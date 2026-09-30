import { SYSTEM, systemPath } from "../../config/system.mjs"
import PenombreBaseActorSheet from "./base-actor-sheet.mjs"

export default class EminenceSheet extends PenombreBaseActorSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["eminence"],
    window: {
      contentClasses: ["eminence-content"],
    },
    actions: {
      jeton: EminenceSheet.#onClicJeton,
      complication: EminenceSheet.#onClicComplication,
      create: EminenceSheet.#onCreateItem,
      jetHarmonique: EminenceSheet.#onClicHarmonique,
      note: EminenceSheet.#onClicNote,
      statut: EminenceSheet.#onClicStatut,
      utilisePouvoir: EminenceSheet.#onClicPouvoirCoche,
    },
  }

  /** @override */
  static PARTS = {
    main: {
      template: "systems/penombre/templates/eminence/eminence.hbs",
      templates: ["atouts.hbs", "conscience.hbs", "harmoniques.hbs", "maitrises.hbs", "personnage.hbs", "pouvoirs.hbs", "recapitulatif.hbs", "timbre.hbs"].map((t) =>
        systemPath(`templates/eminence/partials/${t}`),
      ),
      scrollable: [""],
    },
  }

  /** @override */
  async _prepareContext() {
    const context = await super._prepareContext()

    context.ame = this.document.system._source.harmoniques.ame.valeur
    context.esprit = this.document.system._source.harmoniques.esprit.valeur
    context.etincelle = this.document.system._source.harmoniques.etincelle.valeur
    context.nature = this.document.system._source.harmoniques.nature.valeur
    context.nuit = this.document.system._source.harmoniques.nuit.valeur

    context.jetons = this.document.system.conscience.jetons.slice(0, this.document.system.conscience.max)
    context.nbJetonsRestantsConscience = this.document.system.nbJetonsRestants

    const styleJeu = game.settings.get("penombre", "styleJeu")
    context.isStyleJeuDemo = styleJeu === "demo"
    context.isStyleJeuStandard = styleJeu === "standard"
    context.isStyleJeuAvance = styleJeu === "avance"

    context.pouvoirs = this.document.itemTypes.pouvoir
    context.atouts = this.document.itemTypes.atout
    context.maitrises = this.document.itemTypes.maitrise

    context.hasAtouts = this.document.system.hasAtouts

    // Select options
    context.harmoniqueValueChoices = { d4: "D4", d6: "D6", d8: "D8", d10: "D10", d12: "D12" }
    context.potentielChoices = Object.fromEntries(Array.from({ length: SYSTEM.POTENTIEL_MAX }, (_, i) => [i, i]))

    if (CONFIG.debug.penombre?.sheets) console.debug("Pénombre | EminenceSheet | prepareContext", context)
    return context
  }

  /**
   * Actions performed after a first render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options)
    this._createContextMenus()
  }

  /* Right-click context menus */
  _createContextMenus() {
    /** @fires {hookEvents:_getItemEntryContextOptions} */
    this._createContextMenu(this._getJetonConscienceContextOptions, ".jeton-contextmenu", {
      fixed: true,
      hookName: "JetonEntryContext",
      parentClassHooks: false,
    })
  }

  /** * Get the context options for the jeton conscience.
   * @returns {ContextMenuEntry[]} An array of context menu entries.
   * @private
   */
  _getJetonConscienceContextOptions() {
    return [
      {
        name: `Ajouter / Perdre un jeton de conscience`,
        icon: `<i class="fa-regular fa-bolt"></i>`,
        callback: async (li) => {
          const index = li.dataset.index
          let jetons = foundry.utils.duplicate(this.document.system.conscience.jetons)
          const currentStatut = jetons[index].statut
          let currentConscience = this.document.system.conscience.valeur
          switch (currentStatut) {
            case "actif":
            case "inactif":
              const jetonSupprime = jetons.splice(index, 1)[0]
              jetonSupprime.statut = "perdu"
              jetons.push(jetonSupprime)
              currentConscience--
              break
            case "perdu":
              jetons[currentConscience].statut = "inactif"
              currentConscience++
              break
          }
          await this.document.update({ "system.conscience.jetons": jetons, "system.conscience.valeur": currentConscience })
        },
      },
    ]
  }

  /** @override */
  _onDragStart(event) {
    const target = event.currentTarget
    let dragData

    if (target.classList.contains("jetHarmonique")) {
      const type = "penombre.harmonique"
      const harmonique = target.dataset.harmonique
      let valeur = this.actor.system.harmoniques[harmonique].valeur
      dragData = {
        type,
        actorName: this.actor.name,
        actorId: this.actor.id,
        harmonique,
        valeur,
      }
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData))
    }
    // Sinon dataset contient itemUuid, itemId, itemType
    else super._onDragStart(event)
  }

  /**
   * Handle clicking on Document's elements.
   * @param {Event} event The click event triggered by the user.
   * @param {HTMLElement} target The HTML element that was clicked, containing dataset information.
   * @returns {Promise<void>}
   **/
  static async #onClicJeton(event, target) {
    event.preventDefault()
    const dataset = target.dataset
    const index = dataset.index // Commence à 0
    const jetons = foundry.utils.duplicate(this.document.system.conscience.jetons)
    const currentStatut = jetons[index].statut
    switch (currentStatut) {
      case "actif":
        jetons[index].statut = "inactif"
        break
      case "inactif":
        jetons[index].statut = "actif"
        break
    }
    await this.document.update({ "system.conscience.jetons": jetons })
  }

  static async #onClicNote(event, target) {
    event.preventDefault()
    const dataset = target.dataset
    const index = dataset.index // Commence à 0
    const cle = this.document.system.timbre.cle
    const note1 = this.document.system.timbre.note1
    const note2 = this.document.system.timbre.note2
    const note3 = this.document.system.timbre.note3
    const note4 = this.document.system.timbre.note4

    switch (index) {
      case "0":
        await this.document.update({ "system.timbre.cle": !cle })
        break
      case "1":
        await this.document.update({ "system.timbre.note1": !note1 })
        break
      case "2":
        await this.document.update({ "system.timbre.note2": !note2 })
        break
      case "3":
        await this.document.update({ "system.timbre.note3": !note3 })
        break
      case "4":
        await this.document.update({ "system.timbre.note4": !note4 })
        break
    }
  }

  /**
   * Gère le clic pour cocher/décocher l'utilisation d'un pouvoir.
   *
   * @param {Event} event L'événement de clic déclenché par l'utilisateur.
   * @param {HTMLElement} target L'élément HTML cliqué, contenant les attributs data.
   * @returns {Promise<void>} Résout lorsque la mise à jour du pouvoir est terminée.
   * @private
   * @static
   */
  static async #onClicPouvoirCoche(event, target) {
    event.preventDefault()
    const dataset = target.dataset
    const id = dataset.itemId
    const pouvoir = this.document.items.get(id)
    await pouvoir.update({ "system.utilise": !pouvoir.system.utilise })
  }

  /**
   * Gère les clics sur les éléments de complication dans l'interface.
   *
   * @param {Event} event L'événement de clic déclenché par l'utilisateur.
   * @param {HTMLElement} target L'élément HTML cliqué, contenant les attributs data de la complication.
   * @returns {Promise<void>} Résout lorsque la mise à jour du document est terminée.
   * @private
   * @static
   */
  static async #onClicComplication(event, target) {
    event.preventDefault()
    const dataset = target.dataset
    const complication = dataset.complication
    let index = parseInt(dataset.index)
    const initialValue = this.document.system.conscience.complications[complication].valeur
    if (initialValue === 1 && index === 1) index = 0 // Si on clique sur la première case, on la désactive
    if (initialValue === 2 && index === 2) index = 1
    if (initialValue === 3 && index === 3) index = 2
    await this.document.update({ [`system.conscience.complications.${complication}.valeur`]: index })
  }

  static async #onClicStatut(event, target) {
    event.preventDefault()
    const dataset = target.dataset
    let index = dataset.index
    await this.document.update({ [`system.timbre.statut`]: index })
  }

  static async #onClicHarmonique(event, target) {
    event.preventDefault()
    const dataset = target.dataset
    const harmonique = dataset.harmonique
    await this.actor.rollHarmonique({ harmonique })
  }

  static async #onCreateItem(event, target) {
    event.preventDefault()
    const type = target.dataset.type

    const itemData = {
      type: type,
    }
    if (type === "pouvoir") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.pouvoirNew")
    } else if (type === "atout") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.atoutNew")
    } else if (type === "maitrise") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.maitriseNew")
    }

    return await this.actor.createEmbeddedDocuments("Item", [itemData])
  }
}
