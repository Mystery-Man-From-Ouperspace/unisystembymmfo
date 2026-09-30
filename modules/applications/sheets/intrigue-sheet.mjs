import PenombreBaseItemSheet from "./base-item-sheet.mjs"

export default class IntrigueSheet extends PenombreBaseItemSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["intrigue"],
    window: {
      contentClasses: ["intrigue-content"],
    },
  }

  /** @override */
  static PARTS = {
    main: { template: "systems/penombre/templates/intrigue.hbs" },
  }
}
