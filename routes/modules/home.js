const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId }) // 取出Restaurant model裡的資料
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword
  return Restaurant.find({ userId })
    .lean()
    .then(restaurants => {
      const restaurantsData = restaurants.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()) || item.category.includes(keyword))
      res.render('index', { restaurants: restaurantsData, keyword: keyword })
    })
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

module.exports = router