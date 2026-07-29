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

const clientes = [
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

const nomesDasTelas = {
  cobrancas: 'Cobranças',
  pagamentos: 'Pagamentos',
  relatorios: 'Relatórios',
}

function App() {
  const [telaAtual, setTelaAtual] = useState('painel')

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
            onClick={() => setTelaAtual('painel')}
          >
            Painel
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'clientes' ? 'ativo' : ''
            }`}
            onClick={() => setTelaAtual('clientes')}
          >
            Clientes
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'cobrancas' ? 'ativo' : ''
            }`}
            onClick={() => setTelaAtual('cobrancas')}
          >
            Cobranças
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'pagamentos' ? 'ativo' : ''
            }`}
            onClick={() => setTelaAtual('pagamentos')}
          >
            Pagamentos
          </button>

          <button
            className={`menu-item ${
              telaAtual === 'relatorios' ? 'ativo' : ''
            }`}
            onClick={() => setTelaAtual('relatorios')}
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

              <button className="botao-principal">
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
                  onClick={() => setTelaAtual('cobrancas')}
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

              <button className="botao-principal">
                Novo cliente
              </button>
            </header>

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
                            <button className="botao-acao">
                              Ver
                            </button>

                            <button className="botao-acao">
                              Editar
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
                Esta página será desenvolvida nas próximas etapas
                do projeto.
              </p>

              <button
                className="botao-principal"
                onClick={() => setTelaAtual('painel')}
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