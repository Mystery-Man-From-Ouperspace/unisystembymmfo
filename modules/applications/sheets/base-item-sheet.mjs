const { sheets } = foundry.applications
const { HandlebarsApplicationMixin } = foundry.applications.api

export default class unisystemBaseItemSheet extends HandlebarsApplicationMixin(sheets.ItemSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["unisystembymmfo", "sheet", "item", `${game.settings.get("unisystembymmfo", "gamesystem") === "afmbe" ? "afmbe" : (game.settings.get("unisystembymmfo", "gamesystem") === "witchcraft" ? "witchcraft" : (game.settings.get("unisystembymmfo", "gamesystem") === "terraprimate" ? "terraprimate" : ""))}`],
    position: {
      width: 600,
      height: 450,
    },
    form: {
      submitOnChange: true,
    },
    window: {
      resizable: true,
    },
    actions: {
      editImage: unisystemBaseItemSheet.#onEditImage,
    },
  }

  /** @override */
  async _prepareContext() {
    const context = await super._prepareContext()

    context.fields = this.document.schema.fields
    context.systemFields = this.document.system.schema.fields
    context.systemSource = this.document.system._source
    context.document = this.document
    context.item = this.document
    context.system = this.document.system

    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.description, { async: true })

    return context
  }

  /**
   * Handle changing a Document's image.
   *
   * @this EminenceSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @returns {Promise}
   * @private
   */
  static async #onEditImage(event, target) {
    const current = foundry.utils.getProperty(this.document, "img")
    const { img } = this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ?? {}
    const fp = new foundry.applications.apps.FilePicker.implementation({
      current,
      type: "image",
      redirectToRoot: img ? [img] : [],
      callback: (path) => {
        this.document.update({ img: path })
      },
      top: this.position.top + 40,
      left: this.position.left + 10,
    })
    return fp.browse()
  }
}
