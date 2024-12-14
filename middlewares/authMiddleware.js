const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extrai o token do cabeçalho

    if (!token) {
        return res.sendStatus(401); // Não autorizado
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Proibido
        }
        req.user = user; // Armazena o usuário no objeto da requisição
        next(); // Chama o próximo middleware
    });
};

module.exports = {
    authenticateToken
};