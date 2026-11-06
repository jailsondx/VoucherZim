import express from "express";
import { ObterListaVouchers } from "./functions.js";

const router = express.Router();

// Rotas
router.get("/ObterListaVouchersGrupo", async (req, res) => {
  try {
    const result = await ObterListaVouchers();
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});

// Métodos auxiliares para padronizar respostas e erros
const handleResponse = (res, result) => {
  if (result.success) {
    res.status(200).json({ message: result.message, data: result.data });
  } else {
    res.status(500).json({
      message: result.message,
      error: result.error instanceof Error ? result.error.message : result.error,
    });
  }
};

const handleError = (res, error) => {
  console.error("Erro no processamento:", error);

  if (res.headersSent) return;

  res.status(500).json({
    message: "Erro interno do servidor",
    error: error instanceof Error ? error.message : "Erro desconhecido",
  });
};

export default router;
