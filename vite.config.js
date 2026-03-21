import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/__/auth': {
        target: 'https://money-tracker-f8886.firebaseapp.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Tránh navigate fallback can thiệp các URL có prefix Firebase / OAuth (giảm lỗi auth sau redirect)
      workbox: {
        navigateFallbackDenylist: [/^\/__\//],
      },
      // Cập nhật lại favicon.svg theo đúng file index.html của bạn
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Money Tracker App',
        short_name: 'MoneyTracker',
        description: 'Ứng dụng quản lý tài chính cá nhân',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Quan trọng: Giúp app chạy toàn màn hình trên iPhone
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})