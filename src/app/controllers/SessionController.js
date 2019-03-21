/* A autenticação quando se usa REST é diferente, NÃO terá mais uma sessão(COOKIE) para salvar persistir os dados.
Os dados serão persistidos por meio de um Token(JWT [ json web token]).
Esse token ele é gerado a partir da verificação de usuário e senha corretos. Quando esse token é devolvido para o
front-end ele precisará ser utilizado para todas as requisições subsequentes. */
const User = require('../models/User')

class SessionController {
  // o metodo store faz o papel do login
  async store (req, res) {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    // se não encontrar um usuário aqui dentro significa que o usuaŕio não existe.

    if (!user) {
      return res.status(400).json({ error: 'User not found ' })
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Invalid password' })
    }
    return res.json({ user })
  }
}

module.exports = new SessionController()
