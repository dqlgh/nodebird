const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);


// auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?loginError=카카오로그인실패',
}), (req, res) => {
    console.log('kakao callback req :', req.authInfo)
    if (req.authInfo.message) {
        return res.redirect('/test');
    }
    res.redirect('/');
});



module.exports = router;

