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

  // Define custom Entity classes
  CONFIG.Actor.documentClass = MinuitActor;
  CONFIG.Item.documentClass = MinuitItem;

  // Unregister default sheets.
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  // Register minuit sheets.
  Actors.registerSheet("minuit", MinuitActorSheet, { makeDefault: true });
  Items.registerSheet("minuit", MinuitItemSheet, { makeDefault: true });
});