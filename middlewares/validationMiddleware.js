const { body } = require('express-validator');

const validateUserRegistration = [
    body('username').isString().notEmpty().withMessage('O nome de usuário é obrigatório.'),
    body('password').isString().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
];

module.exports = {
    validateUserRegistration
};