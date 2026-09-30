import { SYSTEM } from "../config/system.mjs"

/**
 * Constantes pour le calcul des succès et types de dés
 */
const SUCCESS_DIVISOR = 4
const MERVEILLEUX_FACES = 20

export default class PenombreRoll extends Roll {
  static DIALOG_TEMPLATE = "systems/penombre/templates/dialogs/roll-dialog.hbs"

  static CHAT_TEMPLATE = "systems/penombre/templates/chat/harmonique-roll.hbs"

  static TOOLTIP_TEMPLATE = "systems/penombre/templates/chat/dice-tooltip.hbs"

  static async prompt(options = {}) {
    const messageType = options.messageType || "principal"
    let messagesLies = {}
    const actor = options.actor || null
    if (!actor) return null
    const harmonique = options.harmonique || null
    const harmoniqueDice = options.rollValue

    const rollModes = Object.fromEntries(Object.entries(CONFIG.Dice.rollModes).map(([key, value]) => [key, game.i18n.localize(value.label)]))
    const defaultRollMode = game.settings.get("core", "rollMode")
    const fieldRollMode = new foundry.data.fields.StringField({ choices: rollModes, blank: false, default: defaultRollMode })

    let formule = options.formule || (harmoniqueDice ? `1${harmoniqueDice}` : "1d20")
    const bonusAtouts = 0
    const deMerveilleux = options.deMerveilleux || false
    const atouts = options.atouts || []
    const choiceDifficulte = SYSTEM.DIFFICULTE

    const maxJetonsConscience = actor.system.nbJetonsRestants
    const maxJetonsReserve = game.settings.get("penombre", "reserveCollegiale").nbJetonsRestants

    const fieldJetonsConscience = new foundry.data.fields.NumberField({ initial: 0, min: 0, max: maxJetonsConscience, step: 1 })
    const fieldJetonsReserve = new foundry.data.fields.NumberField({ initial: 0, min: 0, max: maxJetonsReserve, step: 1 })

    const fieldHarmonique = new foundry.data.fields.StringField({
      required: true,
      nullable: false,
      choices: Object.fromEntries(Object.entries(SYSTEM.HARMONIQUE_VALEURS).map(([key, value]) => [value, { label: `${value}` }])),
    })

    // Construit le choix de l'harmonique
    const choiceHarmonique = Object.entries(actor.system.harmoniques).reduce((acc, [key, obj]) => {
      acc[key] = `${game.i18n.localize(`PENOMBRE.ui.${key}`)} (${obj.valeur})`
      return acc
    }, {})

    // Niveau de l'effet magique : de 1 à 5
    const choiceEffetMagiqueNiveau = Object.freeze(Array.from({ length: 5 }, (_, i) => i + 1).reduce((acc, level) => ({ ...acc, [level]: String(level) }), {}))

    // Maîtrises utilisables pour l'effet magique
    const maitrises = actor.itemTypes.maitrise || []
    const choiceEffetMagiqueMaitrise = Object.fromEntries(maitrises.map((m) => [m.system.slug, m.name]))

    let dialogContext = {
      actor,
      messageType,
      rollModes,
      defaultRollMode,
      fieldRollMode,
      harmonique,
      harmoniqueDice,
      formule,
      bonusAtouts,
      deMerveilleux,
      atouts,
      label: game.i18n.localize(`PENOMBRE.ui.${harmonique}`),
      choiceDifficulte,
      canRoll: true,
      maxJetonsConscience,
      fieldJetonsConscience,
      maxJetonsReserve,
      fieldJetonsReserve,
      fieldHarmonique,
      choiceHarmonique,
      choiceEffetMagiqueNiveau,
      choiceEffetMagiqueMaitrise,
    }

    const content = await foundry.applications.handlebars.renderTemplate("systems/penombre/templates/dialogs/roll-dialog.hbs", dialogContext)
    const title = harmonique != null ? `Jet de ${game.i18n.localize(`PENOMBRE.ui.${harmonique}`)}` : "Jet de dés"

    const rollContext = await foundry.applications.api.DialogV2.wait({
      window: { title },
      classes: ["penombre", "roll-dialog"],
      position: { width: 600 },
      content,
      rejectClose: false, // Click on Close button will not launch an error
      buttons: [
        {
          label: game.i18n.localize("PENOMBRE.ui.lancerDes"),
          callback: async (event, button, dialog) => {
            const output = Array.from(button.form.elements).reduce((obj, input) => {
              if (input.name) {
                if (input.type === "checkbox") {
                  obj[input.name] = input.checked
                } else if (input.type === "radio") {
                  // Only store the value if this radio button is checked
                  if (input.checked) {
                    obj[input.name] = input.value
                  }
                } else {
                  obj[input.name] = input.value
                }
              }
              return obj
            }, {})
            // Console.log("Pénombre | PenombreRoll output", output)
            return output
          },
        },
      ],
      render: (event, dialog) => {
        // Contrôle le nombre de jetons et active/désactive le bouton de lancement du jet
        PenombreRoll._updateNbJetons(dialog.element)

        // Harmonique
        const harmoniqueSelect = dialog.element.querySelector("#harmonique")
        if (harmoniqueSelect) {
          harmoniqueSelect.addEventListener("change", (evt) => this._onChangeHarmonique(evt, dialog.element))
        }
        // Action collégiale
        const actionCollegiale = dialog.element.querySelector("#actionCollegiale")
        if (actionCollegiale) {
          actionCollegiale.addEventListener("change", (evt) => this._onToggleActionCollegiale(evt, dialog.element))
        }
        // Case Premier atout pour action collégiale : permet d'avoir le premier atout sans coût en jeton
        const actionCollegialePremierAtout = dialog.element.querySelector("#actionCollegialePremierAtout")
        if (actionCollegialePremierAtout) {
          actionCollegialePremierAtout.addEventListener("change", (evt) => this._onToggleActionCollegialePremierAtout(evt, dialog.element))
        }
        // Effet magique
        const effetMagique = dialog.element.querySelector("#effetMagique")
        if (effetMagique) {
          effetMagique.addEventListener("change", (evt) => this._onToggleEffetMagique(evt, dialog.element))
        }
        // Niveau de l'effet magique
        const effetMagiqueNiveau = dialog.element.querySelector("#effetMagiqueNiveau")
        if (effetMagiqueNiveau) {
          effetMagiqueNiveau.addEventListener("change", (evt) => this._onChangeEffetMagiqueNiveau(evt, dialog.element))
        }
        // Maîtrise utilisée
        const effetMagiqueMaitrise = dialog.element.querySelector("#effetMagiqueMaitrise")
        if (effetMagiqueMaitrise) {
          effetMagiqueMaitrise.addEventListener("change", (evt) => this._onChangeEffetMagiqueMaitrise(evt, dialog.element))
        }
        // Atouts
        const inputs = dialog.element.querySelectorAll(".atout")
        if (inputs) {
          inputs.forEach((input) => {
            input.addEventListener("click", (evt) => this._onToggleAtout(evt, dialog.element))
          })
        }
        // Dé merveilleux
        const cbDeMerveilleux = dialog.element.querySelector("#deMerveilleux")
        if (cbDeMerveilleux) {
          cbDeMerveilleux.addEventListener("change", (evt) => this._onToggleDeMerveilleux(evt, dialog.element))
        }
        // Bonus de formule
        const autreBonus = dialog.element.querySelector("#autreBonus")
        if (autreBonus) {
          autreBonus.addEventListener("change", (evt) => this._onChangeAutreBonus(evt, dialog.element))
        }
        // Jetons
        const jetonsConscience = dialog.element.querySelector("#jetonsConscience")
        if (jetonsConscience) {
          jetonsConscience.addEventListener("change", (evt) => this._onChangeJetons(evt, dialog.element))
        }
        const jetonsReserve = dialog.element.querySelector("#jetonsReserve")
        if (jetonsReserve) {
          jetonsReserve.addEventListener("change", (evt) => this._onChangeJetons(evt, dialog.element))
        }
      },
    })

    // If the user cancels the dialog, exit early (intentional silent return)
    if (rollContext === null) return

    // Calcul des jetons à dépenser (la dépense effective se fait après l'évaluation du jet)
    const jetonsReserveDepenses = rollContext.jetonsReserve !== "" ? Number(rollContext.jetonsReserve) : 0
    const jetonsConscienceDepenses = rollContext.jetonsConscience !== "" ? Number(rollContext.jetonsConscience) : 0

    formule = rollContext.formule || formule

    const rollOptions = {
      messageType,
      actorId: actor.id,
      harmonique: rollContext.harmonique,
      actionCollegiale: messageType === "principal" ? rollContext.actionCollegiale : true,
      difficulte: rollContext.difficulte,
      rollMode: rollContext.rollMode,
      formule: rollContext.formule,
    }

    /**
     * @param {string} formula    The string formula to parse
     * @param {object} data       The data object against which to parse attributes within the formula
     * @param {RollOptions} [options]  Options modifying or describing the Roll
     */
    const roll = new this(formule, options.data, rollOptions)

    // Apparence des dés si le module Dice So Nice est activé et que le système de dés Pénombre est chargé
    const desSpeciaux = game.settings.get(SYSTEM.ID, "desSpeciaux")
    const desSpeciauxTexture = game.settings.get(SYSTEM.ID, "desSpeciauxTexture")

    if (game.modules.get("dice-so-nice")?.active) {
      if (game.dice3d.getLoadedDiceSystems().has("penombre") && desSpeciaux) {
        // Le premier dé est toujours le dé d'harmonique
        if (desSpeciauxTexture) {
          roll.dice[0].options.appearance = {
            colorset: "penombre-beige",
            foreground: "#7d3339",
            background: "#b3944f",
            texture: "penombre_texture_beige_et_dore",
            edge: "#b3944f",
            material: "glass",
            font: "Cattedrale",
            system: "penombre",
          }
        } else {
          roll.dice[0].options.appearance = {
            colorset: "penombre-beige",
            foreground: "#7d3339",
            background: "#b3944f",
            texture: "water",
            edge: "#b3944f",
            material: "glass",
            font: "Cattedrale",
            system: "penombre",
          }
        }
        // Les autres dés sont des dés d'atouts (d6) ou un dé merveilleux (d20)
        for (let i = 1; i < roll.dice.length; i++) {
          if (roll.dice[i].faces === MERVEILLEUX_FACES) {
            if (desSpeciauxTexture) {
              roll.dice[i].options.appearance = {
                colorset: "penombre-beige",
                foreground: "#7d3339",
                texture: "penombre_texture_beige_et_dore",
                edge: "#b3944f",
                material: "glass",
                font: "Cattedrale",
                system: "penombre",
              }
            } else {
              roll.dice[i].options.appearance = {
                colorset: "penombre-beige",
                foreground: "#7d3339",
                background: "#b3944f",
                texture: "water",
                edge: "#b3944f",
                material: "glass",
                font: "Cattedrale",
                system: "penombre",
              }
            }
          } else {
            if (desSpeciauxTexture) {
              roll.dice[i].options.appearance = {
                colorset: "penombre-bleu",
                foreground: "#ffffff",
                texture: "penombre_texture_bleu_argente",
                edge: "#84b3e3",
                material: "glass",
                font: "Cattedrale",
                system: "penombre",
              }
            } else {
              roll.dice[i].options.appearance = {
                colorset: "penombre-bleu",
                foreground: "#ffffff",
                background: "#84b3e3",
                texture: "water",
                edge: "#84b3e3",
                material: "glass",
                font: "Cattedrale",
                system: "penombre",
              }
            }
          }
        }
      } else {
        for (let i = 0; i < roll.dice.length; i++) {
          roll.dice[i].options.appearance = { system: "standard" }
        }
      }
    }
    await roll.evaluate()

    // Dépense de jetons après évaluation réussie du jet (évite de perdre des jetons si le roll échoue)
    if (jetonsReserveDepenses !== 0) {
      await game.users.activeGM.query("penombre.updateReserveCollegialeFromRoll", { nbJetons: jetonsReserveDepenses })
    }
    if (jetonsConscienceDepenses !== 0) {
      await actor.system.depenserJetons(jetonsConscienceDepenses)
    }

    if (CONFIG.debug.penombre?.rolls) console.debug("Pénombre | PenombreRoll | roll", roll)

    return roll
  }

