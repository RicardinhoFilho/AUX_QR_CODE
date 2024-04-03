import { Request, Response, Router } from "express";
import QRCode from 'qrcode';
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
  QRCode.toDataURL(texto, (err: any, url: string) => {
      if (err) {
          return res.status(500).json({
              status: false,
              message: "Erro ao gerar o QR code"
          });
      }
      
      // Retornar o QR code como uma resposta HTTP
      res.status(200).send(`<img src="${url}" alt="QR Code">`);
  });
});
export default router;
