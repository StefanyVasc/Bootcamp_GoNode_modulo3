const User = require('../models/User')

class UserController {
  async store (req, res) {
    /* o mongoDB não vai fazer a validação, no máximo ele retorna um erro falando que o campo
     é único na tabela, por isso vamos verificar se já não existe um usuário com esse mesmo email */
    const { email } = req.body
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' })
    }
    const user = await User.create(req.body)
    return res.json(user)
  }
}

module.exports = new UserController()
