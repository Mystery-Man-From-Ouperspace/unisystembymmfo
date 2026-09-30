import { SYSTEM, systemPath } from "../../config/system.mjs"
import PenombreBaseActorSheet from "./base-actor-sheet.mjs"

export default class AdversaireSheet extends PenombreBaseActorSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["adversaire"],
    position: {
      width: 800,
      height: 780,
    },
    window: {
      contentClasses: ["adversaire-content"],
    },
    actions: {
      create: AdversaireSheet.#onCreateItem,
    },
  }

  /** @override */
  static PARTS = {
    main: {
      template: "systems/penombre/templates/adversaire/adversaire.hbs",
      templates: ["actions.hbs", "intrigues.hbs", "personnage.hbs"].map((t) => systemPath(`templates/adversaire/partials/${t}`)),
      scrollable: [""],
    },
  }

  /** @override */
  async _prepareContext() {
    const context = await super._prepareContext()

    context.nom = this.document.name
    context.description = this.document.system.description

    context.hasDissonance = this.document.system.dissonance.max > 0

    const actions = this.document.itemTypes.action
    context.actionsAdverses = actions.filter((a) => a.system.type === SYSTEM.ACTION_TYPES.adverse.id)
    context.actionsDissonance = actions.filter((a) => a.system.type === SYSTEM.ACTION_TYPES.dissonance.id)
    context.hasActionsDissonance = context.actionsDissonance.length > 0

    context.intrigues = this.document.itemTypes.intrigue

    context.maxAdversite = this.document.system.adversite.max
    context.maxResilience = this.document.system.resilience.max
    context.maxDissonance = this.document.system.dissonance.max

    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.details, { async: true })

    // Select options
    context.harmoniquesChoices = Object.fromEntries(Object.entries(SYSTEM.HARMONIQUES).map(([key, value]) => [key, { label: game.i18n.localize(value.label) }]))
    if (CONFIG.debug.penombre?.sheets) console.debug("Pénombre | AdversaireSheet | prepareContext", context)
    return context
  }

  static async #onCreateItem(event, target) {
    event.preventDefault()
    const type = target.dataset.type
    const subtype = target.dataset.subtype

    const itemData = {
      type: type,
    }
    if (type === "action") {
      itemData.name = subtype === "dissonance" ? game.i18n.localize("PENOMBRE.ui.actionDissonanceNew") : game.i18n.localize("PENOMBRE.ui.actionAdverseNew")
      foundry.utils.setProperty(itemData, "system.type", subtype)
    } else if (type === "description") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.descriptionNew")
    } else if (type === "intrigue") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.intrigueNew")
    }
    return await this.actor.createEmbeddedDocuments("Item", [itemData])
  }
}
