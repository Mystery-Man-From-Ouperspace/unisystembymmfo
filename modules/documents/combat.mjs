export default class PenombreCombat extends foundry.documents.Combat {
  /** @override */
  async _onEnter(combatant) {
    await super._onEnter(combatant)
    await combatant.update({ initiative: this.#getInitiative(combatant) })
  }

  // L'initiative est en 1xx pour les éminences et en 2xx pour les adversaires
  #getInitiative(combatant) {
    if (combatant.isNPC) {
      return Math.ceil(100 + Math.random() * 100)
    } else {
      return Math.ceil(200 + Math.random() * 100)
    }
  }
}
