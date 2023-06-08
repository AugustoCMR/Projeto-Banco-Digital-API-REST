const {buscarContaBancaria} = require("./contaBancaria")
const contasBancarias = require("../bancodedados");
const { format } = require("date-fns");

const dataFormatada = (date) => {

    return format(date, "yyyy'-'MM'-'dd HH:mm:ss");
}

const depositar = (req, res) => {
    const { numero, valor } = req.body;

    const contaEncontrada = buscarContaBancaria(numero);

    contaEncontrada.saldo += Number(valor);

    const registroDeposito = {
        data: dataFormatada(new Date()),
        numero_conta: numero,
        valor: Number(valor)
    }

    contasBancarias.depositos.push(registroDeposito);

    res.status(200).json({"mensagem": "Depósito realizado com sucesso!"});
}

const sacar = (req, res) => {
    const {numero, valor} = req.body;

    const contaEncontrada = buscarContaBancaria(numero);
  
    contaEncontrada.saldo -= Number(valor);
    
    const registroSaque = {
        data: dataFormatada(new Date()),
        numero_conta: numero,
        valor: Number(valor)
    }

    contasBancarias.saques.push(registroSaque);

    res.status(200).json({"mensagem": "Saque realizado com sucesso!"});
}

const transferir = (req, res) => {
    const {numeroOrigem, valor, numeroDestino} = req.body;

    const contaEncontradaOrigem = contasBancarias.contas.find((conta) => {
        return conta.numero === Number(numeroOrigem);
    })

    const contaEncontradaDestino = contasBancarias.contas.find((conta) => {
        return conta.numero === Number(numeroDestino);
    })

    contaEncontradaOrigem.saldo -= Number(valor);
    contaEncontradaDestino.saldo += Number(valor);
    
    const registroTransferencia = {
        data: dataFormatada(new Date()),
        numero_conta_origem: numeroOrigem,
        numero_conta_destino: numeroDestino,
        valor: Number(valor)
    }

    contasBancarias.transferencias.push(registroTransferencia);

    return res.status(200).json({"mensagem": "Transferência realizada com sucesso!"});
}

const saldo = (req, res) => {
    const {numero_conta} = req.query;

    const contaEncontrada = contasBancarias.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    const saldo = contaEncontrada.saldo;

    res.status(200).json({saldo});
}

const extrato = (req, res) => {
    const {numero_conta} = req.query;

    const transferenciasEnviadas = contasBancarias.transferencias.filter(transferencia => {
        return transferencia.numero_conta_origem === numero_conta;
    })

    const transferenciasRecebidas = contasBancarias.transferencias.filter(transferencia => {
        return transferencia.numero_conta_destino === numero_conta;
    })

    const depositos = contasBancarias.depositos.filter(deposito => {
        return deposito.numero_conta === numero_conta;
    })

    const saques = contasBancarias.saques.filter(saque => {
        return saque.numero_conta === numero_conta;
    })

    let extratoMensagem = {
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciasRecebidas 
    } 

    res.status(200).json(extratoMensagem);
}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}