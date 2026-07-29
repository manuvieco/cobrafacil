import { useState } from 'react'
import './App.css'

const resumoFinanceiro = [
  {
    titulo: 'Total em cobranças',
    valor: 'R$ 12.500,00',
    classe: 'total',
  },
  {
    titulo: 'Total recebido',
    valor: 'R$ 7.800,00',
    classe: 'recebido',
  },
  {
    titulo: 'Total pendente',
    valor: 'R$ 3.200,00',
    classe: 'pendente',
  },
  {
    titulo: 'Total vencido',
    valor: 'R$ 1.500,00',
    classe: 'vencido',
  },
]

const cobrancasRecentes = [
  {
    id: 1,
    cliente: 'Ana Oliveira',
    descricao: 'Mensalidade de julho',
    valor: 'R$ 350,00',
    vencimento: '10/07/2026',
    situacao: 'Pendente',
  },
  {
    id: 2,
    cliente: 'Carlos Souza',
    descricao: 'Parcela do acordo',
    valor: 'R$ 520,00',
    vencimento: '15/07/2026',
    situacao: 'Paga',
  },
  {
    id: 3,
    cliente: 'Mariana Santos',
    descricao: 'Mensalidade de junho',
    valor: 'R$ 290,00',
    vencimento: '05/06/2026',
    situacao: 'Vencida',
  },
  {
    id: 4,
    cliente: 'Lucas Almeida',
    descricao: 'Taxa de serviço',
    valor: 'R$ 180,00',
    vencimento: '25/07/2026',
    situacao: 'Pendente',
  },
]

const clientesIniciais = [
  {
    id: 1,
    nome: 'Ana Oliveira',
    documento: '123.456.789-00',
    telefone: '(61) 99999-1001',
    email: 'ana@email.com',
    situacao: 'Ativo',
  },
  {
    id: 2,
    nome: 'Carlos Souza',
    documento: '987.654.321-00',
    telefone: '(61) 99999-1002',
    email: 'carlos@email.com',
    situacao: 'Ativo',
  },
  {
    id: 3,
    nome: 'Mariana Santos',
    documento: '456.789.123-00',
    telefone: '(61) 99999-1003',
    email: 'mariana@email.com',
    situacao: 'Inativo',
  },
  {
    id: 4,
    nome: 'Lucas Almeida',
    documento: '789.123.456-00',
    telefone: '(61) 99999-1004',
    email: 'lucas@email.com',
    situacao: 'Ativo',
  },
]

const clienteVazio = {
  nome: '',
  documento: '',
  telefone: '',
  email: '',
}

const nomesDasTelas = {
  cobrancas: 'Cobranças',
  pagamentos: 'Pagamentos',
  relatorios: 'Relatórios',
}

