import { LitElement, html, customElement, property } from 'lit-element'

import '@material/mwc-textfield'
import Fuse from 'fuse.js'

import styles from './hp-search.sass'
import { Link } from 'utils/config'
import config from 'utils/config'
import store from './store'

import './link/hp-link'

@customElement('hp-search')
export class HpSearch extends LitElement {
  @property({ type: Number })
  hovered: number = 0

  @property({ type: Array })
  results: Link[] = []

  @property({ type: String })
  value: string = ''

  input?: HTMLInputElement

  static get styles() {
    return [ styles ]
  }

  firstUpdated() {
    this.input = this.shadowRoot!.getElementById('input') as HTMLInputElement
    window.addEventListener('keydown', this.onKeyDown)
    this.setResults(store.links)
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.onKeyDown)
  }

  setResults(items: Link[]) {
    // this.results = [...items].slice(0, config.search.maxResults)
    this.results = [...items]
    this.hovered = 0
  }

  onKeyDown = (e: KeyboardEvent) => {
    let matched = false
    if (e.ctrlKey && e.key === 'j' || e.key === 'ArrowDown') {
      this.hovered++
      matched = true
    }
    if (e.ctrlKey && e.key === 'k' || e.key === 'ArrowUp') {
      this.hovered--
      matched = true
    }
    if (e.key === 'Tab') {
      let res = this.results[this.hovered]
      if (res) {
        if (res.action) {
          this.input!.value = res.action.prefix
        }
      }
      matched = true
    }
    if (e.key === 'Enter') {
      let res = this.results[this.hovered]
      if (res) {
        if (res.action) {
          let value = this.value.slice(res.action.prefix.length)
          if (res.action.internal)  {
            const actionFn = this[`_${res.name}_action`]
            if (typeof actionFn === 'function') {
              actionFn(value)
            }
          } else if (res.action.url) {
            window.location.href = `${res.action.url}${value}`
          }
        } else if (res.url) {
          window.location.href = res.url
        }
      }
      matched = true
    }

    if (matched) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (this.hovered >= this.results.length) {
      this.hovered = this.results.length - 1
    }
    if (this.hovered < 0) {
      this.hovered = 0
    }
  }

  async _load_action(value: string) {
    await store.load(value)
  }

  onInput = (e: InputEvent) => {
    this.value = (e.target as HTMLInputElement)?.value
    let matches = Array.from(this.value.matchAll(/^(\w+: )/g), m => m[0])
    if (matches.length) {
      // Action found!
      this.setResults(store.links.filter(l => l.action?.prefix === matches[0]))
      return
    }

    let res = this.value.split(' ').reduce((res, val) => {
      if (!val) return res

      let fuse = new Fuse(res, {
        keys: ['tags', 'name'],
        threshold: 0.4,
        findAllMatches: true,
      })
      res = fuse.search(val).map(r => r.item)
      return res
    }, store.links)

    this.setResults(res)
  }

  updated(changes) {
    if (changes.has('hovered')) {
      setTimeout(this.updateResultsScroll, 0)
    }
  }

  updateResultsScroll = () => {
    const res = this.shadowRoot?.querySelector('.results')
    const item = this.shadowRoot?.querySelector('hp-link[hovered]')

    const resRect = res?.getBoundingClientRect()
    const itemRect = item?.getBoundingClientRect()

    if (!resRect || !itemRect) return

    const topDiff = itemRect?.top - resRect?.top
    if (topDiff < 0) {
      res?.scrollBy({ top: topDiff, behavior: 'smooth' })
      return
    }

    const bottomDiff = itemRect?.bottom - resRect?.bottom
    if (bottomDiff > 0) {
      res?.scrollBy({ top: bottomDiff, behavior: 'smooth' })
    }
  }

  render() {
    return html`
      <div class="shortcuts">
        <span>CTRL-J=&#8595;</span>
        <span>CTRL-K=&#8593;</span>
        <span>TAB=Autocomplete</span>
        <span>ENTER=Accept</span>
      </div>

      <mwc-textfield
        id="input"
        class="search-input"
        autofocus
        @input=${this.onInput}
      ></mwc-textfield>

      <div class="results">
        ${this.results.map(
          l => html`
            <hp-link .link=${l} ?hovered=${this.results.indexOf(l) === this.hovered}></hp-link>
          `
        )}

        ${this.results.length === 0 ? html`
          <div class="no-results">No matches</div>
        `: ''}
      </div>
    `
  }
}
