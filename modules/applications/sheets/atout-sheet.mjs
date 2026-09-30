import PenombreBaseItemSheet from "./base-item-sheet.mjs"

export default class AtoutSheet extends PenombreBaseItemSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["atout"],
    window: {
      contentClasses: ["atout-content"],
      resizable: true,
    },
  }

  /** @override */
  static PARTS = {
    main: { template: "systems/penombre/templates/atout.hbs" },
  }
}
