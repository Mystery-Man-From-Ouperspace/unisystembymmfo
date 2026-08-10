// Import Modules
import { unisystemActorSheet } from "./actor-sheet.js";
import { unisystemActor } from "./actor.js";
import { unisystemItem } from "./item.js";
import { unisystemItemSheet } from "./item-sheet.js";
import { unisystemCellSheet } from "./cell-sheet.js"
import { unisystemCreatureSheet } from "./creature-sheet.js"
import { unisystemVehicleSheet } from "./vehicle-sheet.js"
import { registerHandlebarsHelpers } from "./helpers.js";

import { unisystemMessage } from "./chat-message.js";



/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
    console.log(`Initializing UNISYSTEM System`);

    /**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
        formula: "1d10 + @initiative.value",
        decimals: 0
      };

      
      // Register Handlebars Helpers
      registerHandlebarsHelpers();


      // Define Custom Entity Classes
      CONFIG.Actor.documentClass = unisystemActor
      CONFIG.Item.documentClass = unisystemItem

      CONFIG.ChatMessage.documentClass = unisystemMessage;

      // Register sheet application classes
      Actors.unregisterSheet("core", ActorSheet)

      Actors.registerSheet("unisystembymmfo", unisystemActorSheet, 
      {
          types: ["character"],
          makeDefault: true,
          label: "Default UNISYSTEM Character Sheet"
      })

      Actors.registerSheet("unisystembymmfo", unisystemCreatureSheet, 
      {
          types: ["creature"],
          makeDefault: true,
          label: "Default UNISYSTEM Creature Sheet"
      })

      Actors.registerSheet("unisystembymmfo", unisystemCellSheet, 
      {
          types: ["cell"],
          makeDefault: true,
          label: "Default UNISYSTEM Cell Sheet"
      })

      Actors.registerSheet("unisystembymmfo", unisystemVehicleSheet, 
      {
          types: ["vehicle"],
          makeDefault: true,
          label: "Default UNISYSTEM Vehicle Sheet"
      })

      Items.registerSheet("unisystembymmfo", unisystemItemSheet, 
      {
          makeDefault: true,
          label: "Default UNISYSTEM Item Sheet"
      })


      // Game Settings
      function delayedReload() {window.setTimeout(() => location.reload(), 500)}
      /*
      game.settings.register("unisystembymmfo", "light-mode", {
        name: game.i18n.localize("UNISYSTEM.Light Mode"),
        hint: game.i18n.localize("UNISYSTEM.Checking this option enables Light Mode"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: delayedReload
      });
      */

        game.settings.register("unisystembymmfo", "gamesystem", {
        name: game.i18n.localize("UNISYSTEM.Settings.gamesystem.name"),
        hint: game.i18n.localize("UNISYSTEM.Settings.gamesystem.hint"),
        scope: "world",
        config: true,
        default: "afmbe",
        type: String,
        choices: {
          afmbe: "UNISYSTEM.Settings.gamesystem.afmbe",
          armageddon: "UNISYSTEM.Settings.gamesystem.armageddon",
          conx: "UNISYSTEM.Settings.gamesystem.conx",
          terraprimate: "UNISYSTEM.Settings.gamesystem.terraprimate",
          witchcraft: "UNISYSTEM.Settings.gamesystem.witchcraft",
        },
        requiresReload: true,
      });

      game.settings.register("unisystembymmfo", "aegis-ndd", {
          name: game.i18n.localize("UNISYSTEM.Aegis-NDD"),
          hint: game.i18n.localize("UNISYSTEM.Checking this option enables NDD wheel instead of Aegis wheel"),
          scope: "world",
          config: true,
          default: false,
          type: Boolean,
          onChange: delayedReload
      });

      const gamesystem = game.settings.get("unisystembymmfo", "gamesystem");
      const ndd = game.settings.get("unisystembymmfo", "aegis-ndd");
      if (gamesystem === "conx") {
        document.body.classList.add(ndd ? "unisystembymmfo-ndd" : "unisystembymmfo-aegis");
      }
      else {
        document.body.classList.add(gamesystem);  
      } 

      game.settings.register("unisystembymmfo", "polaroidold", {
        name: game.i18n.localize("UNISYSTEM.Polaroid Old"),
        hint: game.i18n.localize("UNISYSTEM.Checking this option enables Old Polaroid"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: delayedReload
      });

})


/**
 * Adds custom dice to Dice So Nice!.
 */
