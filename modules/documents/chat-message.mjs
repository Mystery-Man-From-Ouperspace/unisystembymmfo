import PenombreRoll from "./roll.mjs"

export default class PenombreMessage extends ChatMessage {
  /** @inheritDoc */
  async renderHTML({ canDelete, canClose = false, ...rest } = {}) {
    const html = await super.renderHTML({ canDelete, canClose, ...rest })
    this._enrichChatCard(html)
    return html
  }

  /**
   * Get the Actor which is the author of a chat card.
   * @returns {Actor|void}
   */
  getAssociatedActor() {
    if (this.speaker.scene && this.speaker.token) {
      const scene = game.scenes.get(this.speaker.scene)
      const token = scene?.tokens.get(this.speaker.token)
      if (token) return token.actor
    }
    return game.actors.get(this.speaker.actor)
  }

  /**
   * Enriches the chat card HTML by updating the sender's avatar and name display.
   * Depending on content visibility, it uses either the associated actor's image and alias,
   * or the author's avatar and name. The method creates and replaces the sender's DOM elements
   * with the appropriate avatar and name.
   *
   * @param {HTMLElement} html The chat card HTML element to enrich.
   */
  _enrichChatCard(html) {
    const actor = this.getAssociatedActor()

    let img
    let nameText
    if (this.isContentVisible) {
      img = actor?.img ?? this.author.avatar
      nameText = this.alias
    } else {
      img = this.author.avatar
      nameText = this.author.name
    }

    const avatar = document.createElement("a")
    avatar.classList.add("avatar")
    if (actor) avatar.dataset.uuid = actor.uuid
    const avatarImg = document.createElement("img")
    Object.assign(avatarImg, { src: img, alt: nameText })
    avatar.append(avatarImg)

    const name = document.createElement("span")
    name.classList.add("name-stacked")
    const title = document.createElement("span")
    title.classList.add("title")
    title.append(nameText)
    name.append(title)

    const sender = html.querySelector(".message-sender")
    sender?.replaceChildren(avatar, name)
  }

  /**
   * Handles participation in a query message for the Penombre system.
   * Updates the original message with the actor's response and, if applicable, the number of successes from a new roll.
   *
   * @param {Object} params The parameters for handling participation.
   * @param {string} params.existingMessageId The ID of the existing message to update.
   * @param {string} params.actorId The ID of the actor responding to the query.
   * @param {boolean} params.answer Whether the actor's response is positive.
   * @param {number} [params.nbSucces] The number of successes (optional, recalculated if answer is positive).
   * @param {string} [params.newMessageId] The ID of the new message containing the actor's roll (optional).
   * @returns {Promise<void>} Resolves when the message has been updated.
   */
  static async _handleQueryMessageParticipation({ existingMessageId, actorId, answer, nbSucces, newMessageId }) {
    const message = game.messages.get(existingMessageId)
    let newMessage
    if (newMessageId) {
      newMessage = game.messages.get(newMessageId)
    }
    if (!message) return

    // Vérifie que le message est un jet de dés de Pénombre
    if (message.isRoll && message.rolls[0] && message.rolls[0] instanceof PenombreRoll) {
      if (CONFIG.debug.penombre?.chat) console.debug("Pénombre | Participation au jet", existingMessageId, actorId, answer, nbSucces, newMessageId)
      // Met à jour la réponse de l'acteur dans le message
      if (answer) {
        if (!newMessage) {
          console.error("Pénombre | _handleQueryMessageParticipation : newMessage introuvable", newMessageId)
          return
        }
        // Si la réponse est positive, on enregistre le nombre de succès
        const rollResults = PenombreRoll.analyseRollResult(newMessage.rolls[0])
        const nbSucces = rollResults.nbSucces
        await message.update({
          [`system.messagesLies.${actorId}.messageId`]: newMessageId,
          [`system.messagesLies.${actorId}.reponseFaite`]: true,
          [`system.messagesLies.${actorId}.participe`]: true,
          [`system.messagesLies.${actorId}.nbSucces`]: nbSucces,
        })
      } else {
        await message.update({
          [`system.messagesLies.${actorId}.reponseFaite`]: true,
          [`system.messagesLies.${actorId}.participe`]: false,
        })
      }
    }
  }
}
