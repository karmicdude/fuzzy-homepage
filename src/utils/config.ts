import config from 'config.dev'

export interface Action {
  prefix: string
  url?: string
  internal?: boolean
}

export interface Link {
  name: string
  url?: string
  action?: Action
  faviconUrl?: string
  tags: string[]
}

export interface SearchConfig {
  maxResults: number
}

export interface Config {
  apiBaseUrl: string
  title: string
  search: SearchConfig
  links: Link[]
}

export default config as Config
