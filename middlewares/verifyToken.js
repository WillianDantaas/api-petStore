import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1] // Remove prefixo Baerer

    console.log('Token recebido:', token); // Adicione este log
    // Verifica se o token foi enviado
    if (!token) {
        return res.status(403).json({ error: 'Token de acesso necessário' });
    }

    try {
        // Verifica a validade do token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                // Verificar se o erro é de expiração do token
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expirado. Por favor, utilize o refresh token para gerar um novo token.' });
                }

                // Para outros erros (como token inválido)
                return res.status(403).json({ error: 'Token inválido' });
            }

            req.user = decoded
            return next()
        })
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

export default verifyToken;
