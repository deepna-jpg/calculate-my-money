import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/calculate-my-money/', // GitHub Pages 배포를 위한 리포지토리명 설정
})
