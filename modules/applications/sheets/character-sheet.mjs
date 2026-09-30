const { sheets } = foundry.applications
const { HandlebarsApplicationMixin } = foundry.applications.api
const gamesettings = game.settings.get("unisystembymmfo", "gamesystem");
const gamesystemclass = gamesettings === "afmbe" ? "afmbe" : (gamesettings === "witchcraft" ? "witchcraft" : (gamesettings === "terraprimate" ? "terraprimate" : (gamesettings === "armageddon" ? "armageddon" : (gamesettings === "conx" ? "conx" : ""))));

import unisystemBaseActorSheet from "./base-actor-sheet.mjs"

export default class unisystemActorSheet extends unisystemBaseActorSheet {
  /**
   * The current sheet mode.
   * @type {number}
   */
  // _sheetMode = this.constructor.SHEET_MODES.PLAY

  /** @override */
  static DEFAULT_OPTIONS = {
    tag: "form",
    // classes: ["unisystembymmfo", "sheet", "actor", `${game.settings.get("unisystembymmfo", "light-mode") ? "light-mode" : ""}`],
    classes: ["unisystembymmfo", "sheet", "actor", gamesystemclass],
    position: {
      width: 800,
      height: 820,
    },
    form: {
      submitOnChange: true,
    },
    window: {
      resizable: true,
    },
    actions: {
      editImage: unisystemActorSheet.#onEditImage,
      create: unisystemActorSheet.#onCreateItem,
      edit: unisystemActorSheet.#onEditItem,
      delete: unisystemActorSheet.#onDeleteItem,
      attributeRoll: unisystemActorSheet.#onAttributeRoll,
      damageRoll: unisystemActorSheet.#onDamageRoll,
      toggleEquipped: unisystemActorSheet.#onToggleEquipped,
      armorButtonCell: unisystemActorSheet.#onArmorRoll,
      resetResource: unisystemActorSheet.#onResetResource,

      
        /*
        // Buttons and Event Listeners
        html.find('.attribute-roll').click(this._onAttributeRoll.bind(this))
        html.find('.damage-roll').click(this._onDamageRoll.bind(this))
        html.find('.toggleEquipped').click(this._onToggleEquipped.bind(this))
        html.find('.armor-button-cell button').click(this._onArmorRoll.bind(this))
        html.find('.reset-resource').click(this._onResetResource.bind(this))
        
        html.find('.item-name').click( (ev) => {

        */
    },
  }

  /** @typedef {import("@client/applications/api/handlebars-application.mjs").HandlebarsTemplatePart} HandlebarsTemplatePart */
  /** @type {Record<string, HandlebarsTemplatePart>} */
  static PARTS = {
    main: {
        // template: _getTemplate(),
        template: 'systems/unisystembymmfo/templates/hbs-sheets/character-sheet.hbs',
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

    // context.fields = this.document.schema.fields
    // context.systemFields = this.document.system.schema.fields
    // context.systemSource = this.document.system._source
    context.document = this.document
    context.system = this.document.system

    context.isGM = game.user.isGM;
    context.editable = data.options.editable;

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
      const item = [];
      const equippedItem = [];
      const weapon = [];
      const power = [];
      const quality = [];
      const pullingStrings = [];
      const skill = [];
      const drawback = [];

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

            case "power": 
                power.push(i)
                break

            case "quality":
                if (i.system.type == "1") {pullingStrings.push(i)}
                else {quality.push(i)}
                break

            case "skill": 
                skill.push(i)
                break

            case "drawback": 
                drawback.push(i)
                break
          }
      }

