import PenombreBaseItemSheet from "./base-item-sheet.mjs"

export default class PouvoirSheet extends PenombreBaseItemSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["pouvoir"],
    window: {
      contentClasses: ["pouvoir-content"],
    },
  }

  /** @override */
  static PARTS = {
    main: { template: "systems/penombre/templates/pouvoir.hbs" },
  }
}
