const { HTMLField, NumberField, StringField } = foundry.data.fields

export default class Maitrise extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["PENOMBRE.Maitrise"]

  static defineSchema() {
    const schema = {}
    schema.slug = new StringField({ required: true })
    schema.description = new HTMLField({})
    schema.harmonique = new StringField({ required: true, nullable: false, initial: SYSTEM.HARMONIQUES.ame.id, choices: SYSTEM.HARMONIQUES })
    schema.prerequis = new StringField({})
    schema.niveau = new NumberField({ required: true, integer: true, initial: 1, min: 1, max: 5 })

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
        updates.img = "systems/penombre/assets/icons/maitrise.webp"
      }
    }
    this.parent.updateSource(updates)
  }

  /** @override */
  prepareBaseData() {
    this.slug = this.parent.name.slugify({ strict: true })
  }
}
