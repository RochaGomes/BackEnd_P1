const errorMiddleware = (err, req, res, next) => {
    console.error(err); // Log do erro
    res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
};

module.exports = errorMiddleware;