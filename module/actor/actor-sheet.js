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
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const system = duplicate(header.dataset);
    // Initialize a default name.
    const name = `Nouveau ${type.capitalize()}`;
    // Prepare the item object.
    const item = {
      name: name,
      type: type,
      system: system
    };

    // Remove the type from the dataset since it's in the item.type prop.
    delete item.system["type"];

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
      let roll = new Roll(dataset.roll, this.actor.system);
      let label = dataset.label ? `Jet de ${dataset.label}` : '';

      const message = {
          flavor: label,
          speaker: ChatMessage.getSpeaker({ actor: this.actor })
      };

      await roll.toMessage(message);
    }
  }
}