  // #region Événements du prompt
  /**
   * Gère l'événement de changement pour la sélection de l'harmonique.
   * Met à jour la formule et définit le texte du label harmonique avec la valeur localisée correspondant à l'option sélectionnée.
   *
   * @param {Event} event L'événement de changement déclenché par la sélection de l'harmonique.
   * @param {HTMLElement} dialogElement L'élément DOM de la fenêtre de dialogue
   */
  static _onChangeHarmonique(event, dialogElement) {
    PenombreRoll._updateFormula(dialogElement)
    const harmoniqueLabel = dialogElement.querySelector("#harmonique-label")
    if (harmoniqueLabel) {
      harmoniqueLabel.textContent = game.i18n.localize(`PENOMBRE.ui.${event.target.options[event.target.selectedIndex].value}`)
    }
  }

  /**
   * Gère le basculement de la case "Action collégiale".
   * Affiche ou masque le label "premierAtout" selon l'état de la case.
   * Si décochée, décoche également la case "actionCollegialePremierAtout".
   * Met à jour le nombre de jetons en appelant PenombreRoll._updateNbJetons().
   *
   * @param {Event} event L'événement déclenché par le changement de la case à cocher.
   * @param {HTMLElement} dialogElement L'élément DOM de la fenêtre de dialogue
   */
  static _onToggleActionCollegiale(event, dialogElement) {
    const premierAtoutLabel = dialogElement.querySelector("label.premierAtout")
    if (event.target.checked) {
      if (premierAtoutLabel) premierAtoutLabel.style.visibility = "visible"
    } else {
      if (premierAtoutLabel) premierAtoutLabel.style.visibility = "hidden"
      const premierAtoutCheckbox = dialogElement.querySelector("#actionCollegialePremierAtout")
      if (premierAtoutCheckbox) premierAtoutCheckbox.checked = false
    }
    PenombreRoll._updateNbJetons(dialogElement)
  }

