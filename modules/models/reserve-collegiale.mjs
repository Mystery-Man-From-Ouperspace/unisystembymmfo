const { TypedObjectField, BooleanField, SchemaField } = foundry.data.fields

export default class ReserveCollegiale extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const schema = {}

    schema.jetons = new TypedObjectField(
      new SchemaField({
        valeur: new BooleanField(), // True si le jeton est disponible, false sinon
      }),
      {
        validateKeys: (key) => {
          const numericKey = Number(key)
          return Number.isInteger(numericKey) && numericKey >= 1 && numericKey <= 10
        },
      },
    )

    return schema
  }

  get nbJetonsRestants() {
    return Object.values(this.jetons).filter((jeton) => jeton.valeur === true).length
  }

  static changeNbJetons(newNbJetons) {
    if (game.settings.get("penombre", "styleJeu") === "demo" && newNbJetons !== 10) {
      ui.notifications.error(game.i18n.localize("PENOMBRE.Warnings.limiteNbJetonsDemo"), { permanent: true })
    }
  }
}
