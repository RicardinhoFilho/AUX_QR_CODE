import { Request, Response, Router } from "express";
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

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
    // Definir o caminho onde o arquivo temporário será salvo
    const tempDir = path.join(__dirname, 'temp');
    const filePath = path.join(tempDir, 'qrcode.png');

    // Verificar se a pasta temporária existe, senão, criá-la
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Criar um stream de gravação para o arquivo temporário
    const qrCodeStream = fs.createWriteStream(filePath);

    // Gerar o QR code e escrevê-lo no stream
    QRCode.toFileStream(qrCodeStream, texto);

    qrCodeStream.on('finish', () => {
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
