const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const { Strategy: LocalStrategy } = require('passport-local');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
    }, async (email, password, done) => { // done(서버실패, 성공유저, 로직실패)
        try {
            const exUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
            const user = await sequelize.query(exUserQuery, { type: QueryTypes.SELECT });
            if (user.length > 0) {
                if (user[0].password === null) {
                    return done(null, false, {message: 'SNS계정으로 가입된 계정입니다.'});
                }
                const result = await bcrypt.compare(password, user[0].password);
                if (result) {
                    done(null, user[0]);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }))
}


// 카카오로 회원가입 후 로컬에서 로그인하려고 할때 에러처리가 안되어 있음.
// 카카오로 회원가입 시 비밀번호가 null이기 때문
