import { useEffect, useState } from 'react'
import './App.css'

const CHAVE_CLIENTES = 'cobrafacil_clientes'
const CHAVE_COBRANCAS = 'cobrafacil_cobrancas'
const CHAVE_PAGAMENTOS = 'cobrafacil_pagamentos'

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

const cobrancasIniciais = [
  {
    id: 1,
    clienteId: 1,
    descricao: 'Mensalidade de julho',
    valor: 350,
    vencimento: '2026-07-10',
    situacao: 'Pendente',
  },
  {
    id: 2,
    clienteId: 2,
    descricao: 'Parcela do acordo',
    valor: 520,
    vencimento: '2026-07-15',
    situacao: 'Paga',
  },
  {
    id: 3,
    clienteId: 3,
    descricao: 'Mensalidade de junho',
    valor: 290,
    vencimento: '2026-06-05',
    situacao: 'Vencida',
  },
  {
    id: 4,
    clienteId: 4,
    descricao: 'Taxa de serviço',
    valor: 180,
    vencimento: '2026-07-25',
    situacao: 'Pendente',
  },
]

const pagamentosIniciais = [
  {
    id: 1,
    cobrancaId: 2,
    clienteId: 2,
    valor: 520,
    dataPagamento: '2026-07-15',
    formaPagamento: 'Pix',
    observacao: 'Pagamento integral.',
  },
]

const clienteVazio = {
  nome: '',
  documento: '',
  telefone: '',
  email: '',
}

const cobrancaVazia = {
  clienteId: '',
  descricao: '',
  valor: '',
  vencimento: '',
  situacao: 'Pendente',
}

const pagamentoVazio = {
  cobrancaId: '',
  dataPagamento: '',
  formaPagamento: 'Pix',
  observacao: '',
}

const nomesDasTelas = {
  relatorios: 'Relatórios',
}

function carregarDados(chave, dadosIniciais) {
  const dadosSalvos = localStorage.getItem(chave)

  if (!dadosSalvos) {
    return dadosIniciais
  }

  try {
    const dadosConvertidos = JSON.parse(dadosSalvos)

    return Array.isArray(dadosConvertidos)
      ? dadosConvertidos
      : dadosIniciais
  } catch {
    return dadosIniciais
  }
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor) || 0)
}

