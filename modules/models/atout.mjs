const { HTMLField, NumberField } = foundry.data.fields

export default class Atout extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["PENOMBRE.Atout"]

  static defineSchema() {
    const schema = {}

    schema.description = new HTMLField({})
    schema.valeur = new NumberField({ required: true, integer: true, initial: 0, min: 0, max: 3 })

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
        updates.img = "systems/penombre/assets/icons/atout.webp"
      }
    }
    this.parent.updateSource(updates)
  }
}