  /**
   * Gère le basculement de la case "Premier atout pour action collégiale".
   * Met à jour le nombre de jetons à dépenser en appelant PenombreRoll._updateNbJetons().
   *
   * @param {Event} event L'événement déclenché par le changement de la case à cocher.
   * @param {HTMLElement} dialogElement L'élément DOM de la fenêtre de dialogue
   * @private
   */
  static _onToggleActionCollegialePremierAtout(event, dialogElement) {
    PenombreRoll._updateNbJetons(dialogElement)
  }

  static _onToggleEffetMagique(event, dialogElement) {
    const effetMagiqueNiveauDiv = dialogElement.querySelector(".form-group.effet-magique-niveau")
    const effetMagiqueMaitriseDiv = dialogElement.querySelector(".form-group.effet-magique-maitrise")

    if (event.target.checked) {
      // Afficher les divs quand la checkbox est cochée
      if (effetMagiqueNiveauDiv) effetMagiqueNiveauDiv.style.display = "flex"
      if (effetMagiqueMaitriseDiv) effetMagiqueMaitriseDiv.style.display = "flex"
    } else {
      // Masquer les divs quand la checkbox est décochée
      if (effetMagiqueNiveauDiv) effetMagiqueNiveauDiv.style.display = "none"
      if (effetMagiqueMaitriseDiv) effetMagiqueMaitriseDiv.style.display = "none"
    }
    PenombreRoll._updateNbJetons(dialogElement)
  }

