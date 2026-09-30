const { SchemaField, NumberField, StringField, BooleanField, ArrayField, TypedObjectField, DocumentIdField } = foundry.data.fields
import BaseMessageData from "./base-message.mjs"
import PenombreRoll from "../documents/roll.mjs"

export default class HarmoniqueMessageData extends BaseMessageData {
  static defineSchema() {
    return foundry.utils.mergeObject(super.defineSchema(), {
      harmonique: new StringField({
        required: true,
        nullable: false,
        initial: SYSTEM.HARMONIQUES.ame.id,
        choices: SYSTEM.HARMONIQUES,
      }),
      atouts: new ArrayField(
        new SchemaField({
          nom: new StringField({ required: true, nullable: false }),
          valeur: new NumberField({ required: true, integer: true, initial: 0, min: 0, max: 3 }),
        }),
      ),
      difficulte: new NumberField({ min: 0, max: 20 }),

      // Indique si une relance a été faite dans ce message
      relanceFaite: new BooleanField({ initial: false }),

      // Indique si le message a déjà été traité par DiceSoNice
      dsnDejaTraite: new BooleanField({ initial: false }),

      // Est-ce une action collégiale ?
      actionCollegiale: new BooleanField({ initial: false }),

      // Est-il lié à une action collégiale ?
      // Si c'est faux et que c'est une action collégiale, alors ce message est le message d'origine
      // Sinon c'est vrai et que c'est une action collégiale, alors ce message est lié à l'action collégiale
      actionCollegialeMessageLie: new BooleanField({ initial: false }),

      // Tous les messages liés à ce message dans le cas où c'est le message d'origine de l'action collégiale
      messagesLies: new TypedObjectField(
        new SchemaField({
          messageId: new DocumentIdField(),
          // Indique si une réponse a été faite à ce message : participe ou ne participe pas
          reponseFaite: new BooleanField({ initial: false }),
          participe: new BooleanField({ initial: false }),
          nbSucces: new NumberField({ initial: 0, min: 0 }),
        }),
        { validateKey: foundry.data.validators.isValidId },
      ),
      idMessageOrigine: new StringField(),
    })
  }

  // Toutes réponses attendues ont été faites
  get toutesReponsesFaites() {
    return Object.values(this.messagesLies).every((msg) => msg.reponseFaite)
  }

