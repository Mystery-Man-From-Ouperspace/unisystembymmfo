import { SYSTEM } from "../config/system.mjs"

const { BooleanField, HTMLField, StringField } = foundry.data.fields

export default class Pouvoir extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["PENOMBRE.Pouvoir"]

  static defineSchema() {
    const schema = {}

    schema.utilise = new BooleanField()
    schema.description = new HTMLField({})
    schema.type = new StringField({ required: true, nullable: false, initial: SYSTEM.POUVOIR_TYPES.naissance.id, choices: SYSTEM.POUVOIR_TYPES })

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
        updates.img = "systems/penombre/assets/icons/pouvoir.webp"
      }
    }
    this.parent.updateSource(updates)
  }
}
