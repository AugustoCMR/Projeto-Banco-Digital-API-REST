const contasBancarias = require("../bancodedados");
const { isMatch } = require("date-fns");

const validaNumeroConta = (req, res, next) => {

    const { numero } = req.params;

    const contaEncontrada = contasBancarias.contas.find((conta) => {
        return conta.numero === Number(numero);
    })
    
    if(!contaEncontrada) {
        return res.status(404).json({"mensagem": `Ocorreu um erro: conta não encontrada`});
    }

    next();
}

const validaData = (data) => {

    const result = isMatch(data, "yyyy'-'MM'-'dd");

    if(result) {
        return true;
    }

    return false;
}

const validaListagem = (req, res, next) => {

    const contas = contasBancarias.contas

    if(contas.length === 0) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: Não existe contas cadastradas.`});
    }

    next();
}

const validaCadastro = (req, res, next) => {
    
    const propriedadesObrigatórios = ["nome", "cpf", "email", "data_nascimento", "telefone", "senha"];

    const {data_nascimento} = req.body;

    const validadorData = validaData(data_nascimento);

    for(const propriedade of propriedadesObrigatórios) {
        if(!req.body[propriedade]) {
            
            return res.status(400).json({"mensagem": `Ocorreu um erro: ${propriedade} é obrigatório`});
        }
    }

    if(!validadorData) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: data inválida utilize o padrão (yyyy-MM-dd)`});
    }

    next();
}

const validaCPFeEmail = (req, res, next) => {
    let {cpf, email} = req.body;

    if(cpf) {

        if(cpf.length !== 11 || cpf.includes(".") || isNaN(cpf)) {
            return res.status(400).json({"mensagem": "Ocorreu um erro: CPF inválido."});
        }

        const buscaCPF = contasBancarias.contas.find(conta => {
            return conta.usuario.cpf === cpf;
        })
    
        if(buscaCPF) {
            return res.status(400).json({"mensagem": "Ocorreu um erro: CPF informado já existe."});
        }
    }

    const buscaEmail = contasBancarias.contas.find((conta) => {
        return email === conta.usuario.email;
    })

    if(buscaEmail) {
        return res.status(400).json({"mensagem": " Ocorreu um erro: Email informado já existe."});
    }

    next();
}

const validaAtualizacaoConta = (req, res, next) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const propriedades = [nome, cpf, data_nascimento, telefone, email, senha];

    if(!propriedades.some(propriedade => propriedade)){
        return res.status(400).json({"mensagem": "nenhum campo foi preenchido para alteração."});
    }

    if(data_nascimento) {
        const validadorData = validaData(data_nascimento);

        if(!validadorData) {
            return res.status(400).json({"mensagem": `Ocorreu um erro: data inválida utilize o padrão (yyyy-MM-dd)`});
        }
    }

      
    next();   
}

const validaDeletarConta = (req, res, next) => {

    const { numero } = req.params;

    const contaEncontrada = contasBancarias.contas.find((conta) => {
        return conta.numero === Number(numero);
    })

    if(contaEncontrada.saldo > 0) {
        return res.status(400).json({"mensagem": `Ocorreu um erro: o saldo da conta deve estar zerado.`});
    }

    next();
}

module.exports = {
    validaListagem,
    validaCPFeEmail,
    validaCadastro,
    validaAtualizacaoConta,
    validaDeletarConta,
    validaNumeroConta
}