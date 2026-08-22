import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({// 촬영·입력 중 강제 새로고침을 막기 위해
      registerType: 'prompt',

      includeAssets: [
        'favicon.png',
        'apple-touch-icon.png',
      ],

      manifest: {
        name: 'PicCup',
        short_name: 'PicCup',
        description:
          '여러 사진 중 최고의 한 장을 고르는 사진 서비스',
        lang: 'ko',
        start_url: '/',
        scope: '/',
        display: 'standalone', //주소창 사라짐
        orientation: 'portrait-primary', //세로방향 선호
        background_color: '#FDFFFF',
        theme_color: '#00CAB1',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/favicon.png',
            sizes: '48x48',
            type: 'image/png',
          },
        ],
      },

      workbox: {
        // 앱 자체 파일만 캐시하고 API/S3 응답은 캐시하지 않음
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp}',
        ],
        cleanupOutdatedCaches: true, //오래된 캐시를 정리하도록 하는 옵션
      },
    }),
  ],
  server: { //배포 없이 로컬에서도 API 테스트 가능하게 하기 위함
      proxy: {
        '/api': {
          target: 'https://piccup-api.onrender.com',
          changeOrigin: true,
          secure: true,
        }
      }
    }
})