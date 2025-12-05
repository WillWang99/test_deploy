import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [
      react(),
      basicSsl()
    ],
    define: {
      // Polyfill process.env for the existing code to work without changes
      'process.env': JSON.stringify(env),
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      open: true, // Automatically open the app in the browser
      host: true  // Listen on all local IPs (0.0.0.0) so phone can connect
    }
  }
})