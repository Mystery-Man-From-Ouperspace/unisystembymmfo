const { sheets } = foundry.applications
const { HandlebarsApplicationMixin } = foundry.applications.api
const gamesettings = game.settings.get("unisystembymmfo", "gamesystem");
const gamesystemclass = gamesettings === "afmbe" ? "afmbe" : (gamesettings === "witchcraft" ? "witchcraft" : (gamesettings === "terraprimate" ? "terraprimate" : (gamesettings === "armageddon" ? "armageddon" : (gamesettings === "conx" ? "conx" : ""))));

export default class unisystemCreatureSheet extends unisystemBaseActorSheet {
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
      width: 700,
      height: 820,
    },
    form: {
      submitOnChange: true,
    },
    window: {
      resizable: true,
    },
    actions: {
      editImage: unisystemCreatureSheet.#onEditImage,
      create: unisystemCreatureSheet.#onCreateItem,
      edit: unisystemCreatureSheet.#onEditItem,
      delete: unisystemCreatureSheet.#onDeleteItem,
      attributeRoll: unisystemCreatureSheet.#onAttributeRoll,
      damageRoll: unisystemCreatureSheet.#onDamageRoll,
      toggleEquipped: unisystemCreatureSheet.#onToggleEquipped,
      armorButtonCell: unisystemCreatureSheet.#onArmorRoll,
      resetResource: unisystemCreatureSheet.#onResetResource,
    },
  }

  /** @typedef {import("@client/applications/api/handlebars-application.mjs").HandlebarsTemplatePart} HandlebarsTemplatePart */
  /** @type {Record<string, HandlebarsTemplatePart>} */
  static PARTS = {
    main: {
        // template: _getTemplate(),
        template: 'systems/unisystembymmfo/templates/hbs-sheets/creature-sheet.hbs',
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
        template: 'systems/unisystembymmfo/templates/hbs-sheets/hbs-tabs/character-tab-core.hbs',
        scrollable: [''],
    },
    equipment: {
        template: 'systems/unisystembymmfo/templates/hbs-sheets/hbs-tabs/character-tab-equipment.hbs',
        scrollable: [''],
    },
    */

  }

  /** @type {Record<string, foundry.applications.types.ApplicationTabsConfiguration>} */
  /*
  static TABS = {
    primary: {
      tabs: [{ id: "core", label: "UNISYSTEM.Core" }, { id: "equipment", label: "UNISYSTEM.Equipment" }],
      // labelPrefix: "MYSYS.tab", // Optional. Prepended to the id to generate a localization key
      initial: "core", // Set the initial tab
    },
  };
  */


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
    
    // this._prepareCharacterItems(context)


    this._prepareCharacterItems(data)

    return context
  }

    _prepareCharacterItems(sheetData) {
      const actorData = this.document

      // Initialize Containers
      const item = [];
      const equippedItem = [];
      const weapon = [];
      const pullingStrings = [];
      const skill = [];
      const aspect = [];

      // Iterate through items and assign to containers
      for (let i of sheetData.items) {
          switch (i.type) {
            case "item": 
                if (i.system.equipped) {equippedItem.push(i)}
                else {item.push(i)}
                break
            
            case "weapon": 
                weapon.push(i)
                break

            case "skill": 
                skill.push(i)
                break

            case "aspect": 
                aspect.push(i)
                break
          }
      }

      // Alphabetically sort all items
      const itemCats = [item, equippedItem, weapon, skill, aspect]
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
      actorData.item = item
      actorData.equippedItem = equippedItem
      actorData.weapon = weapon
      actorData.skill = skill
      actorData.aspect = aspect
    }

    _getTemplate() {
        const path = "systems/unisystembymmfo/templates/hbs-tabs";
        if (!game.user.isGM && this.actor.limited) return "systems/unisystembymmfo/templates/hbs-tabs/limited-creature-sheet.hbs"; 
        return `${path}/${this.actor.type}-sheet.hbs`;
    }


     /**
   * Handle clickable rolls.
   * @param event   The originating click event
   * @private
   */

     /*
    _createItem(event) {
        event.preventDefault()
        const element = event.currentTarget
        
        let itemData = {
            name: game.i18n.localize(`UNISYSTEM.New`)+` `+game.i18n.localize(`UNISYSTEM.${element.dataset.create}`),
            type: element.dataset.create,
            cost: 0,
            level: 0
        }
        return Item.create(itemData, {parent: this.actor})
    }
    */

    _createCharacterPointDivs() {
        let powerDiv = document.createElement('div')
        let characterTypePath = this.actor.system.characterTypes[this.actor.system.characterType]

        // Construct and assign div elements to the headers
        if(characterTypePath != undefined) {
            powerDiv.innerHTML = `- [${this.actor.system.power}]`
            this.form.querySelector('#aspect-header').append(powerDiv)
        }
    }


    #onAttributeRoll(event) {
        event.preventDefault()
        let element = event.currentTarget
        let attributeLabel = element.dataset.attributeName

        // Create options for Qualities/Drawbacks/Skills
        let skillOptions = []
        for (let skill of this.actor.items.filter(item => item.type === 'skill')) {
            let option = `<option value="${skill.id}">${skill.name} ${skill.system.level}</option>`
            skillOptions.push(option)
        }

        let aspectOptions = []
        for (let aspect of this.actor.items.filter(item => item.type === 'aspect')) {
            let option = `<option value="${aspect.id}">${aspect.name} ${aspect.system.power}</option>`
            aspectOptions.push(option)
        }

        // let mode = game.settings.get("unisystembymmfo", "light-mode") ? "light-mode" : ""
        // let dialogOptions = {classes: ["dialog", "unisystembymmfo", mode]}
        // let dialogOptions = {classes: ["dialog", "unisystembymmfo", `${game.settings.get("unisystemcinematicbymmfo", "gamesystem") === "afmbe" ? "afmbe" : (game.settings.get("unisystemcinematicbymmfo", "gamesystem") === "witchcraft" ? "witchcraft" : (game.settings.get("unisystemcinematicbymmfo", "gamesystem") === "terraprimate" ? "terraprimate" : ""))}`]}
        let gamesettings = game.settings.get("unisystembymmfo", "gamesystem");
        let gamesystemclass = gamesettings === "afmbe" ? "afmbe" : (gamesettings === "witchcraft" ? "witchcraft" : (gamesettings === "terraprimate" ? "terraprimate" : (gamesettings === "armageddon" ? "armageddon" : (gamesettings === "conx" ? "conx" : ""))));
        let dialogOptions = {classes: ["dialog", "unisystemcinematicbymmfo", gamesystemclass]}

        /*
        // Create Dialog Prompt
        let d = new Dialog({
            title: game.i18n.localize('UNISYSTEM.Attribute Roll'),
            content: `<div class="unisystembymmfo-dialog-menu">
            <h2>`+game.i18n.localize(`UNISYSTEM.${attributeLabel}`)+` `+game.i18n.localize("UNISYSTEM.Roll")+`</h2>

                            <div class="unisystembymmfo-dialog-menu-text-box">
                                <div>
                                    <p>`+game.i18n.localize("UNISYSTEM.Apply modifiers creature")+`</p>
                                    
                                    <ul>
                                        <li>`+game.i18n.localize("UNISYSTEM.Simple Test")+`</li>
                                        <li>`+game.i18n.localize("UNISYSTEM.Difficult Test")+`</li>
                                    </ul>
                                </div>
                            </div>


                            <table>
                                <tbody>
                                    <tr>
                                        <td class="table-bold-text">`+game.i18n.localize("UNISYSTEM.Attribute Test")+`</td>
                                        <td class="table-center-align">
                                            <select id="attributeTestSelect" name="attributeTest">
                                                <option value="Simple">`+game.i18n.localize("UNISYSTEM.Simple")+`</option>
                                                <option value="Difficult">`+game.i18n.localize("UNISYSTEM.Difficult")+`</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="table-bold-text">`+game.i18n.localize("UNISYSTEM.Roll Modifier")+`</td>
                                        <td class="table-center-align"><input class="attribute-input" type="number" value="0" name="inputModifier" id="inputModifier"></td>
                                    </tr>
                                    <tr>
                                        <td class="table-bold-text">`+game.i18n.localize("UNISYSTEM.Skills")+`</td>
                                        <td class="table-center-align">
                                            <select id="skillSelect" name="skills">
                                                <option value="None">`+game.i18n.localize("UNISYSTEM.None")+`</option>
                                                ${skillOptions.join('')}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="table-bold-text">`+game.i18n.localize("UNISYSTEM.Aspects")+`</td>
                                        <td class="table-center-align">
                                            <select id="aspectSelect" name="aspects">
                                                <option value="None">`+game.i18n.localize("UNISYSTEM.None")+`</option>
                                                ${aspectOptions.join('')}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>`,
            buttons: {
                one: {
                    label: game.i18n.localize("UNISYSTEM.Cancel"),
                    callback: html => console.log('Cancelled')
                },
                two: {
                    label: game.i18n.localize("UNISYSTEM.Roll"),
                    callback: async html => {
                        // Grab the selected options
                        let attributeTestSelect = html[0].querySelector('#attributeTestSelect').value
                        let userInputModifier = Number(html[0].querySelector('#inputModifier').value)
                        let selectedSkill = this.actor.items.get(html[0].querySelector('#skillSelect').value)
                        let selectedAspect = this.actor.items.get(html[0].querySelector('#aspectSelect').value)

                        // Set values for options
                        let attributeValue = attributeTestSelect === game.i18n.localize("UNISYSTEM.Simple") ? this.actor.system[attributeLabel.toLowerCase()].value * 2 : this.actor.system[attributeLabel.toLowerCase()].value
                        let skillValue = selectedSkill != undefined ? selectedSkill.system.level : 0
                        let aspectValue = selectedAspect != undefined ? selectedAspect.system.power : 0

                        // Calculate total modifier to roll
                        let rollMod = (attributeValue + skillValue + aspectValue + userInputModifier)

                        // Roll Dice
                        let roll = new Roll('1d10')
                        await roll.roll()
                        await game?.dice3d?.showForRoll(roll)

                        // Calculate total result after modifiers
                        let totalResult = Number(roll.result) + rollMod

                        // Create Chat Message Content
                        let tags = [`<div>`+game.i18n.localize(`UNISYSTEM.${attributeTestSelect}`)+` `+game.i18n.localize("UNISYSTEM.Test")+`</div>`]
                        let ruleOfDiv = ``
                        if (userInputModifier != 0) {tags.push(`<div>`+game.i18n.localize("UNISYSTEM.User Modifier")+` ${userInputModifier >= 0 ? '+' : ''}${userInputModifier}</div>`)}
                        if (selectedSkill != undefined) {tags.push(`<div>${selectedSkill.name} ${selectedSkill.system.level >= 0 ? '+' : ''}${selectedSkill.system.level}</div>`)}
                        if (selectedAspect != undefined) {tags.push(`<div>${selectedAspect.name} ${selectedAspect.system.power >= 0 ? '+' : ''}${selectedAspect.system.power}</div>`)}

                        if (roll.result == 10) {
                            ruleOfDiv = `<h2 class="rule-of-chat-text">`+game.i18n.localize("UNISYSTEM.Rule of 10!")+`</h2>
                                        <button type="button" data-roll="roll-again" class="rule-of-ten">`+game.i18n.localize("UNISYSTEM.Roll Again")+`</button>`
                            totalResult = 10
                        }
                        if (roll.result == 1) {
                            ruleOfDiv = `<h2 class="rule-of-chat-text">`+game.i18n.localize("UNISYSTEM.Rule of 1!")+`</h2>
                                        <button type="button" data-roll="roll-again" class="rule-of-one">`+game.i18n.localize("UNISYSTEM.Roll Again")+`</button>`
                            totalResult = 1
                        }

                        let chatContent = `<form>
                                                <h2>`+game.i18n.localize(`UNISYSTEM.${attributeLabel}`)+` `+game.i18n.localize("UNISYSTEM.Roll")+` [${this.actor.system[attributeLabel.toLowerCase()].value}]</h2>

                                                <table class="unisystembymmfo-chat-roll-table">
                                                    <thead>
                                                        <tr>
                                                            <th>`+game.i18n.localize("UNISYSTEM.Roll")+`</th>
                                                            <th>`+game.i18n.localize("UNISYSTEM.Modifier")+`</th>
                                                            <th>`+game.i18n.localize("UNISYSTEM.Result")+`</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td data-roll="dice-result">[[${roll.result}]]</td>
                                                            <td data-roll="modifier">${rollMod}</td>
                                                            <td data-roll="dice-total">${totalResult}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                                                    ${ruleOfDiv}
                                                </div>
                                            </form>`

                        ChatMessage.create({
                            // type: CONST.CHAT_MESSAGE_TYPES.ROLL, //
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: `<div class="unisystembymmfo-tags-flex-container">${tags.join('')}</div>`,
                            content: chatContent,
                            roll: roll
                          })
                        
                    }
                }
            },
            default: 'two',
            close: html => console.log()
        }, dialogOptions)

        d.render(true)
        */
    }

    #onDamageRoll(event) {
        event.preventDefault()
        let element = event.currentTarget
        let weapon = this.actor.items.get(element.dataset.itemId)

        // Create Classes for Dialog Box
        // let mode = game.settings.get("unisystembymmfo", "light-mode") ? "light-mode" : ""
        // let dialogOptions = {classes: ["dialog", "unisystembymmfo", mode]}
        // let dialogOptions = {classes: ["dialog", "unisystembymmfo", `${game.settings.get("unisystemcinematicbymmfo", "gamesystem") === "afmbe" ? "afmbe" : (game.settings.get("unisystemcinematicbymmfo", "gamesystem") === "witchcraft" ? "witchcraft" : (game.settings.get("unisystemcinematicbymmfo", "gamesystem") === "terraprimate" ? "terraprimate" : ""))}`]}
        let gamesettings = game.settings.get("unisystembymmfo", "gamesystem");
        let gamesystemclass = gamesettings === "afmbe" ? "afmbe" : (gamesettings === "witchcraft" ? "witchcraft" : (gamesettings === "terraprimate" ? "terraprimate" : (gamesettings === "armageddon" ? "armageddon" : (gamesettings === "conx" ? "conx" : ""))));
        let dialogOptions = {classes: ["dialog", "unisystemcinematicbymmfo", gamesystemclass]}

        /*
        // Create Dialog Prompt
        let d = new Dialog({
            title: game.i18n.localize('UNISYSTEM.Weapon Roll'),
            content: `<div class="unisystembymmfo-dialog-menu">

                            <div class="unisystembymmfo-dialog-menu-text-box">
                                <p><strong>`+game.i18n.localize("UNISYSTEM.If a ranged weapon")+`</strong>`+game.i18n.localize("UNISYSTEM.select how many shots")+`</p>

                                <p>`+game.i18n.localize("UNISYSTEM.Otherwise, leave default and click roll.")+`</p>
                            </div>

                            <div>
                                <h2>`+game.i18n.localize("UNISYSTEM.Options")+`</h2>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>`+game.i18n.localize("UNISYSTEM.# of Shots")+`</th>
                                            <td>
                                                <input type="number" id="shotNumber" name="shotNumber" value="0">
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>`+game.i18n.localize("UNISYSTEM.Firing Mode")+`</th>
                                            <td>
                                                <select id="firingMode" name="firingMode">
                                                    <option>`+game.i18n.localize("UNISYSTEM.None/Melee")+`</option>
                                                    <option>`+game.i18n.localize("UNISYSTEM.Semi-Auto")+`</option>
                                                    <option>`+game.i18n.localize("UNISYSTEM.Burst Fire")+`</option>
                                                    <option>`+game.i18n.localize("UNISYSTEM.Auto-Fire")+`</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    <div>`,

            buttons: {
                one: {
                    label: game.i18n.localize("UNISYSTEM.Cancel"),
                    callback: html => console.log('Cancelled')
                },
                two: {
                    label: game.i18n.localize("UNISYSTEM.Roll"),
                    callback: async html => {
                        // Grab Values from Dialog
                        let shotNumber = html[0].querySelector('#shotNumber').value
                        let firingMode = html[0].querySelector('#firingMode').value

                        let roll = new Roll(weapon.system.damage_string)
                        await roll.roll()
                        await game?.dice3d?.showForRoll(roll)

                        let tags = [`<div>`+game.i18n.localize("UNISYSTEM.Damage Roll")+`</div>`]
                        if (firingMode != game.i18n.localize("UNISYSTEM.None/Melee")) {tags.push(`<div>${firingMode}: ${shotNumber}</div>`)}
                        if (weapon.system.damage_types[weapon.system.damage_type] != 'None') {tags.push(`<div>${weapon.system.damage_types[weapon.system.damage_type]}</div>`)}

                        // Reduce Fired shots from current load chamber
                        if (shotNumber > 0) {
                            switch (weapon.system.capacity.value - shotNumber >= 0) {
                                case true:
                                    // weapon.update({'data.capacity.value': weapon.system.capacity.value - shotNumber})
                                    weapon.update({'system.capacity.value': weapon.system.capacity.value - shotNumber})
                                    break

                                case false: 
                                    return ui.notifications.info(game.i18n.localize("UNISYSTEM.You do not have enough ammo loaded to fire")+` ${shotNumber} `+game.i18n.localize("UNISYSTEM.rounds!"))
                            }
                        }

                        // Create Chat Content
                        let chatContent = `<div>
                                                <h2>${weapon.name}</h2>

                                                <table class="unisystembymmfo-chat-roll-table">
                                                    <thead>
                                                        <tr>
                                                            <th>`+game.i18n.localize("UNISYSTEM.Damage")+`</th>
                                                            <th>`+game.i18n.localize("UNISYSTEM.Detail")+`</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>[[${roll.result}]]</td>
                                                            <td>${weapon.system.damage_string}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>`

                        ChatMessage.create({
                            // type: CONST.CHAT_MESSAGE_TYPES.ROLL, //
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: `<div class="unisystembymmfo-tags-flex-container-item">${tags.join('')}</div>`,
                            content: chatContent,
                            roll: roll
                        })
                    }
                }
            },
            default: "two",
            close: html => console.log()
        }, dialogOptions)

        d.render(true)
        */
    }

    async #onArmorRoll(event) {
        /*
        event.preventDefault()
        let element = event.currentTarget
        let equippedItem = this.actor.items.get(element.dataset.itemId)

        let roll = new Roll(equippedItem.system.armor_value)
        await roll.roll()
        await game?.dice3d?.showForRoll(roll)

        // Create Chat Content
        let chatContent = `<div>
                                <h2>${equippedItem.name}</h2>

                                <table class="unisystembymmfo-chat-roll-table">
                                    <thead>
                                        <tr>
                                            <th>`+game.i18n.localize("UNISYSTEM.Result")+`</th>
                                            <th>`+game.i18n.localize("UNISYSTEM.Detail")+`</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>[[${roll.result}]]</td>
                                            <td>${equippedItem.system.armor_value}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>`

        ChatMessage.create({
            // type: CONST.CHAT_MESSAGE_TYPES.ROLL, //
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: chatContent,
            roll: roll
          })
          */
    }

    #onToggleEquipped(event) {
        event.preventDefault()
        let element = event.currentTarget
        let equippedItem = this.actor.items.get(element.dataset.itemId)

        switch (equippedItem.system.equipped) {
            case true:
                equippedItem.update({'system.equipped': false})
                break
            
            case false:
                equippedItem.update({'system.equipped': true})
                break
        }
    }

    _onResetResource(event) {
        event.preventDefault()
        let element = event.currentTarget
        let dataPath = `data.${element.dataset.resource}.value`

        this.actor.update({[dataPath]: this.actor.system[element.dataset.resource].max})
    }

    _createStatusTags() {
        let tagContainer = this.form.querySelector('.tags-flex-container')
        let encTag = document.createElement('div')

        // Create Encumbrance Tags & Append
        switch (this.actor.system.encumbrance.level) {
            case 1:
                encTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Lightly Encumbered")+`</div>`
                encTag.classList.add('tag')
                tagContainer.append(encTag)
                break

            case 2:
                encTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Moderately Encumbered")+`</div>`
                encTag.classList.add('tag')
                tagContainer.append(encTag)
                break

            case 3: 
                encTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Heavily Encumbered")+`</div>`
                encTag.classList.add('tag')
                tagContainer.append(encTag)
                break
        }
    }


  /**
   /*
   * Different sheet modes.
   * @enum {number}
   */
  static SHEET_MODES = { EDIT: 0, PLAY: 1 }
  */
  /**
   * Is the sheet currently in 'Play' mode?
   * @type {boolean}
   */
  /*
  get isPlayMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.PLAY
  }
  /*

  /**
   * Is the sheet currently in 'Edit' mode?
   * @type {boolean}
   */
  /*
  get isEditMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.EDIT
  }
  */

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
  /*
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
  */

  /**
   * Manage the lock/unlock button on the sheet
   * @param {Event} event
   */
  /*
  async _onSheetChangeLock(event) {
    event.preventDefault()
    const modes = this.constructor.SHEET_MODES
    this._sheetMode = this.isEditMode ? modes.PLAY : modes.EDIT
    await this.submit()
    this.render()
  }
  */

  /**
   * Handle changing a Document's image.
   *
   * @this EminenceSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @returns {Promise}
   * @private
   */
  /*
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
  */






   /**
   * Different sheet modes.
   * @enum {number}
   */
  /*
  static SHEET_MODES = { EDIT: 0, PLAY: 1 }
  */

  /**
   * Is the sheet currently in 'Play' mode?
   * @type {boolean}
   */
  /*
  get isPlayMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.PLAY
  }
  */

  /**
   * Is the sheet currently in 'Edit' mode?
   * @type {boolean}
   */
  /*
  get isEditMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.EDIT
  }
  */

  /** @inheritDoc */
  async _onRender(context, options) {
    await super._onRender(context, options)

    // Set toggle state and add status class to frame
    /*
    this._renderModeToggle(this.element)
    */
  }

  /**
   * Handle re-rendering the mode toggle on ownership changes.
   * @param {HTMLElement} element
   * @protected
   */
  /*
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
  */

  /**
   * Manage the lock/unlock button on the sheet
   * @param {Event} event
   */
  /*
  async _onSheetChangeLock(event) {
    event.preventDefault()
    const modes = this.constructor.SHEET_MODES
    this._sheetMode = this.isEditMode ? modes.PLAY : modes.EDIT
    await this.submit()
    this.render()
  }
  */

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
        console.log("ID = ", game.user.id);
        console.log("ID = ", game.user._id);
        console.log("Name = ", game.user.name);
        console.log("Permission ID = ", this.actor.permission[game.user.id]); /// Est-ce correct ?
        console.log("Permission is GM = ", game.user.isGM);
      //////////////////////////////////////////////////////////////////////////////////////////////
      if (item && this.actor.permission[game.user._id] >= 2||game.user.isGM) return item.sheet.render({ force: true })
      //////////////////////////////////////////////////////////////////////////////////////////////
      item.update({"data.value": item.system.value})

    }
  }

  static async #onDeleteItem(event, target) {
    event.preventDefault()
    const id = target.dataset.itemId
    if (id) return await this.actor.deleteEmbeddedDocuments("Item", [id])
  }

}