  static _onChangeEffetMagiqueNiveau(event, dialogElement) {
    PenombreRoll._updateNbJetons(dialogElement)
  }

  static _onChangeEffetMagiqueMaitrise(event, dialogElement) {
    PenombreRoll._updateNbJetons(dialogElement)
  }

  static _checkCanRoll(jetons, dialogElement) {
    // Vérification des conditions de lancement
    let canRoll = true
    const jetonsConscience = Number(dialogElement.querySelector("#jetonsConscience").value) || 0
    const jetonsReserve = Number(dialogElement.querySelector("#jetonsReserve").value) || 0
    const jetonsTotal = jetonsConscience + jetonsReserve

    if (jetonsTotal !== jetons) canRoll = false

    if (canRoll) dialogElement.querySelector('button[type="submit"]').disabled = false
    else dialogElement.querySelector('button[type="submit"]').disabled = true
  }

  static _onToggleAtout(event, dialogElement) {
    let item = event.currentTarget.closest(".atout")
    item.classList.toggle("checked")
    // Calcul du bonus total des atouts
    let bonusTotal = Array.from(dialogElement.querySelectorAll(".atout.checked")).reduce((total, atout) => total + Number(atout.dataset.bonus), 0)
    dialogElement.querySelector("#bonusAtouts").value = bonusTotal

    // Calcul du nombre de jetons à dépenser
    PenombreRoll._updateNbJetons(dialogElement)
    PenombreRoll._updateFormula(dialogElement)
  }

  static _onToggleDeMerveilleux(event, dialogElement) {
    PenombreRoll._updateNbJetons(dialogElement)
    PenombreRoll._updateFormula(dialogElement)
  }

  static _onChangeAutreBonus(event, dialogElement) {
    PenombreRoll._updateFormula(dialogElement)
  }

  static _onChangeJetons(event, dialogElement) {
    let canRoll = true
    const jetonsConscience = Number(dialogElement.querySelector("#jetonsConscience").value) || 0
    const jetonsReserve = Number(dialogElement.querySelector("#jetonsReserve").value) || 0
    const jetonsTotal = jetonsConscience + jetonsReserve

    const jetons = Number(dialogElement.querySelector("#jetons").value)

    if (jetonsTotal > jetons) {
      ui.notifications.warn(game.i18n.localize("PENOMBRE.Warnings.jetonsDepassement"))
    }

    // Vérification du nombre de jetons disponibles
    const id = dialogElement.querySelector(".penombre-roll-dialog").dataset.actorId
    let actor
    if (id) actor = game.actors.get(id)
    if (!actor) return

    // Jetons de conscience
    const nbJetonsRestantsConscience = actor.system.nbJetonsRestants
    if (jetonsConscience > nbJetonsRestantsConscience) {
      ui.notifications.warn(game.i18n.format("PENOMBRE.Warnings.jetonsConscienceInsuffisants", { actuel: nbJetonsRestantsConscience, demande: jetonsConscience }))
      canRoll = false
    }

    // Jetons de la réserve collégiale
    const reserveCollegiale = game.settings.get("penombre", "reserveCollegiale")
    const nbJetonsRestantsReserveCollegiale = reserveCollegiale.nbJetonsRestants
    if (jetonsReserve > nbJetonsRestantsReserveCollegiale) {
      ui.notifications.warn(game.i18n.format("PENOMBRE.Warnings.jetonsReserveInsuffisants", { actuel: nbJetonsRestantsReserveCollegiale, demande: jetonsReserve }), {
        permanent: true,
      })
      canRoll = false
    }

    // Permet le lancer ou non
    if (jetonsTotal !== jetons) canRoll = false

    if (canRoll) dialogElement.querySelector('button[type="submit"]').disabled = false
    else dialogElement.querySelector('button[type="submit"]').disabled = true
  }

