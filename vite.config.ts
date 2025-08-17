import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 根據環境變數動態設定 base
const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  plugins: [react()],
  base: isVercel ? '/' : '/prerenderTest/',
})