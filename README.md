# Livraria PaaS

Projeto de e-commerce de livros desenvolvido em Node.js, Express, EJS e PostgreSQL.

## Telas obrigatórias

- Cadastro de produtos/livros: `/cadastro`
- Apresentação e venda dos produtos: `/produtos`
- Checkout: `/checkout/:id`

## Tecnologias utilizadas

- Node.js
- Express
- EJS
- PostgreSQL
- Banco PaaS sugerido: Supabase ou Neon
- Deploy PaaS sugerido: Render, Railway ou Vercel com servidor Node.js

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Configure a variável `DATABASE_URL` no arquivo `.env` com a URL do banco PostgreSQL.

Exemplo:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
PORT=3000
```

4. Rode o projeto:

```bash
npm start
```

5. Acesse no navegador:

```text
http://localhost:3000
```

## Banco de dados

O próprio sistema cria as tabelas automaticamente ao iniciar. Também há um arquivo `schema.sql` com os comandos SQL, caso queira criar manualmente.

## Como publicar no Render

1. Suba este projeto para um repositório no GitHub.
2. Crie um banco PostgreSQL no Supabase ou Neon.
3. No Render, crie um novo Web Service conectado ao repositório.
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Em Environment Variables, adicione:
   - `DATABASE_URL`: URL do seu banco PostgreSQL
   - `NODE_ENV`: `production`
6. Após o deploy, use a URL gerada pelo Render como URL da aplicação publicada.

## Entrega do trabalho

Entregar:

- URL da aplicação publicada
- Link do repositório GitHub ou arquivo compactado com o código-fonte
