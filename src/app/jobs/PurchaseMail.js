// ações executadas atravez da fila

const Mail = require('../services/Mail')

class PurchaseMail {
  get key () {
    return 'PurchaseMail'
  }
  async handle (job, done) {
    const { ad, user, content } = job.data
    // método handle envia o email
    await Mail.sendMail({
      from: '"Stefany Sá" <stefany.vasc.sa@gmail.com>',
      to: ad.author.email,
      subject: `Solicitação de compra: ${ad.title}`,
      template: 'purchase',
      context: { user, content, ad: ad }
    })
    return done()
  }
}

module.exports = new PurchaseMail()
