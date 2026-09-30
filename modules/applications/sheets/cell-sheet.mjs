const { sheets } = foundry.applications
const { HandlebarsApplicationMixin } = foundry.applications.api
const gamesettings = game.settings.get("unisystembymmfo", "gamesystem");
const gamesystemclass = gamesettings === "afmbe" ? "afmbe" : (gamesettings === "witchcraft" ? "witchcraft" : (gamesettings === "terraprimate" ? "terraprimate" : (gamesettings === "armageddon" ? "armageddon" : (gamesettings === "conx" ? "conx" : ""))));

export default class unisystemCellSheet extends unisystemBaseActorSheet {
  /**
   * The current sheet mode.
   * @type {number}
   */
  _sheetMode = this.constructor.SHEET_MODES.PLAY

  /** @override */
  static DEFAULT_OPTIONS = {
    // classes: ["unisystembymmfo", "sheet", "actor", `${game.settings.get("unisystembymmfo", "light-mode") ? "light-mode" : ""}`],
    classes: ["unisystembymmfo", "sheet", "actor", gamesystemclass],
    position: {
      width: 800,
      height: 780,
    },
    form: {
      submitOnChange: true,
    },
    window: {
      resizable: true,
    },
    actions: {
      editImage: unisystemCellSheet.#onEditImage,
      create: unisystemCellSheet.#onCreateItem,
      edit: unisystemCellSheet.#onEditItem,
      delete: unisystemCellSheet.#onDeleteItem,
      attributeRoll: unisystemCellSheet.#onAttributeRoll,
      damageRoll: unisystemCellSheet.#onDamageRoll,
      toggleEquipped: unisystemCellSheet.#onToggleEquipped,
      armorButtonCell: unisystemCellSheet.#onArmorRoll,
      resetResource: unisystemCellSheet.#onResetResource,
    },
  }

  /** @typedef {import("@client/applications/api/handlebars-application.mjs").HandlebarsTemplatePart} HandlebarsTemplatePart */
  /** @type {Record<string, HandlebarsTemplatePart>} */
  static PARTS = {
    main: {
        template: `systems/unisystembymmfo/templates/hbs-tabs/${this.actor.type}-sheet.hbs`,
    },
    /*
    header: {
        template: 'systems/my-system/templates/actor/header.hbs',
    },
    tabs: {
        // Foundry-provided generic template
        template: 'templates/generic/tab-navigation.hbs',
        // classes: ['sysclass'], // Optionally add extra classes to the part for extra customization
    },
    core: {
        template: 'systems/unisystembymmfo/templates/hbs-sheets/hbs-tabs/cell-tab-core.hbs',
        scrollable: [''],
    },
    equipment: {
        template: 'systems/unisystembymmfo/templates/hbs-sheets/hbs-tabs/cell-tab-equipment.hbs',
        scrollable: [''],
    },
    resources: {
        template: 'systems/unisystembymmfo/templates/hbs-sheets/hbs-tabs/cell-tab-resources.hbs',
        scrollable: [''],
    },
    */
  }

  /** @type {Record<string, foundry.applications.types.ApplicationTabsConfiguration>} */
  static TABS = {
    /*
    primary: {
      tabs: [{ id: "core", label: "UNISYSTEM.Core" }, { id: "equipment", label: "UNISYSTEM.Equipment" }, { id: "resources", label: "UNISYSTEM.REsources" }],
      // labelPrefix: "MYSYS.tab", // Optional. Prepended to the id to generate a localization key
      initial: "core", // Set the initial tab
    },
    */
  };


  /** @override */
  async _prepareContext() {
    const context = await super._prepareContext()

    context.fields = this.document.schema.fields
    context.systemFields = this.document.system.schema.fields
    context.systemSource = this.document.system._source
    context.document = this.document
    context.system = this.document.system

    context.gamesystem = game.settings.get("unisystembymmfo", "gamesystem");

    context.polaroidold = game.settings.get("unisystembymmfo", "polaroidold");

    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.biography, { async: true })

    /*
    context.unlocked = this.isEditMode
    context.locked = this.isPlayMode
    */

    // Available in jsdoc via {foundry.applications.types.ApplicationTab}
    /**
     * @typedef ApplicationTab
     * @property {string}  id
     * @property {string}  group
     * @property {boolean} active
     * @property {string}  cssClass
     * @property {string}  [label]
     * @property {string}  [icon]
     * @property {string}  [tooltip]
    */
    /** @type {Record<string, foundry.applications.types.ApplicationTab} */
    /*
    context.tabs = this._prepareTabs("primary")
    */
    
    this._prepareCharacterItems(context)

