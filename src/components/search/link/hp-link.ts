import { LitElement, html, customElement, property } from 'lit-element'
import { styleMap } from 'lit-html/directives/style-map'

import styles from './hp-link.sass'
import { Link } from 'utils/config'

@customElement('hp-link')
export class HpLink extends LitElement {
  @property({ type: Boolean, reflect: true })
  hovered = false

  @property({ type: Object })
  link?: Link

  static get styles() {
    return [ styles ]
  }

  render() {
    if (!this.link) return ''

    const style = {
      backgroundImage: `url(https://www.google.com/s2/favicons?domain=${this.link.faviconUrl ||
        this.link.url})`,
    }
    return html`
      <a href="${this.link.url}">
        <i style="${styleMap(style)}"></i>

        <div class="content">
          <div class="name">${this.link.name}</div>
          <div class="url">${this.link.url}</div>
        </div>

        <div class="tags">
          ${this.link.tags.map(
            t => html`
              <span>${t}</span>
            `
          )}
        </div>
      </a>
    `
  }
}
