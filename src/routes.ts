import { Request, Response, Router } from "express";
import QRCode from 'qrcode';
import { Stream } from "stream";
const router = Router();

router.get('/qr-code', (req: Request, res: Response) => {
  const texto: string | undefined = req.query.text as string | undefined;

  if (!texto) {
      return res.status(400).json({
          status: false,
          message: "Parâmetro 'text' não fornecido na consulta."
      });
  }

  // Gerar o QR code
  QRCode.toFileStream(res, texto)
      .catch((err: any) => {
          res.status(500).json({
              status: false,
              message: "Erro ao gerar o QR code"
          });
      });
});

export default router;