    return context
  }

  _prepareCharacterItems(sheetData) {

      const actorData = sheetData.actor

      // Initialize Containers
      const locations = [];
      const facilities = [];
      const staff = [];
      const weaponery = [];
      const gear = [];
      const vehicles = [];
      const science = [];
      const medical = [];
      const restricted = [];

      // Iterate through items and assign to containers
      for (let i of actorData.items) {
          switch (i.type) {
            case "locations":
                locations.push(i)
                break
               
            case "facilities": 
                facilities.push(i)
                break

            case "staff": 
                staff.push(i)
                break

            case "weaponery": 
                weaponery.push(i)
                break

            case "gear": 
                gear.push(i)
                break

            case "vehicles": 
                vehicles.push(i)
                break

            case "science": 
                science.push(i)
                break

            case "medical": 
                medical.push(i)
                break

            case "restricted": 
                restricted.push(i)
                break
          }
      }

      // Alphabetically sort all items
      // const itemCats = [item, equippedItem, weapon]
      const itemCats = [locations, facilities, staff, weaponery, gear, vehicles, science, medical, restricted]
      for (let category of itemCats) {
          if (category.length > 1) {
              category.sort((a,b) => {
                  let nameA = a.name.toLowerCase()
                  let nameB = b.name.toLowerCase()
                  if (nameA > nameB) {return 1}
                  else {return -1}
              })
          }
      }

      // Assign and return items
      actorData.locations = locations
      actorData.facilities = facilities
      actorData.staff = staff
      actorData.weaponery = weaponery
      actorData.gear = gear
      actorData.vehicles = vehicles
      actorData.science = science
      actorData.medical = medical
      actorData.restricted = restricted
  }

  /**
   * Different sheet modes.
   * @enum {number}
   */
  static SHEET_MODES = { EDIT: 0, PLAY: 1 }

  /**
   * Is the sheet currently in 'Play' mode?
   * @type {boolean}
   */
  get isPlayMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.PLAY
  }

  /**
   * Is the sheet currently in 'Edit' mode?
   * @type {boolean}
   */
  get isEditMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.EDIT
  }

  /** @inheritDoc */
  async _onRender(context, options) {
    await super._onRender(context, options)

    // Set toggle state and add status class to frame
    this._renderModeToggle(this.element)
  }

  /**
   * Handle re-rendering the mode toggle on ownership changes.
   * @param {HTMLElement} element
   * @protected
   */
  _renderModeToggle(element) {
    const header = element.querySelector(".window-header")
    const toggle = header.querySelector(".mode-slider")
    if (this.isEditable && !toggle) {
      const toggle = document.createElement("penombre-toggle-switch")
      toggle.checked = this._sheetMode === this.constructor.SHEET_MODES.EDIT
      toggle.classList.add("mode-slider")
      // TODO change tooltip with translation
      toggle.dataset.tooltip = "PENOMBRE.ui.modeEdition"
      toggle.dataset.tooltipDirection = "UP"
      toggle.setAttribute("aria-label", game.i18n.localize("PENOMBRE.ui.modeEdition"))
      toggle.addEventListener("change", this._onSheetChangeLock.bind(this))
      toggle.addEventListener("dblclick", (event) => event.stopPropagation())
      toggle.addEventListener("pointerdown", (event) => event.stopPropagation())
      header.prepend(toggle)
    } else if (this.isEditable) {
      toggle.checked = this._sheetMode === this.constructor.SHEET_MODES.EDIT
    } else if (!this.isEditable && toggle) {
      toggle.remove()
    }
  }

  /**
   * Manage the lock/unlock button on the sheet
   * @param {Event} event
   */
  async _onSheetChangeLock(event) {
    event.preventDefault()
    const modes = this.constructor.SHEET_MODES
    this._sheetMode = this.isEditMode ? modes.PLAY : modes.EDIT
    await this.submit()
    this.render()
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

  static async #onCreateItem(event, target) {
    event.preventDefault()
    const type = target.dataset.type

    let itemData = {
        // name: `New ${element.dataset.create}`,
        name: game.i18n.localize(`UNISYSTEM.New`)+` `+game.i18n.localize(`UNISYSTEM.${element.dataset.create}`),
        type: element.dataset.create,
        cost: 0,
        level: 0
    }
    // return Item.create(itemData, {parent: this.actor})

    let itemData = {
        // name: `New ${element.dataset.create}`,
        name: game.i18n.localize(`UNISYSTEM.New`)+` `+game.i18n.localize(`UNISYSTEM.${element.dataset.create}`),
        type: element.dataset.create,
        cost: 0,
        level: 0
    }
    // return Item.create(itemData, {parent: this.actor})
    /*
    if (type === "pouvoir") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.pouvoirNew")
    } else if (type === "atout") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.atoutNew")
    } else if (type === "maitrise") {
      itemData.name = game.i18n.localize("PENOMBRE.ui.maitriseNew")
    }
    */

    return await this.actor.createEmbeddedDocuments("Item", [itemData])
  }


  static #onEditItem(event, target) {
    event.preventDefault()
    const id = target.dataset.itemId
    if (id) {
      const item = this.actor.items.get(id)
      if (item) return item.sheet.render({ force: true })
    }
  }

  static async #onDeleteItem(event, target) {
    event.preventDefault()
    const id = target.dataset.itemId
    if (id) return await this.actor.deleteEmbeddedDocuments("Item", [id])
  }
}
