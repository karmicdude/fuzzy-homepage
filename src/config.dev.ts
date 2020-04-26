// THIS MODULE WILL BE REPLACED BY /config/config.prod.ts
// FOR PRODUCTION BUILD

export default {
  apiBaseUrl: 'http://localhost:3000/api',
  title: 'New Tab',
  search: {
    maxResults: 8,
  },
  links: [
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      tags: [],
    },
    {
      name: 'Deezer',
      url: 'https://www.deezer.com/',
      tags: [],
    },
    {
      name: 'WhatsApp',
      url: 'https://web.whatsapp.com/',
      tags: [],
    },
    {
      name: 'Slack',
      url: 'https://netprotect.slack.com/',
      tags: ['work'],
    },
    {
      name: 'Gmail',
      url: 'https://gmail.com',
      tags: [],
    },
    {
      name: 'Gitlab',
      url: 'https://gitlab.netprotect.com/',
      tags: ['work'],
      faviconUrl: 'https://about.gitlab.com/',
    },
    {
      name: 'Jira',
      url: 'https://netprotect.atlassian.net/',
      tags: ['work'],
    },
    {
      name: 'VPN order',
      url: 'https://intranet.strongvpn.com/services/strongvpn',
      tags: ['work', 'prod'],
    },
    {
      name: 'SugarSync order',
      url: 'https://intranet.strongvpn.com/services/sugarsync',
      tags: ['work', 'prod'],
    },
    {
      name: 'Router order',
      url: 'https://intranet.strongvpn.com/services/router',
      tags: ['work', 'prod'],
    },
    {
      name: 'VPN order',
      url: 'https://intranet.stronglocal.com:8000/services/strongvpn',
      tags: ['work', 'local'],
    },
    {
      name: 'SugarSync order',
      url: 'https://intranet.stronglocal.com:8000/services/sugarsync',
      tags: ['work', 'local'],
    },
    {
      name: 'Router order',
      url: 'https://intranet.stronglocal.com:8000/services/router',
      tags: ['work', 'local'],
    },
    {
      name: 'VPN order',
      url: 'https://sandbox-alex.reliablehosting.com/services/strongvpn',
      tags: ['work', 'sandbox'],
    },
    {
      name: 'SugarSync order',
      url: 'https://sandbox-alex.reliablehosting.com/services/sugarsync',
      tags: ['work', 'sandbox'],
    },
    {
      name: 'Router order',
      url: 'https://sandbox-alex.reliablehosting.com/services/router',
      tags: ['work', 'sandbox'],
    },
    {
      name: 'Orders review',
      url: 'https://sandbox-alex.reliablehosting.com/orders/vpn',
      tags: ['work', 'sandbox'],
    },
    {
      name: 'Orders review',
      url: 'https://intranet.stronglocal.com:8000/orders/vpn',
      tags: ['work', 'local'],
    },
    {
      name: 'Orders review',
      url: 'https://intranet.strongvpn.com/orders/vpn',
      tags: ['work', 'prod'],
    },
    {
      name: 'Dropbox',
      url: 'https://dropbox.com',
      tags: [],
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      tags: [],
    },
    {
      name: 'Pingboard',
      url: 'https://netprotect.pingboard.com',
      faviconUrl: 'https://pingboard.com',
      tags: ['work'],
    },
    {
      name: 'Localhost 3000',
      url: 'http://localhost:3000',
      tags: [],
    },
    {
      name: 'Localhost 3001',
      url: 'http://localhost:3001',
      tags: [],
    },
    {
      name: 'Localhost 8000',
      url: 'http://localhost:8000',
      tags: [],
    },
    {
      name: 'Localhost 8001',
      url: 'http://localhost:8001',
      tags: [],
    },
    {
      name: 'Localhost 8080',
      url: 'http://localhost:8080',
      tags: [],
    },
    {
      name: 'Localhost 8081',
      url: 'http://localhost:8081',
      tags: [],
    },
    {
      name: 'StrongVPN.com',
      url: 'http://strongvpn.com',
      tags: [ 'work' ],
    },
    {
      name: 'Strong admin',
      url: 'https://agent.vpnaccount.net/login/',
      tags: [ 'work', 'prod' ],
    },
    {
      name: 'Strong admin',
      url: 'https://sandbox-alex.reliablehosting.com/login/',
      tags: [ 'work', 'sandbox' ],
    },
    {
      name: 'Strong admin',
      url: 'https://intranet.stronglocal.com:8000/login/',
      tags: [ 'work', 'local' ],
    },
    {
      name: 'WHMCS Portal',
      url: 'https://portal.reliablehosting.com/portal/rhstaff/dologin.php',
      tags: [ 'work', 'sandbox' ],
    },
    {
      name: 'Polymer',
      url: 'https://www.polymer-project.org/',
      tags: [],
    },
    {
      name: 'Material Web Components',
      url: 'https://github.com/material-components/material-components-web-components',
      tags: [ 'mwc', 'docs' ],
    },
    {
      name: 'Typescript',
      url: 'https://www.typescriptlang.org/docs/home.html',
      tags: [ 'docs' ],
    },
    {
      name: 'LitElement',
      url: 'https://lit-element.polymer-project.org/guide',
      tags: [ 'docs' ],
    },
    {
      name: 'lit-html',
      url: 'https://lit-html.polymer-project.org/',
      tags: [ 'docs' ],
    },
    {
      name: 'Chrome Web Store',
      url: 'https://chrome.google.com/webstore/category/extensions',
      tags: [],
    },
    {
      name: 'Fuzzy Homepage Github',
      url: 'https://github.com/alxdnlnko/fuzzy-homepage',
      tags: [],
    },

    {
      name: 'translate',
      action: {
        prefix: 'translate: ',
        url: 'https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=',
      },
      tags: [ 'action' ],
    },
    {
      name: 'google',
      action: {
        prefix: 'google: ',
        url: 'https://www.google.com/search?q=',
      },
      tags: [ 'action' ],
    },
    {
      name: 'load',
      action: {
        prefix: 'load: ',
        internal: true,
      },
      tags: [ 'action' ],
    },
  ],
};
