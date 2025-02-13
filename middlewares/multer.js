import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do armazenamento com multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o caminho absoluto para a pasta de uploads
    cb(null, join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname ? file.originalname.split('.').pop() : '';
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

// Cria o middleware do multer
const upload = multer({ storage });

export default upload;
