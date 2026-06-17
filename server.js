require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

async function criarTabelas() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS livros (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      autor VARCHAR(255) NOT NULL,
      preco DECIMAL(10,2) NOT NULL,
      descricao TEXT,
      imagem_url TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      livro_id INTEGER REFERENCES livros(id),
      nome_cliente VARCHAR(255) NOT NULL,
      email_cliente VARCHAR(255) NOT NULL,
      endereco TEXT NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

app.get('/', (req, res) => {
  res.redirect('/produtos');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro', { mensagem: null });
});

app.post('/cadastro', async (req, res) => {
  const { titulo, autor, preco, descricao, imagem_url } = req.body;

  try {
    await pool.query(
      'INSERT INTO livros (titulo, autor, preco, descricao, imagem_url) VALUES ($1, $2, $3, $4, $5)',
      [titulo, autor, preco, descricao, imagem_url]
    );
    res.render('cadastro', { mensagem: 'Livro cadastrado com sucesso!' });
  } catch (erro) {
    console.error(erro);
    res.status(500).render('erro', { mensagem: 'Erro ao cadastrar livro.' });
  }
});

app.get('/produtos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM livros ORDER BY id DESC');
    res.render('produtos', { livros: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).render('erro', { mensagem: 'Erro ao carregar produtos.' });
  }
});

app.get('/checkout/:id', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM livros WHERE id = $1', [req.params.id]);

    if (resultado.rows.length === 0) {
      return res.status(404).render('erro', { mensagem: 'Livro não encontrado.' });
    }

    res.render('checkout', { livro: resultado.rows[0], mensagem: null });
  } catch (erro) {
    console.error(erro);
    res.status(500).render('erro', { mensagem: 'Erro ao abrir checkout.' });
  }
});

app.post('/checkout/:id', async (req, res) => {
  const { nome_cliente, email_cliente, endereco } = req.body;

  try {
    const resultadoLivro = await pool.query('SELECT * FROM livros WHERE id = $1', [req.params.id]);

    if (resultadoLivro.rows.length === 0) {
      return res.status(404).render('erro', { mensagem: 'Livro não encontrado.' });
    }

    const livro = resultadoLivro.rows[0];

    await pool.query(
      'INSERT INTO pedidos (livro_id, nome_cliente, email_cliente, endereco, total) VALUES ($1, $2, $3, $4, $5)',
      [livro.id, nome_cliente, email_cliente, endereco, livro.preco]
    );

    res.render('checkout', {
      livro,
      mensagem: 'Pedido finalizado com sucesso! Obrigado pela compra.'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).render('erro', { mensagem: 'Erro ao finalizar pedido.' });
  }
});

criarTabelas()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('Erro ao conectar ao banco de dados:', erro);
  });
