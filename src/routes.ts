import { Request, Response, Router } from "express";
import QRCode from 'qrcode';
import path from 'path';

const router = Router();

router.get('/qr-code', async (req: Request, res: Response) => {
  
  const texto: string | undefined = req.query.text as string | undefined;

  if (!texto) {
      return res.status(400).json({
          status: false,
          message: "Parâmetro 'text' não fornecido na consulta."
      });
  }

  try {
    // Gerar o QR code
    const qrCodeStream = QRCode.toFileStream(texto);

    // Definir o caminho onde o arquivo temporário será salvo
    const filePath = path.join(__dirname, 'temp', 'qrcode.png');

    // Pipe o stream do QR code para um arquivo temporário
    qrCodeStream.pipe(res);

    qrCodeStream.on('end', () => {
      // Enviar o arquivo PNG como resposta
      res.sendFile(filePath, {}, (err) => {
        if (err) {
          res.status(500).json({
            status: false,
            message: "Erro ao enviar o arquivo PNG."
          });
        } else {
          // Remover o arquivo temporário após enviar a resposta
          fs.unlinkSync(filePath);
        }
      });
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Erro ao gerar o QR code."
    });
  }
});

export default router;
