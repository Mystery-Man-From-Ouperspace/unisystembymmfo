import PenombreRoll from "./roll.mjs"
export default class PenombreActor extends Actor {
  /**
   * Rolls a harmonique for the actor, prompting the user and sending a chat message with the result.
   * Handles both principal and collegial actions, linking related messages for group rolls.
   *
   * @async
   * @param {Object} options Options for the harmonique roll.
   * @param {string} options.harmonique The harmonique to roll.
   * @param {string} [options.messageType="principal"] The type of message ("principal" or "lie").
   * @param {string|null} [options.idMessageOrigine=null] The ID of the original message if this is a linked message.
   * @param {string|undefined} [options.rollMode=undefined] The roll mode to use.
   * @returns {Promise<ChatMessage|null>} The created chat message, or null if the roll was cancelled.
   */
  async rollHarmonique({ harmonique, messageType = "principal", idMessageOrigine = null, rollMode = undefined } = {}) {
    let rollValue = this.system.harmoniques[harmonique].valeur
    const atouts = this.itemTypes.atout
    let roll = await PenombreRoll.prompt({ messageType, actor: this, harmonique, rollValue, atouts })
    if (!roll) return null

    const speaker = ChatMessage.getSpeaker({ actor: this, scene: canvas.scene })

    // Message principal : si c'est une action collégiale
    let messagesLies = {}
    if (messageType === "principal" && roll.options.actionCollegiale) {
      // Préparation des messages liées : récupération des autres joueurs connectés
      const players = game.users.filter((user) => !user.isSelf && user.active && user.character)
      for (const player of players) {
        messagesLies[player.character.id] = {
          messageId: null, // On mettra à jour ce champ plus tard
          reponseFaite: false,
          participe: false,
          nbSucces: 0,
        }
      }
    }
    const chatMessage = await roll.toMessage(
      {
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        type: "harmonique",
        system: {
          harmonique: roll.options.harmonique,
          difficulte: roll.options.difficulte,
          actionCollegiale: messageType === "principal" ? roll.options.actionCollegiale : true,
          actionCollegialeMessageLie: messageType === "lie",
          messagesLies,
          idMessageOrigine: messageType === "principal" ? null : idMessageOrigine,
        },
        speaker,
      },
      { rollMode: roll.options.rollMode },
    )

    // Gestion des cas particuliers : perte ou gain de jetons de conscience
    const rollResults = PenombreRoll.analyseRollResult(roll)
    // Fausse note (1 sur le dé harmonique) : perte d'un jeton
    if (rollResults.isDeHarmoniqueMin) {
      await this.system.perdreUnJeton()
    }

    // Envolée (20 sur le dé harmonique) : un jeton dépensé est réactivé
    // Le premier jeton inactif est réactivé
    if (rollResults.isDeHarmoniqueMax) {
      const jetons = foundry.utils.duplicate(this.system.conscience.jetons)
      for (let i = 0; i < jetons.length; i++) {
        if (jetons[i].statut === SYSTEM.JETON_STATUTS.inactif.id) {
          jetons[i].statut = SYSTEM.JETON_STATUTS.actif.id
          break
        }
      }
      await this.update({ "system.conscience.jetons": jetons })
    }

    return chatMessage
  }
}
