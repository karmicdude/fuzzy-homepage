import { LitElement, html, customElement, property } from 'lit-element'

import styles from './hp-app.sass'

import 'components/search/hp-search'


@customElement('hp-app')
export class HpApp extends LitElement {
  static get styles() {
    return [ styles ]
  }

  render() {
    return html`
      <hp-search></hp-search>
    `
  }
}
