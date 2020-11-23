/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MinuitActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);

    const items = actorData.items;
    data.armes = items.filter(item => item.type === "arme");
    data.forces = items.filter(item => item.type === "particularite" && item.data.type==="force");
    data.faiblesses = items.filter(item => item.type === "particularite" && item.data.type==="faiblesse");
    data.possessions = items.filter(item => item.type === "possession");
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    for (let [key, aspect] of Object.entries(data.aspects)) {
      // Calculate the modifier using d20 rules.
      aspect.nom = game.i18n.localize(`MINUIT.Aspects.${key}`);
    }
  }

}