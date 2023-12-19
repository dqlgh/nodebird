const bcrypt = require('bcrypt');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const passport = require('passport');

exports.join = async (req, res, next) => {
    const { email, nick, password }  = req.body;
    try {
        const exUserQuery = `SELECT * FROM users WHERE email = '${email}'`
        const exUser = await sequelize.query(exUserQuery, { type: QueryTypes.SELECT })
        if (exUser.length > 0) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        const joinQuery = `INSERT INTO users (email, nick, password) VALUES ('${email}', '${nick}', '${hash}')`
        const user = await sequelize.query(joinQuery, { type: QueryTypes.INSERT });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// POST /auth/login
exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) { // 서버 실패
            console.error(authError);
            return next(authError);
        }
        if (!user) { // 로직실패
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { // 로그인성공
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/')
        })
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    })
};

