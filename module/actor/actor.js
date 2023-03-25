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
    const items = actorData.items;
    
    data.possessions = items.filter(item => item.type === "possession").sort((a, b) => a.name.localeCompare(b.name));

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    if (actorData.type === '221b-baker-street') this._prepareCabinetData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    const items = actorData.items;
    data.armes = items.filter(item => item.type === "arme").sort((a, b) => a.name.localeCompare(b.name));
    data.forces = items.filter(item => item.type === "particularite" && item.system.type==="force").sort((a, b) => a.name.localeCompare(b.name));
    data.faiblesses = items.filter(item => item.type === "particularite" && item.system.type==="faiblesse").sort((a, b) => a.name.localeCompare(b.name));
    for (let [key, aspect] of Object.entries(data.aspects)) {
      aspect.nom = game.i18n.localize(`MINUIT.Aspects.${key}`);
    }
  }

  /**
   * Prepare Cabinet type specific data
   */
  _prepareCabinetData(actorData) {
    const data = actorData.data;
    const items = actorData.items;
    data.historiques = items.filter(item => item.type === "historique").sort((a, b) => a.name.localeCompare(b.name));
    data.contacts = items.filter(item => item.type === "contact").sort((a, b) => a.system.categorie.localeCompare(b.system.categorie) || a.name.localeCompare(b.name));

    for (let [key, contact] of Object.entries(data.contacts)) {
      contact.categorieDesc = game.i18n.localize(`MINUIT.CategorieInfluence.${contact.system.categorie}`);
    }
  }

  static async create(data, options)
  {
    if (data.type=="221b-baker-street")
      data.img = "systems/minuit/images/221b.webp";
    super.create(data, options);
  }

}