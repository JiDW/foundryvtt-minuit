/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MinuitActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["minuit", "sheet", "actor"],
      template: "systems/minuit/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/minuit/templates/actor";
    return `${path}/${this.actor.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const data = super.getData(options);
    data.dtypes = ["String", "Number", "Boolean"];
    
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit, .item-name').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getEmbeddedDocument("Item",li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteEmbeddedDocuments("Item",[li.data("itemId")]);
      li.slideUp(200, () => this.render(false));
    });

    // Tension plus
    html.find('.tension-plus').click(ev => {
      let tension = this.actor.system.tension;
      tension++;
      this.actor.update({["system.tension"]: tension});
    });

    // Tension minus
    html.find('.tension-minus').click(ev => {
      let tension = this.actor.system.tension;
      tension--;
      this.actor.update({["system.tension"]: tension});
    });

    html.find('.coche').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      let value = $(ev.currentTarget).is(":checked");
      
      let item = duplicate(this.actor.getEmbeddedDocument("Item", li.data("itemId")));

      item.system.coche = value;

      this.actor.updateEmbeddedDocuments("Item", [item]);
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;

    const type = header.dataset.type;
    const system = duplicate(header.dataset);

    let typeName = this.getTypeName(type);
    const name = game.i18n.format("MINUIT.Common.new_item", {item: typeName});

    const item = {
      name: name,
      type: type,
      system: system
    };

    // Auto select weakness / strength when creating a particularite.
    if (type == "particularite") {
      item.system.type = system.label;
      delete item.system["label"];
    } else {
      // Remove the type from the dataset since it's in the item.type prop.
      delete item.system["type"];
    }

    // Finally, create the item!
    return this.actor.createEmbeddedDocuments("Item",[item]).then(item => this.actor.getEmbeddedDocument("Item",item[0].id).sheet.render(true));
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      if (dataset.roll.toLowerCase().includes("p")) {
        let puissance = this.actor.system.aspects.puissance.value;
        dataset.roll = dataset.roll.toLowerCase().replace("p", puissance);
      }

      let roll = new Roll(dataset.roll, this.actor.system);
      let label = dataset.label ? `Jet de ${dataset.label}` : '';

      const message = {
          flavor: label,
          speaker: ChatMessage.getSpeaker({ actor: this.actor })
      };

      await roll.toMessage(message);
    }
  }

  /**
   * Return a localized name for an item type.
   * @param {Type} type Type of the item
   * @returns Localized name of the item.
   */
  getTypeName(type) {
    switch (type) {
      case "arme":
        return game.i18n.localize("MINUIT.Type.arme");
      case "particularite":
        return game.i18n.localize("MINUIT.Type.particularite");
      case "possession":
        return game.i18n.localize("MINUIT.Type.possession");
      case "historique":
        return game.i18n.localize("MINUIT.Type.historique");
      case "contact":
        return game.i18n.localize("MINUIT.Type.contact");
      default:
        return game.i18n.localize("MINUIT.Type.default");
    }
  }
}
