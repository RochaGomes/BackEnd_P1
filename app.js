const express = require('express');
const userRoutes = require('./routes/userRoutes');
const swaggerSetup = require('./swagger');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
swaggerSetup(app); // Configura o Swagger

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor em https://localhost:${PORT}`);
});