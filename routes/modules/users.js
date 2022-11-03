const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req,res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  //取得表單資料，並運用解構複值
  const { name, email, password, confirmPassword } = req.body
  // 檢查是否已註冊過
  // 因為名字非必填，所以用email做條件檢視
  User.findOne({ email }).then(user => {
    // 如果user資料是true，代表註冊過
    if (user) {
      console.log('User already exists.')
      res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(err => {
          console.log(err)
          res.render('error', { errorMsg: err.message })
        })
    }
  })
  .catch(err => {
    console.log(err)
    res.render('error', { errorMsg: err.message })
  })
})

module.exports = router