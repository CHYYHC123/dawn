import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  chrome_url_overrides: {
    newtab: 'index.html'
  },
  icons: {
    48: 'public/logo.png'
  },
  action: {
    // default_icon: {
    //   48: 'public/logo.png'
    // },
    // default_popup: 'src/popup/index.html'
  },
  permissions: ['storage', 'tabs', 'search'],
  host_permissions: ['https://api.unsplash.com/*', 'https://freegeoip.app/*', 'https://api.quotable.io/*', 'https://v1.hitokoto.cn/*', 'https://zenquotes.io/*'],
  background: {
    service_worker: 'src/background/index.ts'
  }
});
