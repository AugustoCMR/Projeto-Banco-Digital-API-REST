const express = require("express");
const rotas = express.Router();

const {listarContas, criarConta, atualizarConta, deletarConta} = require("./controladores/contaBancaria");
const {verificaSenha, verificaSenhaConta} = require("./intermediarios/senha");
const {validaListagem, validaCPFeEmail, validaCadastro, validaAtualizacaoConta, validaNumeroConta, validaDeletarConta} = require("./intermediarios/validaConta");
const {depositar, sacar, transferir, saldo, extrato} = require("./controladores/operacosBancarias");
const {validaSaque, validaDeposito, validaTransferencia, validaOpcaoSaldo, validaExtrato} = require("./intermediarios/validaOperacosBancarias");
 
rotas.get("/contas", validaListagem, verificaSenha, listarContas);
rotas.post("/contas", validaCadastro, validaCPFeEmail,  criarConta);
rotas.put("/contas/:numero/usuario", validaNumeroConta, validaCPFeEmail, validaAtualizacaoConta, atualizarConta);
rotas.delete("/contas/:numero", validaNumeroConta, validaDeletarConta,deletarConta);

rotas.post("/transacoes/depositar", validaDeposito, depositar);
rotas.post("/transacoes/sacar", validaSaque, sacar);
rotas.post("/transacoes/transferir", validaTransferencia, transferir);
rotas.get("/contas/saldo", validaOpcaoSaldo, saldo);
rotas.get("/contas/extrato", validaExtrato, extrato);

module.exports = rotas