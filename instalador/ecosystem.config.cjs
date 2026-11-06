// Configuracao do PM2 para o VoucherZim.
// Cada app roda dentro da propria pasta, para que o .env de cada uma seja carregado.
const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "voucherzim-backend",
      cwd: path.join(__dirname, "server"),
      script: "server.js",
      env: { NODE_ENV: "production" },
    },
    {
      // Build standalone do Next: a porta e o IP vem de PORT e HOSTNAME
      name: "voucherzim-frontend",
      cwd: path.join(__dirname, "client"),
      script: "server.js",
      env: { NODE_ENV: "production", PORT: "5004", HOSTNAME: "0.0.0.0" },
    },
  ],
};