Hooks.once("diceSoNiceReady", (dice3d) => {
  // Called once the module is ready to listen to new rolls and display 3D animations.
  // dice3d: Main class, instantiated and ready to use.

  /**
   * Add a colorset (theme)
   * @param {Object} colorset (see below)
   * @param {string} mode= "default","preferred"
   * The "mode" parameter have 2 modes :
   * - "default" only register the colorset
   * - "preferred" apply the colorset if the player didn't already change his dice appearance for this world.
   */
  dice3d.addColorset(
    {
      name: "unisystemb",
      description: "Conspiracy X/B",
      category: "Conspiracy X",
      foreground: "#ffffff",
      background: "#000000",
      edge: "#000000",
      font: "Industria",
    },
    "preferred",
  )
  dice3d.addColorset(
    {
      name: "unisystemw",
      description: "Conspiracy X/W",
      category: "Conspiracy X",
      foreground: "#000000",
      background: "#ffffff",
      edge: "#ffffff",
      font: "Industria",
    },
    "default",
  )

  dice3d.addSystem({ id: "unisystemetw", name: "White E.T." }, "preferred");
  dice3d.addDicePreset({
    type: "d10",
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "systems/unisystembymmfo/images/avatars/ET_white.png",
    ],
    system: "unisystemetw",
  },
"d10");

  dice3d.addSystem({ id: "unisystemetb", name: "Black E.T." }, "default");
  dice3d.addDicePreset({
    type: "d10",
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "systems/unisystembymmfo/images/avatars/ET_black.png",
    ],
    system: "unisystemetb",
  },
"d10");

});



/* -------------------------------------------- */
/*  Chat Message Hooks                          */
/* -------------------------------------------- */

// Hook for Re-Rolls on Lucky/Unlucky Rolls
Hooks.on("renderChatMessage", (app, html, data) => {
    let chatButton = html[0].querySelector("[data-roll='roll-again']")

    if (chatButton != undefined && chatButton != null) {
        chatButton.addEventListener('click', async () => {
            let ruleTag = ''

            if (html[0].querySelector("[data-roll='dice-result']").textContent == 10) {ruleTag = game.i18n.localize("UNISYSTEM.Rule of Ten Re-Roll")}
            if (html[0].querySelector("[data-roll='dice-result']").textContent == 1)  {ruleTag = game.i18n.localize("UNISYSTEM.Rule of One Re-Roll")}

            let roll = new Roll('1d10')
            await roll.roll()
            await game?.dice3d?.showForRoll(roll)

            // Grab and Set Values from Previous Roll
            let attributeLabel = html[0].querySelector('h2').outerHTML
            let diceTotal = Number(html[0].querySelector("[data-roll='dice-total']").textContent)
            let rollMod = Number(html[0].querySelector("[data-roll='modifier']").textContent)
            let ruleOfMod = ruleTag === game.i18n.localize("UNISYSTEM.Rule of Ten Re-Roll") ? Number(roll.result) > 5 ? Number(roll.result) - 5 : 0 : Number(roll.result) > 4 ? 0 : Number(roll.result) - 5
            if (ruleTag === game.i18n.localize("UNISYSTEM.Rule of One Re-Roll") && diceTotal == 1 && ruleOfMod < 0) {ruleOfMod--}
            let ruleOfDiv = ''

            if (roll.result == 10 && ruleTag === game.i18n.localize("UNISYSTEM.Rule of Ten Re-Roll")) {
                ruleOfDiv = `<h2 class="rule-of-chat-text">`+game.i18n.localize("UNISYSTEM.Rule of 10!")+`</h2>
                            <button type="button" data-roll="roll-again" class="rule-of-ten">`+game.i18n.localize(`UNISYSTEM.Roll Again`)+`</button>`
                ruleOfMod = 5
            }
            
            if (roll.result == 1 && ruleTag === game.i18n.localize("UNISYSTEM.Rule of One Re-Roll")) {
                ruleOfDiv = `<h2 class="rule-of-chat-text">`+game.i18n.localize("UNISYSTEM.Rule of 1!")+`</h2>
                            <button type="button" data-roll="roll-again" class="rule-of-one">`+game.i18n.localize(`UNISYSTEM.Roll Again`)+`</button>`
                ruleOfMod = -5
                if (diceTotal == 1) {ruleOfMod--}
            }

            // Create Chat Content
            let tags = [`<div>${ruleTag}</div>`]
            let chatContent = `<form>
                                    ${attributeLabel}

                                    <table class="unisystembymmfo-chat-roll-table">
                                        <thead>
                                            <tr>
                                                <th class="w30pc">`+game.i18n.localize(`UNISYSTEM.Roll`)+`</th>
                                                <th class="w30pc">`+game.i18n.localize(`UNISYSTEM.Modifier2`)+`</th>
                                                <th class="plus">+</th>
                                                <th class="w30pc">`+game.i18n.localize(`UNISYSTEM.Result2`)+`</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="w30pc" data-roll="dice-result">[[${roll.result}]]</td>
                                                <td class="w30pc" data-roll="modifier">${rollMod}</td>
                                                <td class="plus">+</td>
                                                <td class="w30pc" data-roll="dice-total">${diceTotal + ruleOfMod}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                                        ${ruleOfDiv}
                                    </div>
                                </form>`

            ChatMessage.create({
                /* type: CONST.CHAT_MESSAGE_TYPES.ROLL, */
                user: game.user.id,
                speaker: ChatMessage.getSpeaker(),
                flavor: `<div class="unisystembymmfo-tags-flex-container">${tags.join('')}</div>`,
                content: chatContent,
                roll: roll
            })
        })
    }
})