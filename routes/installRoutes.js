app.get('/install', async (req, res) => {
    const users = readUsersFromFile(); // Função para ler usuários do arquivo

    // Verificar se já existem usuários cadastrados
    if (users.length > 0) {
        return res.status(400).json({ message: 'Usuário administrador já existe.' });
    }

    // Dados do novo usuário administrador
    const adminUsername = 'admin'; // Nome de usuário padrão
    const adminPassword = 'admin123'; // Senha padrão

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Criar novo usuário administrador
    const newAdmin = { username: adminUsername, password: hashedPassword, role: 'admin' };
    users.push(newAdmin);

    // Persistir o novo usuário no arquivo
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Usuário administrador criado com sucesso.' });
});