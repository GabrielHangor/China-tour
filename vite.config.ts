import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    ui({
      ui: {
        colors: {
          primary: 'red',
          secondary: 'amber',
          neutral: 'stone',
        },
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'China Tour',
        short_name: 'China Tour',
        description: 'Маршруты и точки по Китаю, офлайн на телефоне',
        theme_color: '#b91c1c',
        background_color: '#1c1917',
        display: 'standalone',
        lang: 'ru',
        start_url: '.',
        scope: '.',
        orientation: 'any',
        icons: [
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,ico,json}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('openfreemap.org') || url.hostname.includes('is.autonavi.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: {
                maxEntries: 2500,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('wikimedia.org') || url.hostname.includes('wikipedia.org'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'place-images',
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 60 * 60 * 24 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    {
      name: 'spa-github-pages-404',
      closeBundle() {
        if (existsSync('dist/index.html')) {
          copyFileSync('dist/index.html', 'dist/404.html')
        }
      },
    },
  ],
})
