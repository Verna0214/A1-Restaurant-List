const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// render new page
router.get('/new', (req, res) => {
  return res.render('new')
})

// create new data
router.post('/', (req, res) => {
  const userId = req.user._id
  req.body.userId = userId
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

// 瀏覽特定資料畫面
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

// edit data page
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

// edit data
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findByIdAndUpdate({ _id, userId}, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

// delete data
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

module.exports = router