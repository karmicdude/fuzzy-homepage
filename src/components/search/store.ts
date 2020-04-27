import config, { Link } from 'utils/config'
import { setCookie, getCookie } from 'utils/cookies'


const SOURCE_COOKIE = 'links-source'

export interface State {
  links: Link[]
  isLoading: boolean
}

export type SubscriberFn = (state: State) => void
export type UnsubscribeFn = () => void

class Store {
  isLoading: boolean = true
  links: Link[]
  _subs: SubscriberFn[] = []

  constructor() {
    this.links = [ ...config.links ]
    this._initLinks()
  }

  _getState(): State {
    return {
      links: this.links,
      isLoading: this.isLoading
    }
  }

  _setLinks(links: Link[]) {
    this.links = [ ...links ]
    this._updateSubscribers()
  }

  _setLoading(val: boolean) {
    this.isLoading = val
    this._updateSubscribers()
  }

  _updateSubscribers(): void {
    this._subs.forEach(s => s(this._getState()))
  }

  subscribe(cb: SubscriberFn) {
    const ind = this._subs.length
    this._subs.push(cb)

    // notify immediatelly with current data
    cb(this._getState())

    return () => {
      this._subs.splice(ind, 1)
    }
  }

  async _initLinks(): Promise<void> {
    const url = getCookie(SOURCE_COOKIE)
    if (!url) {
      this._setLoading(false)
      return
    }

    const data = await this._fetchLinks(url)
    if (data) {
      this._setLinks([ ...data, ...config.links ])
      this._setLoading(false)
    }
  }

  async load(url: string) {
    this._setLoading(true)
    if (url.match(/^https:\/\/.*\.json$/)) {
      setCookie(SOURCE_COOKIE, url, 0, true)

      const data = await this._fetchLinks(url)
      this._setLoading(false)
      if (data) {
        this._setLinks([ ...data, ...config.links ])
      }
    }

  }

  async _fetchLinks(url: string): Promise<Link[]> {
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      if (res.ok) {
        const text = await res.json()
        const data = JSON.parse(text.contents)
        return data
      }
    } catch(err) { }

    return []
  }
}

export default new Store()
