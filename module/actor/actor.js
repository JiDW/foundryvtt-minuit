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

    const actor = this;
    const system = actor.system;
    const items = actor.items;
    
    system.possessions = items.filter(item => item.type === "possession").sort((a, b) => a.name.localeCompare(b.name));

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actor.type === 'character') this._prepareCharacterData(actor);
    if (actor.type === '221b-baker-street') this._prepareCabinetData(actor);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actor) {
    const system = actor.system;
    const items = actor.items;
    system.armes = items.filter(item => item.type === "arme").sort((a, b) => a.name.localeCompare(b.name));
    system.forces = items.filter(item => item.type === "particularite" && item.system.type==="force").sort((a, b) => a.name.localeCompare(b.name));
    system.faiblesses = items.filter(item => item.type === "particularite" && item.system.type==="faiblesse").sort((a, b) => a.name.localeCompare(b.name));

    for (let [key, aspect] of Object.entries(system.aspects)) {
      aspect.nom = game.i18n.localize(`MINUIT.Aspects.${key}`);
    }
  }

  /**
   * Prepare Cabinet type specific data
   */
  _prepareCabinetData(actor) {
    const system = actor.system;
    const items = actor.items;
    system.historiques = items.filter(item => item.type === "historique").sort((a, b) => a.name.localeCompare(b.name));
    system.contacts = items.filter(item => item.type === "contact").sort((a, b) => a.system.categorie.localeCompare(b.system.categorie) || a.name.localeCompare(b.name));

    for (let [key, contact] of Object.entries(system.contacts)) {
      contact.categorieDesc = game.i18n.localize(`MINUIT.CategorieInfluence.${contact.system.categorie}`);
    }
  }

  static async create(system, options)
  {
    if (system.type=="221b-baker-street")
      system.img = "systems/minuit/images/221b.webp";

    super.create(system, options);
  }

}