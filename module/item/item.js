/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class MinuitItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;

  }

  // Upon creation, assign a blank image if item is new (not duplicated) instead of mystery-man default
  static async create(data, options)
  {
    if (!data.img)
      data.img = "systems/minuit/icons/blank.png";
    super.create(data, options);
  }
}
