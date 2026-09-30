import { SYSTEM } from "../config/system.mjs"

const { SchemaField, NumberField, StringField, HTMLField } = foundry.data.fields

export default class Adversaire extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["PENOMBRE.Adversaire"]

  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true }
    const schema = {}

    // Personnage
    schema.description = new StringField({})
    schema.details = new HTMLField({})
    schema.adversite = new SchemaField({
      valeur: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })
    schema.resilience = new SchemaField({
      valeur: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })
    schema.dissonance = new SchemaField({
      harmonique: new StringField({ required: true, nullable: false, initial: SYSTEM.HARMONIQUES.ame.id, choices: SYSTEM.HARMONIQUES }),
      valeur: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })

    // Actions : sous forme d'un item

    // Intrigues : sous forme d'un item

    return schema
  }
}
