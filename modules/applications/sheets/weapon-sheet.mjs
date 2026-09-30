import PenombreBaseItemSheet from "./base-item-sheet.mjs"

export default class unisystemWeaponSheet extends unisystemBaseItemSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["pouvoir"],
    window: {
      contentClasses: ["weapon-content"],
    },
  }

  /** @override */
  static PARTS = {
    main: { template: "systems/penombre/templates/pouvoir.hbs" },
  }
}
