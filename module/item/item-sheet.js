/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class MinuitItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["minuit", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/minuit/templates/item";
    return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const data = super.getData(options);
    if(this.item.data.type == "particularite"){
      data.particulariteTypes = {
        "force": game.i18n.localize("MINUIT.ParticulariteTypes.Force"),
        "faiblesse": game.i18n.localize("MINUIT.ParticulariteTypes.Faiblesse"),
      }
    }
    if(this.item.data.type == "contact"){
      data.categorieInfluence = {
        "informelle": game.i18n.localize("MINUIT.CategorieInfluence.informelle"),
        "institutionnelle": game.i18n.localize("MINUIT.CategorieInfluence.institutionnelle"),
        "intellectuelle": game.i18n.localize("MINUIT.CategorieInfluence.intellectuelle"),
        "interlope": game.i18n.localize("MINUIT.CategorieInfluence.interlope"),
        "paranaturelle": game.i18n.localize("MINUIT.CategorieInfluence.paranaturelle"),
      }
    }
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
