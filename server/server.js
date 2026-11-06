import "dotenv/config";

import express from "express";
import http from "node:http";
import cors from "cors";
import ipRangeCheck from "ip-range-check";
import router from "./src/routers.js";

const app = express();
const IP = process.env.NODE_SERVER_IP || "0.0.0.0";
const PORT = Number(process.env.NODE_SERVER_PORT) || 3001;

//const redesPermitidas = ["127.0.0.1/32", "::1/128", "10.3.0.0/24", "10.3.3.0/24"];
const redesPermitidas = ["10.2.2.0/24", "10.3.0.2/32", "10.3.0.15/32", "10.3.0.16/32", "10.3.0.14/32"];

/*
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://10.3.0.2:3000",
  ],
}));
*/

app.use(cors());
app.use(express.json());

// Restrição de IP de origem
app.use((req, res, next) => {
  let ip = req.socket.remoteAddress;

  // Normaliza IPv4 recebido como endereço IPv6 mapeado
  if (ip?.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  console.log(`IP de origem: ${ip}`);

  if (!ip || !ipRangeCheck(ip, redesPermitidas)) {
    console.log(`\n❌Acesso negado para IP: ${ip}\n`);
    return res.status(403).json({
      erro: "Acesso permitido somente na rede local",
      message: "Acesso negado. O Dispositivo de origem não está permitido.",
    });
  }

  next();
});

// Aumenta o limite de listeners de eventos
import("events").then((events) => {
  events.EventEmitter.defaultMaxListeners = 20;
});

// Configura o pool de conexões HTTP
http.globalAgent.maxSockets = Infinity;

app.use("/api/get", router);
app.get("/", (req, res) => {
  res.send("Backend API funcionando!");
});

app.listen(PORT, IP, () => {
  console.log(`Servidor rodando no IP ${IP} na porta ${PORT}`);
});