  static _updateFormula(dialogElement) {
    const harmonique = dialogElement.querySelector("#harmonique").value
    const id = dialogElement.querySelector(".penombre-roll-dialog").dataset.actorId
    let actor
    if (id) actor = game.actors.get(id)
    if (!actor) return
    const harmoniqueDice = actor.system.harmoniques[harmonique].valeur
    const deMerveilleux = dialogElement.querySelector("#deMerveilleux").checked
    const bonusAtouts = dialogElement.querySelector("#bonusAtouts").value
    const autreBonus = dialogElement.querySelector("#autreBonus").value

    let formule = deMerveilleux ? `1d20` : `1${harmoniqueDice}`
    if (bonusAtouts > 0) {
      formule += ` + ${bonusAtouts}d6`
    }
    if (autreBonus && PenombreRoll._isValidDiceFormula(autreBonus)) {
      formule += ` + ${autreBonus}`
    }
    dialogElement.querySelector("#formule").value = formule
  }

  /**
   * Valide qu'une chaîne de caractères correspond à une formule de dé valide.
   * Accepte uniquement les formats : 1d20 ou xd6 (où x est un nombre positif)
   *
   * @param {string} formula La formule à valider
   * @returns {boolean} True si la formule est valide, false sinon
   */
  static _isValidDiceFormula(formula) {
    if (!formula || typeof formula !== "string") return false

    const trimmedFormula = formula.trim()

    // Expression régulière pour valider uniquement 1d20 ou xd6 (x > 0)
    // ^1d20$ : exactement 1d20
    // ^\d+d6$ : un ou plusieurs chiffres suivis de d6
    const dicePattern = /^(1d20|\d+d6)$/i

    if (!dicePattern.test(trimmedFormula)) return false

    // Vérification supplémentaire pour s'assurer que x dans xd6 est positif
    const d6Match = trimmedFormula.match(/^(\d+)d6$/i)
    if (d6Match) {
      const numberOfDice = parseInt(d6Match[1], 10)
      return numberOfDice > 0
    }

    // Si c'est 1d20, c'est valide
    return true
  }

  static _updateNbJetons(dialogElement) {
    // Action collégiale
    const actionCollegiale = dialogElement.querySelector("#actionCollegiale")?.checked ?? false
    const messageType = dialogElement.querySelector(".messageType").innerHTML
    const jetonActionCollegiale = actionCollegiale && messageType !== "lie" ? 1 : 0

    const actionCollegialeLiee = dialogElement.querySelector("#actionCollegiale")?.checked === undefined // Si on ne trouve pas la checkbox, c'est que c'est une action collégiale liée

    // Le joueur a-t-il coché la case "Premier atout pour action collégiale" ?
    const actionCollegialePremierAtout = dialogElement.querySelector("#actionCollegialePremierAtout")?.checked ?? false

    // Atouts : 1 jeton par atout au-delà du premier sinon 1 jeton par atout
    // Dans le cas d'une action collégiale, le premier atout ne coûte pas de jeton si la case est cochée
    // Pour une action collégiale liée, si la case est cochée, le premier atout ne coûte pas de jeton
    const nbAtoutsSelectionnes = Number(dialogElement.querySelectorAll(".atout.checked").length)
    let premierAtoutGratuit = false
    if (
      (actionCollegiale && actionCollegialePremierAtout) ||
      (!actionCollegiale && !actionCollegialeLiee) ||
      (!actionCollegiale && actionCollegialeLiee && actionCollegialePremierAtout)
    ) {
      premierAtoutGratuit = true
    }
    let jetonsAtouts = nbAtoutsSelectionnes
    if (premierAtoutGratuit) jetonsAtouts = Math.max(nbAtoutsSelectionnes - 1, 0)

    // Dé merveilleux
    const deMerveilleux = dialogElement.querySelector("#deMerveilleux").checked
    const jetonDeMerveilleux = deMerveilleux ? 1 : 0

    // Effet magique
    const effetMagique = dialogElement.querySelector("#effetMagique")?.checked ?? false
    const jetonEffetMagique = effetMagique ? 1 : 0

    // Selon la maitrise magique : 1 jeton par niveau manquant par rapport au niveau de l'effet magique souhaité
    const niveauEffetMagique = Number(dialogElement.querySelector("#effetMagiqueNiveau")?.value || 1)
    const maitriseSlug = dialogElement.querySelector("#effetMagiqueMaitrise")?.value || null
    const actorId = dialogElement.querySelector(".penombre-roll-dialog").dataset.actorId
    let actor = null
    if (actorId) actor = game.actors.get(actorId)
    let niveauMaitrise = 0
    if (actor && maitriseSlug) {
      const maitrise = actor.itemTypes.maitrise.find((m) => m.system.slug === maitriseSlug)
      if (maitrise) niveauMaitrise = maitrise.system.niveau || 0
    }
    const jetonsEffetMagiqueMaitrise = effetMagique ? Math.max(niveauEffetMagique - niveauMaitrise, 0) : 0

    // Total des jetons à dépenser
    const jetons = jetonsAtouts + jetonActionCollegiale + jetonDeMerveilleux + jetonEffetMagique + jetonsEffetMagiqueMaitrise
    dialogElement.querySelector("#jetons").value = jetons

    // Met à jour le tooltip pour expliquer chaque partie du total
    const tooltipLabel = dialogElement.querySelector("#jetonsDepenserTooltip")
    if (tooltipLabel) {
      const tooltipContent = `
        • Atouts : ${jetonsAtouts} ${nbAtoutsSelectionnes > 0 && premierAtoutGratuit ? "(Premier atout gratuit)" : ""}<br>
        • Action collégiale : ${jetonActionCollegiale} <br>
        • Dé merveilleux : ${jetonDeMerveilleux} <br>
        • Produire effet magique : ${jetonEffetMagique} <br>
        • Compenser maîtrise magique : ${jetonsEffetMagiqueMaitrise} <br>
        Total : ${jetons}`

      tooltipLabel.setAttribute("data-tooltip", tooltipContent)
    }

    PenombreRoll._checkCanRoll(jetons, dialogElement)
    return jetons
  }
  // #endregion Événements du prompt

