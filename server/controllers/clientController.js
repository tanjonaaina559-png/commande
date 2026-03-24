const Client = require('../models/clientModel');

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    
    const orders = await Client.getOrders(req.params.id);
    res.json({ ...client, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const { nom, telephone } = req.body;
    const clientId = await Client.create(nom, telephone);
    res.status(201).json({ id: clientId, nom, telephone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
