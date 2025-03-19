module.exports = {
  apps: [
    {
      name: "web-ui",
      script: "npm run dev",
      instances: 1,
      exec_mode: "fork",
      watch: true,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
