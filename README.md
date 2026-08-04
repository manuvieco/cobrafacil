
# CobraFácil

> Projeto de estudo para praticar React, organização de componentes e gestão de dados no navegador.
Projeto de estudo em React para gerenciar clientes, cobranças e pagamentos.

O **CobraFácil** é uma aplicação web simples para cadastrar clientes, criar cobranças e registrar pagamentos. O projeto foi desenvolvido como prática de desenvolvimento frontend e tem foco em uma interface organizada para controle financeiro básico.
## Funcionalidades

## Demonstração das funcionalidades
- Cadastro e edição de clientes.
- Criação de cobranças.
- Registro de pagamentos.
- Painel financeiro e relatórios.
- Dados salvos no navegador com `localStorage`.

- Cadastro, edição, visualização e exclusão de clientes.
- Criação, edição e exclusão de cobranças.
- Registro e estorno de pagamentos.
- Atualização automática do status das cobranças.
- Painel com resumo financeiro.
- Relatórios com valores recebidos, em aberto e resumo por cliente.
- Dados mantidos no `localStorage` do navegador.
## Tecnologias

## Tecnologias utilizadas
React, Vite, JavaScript e CSS.

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- JavaScript
- CSS puro
- ESLint
## Como executar

## Como executar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
```

### 2. Entre na pasta do projeto

```bash
cd cobrafacil
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Depois, abra no navegador o endereço exibido no terminal, normalmente `http://localhost:5173`.

## Outros comandos úteis
Para verificar o código e gerar a versão de produção:

```bash
# Verifica padrões e possíveis problemas no código
npm run lint

# Gera a versão otimizada para publicação
npm run build

# Visualiza localmente a versão gerada pelo build
npm run preview
```

## Organização do projeto

```text
src/
├── components/  # componentes reutilizáveis, como Sidebar e modal
├── data/        # dados iniciais usados na demonstração
├── hooks/       # hooks reutilizáveis, como persistência de dados
├── pages/       # páginas da aplicação, como Relatórios
├── utils/       # funções auxiliares de formatação e armazenamento
├── App.jsx      # componente principal da aplicação
└── App.css      # estilos globais da interface
```

## Observação sobre os dados

Nesta versão, os dados são salvos no navegador usando `localStorage`. Isso significa que não existe login, API ou banco de dados configurado ainda. Se os dados do navegador forem apagados, os registros também serão removidos.

## Próximos passos de estudo

- Criar um backend com Node.js e Express.
- Salvar os dados em PostgreSQL.
- Adicionar autenticação de usuários.
- Criar testes automatizados.
- Publicar a aplicação online.

---

Desenvolvido para fins de estudo. 🚀
> Este projeto ainda não possui backend ou banco de dados. Os dados ficam salvos apenas no navegador.
