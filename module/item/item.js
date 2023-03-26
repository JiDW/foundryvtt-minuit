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
    const item = this;
    const actor = this.actor ? this.actor : {};
    const system = item.system;

  }

  // Upon creation, assign a blank image if item is new (not duplicated) instead of mystery-man default
  static async create(system, options)
  {
    if (!system.img)
      system.img = "systems/minuit/images/blank.png";
    super.create(system, options);
  }
}