  /** @override */
  async _prepareChatRenderContext({ flavor, isPrivate = false, ...options } = {}) {
    const rollResults = PenombreRoll.analyseRollResult(this)
    const nbSucces = rollResults.nbSucces
    // Fusion des événements spéciaux courants avec ceux accumulés lors des relances précédentes
    const accumulated = this.options.accumulated || {}
    const nbFaussesNotes = (accumulated.fausseNote || 0) + (rollResults.isDeHarmoniqueMin ? 1 : 0)
    const nbEnvolees = (accumulated.envolee || 0) + (rollResults.isDeHarmoniqueMax ? 1 : 0)
    const isFausseNote = nbFaussesNotes > 0
    const isEnvolee = nbEnvolees > 0
    let typeEnvolee = 1
    if (rollResults.typeDeHarmonique === 8 || rollResults.typeDeHarmonique === 10) typeEnvolee = 2
    else if (rollResults.typeDeHarmonique === 12) typeEnvolee = 3
    const nbIncidentsMagiques = (accumulated.incidentMagique || 0) + (rollResults.isDeMerveilleuxMin ? 1 : 0)
    const nbMerveilles = (accumulated.merveille || 0) + (rollResults.isDeMerveilleuxMax ? 1 : 0)
    const isIncidentMagique = nbIncidentsMagiques > 0
    const isMerveille = nbMerveilles > 0
    const hasDifficulte = this.options.difficulte !== ""
    let succesManquants = 0
    if (hasDifficulte) {
      succesManquants = Math.max(this.options.difficulte - nbSucces, 0)
    }
    const actorIdSource = this.options.actorId
    const actorId = game.user.character?.id
    const isSuccess = hasDifficulte && nbSucces >= this.options.difficulte

    return {
      messageType: this.options.messageType,
      harmonique: this.options.harmonique,
      actionCollegiale: this.options.actionCollegiale,
      isActionPrincipale: this.options.messageType === "principal",
      hasDifficulte: this.options.difficulte !== "",
      difficulte: this.options.difficulte,
      nbSucces,
      succesManquants,
      isSuccess,
      isFausseNote,
      nbFaussesNotes,
      multipleFaussesNotes: nbFaussesNotes > 1,
      isEnvolee,
      nbEnvolees,
      multipleEnvolees: nbEnvolees > 1,
      typeEnvolee,
      isIncidentMagique,
      nbIncidentsMagiques,
      multipleIncidentsMagiques: nbIncidentsMagiques > 1,
      isMerveille,
      nbMerveilles,
      multipleMerveilles: nbMerveilles > 1,
      isPrivate,
      formula: isPrivate ? "???" : this._formula,
      flavor: isPrivate ? null : (flavor ?? this.options.flavor),
      user: game.user.id,
      peutParticiper: actorIdSource !== actorId,
      tooltip: isPrivate ? "" : await this.getTooltip(),
      total: isPrivate ? "?" : Math.round(this.total * 100) / 100,
    }
  }