  /**
   * Modifie le contenu HTML d'un message en fonction de l'état d'une action collégiale.
   * Si toutes les réponses sont faites, calcule le nombre total de succès à partir du jet principal et des messages liés,
   * détermine si la difficulté est atteinte, puis affiche le résultat via un template Handlebars.
   *
   * @async
   * @param {PenombreMessage} message Le document ChatMessage en cours de rendu.
   * @param {HTMLElement} html Élément HTML représentant le message à modifier.
   * @returns {Promise<void>} Résout lorsque le HTML a été mis à jour.
   */
  async alterMessageHTML(message, html) {
    if (CONFIG.debug.penombre?.chat) console.debug("Pénombre | alterMessageHTML", this)
    // C'est une action collégiale
    if (this.actionCollegiale) {
      let isMessagePrincipal = true
      // C'est le message principal
      if (!this.actionCollegialeMessageLie) {
        // Si toutes les réponses ne sont pas faites
        if (!this.toutesReponsesFaites) {
          if (CONFIG.debug.penombre?.chat) console.debug("Pénombre | alterMessageHTML | Message principal | Certaines réponses sont manquantes.", this)
          // Le résultat du dé est masqué
          const rollResultSelfDiv = html.querySelector(".dice-result")
          if (rollResultSelfDiv) rollResultSelfDiv.style.display = "none"
        }
        // Si toutes les réponses sont faites
        else {
          if (CONFIG.debug.penombre?.chat) console.debug("Pénombre | alterMessageHTML | Toutes les réponses ont été faites.", this)
          const rollResultOtherDiv = html.querySelector(".roll-result-collegiale")

          const roll = this.parent.rolls[0]
          const rollResults = PenombreRoll.analyseRollResult(roll)
          const nbSucces = rollResults.nbSucces
          const autresSucces = Object.entries(this.messagesLies).map(([id, value]) => ({
            actor: game.actors.get(id)?.name ?? "Acteur inconnu",
            nbSucces: value.nbSucces,
            participe: value.participe,
          }))
          const totalSucces = nbSucces + autresSucces.reduce((acc, curr) => acc + curr.nbSucces, 0)

          const hasDifficulte = roll.options.difficulte !== ""
          const isSuccess = hasDifficulte && totalSucces >= roll.options.difficulte
          let succesManquants = 0
          if (hasDifficulte && !isSuccess) {
            succesManquants = Math.max(roll.options.difficulte - totalSucces, 0)
          }

          // Si le joueur est à l'origine du message, affichage du résultat du roll dans Dice So Nice (visible par tous les joueurs)
          if (game.modules.get("dice-so-nice")?.active && game.user.id === this.parent.author.id && message.system.dsnDejaTraite === false) {
            // Paramètres : roll, user, synchronize, whisper, blind
            // @param {Boolean} synchronize if the animation needs to be shown to other players. Default: false
            await game.dice3d.showForRoll(roll, game.user, true)
            await message.update({ "system.dsnDejaTraite": true })
          }

          const content = await foundry.applications.handlebars.renderTemplate("systems/penombre/templates/chat/action-collegiale.hbs", {
            isMessagePrincipal,
            nbSucces,
            autresSucces,
            hasAutresSucces: autresSucces.length > 0,
            totalSucces,
            hasDifficulte,
            difficulte: roll.options.difficulte,
            isSuccess,
            succesManquants,
          })
          rollResultOtherDiv.innerHTML = content
        }
      }
      // C'est un message lié
      else {
        isMessagePrincipal = false
        if (this.toutesReponsesFaites) {
          const rollResultOtherDiv = html.querySelector(".roll-result-collegiale")

          const roll = this.parent.rolls[0]
          const rollResults = PenombreRoll.analyseRollResult(roll)
          const nbSucces = rollResults.nbSucces
          const content = await foundry.applications.handlebars.renderTemplate("systems/penombre/templates/chat/action-collegiale.hbs", {
            isMessagePrincipal,
            nbSucces,
          })
          rollResultOtherDiv.innerHTML = content
        }
      }
    }
  }

