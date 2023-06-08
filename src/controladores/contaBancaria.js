const contasBancarias = require("../bancodedados");
const { validaAtualizacaoConta } = require("../intermediarios/validaConta");

const buscarContaBancaria = (numero) => {
  const contaEncontrada = contasBancarias.contas.find((conta) => {
    return conta.numero === Number(numero);
  });

  return contaEncontrada;
};

const listarContas = (req, res) => {
  const contas = contasBancarias.contas;

  return res.status(200).json(contas);
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  let ultimoIndice = contasBancarias.contas.length - 1;

  let numeroConta =
    contasBancarias.contas.length > 0
      ? contasBancarias.contas[ultimoIndice].numero + 1
      : 1;

  const conta = {
    numero: numeroConta,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  contasBancarias.contas.push(conta);

  return res.status(201).json(conta);
};

const atualizarConta = (req, res) => {

    const { numero } = req.params;

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = buscarContaBancaria(numero);

    const propriedades = [
        { nomePropriedade: "nome", valor: nome },
        { nomePropriedade: "cpf", valor: cpf },
        { nomePropriedade: "data_nascimento", valor: data_nascimento },
        { nomePropriedade: "telefone", valor: telefone },
        { nomePropriedade: "email", valor: email },
        { nomePropriedade: "senha", valor: senha },
    ];

    for (let propriedade of propriedades) {
      if (propriedade.valor) {
        conta.usuario[propriedade.nomePropriedade] = propriedade.valor;
      }
    }

    return res.status(200).json({ mensagem: `Conta atualizada com sucesso!` });
};

const deletarConta = (req, res) => {
  const { numero } = req.params;

  const contaEncontrada = contasBancarias.contas.findIndex((conta) => {
    return conta.numero === Number(numero);
  })
  
  contasBancarias.contas.splice(contaEncontrada, 1);

  return res.status(200).json({ mensagem: "Conta excluída com sucesso!" });
};

module.exports = {
  listarContas,
  criarConta,
  atualizarConta,
  deletarConta,
  buscarContaBancaria,
};