  /**
   * Analyzes the result of a dice roll and returns statistics about successes and special die outcomes.
   * La formule est de type : dé harmonique / dé merveilleux + dé d'atouts + éventuellement dé merveilleux
   *
   * @param {Object} roll The roll object containing dice information.
   * @param {Array<Object>} roll.dice Array of dice objects.
   * @param {number} roll.dice[].faces Number of faces on the die.
   * @param {number} roll.dice[].total The total rolled value for the die.
   * @param {Array<Object>} roll.dice[].results Array of individual roll results for the die.
   * @param {number} roll.dice[].results[].result The value of each individual roll result.
   * @returns {Object} An object containing:
   *   @property {number} nbSucces - The total number of successes.
   *   @property {boolean} isDeHarmoniqueMin - True if the first die (harmonique) rolled its minimum value.
   *   @property {boolean} isDeHarmoniqueMax - True if the first die (harmonique) rolled its maximum value.
   *   @property {boolean} isDeMerveilleuxMin - True if the first die (merveilleux) rolled its minimum value.
   *   @property {boolean} isDeMerveilleuxMax - True if the first die (merveilleux) rolled its maximum value.
   */
  static analyseRollResult(roll) {
    let nbSucces = 0
    let isDeHarmoniqueMin = false
    let isDeHarmoniqueMax = false
    let isDeMerveilleuxMin = false
    let isDeMerveilleuxMax = false
    let typeDeHarmonique = null

    for (const [index, die] of roll.dice.entries()) {
      // Traitement du premier dé uniquement (dé harmonique ou merveilleux)
      if (index === 0) {
        typeDeHarmonique = die.faces
        const isMerveilleux = die.faces === MERVEILLEUX_FACES

        // Résultat maximum
        if (die.total === die.faces) {
          if (isMerveilleux) {
            isDeMerveilleuxMax = true
          } else {
            isDeHarmoniqueMax = true
          }
        }

        // Résultat minimum
        if (die.total === 1) {
          if (isMerveilleux) {
            isDeMerveilleuxMin = true
          } else {
            isDeHarmoniqueMin = true
          }
        }
      }

      // Les autres dés peuvent être un dé merveilleux ou des dés d'atouts
      else if (die.faces === MERVEILLEUX_FACES) {
        if (die.total === die.faces) isDeMerveilleuxMax = true
        if (die.total === 1) isDeMerveilleuxMin = true
      }

      // Calcul des succès pour tous les dés
      for (const result of die.results) {
        nbSucces += Math.floor(result.result / SUCCESS_DIVISOR)
      }
    }

    if (CONFIG.debug.penombre?.rolls)
      console.debug("Pénombre | Roll | analyseRollResult", { nbSucces, isDeHarmoniqueMin, isDeHarmoniqueMax, isDeMerveilleuxMin, isDeMerveilleuxMax })
    return { nbSucces, typeDeHarmonique, isDeHarmoniqueMin, isDeHarmoniqueMax, isDeMerveilleuxMin, isDeMerveilleuxMax }
  }

