const verificaSenha = (req, res, next) => {
    const senha = req.query.senha_banco;

  
    if(!senha) {
        return res.status(400).json({"mensagem": "Ocorreu um erro: senha não informada."})
    }

    if(senha !== "Cubos123Bank") {
        return res.status(400).json({"mensagem": "Senha inválida"});
    }

    next();
}

const verificaSenhaConta = (conta, senhaDigitada) => {

    if(conta.usuario.senha !== senhaDigitada){
       return false
    }

    return true;
}

module.exports = {
    verificaSenha,
    verificaSenhaConta
}

