const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  //取得表單資料，並運用解構複值
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '星號欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查是否已註冊過
  // 因為名字非必填，所以用email做條件檢視
  User.findOne({ email }).then(user => {
    // 如果user資料是true，代表註冊過
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10) //產生鹽，複雜係數為10
      .then(salt => bcrypt.hash(password, salt)) //有了鹽之後，就跟密碼雜湊
      .then(hash => User.create({
        name,
        email,
        password: hash //加了鹽的雜湊值取代本來的密碼
      }))
      .then(() => res.redirect('/'))
      .catch(err => {
        console.log(err)
        res.render('error', { errorMsg: err.message })
      })
  })
    .catch(err => {
      console.log(err)
      res.render('error', { errorMsg: err.message })
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router