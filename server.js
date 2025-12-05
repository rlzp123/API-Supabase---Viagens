const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Rota teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de viagens rodando!' });
});


// =============================
// GET – Buscar todas as viagens
// =============================
app.get('/viagens', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('viagens')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});


// =========================================
// GET – Filtro por tipo (nacional/internacional)
// Exemplo: /viagens/tipo/nacional
// =========================================
app.get('/viagens/tipo/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;

    const { data, error } = await supabase
      .from('viagens')
      .select('*')
      .eq('tipo', tipo);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});


// ================================
// GET – Buscar viagem por ID
// ================================
app.get('/viagens/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('viagens')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});


// ================================
// POST – Criar nova viagem
// ================================
app.post('/viagens', async (req, res) => {
  try {
    const { destino, duracao_dias, preco, tipo } = req.body;

    // Validação simples
    if (!destino || !preco || !tipo) {
      return res.status(400).json({ erro: "Destino, preço e tipo são obrigatórios." });
    }

    const { data, error } = await supabase
      .from('viagens')
      .insert([{ destino, duracao_dias, preco, tipo }])
      .select();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});


// ================================
// PUT – Atualizar viagem
// ================================
app.put('/viagens/:id', async (req, res) => {
  try {
    const { destino, duracao_dias, preco, tipo } = req.body;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('viagens')
      .update({ destino, duracao_dias, preco, tipo })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});


// ================================
// DELETE – Deletar viagem
// ================================
app.delete('/viagens/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('viagens')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ mensagem: "Viagem deletada." });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});


// Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
