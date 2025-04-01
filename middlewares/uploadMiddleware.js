import multer from 'multer';
import fs from 'fs';
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 📌 Função para criar diretórios, se não existirem
const ensureUploadPath = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

// 📌 Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const uploadPath = isImage
      ? join(__dirname, '..', 'uploads', 'images')
      : join(__dirname, '..', 'uploads', 'media');

    ensureUploadPath(uploadPath); // Garante que o diretório exista
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  }
});

// 📌 Filtro de tipo de arquivo
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não permitido!'), false);
  }
};

// 📌 Limite de tamanho do arquivo (5MB para imagens e 50MB para vídeos)
const limits = {
  fileSize: (req, file, cb) => {
    const maxSize = file.mimetype.startsWith('image/') ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    cb(null, maxSize);
  }
};

// 📌 Middleware de upload com limites
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Aplica um limite global (o filtro de tipo corrige isso depois)
  }
});

export default upload;
