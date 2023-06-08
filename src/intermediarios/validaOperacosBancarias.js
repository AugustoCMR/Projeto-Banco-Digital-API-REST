const {buscarContaBancaria} = require("../controladores/contaBancaria");
const {verificaSenhaConta} = require("./senha");

const validaPropriedades = (propriedades, objeto) => {

    for(let propriedade of propriedades) {
        if(!objeto[propriedade]) {
            return propriedade;
        } 
    }

    return null;
}

const validaDeposito = (req, res, next) => {
    const {numero, valor} = req.body;

    const propriedades = ["numero", "valor"];
    const contaEncontrada = buscarContaBancaria(numero);
    const validadorPropriedades = validaPropriedades(propriedades, req.body);

    if(validadorPropriedades) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: ${validadorPropriedades} é obrigatório`});
    }

    if(!contaEncontrada) {
        return res.status(404).json({"mensagem": `Ocorreu um erro: conta não encontrada.`})
    }

    if(isNaN(valor)) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: o depósito deve conter apenas números`});
    } 

    if(valor <= 0) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: valor do deposito não pode ser negativo ou zerado.`});
    } 

    next();
}

const validaSaque = (req, res, next) => {
    const {numero,valor, senha} = req.body;

    const propriedades = ["numero", "valor", "senha"];
    const contaEncontrada = buscarContaBancaria(numero);

    if(!contaEncontrada) {
        return res.status(404).json({"mensagem": `Ocorreu um erro: conta não encontrada.`})
    }
    
    const validadorPropriedades = validaPropriedades(propriedades, req.body);

    if(validadorPropriedades) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: ${validadorPropriedades} é obrigatório`});
    }

    const senhaVerificada = verificaSenhaConta(contaEncontrada, senha);

   
    if(!senhaVerificada){
        return res.status(400).json({"mensagem": `Ocorreu um erro: senha incorreta.`})
   
    }

    if(isNaN(valor)) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: o depósito deve conter apenas números`});
    } 
    
    if(contaEncontrada.saldo < valor) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: saldo insuficiente para saque.`});
    }

    next();
}

const validaTransferencia = (req, res, next) => {
    const {numeroOrigem, senha, valor, numeroDestino} = req.body;
    const propriedades = ["valor", "senha"];

    const contaOrigem = buscarContaBancaria(numeroOrigem);
    const contaDestino = buscarContaBancaria(numeroDestino);

    if(!contaOrigem || !contaDestino) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: as contas de origem e destino são obrigatórias, verifique também se os números das contas estão corretos.`});
    }


    const senhaVerificada = verificaSenhaConta(contaOrigem, senha);
    const validadorPropriedades = validaPropriedades(propriedades, req.body);

    
    if(validadorPropriedades) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: ${validadorPropriedades} é obrigatório`});
    }

    if(numeroOrigem === numeroDestino) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: transferência inválida`});
    }

    if(!senhaVerificada){
        return res.status(400).json({"mensagem": `Ocorreu um erro: senha incorreta.`}) 
    }

    if(isNaN(valor)) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: o depósito deve conter apenas números`});
    } 

    if(contaOrigem.saldo < valor) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: saldo insuficiente para transferência.`});
    }

    next();
}

const validaOpcaoSaldo = (req, res, next) => {
    const {numero_conta, senha} = req.query;
    const propriedades = ["numero_conta", "senha"];

    const contaEncontrada = buscarContaBancaria(numero_conta)

    if(!contaEncontrada) {
        return res.status(404).json({"mensagem": `Ocorreu um erro: conta não encontrada.`})
    }

    
    const validadorPropriedades = validaPropriedades(propriedades, req.query);

    if(validadorPropriedades) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: ${validadorPropriedades} é obrigatório`});
    }

    const senhaVerificada = verificaSenhaConta(contaEncontrada, senha);

   if(!senhaVerificada) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: senha incorreta.`})
   }

    next();
}

const validaExtrato = (req, res, next) => {
    const {numero_conta, senha} = req.query;
    const propriedades = ["numero_conta", "senha"];

    const contaEncontrada = buscarContaBancaria(numero_conta);

    if(!contaEncontrada) {
        return res.status(404).json({"mensagem": `Ocorreu um erro: conta não encontrada.`})
    }

    const validadorPropriedades = validaPropriedades(propriedades, req.query);

    if(validadorPropriedades) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: ${validadorPropriedades} é obrigatório`});
    }

    const senhaVerificada = verificaSenhaConta(contaEncontrada, senha);
    
    if(!senhaVerificada){
        return res.status(400).json({"mensagem": `Ocorreu um erro: senha incorreta.`}); 
    }

    next();
}

module.exports = {
    validaDeposito,
    validaSaque, 
    validaTransferencia,
    validaOpcaoSaldo,
    validaExtrato 
}