const express = require('express');
const fs = require('fs-extra');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();
const itemsFilePath = './data/items.json'; // Caminho para o arquivo de itens

// Função para ler itens do arquivo
const readItemsFromFile = async () => {
    const data = await fs.readFile(itemsFilePath);
    return JSON.parse(data);
};

// Criar um novo item
router.post('/', authenticateToken, async (req, res) => {
    const { name, description } = req.body;

    const items = await readItemsFromFile();
    const newItem = { id: items.length + 1, name, description };
    items.push(newItem);
    await fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2));

    res.status(201).json({ message: 'Item criado com sucesso.', item: newItem });
});

// Listar itens com paginação
router.get('/', async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const items = await readItemsFromFile();

    const limitValue = Math.min(Math.max(parseInt(limit), 1), 30); // Limite máximo de 30
    const pageValue = Math.max(parseInt(page), 1); // Página mínima de 1
    const startIndex = (pageValue - 1) * limitValue;
    const paginatedItems = items.slice(startIndex, startIndex + limitValue);

    res.status(200).json({
        totalItems: items.length,
        currentPage: pageValue,
        totalPages: Math.ceil(items.length / limitValue),
        items: paginatedItems
    });
});

// Atualizar um item
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const items = await readItemsFromFile();

    const itemIndex = items.findIndex(item => item.id === parseInt(id));
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item não encontrado.' });
    }

    items[itemIndex] = { id: parseInt(id), name, description };
    await fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2));

    res.status(200).json({ message: 'Item atualizado com sucesso.', item: items[itemIndex] });
});

// Excluir um item
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const items = await readItemsFromFile();

    const itemIndex = items.findIndex(item => item.id === parseInt(id));
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item não encontrado.' });
    }

    items.splice(itemIndex, 1);
    await fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2));

    res.status(200).json({ message: 'Item excluído com sucesso.' });
});

module.exports = router;