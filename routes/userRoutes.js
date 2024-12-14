const express = require('express');
const {
    registerUser ,
    listUsers,
    updateUser ,
    deleteUser ,
    loginUser ,
    createAdmin,
    installAdmin // Nova função para instalar administrador
} = require('../controllers/userController');
const { validateUserRegistration } = require('../middlewares/validationMiddleware');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/register', validateUserRegistration, registerUser );

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno do servidor.
 */

// Exige autenticação
router.get('/', authenticateToken, listUsers);

/**
 * @swagger
 * /api/users/{username}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Nome de usuário a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put('/:username', authenticateToken, updateUser );

/**
 * @swagger
 * /api/users/{username}:
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Nome de usuário a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:username', authenticateToken, deleteUser );

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT.
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/login', loginUser );

/**
 * * @swagger
 * /api/users/admin:
 *   post:
 *     summary: Cria um administrador
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/admin', createAdmin );

/**
 * @swagger
 * /api/users/install:
 *   get:
 *     summary: Cria um usuário administrador padrão
 *     description: Esta rota cria um usuário administrador padrão no sistema. Se um administrador já existir, uma mensagem de erro será retornada.
 *     responses:
 *       201:
 *         description: Usuário administrador criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário administrador criado com sucesso."
 *       400:
 *         description: Usuário administrador já existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário administrador já existe."
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao criar o usuário administrador."
 */
router.get('/install', installAdmin);

module.exports = router;