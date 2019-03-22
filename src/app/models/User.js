const moongose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') // cria os tokens e verifica se os tokens estão validados

/* Criando o userSchema, no mongoDB não possui tabelas, por isso não tem a parte de migrations (pois cada dado pode ter formatos diferentes)tr
Os dados são salvos de forma não estruturada, é salvo por completo (não coluna//dado), sendo assim quando for necessário alterar o schema é só
adicionar ou retirar o campo que é desejado
*/

const authConfig = require('../../config/auth')

const UserSchema = new moongose.Schema({
  name: {
    type: String, // pode usar o tipos nativos do JS, pois todos os dados que são salvos dentro do mongo são dados nativos
    required: true // para ser obrigatório
  },
  email: {
    type: String,
    required: true,
    unique: true, // é um dado único para cada cadastro
    lowercase: true // formatando o email para caixa baixa
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // definindo a data atual que o registro foi salvo
  }
})

/* Usar hooks para escutar as açoes do usuário para poder manipular os dados */

UserSchema.pre('save', async function (next) {
  // hook antes da ação
  if (!this.isModified('password')) {
    // verificando se a senha não foi modificada
    return next()
  }
  // se a senha foi alterada realmente, fazendo a criptografia da senha
  this.password = await bcrypt.hash(this.password, 8)
})

// novos métodos para ajudar na comparação, cada instância do usuário terá.
UserSchema.methods = {
  compareHash (password) {
    /* esse metodo vai receber uma senha criptografada que será comparada com a senha do usuário */
    return bcrypt.compare(password, this.password)
  }
}

// retornando o token para o frontpara ele ser usado nas próximas requisições para saber se o usuário se autenticou na aplicação
// esse método será estático pois não será disparado por uma instância, será disparado diretamente do model User
UserSchema.statics = {
  generateToken ({ id }) {
    // generateToken recebe um usuário que eu quero pegar apenas o ID
    return jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.ttl }) // pode passar quantas informações do usuário quiser, elas ficam criptografadas dentro do token
  }
}
module.exports = moongose.model('User', UserSchema)
