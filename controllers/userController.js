const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para registrar um novo usuário
const registerUser  = async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser  = await userService.createUser (username, password);
        res.status(201).json({ message: 'Usuário registrado com sucesso.', user: newUser  });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para listar todos os usuários
const listUsers = async (req, res) => {
    try {
        const users = await userService.listUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para atualizar um usuário
const updateUser  = async (req, res) => {
    const { username } = req.params;
    const newData = req.body;

    try {
        const updatedUser  = await userService.updateUser (username, newData);
        res.status(200).json({ message: 'Usuário atualizado com sucesso.', user: updatedUser  });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Função para excluir um usuário
const deleteUser  = async (req, res) => {
    const { username } = req.params;

    try {
        const result = await userService.deleteUser (username);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Função para fazer login
const loginUser  = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userService.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha inválida.' });
        }

        // Gerar token JWT
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para criar um novo administrador
const createAdmin = async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newAdmin = await userService.createUser (username, password, 'admin'); // Pass ando 'admin' como role
        res.status(201).json({ message: 'Administrador criado com sucesso.', user: newAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para instalar um administrador padrão
const installAdmin = async (req, res) => {
    const adminUsername = 'admin'; // Nome de usuário padrão
    const adminPassword = 'admin123'; // Senha padrão

    try {
        const existingAdmin = await userService.findUserByUsername(adminUsername);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Administrador já existe.' });
        }

        const newAdmin = await userService.createUser (adminUsername, adminPassword, 'admin');
        res.status(201).json({ message: 'Administrador padrão criado com sucesso.', user: newAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exportações
module.exports = {
    registerUser ,
    listUsers,
    updateUser ,
    deleteUser ,
    loginUser ,
    createAdmin,
    installAdmin // Adicione aqui
};