  /**
   * Relance les résultats de dés spécifiés dans un message de jet Pénombre et met à jour le message.
   *
   * @param {string} messageId L'identifiant du message de chat contenant le jet à relancer.
   * @param {string[]} rerolledDices Tableau des indices de dés à relancer, format "dieIndex-resultIndex".
   * @returns {Promise<void>} Résout lorsque la relance et la mise à jour du message sont terminées.
   */
  static async reroll(messageId, rerolledDices) {
    const message = game.messages.get(messageId)
    if (!message) {
      return
    }

    // Vérifie que le message est un jet de dés de Pénombre
    if (message.isRoll && message.rolls[0] && message.rolls[0] instanceof PenombreRoll) {
      const roll = message.rolls[0]

      // Reprise du choix du rollMode
      const rollMode = roll.options.rollMode
      let whisper = null
      // Self roll
      if (rollMode === SYSTEM.DICE_ROLL_MODES.SELF) whisper = [game.user.id]
      // Private or blind roll
      else if (rollMode === SYSTEM.DICE_ROLL_MODES.PRIVATE || rollMode === SYSTEM.DICE_ROLL_MODES.BLIND) whisper = game.users.filter((u) => u.isGM).map((u) => u.id)

      const blind = rollMode === SYSTEM.DICE_ROLL_MODES.BLIND

      if (CONFIG.debug.penombre?.rolls && roll) console.debug("Pénombre | Reroll", roll, rerolledDices)

      const newRolls = []

      // Sauvegarde des événements spéciaux (fausse note, envolée, etc.) avant modification des dés
      // Ces événements sont cumulatifs : un 1 suivi d'une relance à 8 produit une fausse note ET une envolée
      const preAnalysis = PenombreRoll.analyseRollResult(roll)
      if (!roll.options.accumulated) {
        roll.options.accumulated = { fausseNote: 0, envolee: 0, incidentMagique: 0, merveille: 0 }
      }
      if (preAnalysis.isDeHarmoniqueMin) roll.options.accumulated.fausseNote++
      if (preAnalysis.isDeHarmoniqueMax) roll.options.accumulated.envolee++
      if (preAnalysis.isDeMerveilleuxMin) roll.options.accumulated.incidentMagique++
      if (preAnalysis.isDeMerveilleuxMax) roll.options.accumulated.merveille++

      // TODO : Lorsque le système de dés Pénombre sera géré : gérer la relance d'un dé merveilleux
      for (const indice of rerolledDices) {
        const [dieIndex, resultIndex] = indice.split("-").map(Number)
        if (roll.dice[dieIndex] && roll.dice[dieIndex].results[resultIndex]) {
          const formula = `1d${roll.dice[dieIndex].faces}`
          const newDice = await new Roll(formula, {}, { rollMode }).evaluate()

          // Avec DsN, les dés relancés sont : soit spécial si harmonique, soit standards si bonus
          // Apparence des dés si le module Dice So Nice est activé et que le système de dés Pénombre est chargé
          const desSpeciaux = game.settings.get(SYSTEM.ID, "desSpeciaux")
          const desSpeciauxTexture = game.settings.get(SYSTEM.ID, "desSpeciauxTexture")

          if (game.modules.get("dice-so-nice")?.active) {
            if (game.dice3d.getLoadedDiceSystems().has("penombre") && desSpeciaux) {
              // Le premier dé est toujours le dé d'harmonique
              if (dieIndex === 0) {
                if (desSpeciauxTexture) {
                  newDice.dice[0].options.appearance = {
                    colorset: "penombre-beige",
                    foreground: "#7d3339",
                    texture: "penombre_texture_beige_et_dore",
                    edge: "#b3944f",
                    material: "glass",
                    font: "Cattedrale",
                    system: "penombre",
                  }
                } else {
                  newDice.dice[0].options.appearance = {
                    colorset: "penombre-beige",
                    foreground: "#7d3339",
                    background: "#b3944f",
                    texture: "water",
                    edge: "#b3944f",
                    material: "glass",
                    font: "Cattedrale",
                    system: "penombre",
                  }
                }
              } else {
                if (newDice.dice[0].faces === MERVEILLEUX_FACES) {
                  if (desSpeciauxTexture) {
                    newDice.dice[0].options.appearance = {
                      colorset: "penombre-beige",
                      foreground: "#7d3339",
                      texture: "penombre_texture_beige_et_dore",
                      edge: "#b3944f",
                      material: "glass",
                      font: "Cattedrale",
                      system: "penombre",
                    }
                  } else {
                    newDice.dice[0].options.appearance = {
                      colorset: "penombre-beige",
                      foreground: "#7d3339",
                      background: "#b3944f",
                      texture: "water",
                      edge: "#b3944f",
                      material: "glass",
                      font: "Cattedrale",
                      system: "penombre",
                    }
                  }
                } else {
                  if (desSpeciauxTexture) {
                    newDice.dice[0].options.appearance = {
                      colorset: "penombre-bleu",
                      foreground: "#ffffff",
                      texture: "penombre_texture_bleu_argente",
                      edge: "#84b3e3",
                      material: "glass",
                      font: "Cattedrale",
                      system: "penombre",
                    }
                  } else {
                    newDice.dice[0].options.appearance = {
                      colorset: "penombre-bleu",
                      foreground: "#ffffff",
                      background: "#84b3e3",
                      texture: "water",
                      edge: "#84b3e3",
                      material: "glass",
                      font: "Cattedrale",
                      system: "penombre",
                    }
                  }
                }
              }
            } else {
              newDice.dice[0].options.appearance = { system: "standard" }
            }
          }

          newRolls.push(newDice)
          roll.dice[dieIndex].results[resultIndex].result = parseInt(newDice.result)
          // Recalcul du _total du dé après mutation du résultat
          roll.dice[dieIndex]._total = roll.dice[dieIndex].results.filter((r) => !r.discarded).reduce((sum, r) => sum + r.result, 0)
        }
      }

      // Recalcul du total global du roll
      roll._total = roll.dice.reduce((sum, die) => sum + die.total, 0)

      // Gestion des effets de jetons si le dé harmonique (index 0) a été relancé
      const harmoniqueRerolled = rerolledDices.some((indice) => indice.startsWith("0-"))
      if (harmoniqueRerolled) {
        const postAnalysis = PenombreRoll.analyseRollResult(roll)
        const actorId = roll.options.actorId || message.speaker.actor
        const rerollActor = actorId ? game.actors.get(actorId) : null
        if (rerollActor?.type === "eminence") {
          // Fausse note (1 sur le dé harmonique) : perte d'un jeton
          if (postAnalysis.isDeHarmoniqueMin) {
            await rerollActor.system.perdreUnJeton()
          }
          // Envolée (max sur le dé harmonique) : réactivation d'un jeton inactif
          if (postAnalysis.isDeHarmoniqueMax) {
            const jetons = foundry.utils.duplicate(rerollActor.system.conscience.jetons)
            for (let i = 0; i < jetons.length; i++) {
              if (jetons[i].statut === SYSTEM.JETON_STATUTS.inactif.id) {
                jetons[i].statut = SYSTEM.JETON_STATUTS.actif.id
                break
              }
            }
            await rerollActor.update({ "system.conscience.jetons": jetons })
          }
        }
      }

      // Affichage groupé de tous les nouveaux dés avec Dice So Nice
      if (game.modules.get("dice-so-nice")?.active && newRolls.length > 0) {
        const synchronize = !game.user.isGM
        // Paramètres : roll, user, synchronize, whisper, blind
        // * @param {Boolean} synchronize if the animation needs to be shown to other players. Default: false
        // * @param {Array} whisper list of users or userId who can see the roll, set it to null if everyone can see. Default: null
        // * @param {Boolean} blind if the roll is blind for the current user. Default: false

        const showPromises = newRolls.map((newDice) => game.dice3d.showForRoll(newDice, game.user, synchronize, whisper, blind))
        await Promise.all(showPromises)
      }

      await message.update({ rolls: [roll] })
    }
  }
}
