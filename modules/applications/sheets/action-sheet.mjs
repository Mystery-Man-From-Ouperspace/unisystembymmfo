import PenombreBaseItemSheet from "./base-item-sheet.mjs"

export default class ActionSheet extends PenombreBaseItemSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["action"],
    window: {
      contentClasses: ["action-content"],
    },
  }

  /** @override */
  static PARTS = {
    main: { template: "systems/penombre/templates/action.hbs" },
  }
}