  async addListeners(html) {
    // Les boutons reroll n'est affiché que pour le MJ ou le joueur à l'origine du message
    if (game.user.isGM || this.parent.isAuthor) {
      html.querySelectorAll(".roll.die").forEach((btn) => {
        btn.classList.add("rerollable")
        btn.addEventListener("click", (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          // Ajoute la classe css dice-selected
          ev.currentTarget.classList.toggle("dice-selected")
        })
      })

      // S'il reste au moins un jeton de conscience
      const actor = game.actors.get(this.parent.speaker.actor)
      if (actor && actor.system.nbJetonsRestants > 0) {
        html.querySelector(".reroll-conscience").classList.remove("hidden")

        html.querySelector(".reroll-conscience").addEventListener("click", async (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          const messageId = ev.target.closest(".chat-message").dataset.messageId
          if (!messageId) return
          let rerolledDices = []
          // Remonter dans la structure html pour trouver les éléments dice-selected
          ev.target
            .closest(".chat-message")
            .querySelectorAll(".dice-selected")
            .forEach((selected) => {
              rerolledDices.push(selected.dataset.indice)
            })
          // Pas de dé sélectionné
          if (rerolledDices.length === 0) return

          // On vérifie qu'il reste un jeton de la réserve de conscience
          if (actor.system.nbJetonsRestants === 0) {
            ui.notifications.warn(game.i18n.format("PENOMBRE.Warnings.jetonsConscienceInsuffisants", { actuel: 0, demande: 1 }))
            return
          }

          // Dépense d'un jeton de conscience et relance
          await actor.system.depenserJetons(1)
          await PenombreRoll.reroll(messageId, rerolledDices)

          // Si c'est un message lié, mettre à jour le message principal
          if (this.actionCollegialeMessageLie && this.idMessageOrigine) {
            await game.users.activeGM.query("penombre.updateMessageParticipation", {
              existingMessageId: this.idMessageOrigine,
              actorId: actor.id,
              answer: true,
              newMessageId: messageId,
            })
          }
        })
      }

      // S'il reste au moins un jeton dans la réserve collégiale
      let reserveCollegiale = game.settings.get(SYSTEM.ID, "reserveCollegiale")
      if (reserveCollegiale.nbJetonsRestants > 0) {
        html.querySelector(".reroll-reserve").classList.remove("hidden")

        html.querySelector(".reroll-reserve").addEventListener("click", async (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          const messageId = ev.target.closest(".chat-message").dataset.messageId
          if (!messageId) return
          let rerolledDices = []
          // Remonter dans la structure html pour trouver les éléments dice-selected
          ev.target
            .closest(".chat-message")
            .querySelectorAll(".dice-selected")
            .forEach((selected) => {
              rerolledDices.push(selected.dataset.indice)
            })
          // Pas de dé sélectionné
          if (rerolledDices.length === 0) return

          // On vérifie qu'il reste un jeton dans la réserve collégiale
          reserveCollegiale = game.settings.get(SYSTEM.ID, "reserveCollegiale")
          if (reserveCollegiale.nbJetonsRestants === 0) {
            ui.notifications.warn(game.i18n.format("PENOMBRE.Warnings.jetonsReserveInsuffisants", { actuel: 0, demande: 1 }), {
              permanent: true,
            })
            return
          }

          // Dépense d'un jeton de la réserve et relance
          await game.users.activeGM.query("penombre.updateReserveCollegialeFromRoll", { nbJetons: 1 })
          await PenombreRoll.reroll(messageId, rerolledDices)

          // Si c'est un message lié, mettre à jour le message principal
          if (this.actionCollegialeMessageLie && this.idMessageOrigine) {
            await game.users.activeGM.query("penombre.updateMessageParticipation", {
              existingMessageId: this.idMessageOrigine,
              actorId: actor.id,
              answer: true,
              newMessageId: messageId,
            })
          }
        })
      }
    }

    // Les boutons pour participer à un jet collégial sont visibles par tous les autres joueurs
    const currentActorId = game.user.character?.id
    if (this.actionCollegiale && !this.actionCollegialeMessageLie && !this.parent.isAuthor && currentActorId && !this.messagesLies[currentActorId]?.reponseFaite) {
      html.querySelector(".participate-yes").classList.remove("hidden")
      html.querySelector(".participate-no").classList.remove("hidden")

      const currentActorId = game.user.character?.id

      html.querySelector(".participate-yes").addEventListener("click", async (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const messageId = ev.target.closest(".chat-message").dataset.messageId
        const harmonique = this.harmonique
        const actor = game.actors.get(currentActorId)
        const chatMessage = await actor.rollHarmonique({ harmonique, messageType: "lie", idMessageOrigine: messageId })
        if (chatMessage) {
          await game.users.activeGM.query("penombre.updateMessageParticipation", {
            existingMessageId: messageId,
            actorId: currentActorId,
            answer: true,
            newMessageId: chatMessage.id,
          })
        }
      })

      html.querySelector(".participate-no").addEventListener("click", async (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const messageId = ev.target.closest(".chat-message").dataset.messageId
        await game.users.activeGM.query("penombre.updateMessageParticipation", { existingMessageId: messageId, actorId: currentActorId, answer: false })
      })
    }
  }
}
