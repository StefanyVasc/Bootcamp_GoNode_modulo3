const moongose = require('mongoose')
const bcrypt = require('bcryptjs')

/* Criando o userSchema, no mongoDB não possui tabelas, por isso não tem a parte de migrations (pois cada dado pode ter formatos diferentes)tr
Os dados são salvos de forma não estruturada, é salvo por completo (não coluna//dado), sendo assim quando for necessário alterar o schema é só
adicionar ou retirar o campo que é desejado
*/

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

module.exports = moongose.model('User', UserSchema)
