import config, { Link } from 'utils/config'
import { setCookie, getCookie } from 'utils/cookies'


const SOURCE_COOKIE = 'links-source'

class Store {
  links: Link[]

  constructor() {
    this.links = [ ...config.links ]
    this._initLinks()
  }

  async _initLinks(): Promise<void> {
    const url = getCookie(SOURCE_COOKIE)
    if (!url) return

    const data = await this._fetchLinks(url)
    if (data) {
      this.links = [ ...data, ...this.links ]
    }
  }

  async load(url: string) {
    if (url.match(/^https:\/\/.*\.json$/)) {
      setCookie(SOURCE_COOKIE, url, 0, true)
      console.log('load!')

      const data = await this._fetchLinks(url)
      if (data) {
        this.links = [ ...data, ...this.links ]
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