function App() {
  const [telaAtual, setTelaAtual] = useState('painel')
  const [clientes, setClientes] = useState(clientesIniciais)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [novoCliente, setNovoCliente] = useState(clienteVazio)
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null)

  const [mensagem, setMensagem] = useState({
    tipo: '',
    texto: '',
  })

  function limparMensagem() {
    setMensagem({
      tipo: '',
      texto: '',
    })
  }

  function mudarTela(tela) {
    setTelaAtual(tela)
    setMostrarFormulario(false)
    setClienteEmEdicao(null)
    setNovoCliente(clienteVazio)
    limparMensagem()
  }

  function abrirFormularioCliente() {
    setNovoCliente(clienteVazio)
    setClienteEmEdicao(null)
    setMostrarFormulario(true)
    limparMensagem()
  }

  function fecharFormularioCliente() {
    setNovoCliente(clienteVazio)
    setClienteEmEdicao(null)
    setMostrarFormulario(false)
    limparMensagem()
  }

  function atualizarCampoCliente(evento) {
    const { name, value } = evento.target

    setNovoCliente((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }))
  }

  function editarCliente(cliente) {
    setNovoCliente({
      nome: cliente.nome,
      documento: cliente.documento,
      telefone: cliente.telefone,
      email: cliente.email,
    })

    setClienteEmEdicao(cliente.id)
    setMostrarFormulario(true)
    limparMensagem()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function excluirCliente(cliente) {
    const confirmouExclusao = window.confirm(
      `Deseja realmente excluir o cliente ${cliente.nome}?`,
    )

    if (!confirmouExclusao) {
      return
    }

    setClientes((clientesAtuais) =>
      clientesAtuais.filter(
        (clienteAtual) => clienteAtual.id !== cliente.id,
      ),
    )

    if (clienteEmEdicao === cliente.id) {
      setNovoCliente(clienteVazio)
      setClienteEmEdicao(null)
      setMostrarFormulario(false)
    }

    setMensagem({
      tipo: 'sucesso',
      texto: 'Cliente excluído com sucesso!',
    })
  }

  function salvarCliente(evento) {
    evento.preventDefault()

    const formularioIncompleto =
      !novoCliente.nome.trim() ||
      !novoCliente.documento.trim() ||
      !novoCliente.telefone.trim() ||
      !novoCliente.email.trim()

    if (formularioIncompleto) {
      setMensagem({
        tipo: 'erro',
        texto: 'Preencha todos os campos antes de salvar.',
      })

      return
    }

    const dadosDoCliente = {
      nome: novoCliente.nome.trim(),
      documento: novoCliente.documento.trim(),
      telefone: novoCliente.telefone.trim(),
      email: novoCliente.email.trim(),
    }

    if (clienteEmEdicao !== null) {
      setClientes((clientesAtuais) =>
        clientesAtuais.map((cliente) =>
          cliente.id === clienteEmEdicao
            ? {
                ...cliente,
                ...dadosDoCliente,
              }
            : cliente,
        ),
      )

      setMensagem({
        tipo: 'sucesso',
        texto: 'Cliente atualizado com sucesso!',
      })
    } else {
      const clienteCadastrado = {
        id: Date.now(),
        ...dadosDoCliente,
        situacao: 'Ativo',
      }

      setClientes((clientesAtuais) => [
        ...clientesAtuais,
        clienteCadastrado,
      ])

      setMensagem({
        tipo: 'sucesso',
        texto: 'Cliente cadastrado com sucesso!',
      })
    }

    setNovoCliente(clienteVazio)
    setClienteEmEdicao(null)
    setMostrarFormulario(false)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-simbolo">C$</span>

          <div>
            <h1>CobraFácil</h1>
            <p>Gestão de cobranças</p>
          </div>
        </div>

        <nav className="menu">
          <button
            className={`menu-item ${
              telaAtual === 'painel' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('painel')}
          >
            Painel
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'clientes' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('clientes')}
          >
            Clientes
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'cobrancas' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('cobrancas')}
          >
            Cobranças
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'pagamentos' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('pagamentos')}
          >
            Pagamentos
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'relatorios' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('relatorios')}
          >
            Relatórios
          </button>
        </nav>

        <div className="usuario-sidebar">
          <span className="avatar">KM</span>

          <div>
            <strong>Kelry Manuelle</strong>
            <small>Administradora</small>
          </div>
        </div>
      </aside>

      <main className="conteudo">
        {telaAtual === 'painel' && (
          <>
            <header className="cabecalho">
              <div>
                <p className="saudacao">Bem-vinda, Kelry</p>
                <h2>Painel de cobranças</h2>
              </div>

              <button
                className="botao-principal"
                onClick={() => mudarTela('cobrancas')}
              >
                Nova cobrança
              </button>
            </header>

            <section className="resumo">
              {resumoFinanceiro.map((item) => (
                <article
                  className={`cartao ${item.classe}`}
                  key={item.titulo}
                >
                  <span>{item.titulo}</span>
                  <strong>{item.valor}</strong>
                </article>
              ))}
            </section>

            <section className="secao-tabela">
              <div className="titulo-secao">
                <div>
                  <h3>Cobranças recentes</h3>
                  <p>
                    Acompanhe as últimas movimentações cadastradas.
                  </p>
                </div>

                <button
                  className="botao-secundario"
                  onClick={() => mudarTela('cobrancas')}
                >
                  Ver todas
                </button>
              </div>

              <div className="tabela-container">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Vencimento</th>
                      <th>Situação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cobrancasRecentes.map((cobranca) => (
                      <tr key={cobranca.id}>
                        <td>{cobranca.cliente}</td>
                        <td>{cobranca.descricao}</td>
                        <td>{cobranca.valor}</td>
                        <td>{cobranca.vencimento}</td>

                        <td>
                          <span
                            className={`status ${cobranca.situacao.toLowerCase()}`}
                          >
                            {cobranca.situacao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {telaAtual === 'clientes' && (
          <>
            <header className="cabecalho">
              <div>
                <p className="saudacao">Gerenciamento</p>
                <h2>Clientes</h2>
              </div>

              <button
                className="botao-principal"
                onClick={abrirFormularioCliente}
              >
                Novo cliente
              </button>
            </header>

            {mensagem.texto && (
              <div className={`mensagem-formulario ${mensagem.tipo}`}>
                {mensagem.texto}
              </div>
            )}

            {mostrarFormulario && (
              <section className="formulario-card">
                <div className="formulario-cabecalho">
                  <h3>
                    {clienteEmEdicao !== null
                      ? 'Editar cliente'
                      : 'Cadastrar cliente'}
                  </h3>

                  <p>
                    {clienteEmEdicao !== null
                      ? 'Altere os dados do cliente selecionado.'
                      : 'Preencha os dados para adicionar um novo cliente.'}
                  </p>
                </div>

                <form onSubmit={salvarCliente}>
                  <div className="formulario-grid">
                    <label className="campo-formulario">
                      <span>Nome completo</span>

                      <input
                        type="text"
                        name="nome"
                        value={novoCliente.nome}
                        onChange={atualizarCampoCliente}
                        placeholder="Ex.: Fernanda Ribeiro"
                        required
                      />
                    </label>

                    <label className="campo-formulario">
                      <span>CPF ou CNPJ</span>

                      <input
                        type="text"
                        name="documento"
                        value={novoCliente.documento}
                        onChange={atualizarCampoCliente}
                        placeholder="000.000.000-00"
                        required
                      />
                    </label>

                    <label className="campo-formulario">
                      <span>Telefone</span>

                      <input
                        type="text"
                        name="telefone"
                        value={novoCliente.telefone}
                        onChange={atualizarCampoCliente}
                        placeholder="(61) 99999-9999"
                        required
                      />
                    </label>

                    <label className="campo-formulario">
                      <span>E-mail</span>

                      <input
                        type="email"
                        name="email"
                        value={novoCliente.email}
                        onChange={atualizarCampoCliente}
                        placeholder="cliente@email.com"
                        required
                      />
                    </label>
                  </div>

                  <div className="formulario-acoes">
                    <button
                      type="button"
                      className="botao-cancelar"
                      onClick={fecharFormularioCliente}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="botao-principal"
                    >
                      {clienteEmEdicao !== null
                        ? 'Salvar alterações'
                        : 'Salvar cliente'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="secao-tabela">
              <div className="titulo-secao">
                <div>
                  <h3>Clientes cadastrados</h3>
                  <p>
                    Consulte os clientes registrados no sistema.
                  </p>
                </div>

                <span className="contador-clientes">
                  {clientes.length} clientes
                </span>
              </div>

              <div className="tabela-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Documento</th>
                      <th>Telefone</th>
                      <th>E-mail</th>
                      <th>Situação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <td>
                          <strong>{cliente.nome}</strong>
                        </td>

                        <td>{cliente.documento}</td>
                        <td>{cliente.telefone}</td>
                        <td>{cliente.email}</td>

                        <td>
                          <span
                            className={`status ${cliente.situacao.toLowerCase()}`}
                          >
                            {cliente.situacao}
                          </span>
                        </td>

                        <td>
                          <div className="acoes">
                            <button
                              type="button"
                              className="botao-acao"
                            >
                              Ver
                            </button>

                            <button
                              type="button"
                              className="botao-acao"
                              onClick={() => editarCliente(cliente)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="botao-acao botao-excluir"
                              onClick={() => excluirCliente(cliente)}
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {nomesDasTelas[telaAtual] && (
          <>
            <header className="cabecalho">
              <div>
                <p className="saudacao">Gerenciamento</p>
                <h2>{nomesDasTelas[telaAtual]}</h2>
              </div>
            </header>

            <section className="pagina-em-construcao">
              <span className="icone-construcao">&lt;/&gt;</span>

              <h3>{nomesDasTelas[telaAtual]}</h3>

              <p>
                Esta página será desenvolvida nas próximas etapas do
                projeto.
              </p>

              <button
                className="botao-principal"
                onClick={() => mudarTela('painel')}
              >
                Voltar ao painel
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App