// Import Modules
import { MinuitActor } from "./actor/actor.js";
import { MinuitActorSheet } from "./actor/actor-sheet.js";
import { MinuitItem } from "./item/item.js";
import { MinuitItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.minuit = {
    MinuitActor,
    MinuitItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = MinuitActor;
  CONFIG.Item.documentClass = MinuitItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("minuit", MinuitActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("minuit", MinuitItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});