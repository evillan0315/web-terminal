import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/",
  server: {

    host: "0.0.0.0",  // Allow access from anywhere
    port: 3000,       // Run on port 3000
    //strictPort: true,
    allowedHosts: ['serve-app.duckdns.org', 'board-dynamodb.duckdns.org', 'board-api.duckdns.org'],
    cors: true, // Enable CORS if needed
    hmr: {
      protocol: "wss", // Use secure WebSockets
      host: "board-api.duckdns.org",
      clientPort: 443
    },
    proxy: {
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true
      }
    },
//    hmr: {
  //   clientPort: 443,
  //   port: 443,
  //   host: "board-api.duckdns.org",
  //   protocol: "https",
  //  },   
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Ensure Vite recognizes JSX files
  },
  build: {
    outDir: "dist",  // Change this to your desired output directory
    emptyOutDir: true, // Clean the output folder before building
  },
  plugins: [react(),tailwindcss(),]
})

