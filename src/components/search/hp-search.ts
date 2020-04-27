import { LitElement, html, customElement, property, PropertyValues } from 'lit-element'

import '@material/mwc-textfield'
import Fuse from 'fuse.js'

import styles from './hp-search.sass'
import { Link } from 'utils/config'
import store, { UnsubscribeFn, State } from './store'

import './link/hp-link'

@customElement('hp-search')
export class HpSearch extends LitElement {
  @property({ type: Array })
  links: Link[] = []

  @property({ type: Boolean })
  isLoading: boolean = true

  @property({ type: Number })
  hovered: number = 0

  @property({ type: Array })
  results: Link[] = []

  @property({ type: String })
  value: string = ''

  input?: HTMLInputElement
  _unsub?: UnsubscribeFn

  static styles = [ styles ]

  connectedCallback() {
    this._unsub = store.subscribe(this._stateChanged)
    super.connectedCallback()
  }

  disconnectedCallback() {
    if (typeof this._unsub === 'function') {
      this._unsub()
    }
    window.removeEventListener('keydown', this._onKeyDown)
    super.disconnectedCallback()
  }

  firstUpdated() {
    this.input = this.shadowRoot!.getElementById('input') as HTMLInputElement
    window.addEventListener('keydown', this._onKeyDown)
  }

  updated(changes: PropertyValues) {
    if (changes.has('hovered')) {
      setTimeout(this._updateResultsScroll, 0)
    }

    if (changes.has('results')) {
      setTimeout(() => this.hovered = 0, 0)
    }
  }

  _stateChanged = (state: State) => {
    console.log('state changed', state)
    this.links = state.links
    this.isLoading = state.isLoading
    this._updateResults()
  }

  _updateResults = () => {
    let matches = Array.from(this.value.matchAll(/^(\w+: )/g), m => m[0])
    if (matches.length) {
      // Action found!
      this.results = this.links.filter(l => l.action?.prefix === matches[0])
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
    }, this.links || [])

    this.results = res
  }

  _onKeyDown = (e: KeyboardEvent) => {
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

  _load_action = async (value: string) => {
    await store.load(value)
    this.value = ''
    this.input!.value = ''
    this._updateResults()
  }

  _onInput = (e: InputEvent) => {
    this.value = (e.target as HTMLInputElement)?.value
    this._updateResults()
  }

  _updateResultsScroll = () => {
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
    // console.log('render', this.isLoading, this.results)
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
        @input=${this._onInput}
      ></mwc-textfield>

      <div class="results">
        ${this.isLoading
          ? new Array(10).fill(0).map(
              _ => html`
                <hp-link placeholder></hp-link>
              `
            )
          : this.results.map(
              l => html`
                <hp-link
                  .link=${l}
                  ?hovered=${this.results.indexOf(l) === this.hovered}
                ></hp-link>
              `
            )}

        ${this.results.length === 0
          ? html`
              <div class="no-results">No matches</div>
            `
          : ''}
      </div>
    `;
  }
}