function formatarData(data) {
  if (!data) {
    return '-'
  }

  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

function obterDataHoje() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function calcularSituacaoSemPagamento(cobranca) {
  if (!cobranca?.vencimento) {
    return 'Pendente'
  }

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dataVencimento = new Date(
    `${cobranca.vencimento}T00:00:00`,
  )

  return dataVencimento < hoje ? 'Vencida' : 'Pendente'
}

function App() {
  const [telaAtual, setTelaAtual] = useState('painel')

  const [clientes, setClientes] = useState(() =>
    carregarDados(CHAVE_CLIENTES, clientesIniciais),
  )

  const [cobrancas, setCobrancas] = useState(() =>
    carregarDados(CHAVE_COBRANCAS, cobrancasIniciais),
  )

  const [pagamentos, setPagamentos] = useState(() =>
    carregarDados(CHAVE_PAGAMENTOS, pagamentosIniciais),
  )

  const [mostrarFormularioCliente, setMostrarFormularioCliente] =
    useState(false)

  const [mostrarFormularioCobranca, setMostrarFormularioCobranca] =
    useState(false)

  const [mostrarFormularioPagamento, setMostrarFormularioPagamento] =
    useState(false)

  const [novoCliente, setNovoCliente] = useState(clienteVazio)
  const [novaCobranca, setNovaCobranca] = useState(cobrancaVazia)
  const [novoPagamento, setNovoPagamento] =
    useState(pagamentoVazio)

  const [clienteEmEdicao, setClienteEmEdicao] = useState(null)
  const [cobrancaEmEdicao, setCobrancaEmEdicao] = useState(null)

  const [clienteSelecionado, setClienteSelecionado] =
    useState(null)

  const [mensagem, setMensagem] = useState({
    tipo: '',
    texto: '',
  })

  useEffect(() => {
    localStorage.setItem(
      CHAVE_CLIENTES,
      JSON.stringify(clientes),
    )
  }, [clientes])

  useEffect(() => {
    localStorage.setItem(
      CHAVE_COBRANCAS,
      JSON.stringify(cobrancas),
    )
  }, [cobrancas])

  useEffect(() => {
    localStorage.setItem(
      CHAVE_PAGAMENTOS,
      JSON.stringify(pagamentos),
    )
  }, [pagamentos])

  const cobrancasOrdenadas = [...cobrancas].sort(
    (primeira, segunda) => segunda.id - primeira.id,
  )

  const pagamentosOrdenados = [...pagamentos].sort(
    (primeiro, segundo) => segundo.id - primeiro.id,
  )

  const cobrancasRecentes = cobrancasOrdenadas.slice(0, 4)

  const cobrancasDisponiveisPagamento = cobrancas.filter(
    (cobranca) => {
      const possuiPagamento = pagamentos.some(
        (pagamento) =>
          String(pagamento.cobrancaId) === String(cobranca.id),
      )

      return cobranca.situacao !== 'Paga' && !possuiPagamento
    },
  )

  const cobrancaSelecionadaPagamento = cobrancas.find(
    (cobranca) =>
      String(cobranca.id) === String(novoPagamento.cobrancaId),
  )

  const totalCobrancas = cobrancas.reduce(
    (total, cobranca) => total + Number(cobranca.valor),
    0,
  )

  const totalRecebido = cobrancas
    .filter((cobranca) => cobranca.situacao === 'Paga')
    .reduce(
      (total, cobranca) => total + Number(cobranca.valor),
      0,
    )

  const totalPendente = cobrancas
    .filter((cobranca) => cobranca.situacao === 'Pendente')
    .reduce(
      (total, cobranca) => total + Number(cobranca.valor),
      0,
    )

  const totalVencido = cobrancas
    .filter((cobranca) => cobranca.situacao === 'Vencida')
    .reduce(
      (total, cobranca) => total + Number(cobranca.valor),
      0,
    )

  function limparMensagem() {
    setMensagem({
      tipo: '',
      texto: '',
    })
  }

  function mudarTela(tela) {
    setTelaAtual(tela)

    setMostrarFormularioCliente(false)
    setMostrarFormularioCobranca(false)
    setMostrarFormularioPagamento(false)

    setClienteEmEdicao(null)
    setCobrancaEmEdicao(null)
    setClienteSelecionado(null)

    setNovoCliente(clienteVazio)
    setNovaCobranca(cobrancaVazia)
    setNovoPagamento(pagamentoVazio)

    limparMensagem()
  }

  function buscarCliente(clienteId) {
    return clientes.find(
      (cliente) => String(cliente.id) === String(clienteId),
    )
  }

  function buscarNomeCliente(clienteId) {
    const clienteEncontrado = buscarCliente(clienteId)

    return clienteEncontrado
      ? clienteEncontrado.nome
      : 'Cliente não encontrado'
  }

  function buscarCobranca(cobrancaId) {
    return cobrancas.find(
      (cobranca) => String(cobranca.id) === String(cobrancaId),
    )
  }

  function buscarDescricaoCobranca(cobrancaId) {
    const cobrancaEncontrada = buscarCobranca(cobrancaId)

    return cobrancaEncontrada
      ? cobrancaEncontrada.descricao
      : 'Cobrança não encontrada'
  }

  function abrirFormularioCliente() {
    setNovoCliente(clienteVazio)
    setClienteEmEdicao(null)
    setClienteSelecionado(null)
    setMostrarFormularioCliente(true)
    limparMensagem()
  }

  function fecharFormularioCliente() {
    setNovoCliente(clienteVazio)
    setClienteEmEdicao(null)
    setMostrarFormularioCliente(false)
    limparMensagem()
  }

  function atualizarCampoCliente(evento) {
    const { name, value } = evento.target

    setNovoCliente((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }))
  }

  function verCliente(cliente) {
    setClienteSelecionado(cliente)
  }

  function fecharDetalhesCliente() {
    setClienteSelecionado(null)
  }

  function editarCliente(cliente) {
    setNovoCliente({
      nome: cliente.nome,
      documento: cliente.documento,
      telefone: cliente.telefone,
      email: cliente.email,
    })

    setClienteEmEdicao(cliente.id)
    setClienteSelecionado(null)
    setMostrarFormularioCliente(true)
    limparMensagem()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function editarClienteSelecionado() {
    if (!clienteSelecionado) {
      return
    }

    editarCliente(clienteSelecionado)
  }

  function excluirCliente(cliente) {
    const possuiCobranca = cobrancas.some(
      (cobranca) =>
        String(cobranca.clienteId) === String(cliente.id),
    )

    if (possuiCobranca) {
      setMensagem({
        tipo: 'erro',
        texto:
          'Este cliente possui cobranças cadastradas e não pode ser excluído.',
      })

      return
    }

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
      setMostrarFormularioCliente(false)
    }

    if (clienteSelecionado?.id === cliente.id) {
      setClienteSelecionado(null)
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
    setMostrarFormularioCliente(false)
  }

  function abrirFormularioCobranca() {
    setTelaAtual('cobrancas')
    setNovaCobranca(cobrancaVazia)
    setCobrancaEmEdicao(null)

    setMostrarFormularioCliente(false)
    setMostrarFormularioPagamento(false)
    setMostrarFormularioCobranca(true)

    limparMensagem()
  }

  function fecharFormularioCobranca() {
    setNovaCobranca(cobrancaVazia)
    setCobrancaEmEdicao(null)
    setMostrarFormularioCobranca(false)
    limparMensagem()
  }

  function atualizarCampoCobranca(evento) {
    const { name, value } = evento.target

    setNovaCobranca((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }))
  }

  function editarCobranca(cobranca) {
    setNovaCobranca({
      clienteId: String(cobranca.clienteId),
      descricao: cobranca.descricao,
      valor: String(cobranca.valor),
      vencimento: cobranca.vencimento,
      situacao: cobranca.situacao,
    })

    setCobrancaEmEdicao(cobranca.id)
    setMostrarFormularioCobranca(true)
    limparMensagem()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function excluirCobranca(cobranca) {
    const possuiPagamento = pagamentos.some(
      (pagamento) =>
        String(pagamento.cobrancaId) === String(cobranca.id),
    )

    if (possuiPagamento) {
      setMensagem({
        tipo: 'erro',
        texto:
          'Esta cobrança possui um pagamento registrado. Estorne o pagamento antes de excluir a cobrança.',
      })

      return
    }

    const nomeCliente = buscarNomeCliente(cobranca.clienteId)

    const confirmouExclusao = window.confirm(
      `Deseja realmente excluir a cobrança de ${nomeCliente}?`,
    )

    if (!confirmouExclusao) {
      return
    }

    setCobrancas((cobrancasAtuais) =>
      cobrancasAtuais.filter(
        (cobrancaAtual) => cobrancaAtual.id !== cobranca.id,
      ),
    )

    if (cobrancaEmEdicao === cobranca.id) {
      setNovaCobranca(cobrancaVazia)
      setCobrancaEmEdicao(null)
      setMostrarFormularioCobranca(false)
    }

    setMensagem({
      tipo: 'sucesso',
      texto: 'Cobrança excluída com sucesso!',
    })
  }

  function salvarCobranca(evento) {
    evento.preventDefault()

    const valorConvertido = Number(novaCobranca.valor)

    const formularioIncompleto =
      !novaCobranca.clienteId ||
      !novaCobranca.descricao.trim() ||
      !novaCobranca.valor ||
      !novaCobranca.vencimento ||
      !novaCobranca.situacao

    if (formularioIncompleto) {
      setMensagem({
        tipo: 'erro',
        texto: 'Preencha todos os campos da cobrança.',
      })

      return
    }

    if (valorConvertido <= 0) {
      setMensagem({
        tipo: 'erro',
        texto: 'O valor da cobrança deve ser maior que zero.',
      })

      return
    }

    const clienteExiste = clientes.some(
      (cliente) =>
        String(cliente.id) === String(novaCobranca.clienteId),
    )

    if (!clienteExiste) {
      setMensagem({
        tipo: 'erro',
        texto: 'Selecione um cliente válido.',
      })

      return
    }

    const dadosDaCobranca = {
      clienteId: Number(novaCobranca.clienteId),
      descricao: novaCobranca.descricao.trim(),
      valor: valorConvertido,
      vencimento: novaCobranca.vencimento,
      situacao: novaCobranca.situacao,
    }

    if (cobrancaEmEdicao !== null) {
      setCobrancas((cobrancasAtuais) =>
        cobrancasAtuais.map((cobranca) =>
          cobranca.id === cobrancaEmEdicao
            ? {
                ...cobranca,
                ...dadosDaCobranca,
              }
            : cobranca,
        ),
      )

      setPagamentos((pagamentosAtuais) =>
        pagamentosAtuais.map((pagamento) =>
          String(pagamento.cobrancaId) ===
          String(cobrancaEmEdicao)
            ? {
                ...pagamento,
                clienteId: Number(novaCobranca.clienteId),
                valor: valorConvertido,
              }
            : pagamento,
        ),
      )

      setMensagem({
        tipo: 'sucesso',
        texto: 'Cobrança atualizada com sucesso!',
      })
    } else {
      const cobrancaCadastrada = {
        id: Date.now(),
        ...dadosDaCobranca,
      }

      setCobrancas((cobrancasAtuais) => [
        ...cobrancasAtuais,
        cobrancaCadastrada,
      ])

      setMensagem({
        tipo: 'sucesso',
        texto: 'Cobrança cadastrada com sucesso!',
      })
    }

    setNovaCobranca(cobrancaVazia)
    setCobrancaEmEdicao(null)
    setMostrarFormularioCobranca(false)
  }

  function abrirFormularioPagamento() {
    setTelaAtual('pagamentos')

    setNovoPagamento({
      ...pagamentoVazio,
      dataPagamento: obterDataHoje(),
    })

    setMostrarFormularioCliente(false)
    setMostrarFormularioCobranca(false)
    setMostrarFormularioPagamento(true)

    limparMensagem()
  }

  function fecharFormularioPagamento() {
    setNovoPagamento(pagamentoVazio)
    setMostrarFormularioPagamento(false)
    limparMensagem()
  }

  function atualizarCampoPagamento(evento) {
    const { name, value } = evento.target

    setNovoPagamento((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }))
  }

  function salvarPagamento(evento) {
    evento.preventDefault()

    const formularioIncompleto =
      !novoPagamento.cobrancaId ||
      !novoPagamento.dataPagamento ||
      !novoPagamento.formaPagamento

    if (formularioIncompleto) {
      setMensagem({
        tipo: 'erro',
        texto: 'Preencha todos os campos obrigatórios.',
      })

      return
    }

    const cobrancaEncontrada = buscarCobranca(
      novoPagamento.cobrancaId,
    )

    if (!cobrancaEncontrada) {
      setMensagem({
        tipo: 'erro',
        texto: 'A cobrança selecionada não foi encontrada.',
      })

      return
    }

    const pagamentoJaExiste = pagamentos.some(
      (pagamento) =>
        String(pagamento.cobrancaId) ===
        String(novoPagamento.cobrancaId),
    )

    if (pagamentoJaExiste) {
      setMensagem({
        tipo: 'erro',
        texto: 'Esta cobrança já possui um pagamento registrado.',
      })

      return
    }

    const pagamentoCadastrado = {
      id: Date.now(),
      cobrancaId: cobrancaEncontrada.id,
      clienteId: cobrancaEncontrada.clienteId,
      valor: Number(cobrancaEncontrada.valor),
      dataPagamento: novoPagamento.dataPagamento,
      formaPagamento: novoPagamento.formaPagamento,
      observacao: novoPagamento.observacao.trim(),
    }

    setPagamentos((pagamentosAtuais) => [
      ...pagamentosAtuais,
      pagamentoCadastrado,
    ])

    setCobrancas((cobrancasAtuais) =>
      cobrancasAtuais.map((cobranca) =>
        cobranca.id === cobrancaEncontrada.id
          ? {
              ...cobranca,
              situacao: 'Paga',
            }
          : cobranca,
      ),
    )

    setNovoPagamento(pagamentoVazio)
    setMostrarFormularioPagamento(false)

    setMensagem({
      tipo: 'sucesso',
      texto: 'Pagamento registrado com sucesso!',
    })
  }

  function estornarPagamento(pagamento) {
    const nomeCliente = buscarNomeCliente(pagamento.clienteId)

    const confirmouEstorno = window.confirm(
      `Deseja realmente estornar o pagamento de ${nomeCliente}?`,
    )

    if (!confirmouEstorno) {
      return
    }

    const cobrancaRelacionada = buscarCobranca(
      pagamento.cobrancaId,
    )

    setPagamentos((pagamentosAtuais) =>
      pagamentosAtuais.filter(
        (pagamentoAtual) =>
          pagamentoAtual.id !== pagamento.id,
      ),
    )

    if (cobrancaRelacionada) {
      const novaSituacao =
        calcularSituacaoSemPagamento(cobrancaRelacionada)

      setCobrancas((cobrancasAtuais) =>
        cobrancasAtuais.map((cobranca) =>
          cobranca.id === cobrancaRelacionada.id
            ? {
                ...cobranca,
                situacao: novaSituacao,
              }
            : cobranca,
        ),
      )
    }

    setMensagem({
      tipo: 'sucesso',
      texto: 'Pagamento estornado com sucesso!',
    })
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
            type="button"
            className={`menu-item ${
              telaAtual === 'painel' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('painel')}
          >
            Painel
          </button>

          <button
            type="button"
            className={`menu-item ${
              telaAtual === 'clientes' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('clientes')}
          >
            Clientes
          </button>

          <button
            type="button"
            className={`menu-item ${
              telaAtual === 'cobrancas' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('cobrancas')}
          >
            Cobranças
          </button>

          <button
            type="button"
            className={`menu-item ${
              telaAtual === 'pagamentos' ? 'ativo' : ''
            }`}
            onClick={() => mudarTela('pagamentos')}
          >
            Pagamentos
          </button>

          <button
            type="button"
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
                type="button"
                className="botao-principal"
                onClick={abrirFormularioCobranca}
              >
                Nova cobrança
              </button>
            </header>

            <section className="resumo">
              <article className="cartao total">
                <span>Total em cobranças</span>
                <strong>{formatarMoeda(totalCobrancas)}</strong>
              </article>

              <article className="cartao recebido">
                <span>Total recebido</span>
                <strong>{formatarMoeda(totalRecebido)}</strong>
              </article>

              <article className="cartao pendente">
                <span>Total pendente</span>
                <strong>{formatarMoeda(totalPendente)}</strong>
              </article>

              <article className="cartao vencido">
                <span>Total vencido</span>
                <strong>{formatarMoeda(totalVencido)}</strong>
              </article>
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
                  type="button"
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
                        <td>
                          {buscarNomeCliente(cobranca.clienteId)}
                        </td>

                        <td>{cobranca.descricao}</td>
                        <td>{formatarMoeda(cobranca.valor)}</td>
                        <td>{formatarData(cobranca.vencimento)}</td>

                        <td>
                          <span
                            className={`status ${cobranca.situacao.toLowerCase()}`}
                          >
                            {cobranca.situacao}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {cobrancasRecentes.length === 0 && (
                      <tr>
                        <td colSpan="5" className="tabela-vazia">
                          Nenhuma cobrança cadastrada.
                        </td>
                      </tr>
                    )}
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
                type="button"
                className="botao-principal"
                onClick={abrirFormularioCliente}
              >
                Novo cliente
              </button>
            </header>

            {mensagem.texto && (
              <div
                className={`mensagem-formulario ${mensagem.tipo}`}
              >
                {mensagem.texto}
              </div>
            )}

            {mostrarFormularioCliente && (
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
                  {clientes.length}{' '}
                  {clientes.length === 1
                    ? 'cliente'
                    : 'clientes'}
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
                              onClick={() => verCliente(cliente)}
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

                    {clientes.length === 0 && (
                      <tr>
                        <td colSpan="6" className="tabela-vazia">
                          Nenhum cliente cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {telaAtual === 'cobrancas' && (
          <>
            <header className="cabecalho">
              <div>
                <p className="saudacao">Gerenciamento</p>
                <h2>Cobranças</h2>
              </div>

              <button
                type="button"
                className="botao-principal"
                onClick={abrirFormularioCobranca}
              >
                Nova cobrança
              </button>
            </header>

            {mensagem.texto && (
              <div
                className={`mensagem-formulario ${mensagem.tipo}`}
              >
                {mensagem.texto}
              </div>
            )}

            {mostrarFormularioCobranca && (
              <section className="formulario-card">
                <div className="formulario-cabecalho">
                  <h3>
                    {cobrancaEmEdicao !== null
                      ? 'Editar cobrança'
                      : 'Cadastrar cobrança'}
                  </h3>

                  <p>
                    {cobrancaEmEdicao !== null
                      ? 'Altere os dados da cobrança selecionada.'
                      : 'Selecione o cliente e informe os dados da cobrança.'}
                  </p>
                </div>

                {clientes.length === 0 ? (
                  <div className="mensagem-formulario erro">
                    Cadastre pelo menos um cliente antes de criar uma
                    cobrança.
                  </div>
                ) : (
                  <form onSubmit={salvarCobranca}>
                    <div className="formulario-grid">
                      <label className="campo-formulario">
                        <span>Cliente</span>

                        <select
                          name="clienteId"
                          value={novaCobranca.clienteId}
                          onChange={atualizarCampoCobranca}
                          required
                        >
                          <option value="">
                            Selecione um cliente
                          </option>

                          {clientes.map((cliente) => (
                            <option
                              key={cliente.id}
                              value={cliente.id}
                            >
                              {cliente.nome}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="campo-formulario">
                        <span>Descrição</span>

                        <input
                          type="text"
                          name="descricao"
                          value={novaCobranca.descricao}
                          onChange={atualizarCampoCobranca}
                          placeholder="Ex.: Mensalidade de agosto"
                          required
                        />
                      </label>

                      <label className="campo-formulario">
                        <span>Valor em reais</span>

                        <input
                          type="number"
                          name="valor"
                          value={novaCobranca.valor}
                          onChange={atualizarCampoCobranca}
                          placeholder="350,00"
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </label>

                      <label className="campo-formulario">
                        <span>Data de vencimento</span>

                        <input
                          type="date"
                          name="vencimento"
                          value={novaCobranca.vencimento}
                          onChange={atualizarCampoCobranca}
                          required
                        />
                      </label>

                      <label className="campo-formulario">
                        <span>Situação</span>

                        <select
                          name="situacao"
                          value={novaCobranca.situacao}
                          onChange={atualizarCampoCobranca}
                          required
                        >
                          <option value="Pendente">
                            Pendente
                          </option>

                          <option value="Paga">Paga</option>

                          <option value="Vencida">
                            Vencida
                          </option>
                        </select>
                      </label>
                    </div>

                    <div className="formulario-acoes">
                      <button
                        type="button"
                        className="botao-cancelar"
                        onClick={fecharFormularioCobranca}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="botao-principal"
                      >
                        {cobrancaEmEdicao !== null
                          ? 'Salvar alterações'
                          : 'Salvar cobrança'}
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}

            <section className="secao-tabela">
              <div className="titulo-secao">
                <div>
                  <h3>Cobranças cadastradas</h3>
                  <p>
                    Consulte as cobranças registradas no sistema.
                  </p>
                </div>

                <span className="contador-clientes">
                  {cobrancas.length}{' '}
                  {cobrancas.length === 1
                    ? 'cobrança'
                    : 'cobranças'}
                </span>
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
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cobrancasOrdenadas.map((cobranca) => (
                      <tr key={cobranca.id}>
                        <td>
                          <strong>
                            {buscarNomeCliente(cobranca.clienteId)}
                          </strong>
                        </td>

                        <td>{cobranca.descricao}</td>
                        <td>{formatarMoeda(cobranca.valor)}</td>
                        <td>{formatarData(cobranca.vencimento)}</td>

                        <td>
                          <span
                            className={`status ${cobranca.situacao.toLowerCase()}`}
                          >
                            {cobranca.situacao}
                          </span>
                        </td>

                        <td>
                          <div className="acoes">
                            <button
                              type="button"
                              className="botao-acao"
                              onClick={() =>
                                editarCobranca(cobranca)
                              }
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="botao-acao botao-excluir"
                              onClick={() =>
                                excluirCobranca(cobranca)
                              }
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {cobrancas.length === 0 && (
                      <tr>
                        <td colSpan="6" className="tabela-vazia">
                          Nenhuma cobrança cadastrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {telaAtual === 'pagamentos' && (
          <>
            <header className="cabecalho">
              <div>
                <p className="saudacao">Movimentações</p>
                <h2>Pagamentos</h2>
              </div>

              <button
                type="button"
                className="botao-principal"
                onClick={abrirFormularioPagamento}
              >
                Registrar pagamento
              </button>
            </header>

            {mensagem.texto && (
              <div
                className={`mensagem-formulario ${mensagem.tipo}`}
              >
                {mensagem.texto}
              </div>
            )}

            {mostrarFormularioPagamento && (
              <section className="formulario-card">
                <div className="formulario-cabecalho">
                  <h3>Registrar pagamento</h3>

                  <p>
                    Selecione uma cobrança pendente ou vencida.
                  </p>
                </div>

                {cobrancasDisponiveisPagamento.length === 0 ? (
                  <div className="mensagem-formulario erro">
                    Não existem cobranças disponíveis para pagamento.
                  </div>
                ) : (
                  <form onSubmit={salvarPagamento}>
                    <div className="formulario-grid">
                      <label className="campo-formulario">
                        <span>Cobrança</span>

                        <select
                          name="cobrancaId"
                          value={novoPagamento.cobrancaId}
                          onChange={atualizarCampoPagamento}
                          required
                        >
                          <option value="">
                            Selecione uma cobrança
                          </option>

                          {cobrancasDisponiveisPagamento.map(
                            (cobranca) => (
                              <option
                                key={cobranca.id}
                                value={cobranca.id}
                              >
                                {buscarNomeCliente(
                                  cobranca.clienteId,
                                )}{' '}
                                — {cobranca.descricao} —{' '}
                                {formatarMoeda(cobranca.valor)}
                              </option>
                            ),
                          )}
                        </select>
                      </label>

                      <label className="campo-formulario">
                        <span>Data do pagamento</span>

                        <input
                          type="date"
                          name="dataPagamento"
                          value={novoPagamento.dataPagamento}
                          onChange={atualizarCampoPagamento}
                          required
                        />
                      </label>

                      <label className="campo-formulario">
                        <span>Forma de pagamento</span>

                        <select
                          name="formaPagamento"
                          value={novoPagamento.formaPagamento}
                          onChange={atualizarCampoPagamento}
                          required
                        >
                          <option value="Pix">Pix</option>
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="Cartão de crédito">
                            Cartão de crédito
                          </option>
                          <option value="Cartão de débito">
                            Cartão de débito
                          </option>
                          <option value="Transferência">
                            Transferência
                          </option>
                          <option value="Boleto">Boleto</option>
                        </select>
                      </label>

                      <label className="campo-formulario">
                        <span>Observação</span>

                        <input
                          type="text"
                          name="observacao"
                          value={novoPagamento.observacao}
                          onChange={atualizarCampoPagamento}
                          placeholder="Ex.: Pagamento integral"
                        />
                      </label>
                    </div>

                    {cobrancaSelecionadaPagamento && (
                      <div
                        className="detalhe-item"
                        style={{ marginTop: '20px' }}
                      >
                        <span>Valor que será recebido</span>

                        <strong>
                          {formatarMoeda(
                            cobrancaSelecionadaPagamento.valor,
                          )}
                        </strong>
                      </div>
                    )}

                    <div className="formulario-acoes">
                      <button
                        type="button"
                        className="botao-cancelar"
                        onClick={fecharFormularioPagamento}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="botao-principal"
                      >
                        Confirmar pagamento
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}

            <section className="secao-tabela">
              <div className="titulo-secao">
                <div>
                  <h3>Pagamentos registrados</h3>

                  <p>
                    Consulte os recebimentos registrados no sistema.
                  </p>
                </div>

                <span className="contador-clientes">
                  {pagamentos.length}{' '}
                  {pagamentos.length === 1
                    ? 'pagamento'
                    : 'pagamentos'}
                </span>
              </div>

              <div className="tabela-container">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Cobrança</th>
                      <th>Valor</th>
                      <th>Data</th>
                      <th>Forma</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagamentosOrdenados.map((pagamento) => (
                      <tr key={pagamento.id}>
                        <td>
                          <strong>
                            {buscarNomeCliente(
                              pagamento.clienteId,
                            )}
                          </strong>
                        </td>

                        <td>
                          {buscarDescricaoCobranca(
                            pagamento.cobrancaId,
                          )}
                        </td>

                        <td>{formatarMoeda(pagamento.valor)}</td>

                        <td>
                          {formatarData(
                            pagamento.dataPagamento,
                          )}
                        </td>

                        <td>{pagamento.formaPagamento}</td>

                        <td>
                          <button
                            type="button"
                            className="botao-acao botao-excluir"
                            onClick={() =>
                              estornarPagamento(pagamento)
                            }
                          >
                            Estornar
                          </button>
                        </td>
                      </tr>
                    ))}

                    {pagamentos.length === 0 && (
                      <tr>
                        <td colSpan="6" className="tabela-vazia">
                          Nenhum pagamento registrado.
                        </td>
                      </tr>
                    )}
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
                type="button"
                className="botao-principal"
                onClick={() => mudarTela('painel')}
              >
                Voltar ao painel
              </button>
            </section>
          </>
        )}
      </main>

      {clienteSelecionado && (
        <div
          className="modal-fundo"
          onClick={fecharDetalhesCliente}
        >
          <section
            className="modal-cliente"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="modal-cabecalho">
              <div>
                <p className="modal-subtitulo">
                  Detalhes do cliente
                </p>

                <h3>{clienteSelecionado.nome}</h3>
              </div>

              <button
                type="button"
                className="botao-fechar-modal"
                onClick={fecharDetalhesCliente}
                aria-label="Fechar detalhes do cliente"
              >
                ×
              </button>
            </div>

            <div className="detalhes-cliente">
              <div className="detalhe-item">
                <span>Código do cliente</span>
                <strong>#{clienteSelecionado.id}</strong>
              </div>

              <div className="detalhe-item">
                <span>Nome completo</span>
                <strong>{clienteSelecionado.nome}</strong>
              </div>

              <div className="detalhe-item">
                <span>CPF ou CNPJ</span>
                <strong>{clienteSelecionado.documento}</strong>
              </div>

              <div className="detalhe-item">
                <span>Telefone</span>
                <strong>{clienteSelecionado.telefone}</strong>
              </div>

              <div className="detalhe-item">
                <span>E-mail</span>
                <strong>{clienteSelecionado.email}</strong>
              </div>

              <div className="detalhe-item">
                <span>Situação</span>

                <span
                  className={`status ${clienteSelecionado.situacao.toLowerCase()}`}
                >
                  {clienteSelecionado.situacao}
                </span>
              </div>
            </div>

            <div className="modal-acoes">
              <button
                type="button"
                className="botao-cancelar"
                onClick={fecharDetalhesCliente}
              >
                Fechar
              </button>

              <button
                type="button"
                className="botao-principal"
                onClick={editarClienteSelecionado}
              >
                Editar cliente
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default App