      // Alphabetically sort all items
      const itemCats = [item, equippedItem, weapon, power, quality, pullingStrings, skill, drawback]
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
      actorData.power = power
      actorData.quality = quality
      actorData.pullingStrings = pullingStrings
      actorData.skill = skill
      actorData.drawback = drawback
  }


    _getTemplate() {
        const path = "systems/unisystembymmfo/templates/hbs-tabs";
        if (!game.user.isGM && this.actor.limited) return "systems/unisystembymmfo/templates/hbs-tabs/limited-character-sheet.hbs"; 
        return `${path}/${this.actor.type}-sheet.hbs`;
    }

    
    /** @override */
    /*
    async activateListeners(html) {
        super.activateListeners(html);

        // Run non-event functions
        this._createCharacterPointDivs()
        this._createStatusTags()

        // Buttons and Event Listeners
        html.find('.attribute-roll').click(this._onAttributeRoll.bind(this))
        html.find('.damage-roll').click(this._onDamageRoll.bind(this))
        html.find('.toggleEquipped').click(this._onToggleEquipped.bind(this))
        html.find('.armor-button-cell button').click(this._onArmorRoll.bind(this))
        html.find('.reset-resource').click(this._onResetResource.bind(this))
        
        // Update/Open Inventory Item
        html.find('.create-item').click(this._createItem.bind(this))

        html.find('.item-name').click( (ev) => {
            const li = ev.currentTarget.closest(".item")
            const item = this.actor.items.get(li.dataset.itemId)
            //////////////////////////////////////////////////////////////////////////////////////////////
            // if(this.actor.permission[game.user.data._id] >= 2||game.user.isGM) {item.sheet.render(true)}
            console.log("ID = ", game.user.id);
            console.log("ID = ", game.user._id);
            console.log("Name = ", game.user.name);
            console.log("Permission ID = ", this.actor.permission[game.user.id]); /// Est-ce correct ?
            console.log("Permission is GM = ", game.user.isGM);
            if(this.actor.permission[game.user._id] >= 2||game.user.isGM) {item.sheet.render(true)} /// Est-ce correct ?
            //////////////////////////////////////////////////////////////////////////////////////////////
            item.update({"data.value": item.system.value})
        })

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = ev.currentTarget.closest(".item");
            this.actor.deleteEmbeddedDocuments("Item", [li.dataset.itemId]);
        });
    }
    */


    _createCharacterPointDivs() {
        let actorData = this.actor.system
        let attributesDiv = document.createElement('div')
        let qualityDiv = document.createElement('div')
        let drawbackDiv = document.createElement('div')
        let skillDiv = document.createElement('div')
        let powerDiv = document.createElement('div')

        const gamesystem = game.settings.get("unisystembymmfo", "gamesystem")
        let characterTypePath
        let mycharacterTypeValues
        switch (gamesystem) {
            case "terraprimate":
              characterTypePath = actorData.terraprimatecharacterTypes[actorData.terraprimatecharacterType]
              mycharacterTypeValues = actorData.terraprimatecharacterTypeValues
                break;
            case "afmbe":
              characterTypePath = actorData.afmbecharacterTypes[actorData.afmbecharacterType]
              mycharacterTypeValues = actorData.afmbecharacterTypeValues
                break;
            case "witchcraft":
              characterTypePath = actorData.witchcraftcharacterTypes[actorData.witchcraftcharacterType]
              mycharacterTypeValues = actorData.witchcraftcharacterTypeValues
                break;
            case "conx":
              characterTypePath = actorData.characterTypes[actorData.characterType]
              mycharacterTypeValues = actorData.characterTypeValues
                break;
            case "armageddon":
              characterTypePath = actorData.armageddoncharacterTypes[actorData.armageddoncharacterType]
              mycharacterTypeValues = actorData.armageddoncharacterTypeValues
                break;
            default:
                console.log("Bizarre !")
                characterTypePath = undefined
        }

        // Construct and assign div elements to the headers
        if(characterTypePath != undefined) {
            attributesDiv.innerHTML = `- [${mycharacterTypeValues[characterTypePath].attributePoints.value}/${mycharacterTypeValues[characterTypePath].attributePoints.max}]`
            this.form.querySelector('#attributes-header').append(attributesDiv)

            qualityDiv.innerHTML = `- [${mycharacterTypeValues[characterTypePath].qualityPoints.value}/${mycharacterTypeValues[characterTypePath].qualityPoints.max}]`
            this.form.querySelector('#quality-header').append(qualityDiv)

            drawbackDiv.innerHTML = `- [${mycharacterTypeValues[characterTypePath].drawbackPoints.value}/${mycharacterTypeValues[characterTypePath].drawbackPoints.max}]`
            this.form.querySelector('#drawback-header').append(drawbackDiv)

            skillDiv.innerHTML = `- [${mycharacterTypeValues[characterTypePath].skillPoints.value}/${mycharacterTypeValues[characterTypePath].skillPoints.max}]`
            this.form.querySelector('#skill-header').append(skillDiv)

            powerDiv.innerHTML = `- [${mycharacterTypeValues[characterTypePath].metaphysicsPoints.value}/${mycharacterTypeValues[characterTypePath].metaphysicsPoints.max}]`
            this.form.querySelector('#power-header').append(powerDiv)
        }
    }


   /**
   * Handle clickable rolls.
   * @param event   The originating click event
   * @private
   */

    #onAttributeRoll(event, target) {
        event.preventDefault()
        let element = event.target
        let attributeLabel = element.dataset.attributeName
        let actorData = this.actor.system

        // Create options for Qualities/Drawbacks/Skills
        let skillOptions = []
        for (let skill of this.actor.items.filter(item => item.type === 'skill')) {
            let option = `<option value="${skill.id}">${skill.name} ${skill.system.level}</option>`
            skillOptions.push(option)
        }

        let qualityOptions = []
        for (let quality of this.actor.items.filter(item => item.type === 'quality')) {
            let option = `<option value="${quality.id}">${quality.name} ${quality.system.cost}</option>`
            qualityOptions.push(option)
        }

        let drawbackOptions = []
        for (let drawback of this.actor.items.filter(item => item.type === 'drawback')) {
            let option = `<option value="${drawback.id}">${drawback.name} ${drawback.system.cost}</option>`
            drawbackOptions.push(option)
        }

        // Create penalty tags from Resource Loss Status
        let penaltyTags = []
        if (actorData.endurance_points.loss_toggle) {penaltyTags.push(`<div>`+game.i18n.localize(`UNISYSTEM.Endurance Loss`)+` ${actorData.endurance_points.loss_penalty}</div>`)}
        if (actorData.essence.loss_toggle) {penaltyTags.push(`<div>`+game.i18n.localize(`UNISYSTEM.Essence Loss`)+` ${actorData.essence.loss_penalty}</div>`)}
        
        // Create Classes for Dialog Box
        // let mode = game.settings.get("unisystembymmfo", "light-mode") ? "light-mode" : ""
        // let dialogOptions = {classes: ["dialog", "unisystembymmfo", mode]}
        let gamesettings = game.settings.get("unisystembymmfo", "gamesystem");
        let gamesystemclass = gamesettings === "afmbe" ? "afmbe" : (gamesettings === "witchcraft" ? "witchcraft" : (gamesettings === "terraprimate" ? "terraprimate" : (gamesettings === "armageddon" ? "armageddon" : (gamesettings === "conx" ? "conx" : ""))));
        let dialogOptions = {classes: ["dialog", "unisystembymmfo", gamesystemclass]}

        /*
        // Create Dialog Prompt
        let d = new Dialog({
            title: game.i18n.localize('UNISYSTEM.Attribute Roll'),
            content: `<div class="unisystembymmfo-dialog-menu">
                            <h2>`+game.i18n.localize(`UNISYSTEM.${attributeLabel}`)+` `+game.i18n.localize("UNISYSTEM.Roll")+`</h2>

                            <div class="unisystembymmfo-dialog-menu-text-box">
                                <div>
                                    <p>`+game.i18n.localize("UNISYSTEM.Apply modifiers")+`</p>
                                    
                                    <ul>
                                        <li>`+game.i18n.localize("UNISYSTEM.Simple Test")+`</li>
                                        <li>`+game.i18n.localize("UNISYSTEM.Difficult Test")+`</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="unisystembymmfo-tags-flex-container">
                                ${penaltyTags.join('')}
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
                                        <td class="table-bold-text">`+game.i18n.localize("UNISYSTEM.Qualities")+`</td>
                                        <td class="table-center-align">
                                            <select id="qualitySelect" name="qualities">
                                                <option value="None">`+game.i18n.localize("UNISYSTEM.None")+`</option>
                                                ${qualityOptions.join('')}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="table-bold-text">`+game.i18n.localize("UNISYSTEM.Drawbacks")+`</td>
                                        <td class="table-center-align">
                                            <select id="drawbackSelect" name="drawbacks">
                                                <option value="None">`+game.i18n.localize("UNISYSTEM.None")+`</option>
                                                ${drawbackOptions.join('')}
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
                        let selectedQuality = this.actor.items.get(html[0].querySelector('#qualitySelect').value)
                        let selectedDrawback = this.actor.items.get(html[0].querySelector('#drawbackSelect').value)

                        // Set values for options
                        let attributeValue = attributeTestSelect === game.i18n.localize("UNISYSTEM.Simple") ? actorData[attributeLabel.toLowerCase()].value * 2 : actorData[attributeLabel.toLowerCase()].value
                        let skillValue = selectedSkill != undefined ? selectedSkill.system.level : 0
                        let qualityValue = selectedQuality != undefined ? selectedQuality.system.cost : 0
                        let drawbackValue = selectedDrawback != undefined ? selectedDrawback.system.cost : 0
                        let statusPenalties = actorData.endurance_points.loss_penalty + actorData.essence.loss_penalty

                        // Calculate total modifier to roll
                        let rollMod = (attributeValue + skillValue + qualityValue + userInputModifier) - drawbackValue + statusPenalties

                        // Roll Dice
                        let roll = new Roll('1d10')
                        await roll.roll()
                        await game?.dice3d?.showForRoll(roll)

                        // Calculate total result after modifiers
                        let totalResult = Number(roll.result) + rollMod

                        // Create Chat Message Content
                        let tags = [`<div>`+game.i18n.localize(`UNISYSTEM.${attributeTestSelect}`)+` `+game.i18n.localize("UNISYSTEM.Test")+`</div>`]
                        let ruleOfDiv = ``
                        if (userInputModifier != 0) {tags.push(`<div>`+game.i18n.localize("UNISYSTEM.User Modifier")+` ${userInputModifier >= 0 ? "+" : ''}${userInputModifier}</div>`)}
                        if (selectedSkill != undefined) {tags.push(`<div>${selectedSkill.name} ${selectedSkill.system.level >= 0 ? '+' : ''}${selectedSkill.system.level}</div>`)}
                        if (selectedQuality != undefined) {tags.push(`<div>${selectedQuality.name} ${selectedQuality.system.cost >= 0 ? '+' : ''}${selectedQuality.system.cost}</div>`)}
                        if (selectedDrawback != undefined) {tags.push(`<div>${selectedDrawback.name} ${selectedQuality.system.cost >= 0 ? '-' : '+'}${Math.abs(selectedDrawback.system.cost)}</div>`)}

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
                                                <h2>`+game.i18n.localize(`UNISYSTEM.${attributeLabel}`)+` `+game.i18n.localize("UNISYSTEM.Roll")+` [${actorData[attributeLabel.toLowerCase()].value}]</h2>

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
                            flavor: `<div class="unisystembymmfo-tags-flex-container">${tags.join('')} ${penaltyTags.join('')}</div>`,
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

    #onDamageRoll(event, target) {
        event.preventDefault()
        let element = event.target
        let weapon = this.actor.items.get(element.dataset.itemId)

        // Create Classes for Dialog Box
        // let mode = game.settings.get("unisystembymmfo", "light-mode") ? "light-mode" : ""
        // let dialogOptions = {classes: ["dialog", "unisystembymmfo", mode]}
        let gamesettings = game.settings.get("unisystembymmfo", "gamesystem");
        let gamesystemclass = gamesettings === "afmbe" ? "afmbe" : (gamesettings === "witchcraft" ? "witchcraft" : (gamesettings === "terraprimate" ? "terraprimate" : (gamesettings === "armageddon" ? "armageddon" : (gamesettings === "conx" ? "conx" : ""))));
        let dialogOptions = {classes: ["dialog", "unisystembymmfo", gamesystemclass]}

        /*
        // Create Dialog Box
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
                        if (weapon.system.damage_types[weapon.system.damage_type] != 'None') {tags.push(`<div>`+game.i18n.localize(`UNISYSTEM.${weapon.system.damage_types[weapon.system.damage_type]}`)+`</div>`)}

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

    async #onArmorRoll(event, target) {
        event.preventDefault()
        let element = event.target
        let equippedItem = this.actor.items.get(element.dataset.itemId)

        let roll = new Roll(equippedItem.system.armor_value)
        await roll.roll()
        await game?.dice3d?.showForRoll(roll)

        let tags = [`<div>`+game.i18n.localize("UNISYSTEM.Armor Roll")+`</div>`]

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
            flavor: `<div class="unisystembymmfo-tags-flex-container-item">${tags.join('')}</div>`,
            content: chatContent,
            roll: roll
          })
    }

    #onToggleEquipped(event, target) {
        event.preventDefault()
        let element = event.target
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

    #onResetResource(event, target) {
        event.preventDefault()
        let actorData = this.actor.system
        let element = event.target
        let dataPath = `data.${element.dataset.resource}.value`

        this.actor.update({[dataPath]: actorData[element.dataset.resource].max})
    }

    _createStatusTags() {
        let tagContainer = this.form.querySelector('.tags-flex-container')
        let encTag = document.createElement('div')
        let enduranceTag = document.createElement('div')
        let essenceTag = document.createElement('div')
        let injuryTag = document.createElement('div')
        let actorData = this.actor.system

        // Create Essence Tag and & Append
        if (actorData.essence.value <= 1) {
            essenceTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Hopeless")+`</div>`
            essenceTag.title = game.i18n.localize('UNISYSTEM.All Tests suffer -3 penalty')
            essenceTag.classList.add('tag')
            tagContainer.append(essenceTag)
        }
        else if (actorData.essence.value <= (actorData.essence.max / 2)) {
            essenceTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Forlorn")+`</div>`
            essenceTag.title = game.i18n.localize('UNISYSTEM.Mental tests suffer a -1 penalty')
            essenceTag.classList.add('tag')
            tagContainer.append(essenceTag)
        }

        // Create Endurance Tag and & Append
        if (actorData.endurance_points.value <= 5) {
            enduranceTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Exhausted")+`</div>`
            enduranceTag.title = game.i18n.localize('UNISYSTEM.All Tests suffer -2 penalty')
            enduranceTag.classList.add('tag')
            tagContainer.append(enduranceTag)
        }

        // Create Injury Tag and & Append
        if (actorData.hp.value <= -10) {
            injuryTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Dying")+`</div>`
            injuryTag.classList.add('tag')
            injuryTag.title = game.i18n.localize('UNISYSTEM.Survival Test required to avoid instant death')
            tagContainer.append(injuryTag)
        }
        else if (actorData.hp.value <= 0) {
            injuryTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Semi-Conscious")+`</div>`
            injuryTag.classList.add('tag')
            injuryTag.title = game.i18n.localize('UNISYSTEM.Willpower test required to regain consciousness, penalized by the number their HP is below 0')
            tagContainer.append(injuryTag)
        }
        else if (actorData.hp.value <= 5) {
            injuryTag.innerHTML = `<div>`+game.i18n.localize("UNISYSTEM.Severely Injured")+`</div>`
            injuryTag.classList.add('tag')
            injuryTag.title = game.i18n.localize('UNISYSTEM.Most actions suffer -1 through -5 penalty')
            tagContainer.append(injuryTag)
        }

        // Create Encumbrance Tags & Append
        switch (actorData.encumbrance.level) {
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
