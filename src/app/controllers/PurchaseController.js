const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body
    const purchaseAd = await Ad.findById(ad).populate('author') // informações do anuncio que ele quer fazer a intenção de compra
    const user = await User.findById(req.userId) // informações do usuário logado

    await Mail.sendMail({
      from: '"Stefany Sá" <stefany.vasc.sa@gmail.com>',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra: ${purchaseAd.title}`,
      template: 'purchase',
      context: { user, content, ad: purchaseAd }
    })
    return res.send()
  }
}

module.exports = new PurchaseController()
