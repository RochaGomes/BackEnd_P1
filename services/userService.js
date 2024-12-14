const fs = require('fs-extra');
const bcrypt = require('bcryptjs');
const usersFilePath = './data/users.json'; // Caminho para o arquivo de usuários

// Função para criar um novo usuário
const createUser  = async (username, password, role = 'user') => {
    const users = await readUsersFromFile();
    const existingUser  = users.find(user => user.username === username);
    
    if (existingUser ) {
        throw new Error('Usuário já existe.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = { username, password: hashedPassword, role }; // Adiciona a role
    users.push(newUser );
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return newUser ;
};

// Função para listar todos os usuários
const listUsers = async () => {
    return await readUsersFromFile();
};

// Função para atualizar um usuário
const updateUser  = async (username, newData) => {
    const users = await readUsersFromFile();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        throw new Error('Usuário não encontrado.');
    }

    users[userIndex] = { ...users[userIndex], ...newData };
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return users[userIndex];
};

// Função para excluir um usuário
const deleteUser  = async (username) => {
    const users = await readUsersFromFile();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        throw new Error('Usuário não encontrado.');
    }

    users.splice(userIndex, 1);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return { message: 'Usuário excluído com sucesso.' };
};

// Função para encontrar um usuário pelo nome de usuário
const findUserByUsername = async (username) => {
    const users = await readUsersFromFile();
    return users.find(user => user.username === username);
};

// Função para ler usuários do arquivo
const readUsersFromFile = async () => {
    try {
        const data = await fs.readFile(usersFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Exportações
module.exports = {
    createUser ,
    listUsers,
    updateUser ,
    deleteUser ,
    findUserByUsername // Adicione aqui
};