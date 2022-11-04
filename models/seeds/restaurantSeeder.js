const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantData = require('../../restaurant.json').results
const db = require('../../config/mongoose')
const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  Promise.all(
    SEED_USER.map((user, userIndex) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(user.password, salt))
        .then((hash) => {
          return User.create({
            name: user.name,
            email: user.email,
            password: hash
          })
        })
        .then((user) => {
          const usedRestaurant = []
          restaurantData.forEach((restaurant, restaurantIndex) => {
            if (restaurantIndex >= userIndex * 3 && restaurantIndex < (userIndex + 1) * 3) {
              restaurant.userId = user._id
              usedRestaurant.push(restaurant)
            }
          })
          return Restaurant.create(usedRestaurant)
        })
    })
  )
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch((error) => {
      console.error(error)
      res.render('error')
    })
})
