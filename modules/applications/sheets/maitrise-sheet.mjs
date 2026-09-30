import PenombreBaseItemSheet from "./base-item-sheet.mjs"

export default class MaitriseSheet extends PenombreBaseItemSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["maitrise"],
    position: {
      width: 570,
      height: 450,
    },

    window: {
      contentClasses: ["maitrise-content"],
    },
  }

  /** @override */
  static PARTS = {
    main: { template: "systems/penombre/templates/maitrise.hbs" },
  }
}
