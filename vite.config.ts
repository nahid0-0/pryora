import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// BASE_PATH is set by the GitHub Pages workflow (/pryora/). Locally the site runs at /.
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      // GitHub Pages has no server-side routing: serving index.html as the 404 page
      // lets direct links like /pryora/shop?type=rings open the right page.
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
      },
    },
  ],
})
