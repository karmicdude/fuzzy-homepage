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
