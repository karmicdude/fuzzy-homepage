import config, { Link } from 'utils/config'
import { setCookie, getCookie } from 'utils/cookies'


const SOURCE_COOKIE = 'links-source'

export type SubscriberFn = (links: Link[]) => void
export type UnsubscribeFn = () => void

class Store {
  links: Link[]
  _subs: SubscriberFn[] = []

  constructor() {
    this.links = [ ...config.links ]
    this._initLinks()
  }

  _setLinks(links: Link[]) {
    this.links = [ ...links ]
    this._updateSubscribers()
  }

  _updateSubscribers(): void {
    this._subs.forEach(s => s(this.links))
  }

  subscribe(cb: SubscriberFn) {
    const ind = this._subs.length
    this._subs.push(cb)

    // notify immediatelly with current data
    cb(this.links)

    return () => {
      this._subs.splice(ind, 1)
    }
  }

  async _initLinks(): Promise<void> {
    const url = getCookie(SOURCE_COOKIE)
    if (!url) return

    const data = await this._fetchLinks(url)
    if (data) {
      this._setLinks([ ...data, ...config.links ])
    }
  }

  async load(url: string) {
    if (url.match(/^https:\/\/.*\.json$/)) {
      setCookie(SOURCE_COOKIE, url, 0, true)
      console.log('load!')

      const data = await this._fetchLinks(url)
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
