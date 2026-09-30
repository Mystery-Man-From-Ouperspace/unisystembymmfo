import { SYSTEM } from "../config/system.mjs"

const { StringField, HTMLField } = foundry.data.fields

export default class Action extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["PENOMBRE.Action"]

  static defineSchema() {
    const schema = {}

    schema.type = new StringField({ required: true, nullable: false, initial: SYSTEM.ACTION_TYPES.adverse.id, choices: SYSTEM.ACTION_TYPES })
    schema.description = new HTMLField({})

    return schema
  }

  /** @inheritDoc */
  async _preCreate(data, options, user) {
    let updates = {}
    const stats = this.parent._stats

    // Pour un acteur non dupliqué, non provenant d'un compendium et non exporté
    if (!stats.duplicateSource && !stats.compendiumSource && !stats.exportSource) {
      // Image par défaut
      if (!foundry.utils.hasProperty(data, "img")) {
        updates.img = "systems/penombre/assets/icons/action.webp"
      }
    }
    this.parent.updateSource(updates)
  }
}
