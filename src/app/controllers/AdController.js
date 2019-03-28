const Ad = require('../models/Ad')

class AdController {
  async index (req, res) {
    /* para listagem */
    const filters = {} // armazenando os filtros

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price$gte = req.query.price_min // gte é uma sigla pra greater than
      }

      if (req.query.price_max) {
        filters.price$lte = req.query.price_max // lte é uma sigla para less than
      }
    }

    if (req.query.title) {
      /* RegExp é uma expressão regular para ver se a palavra está em qualquer lugar do titulo
      e não o titulo é aquela palavra.
      Esse 'i' é para transformar a palavra em casesensitive */
      filters.title = new RegExp(req.query.title, 'i')
    }

    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'],
      sort: '-createdAt'
    })
    return res.json(ads)
  }
  async show (req, res) {
    /* para mostrar um único ad */
    const ad = await Ad.findById(req.params.id)
    return res.json(ad)
  }
  async store (req, res) {
    /* para criar um ad */
    const ad = await Ad.create({ ...req.body, author: req.userId })
    return res.json(ad)
  }
  async update (req, res) {
    /* para editar um ad */
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    return res.json(ad)
  }
  async destroy (req, res) {
    /* para deletar um ad */
    await Ad.findByIdAndDelete(req.params.id)
    return res.send()
  }
}

module.exports = new AdController()
