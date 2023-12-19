const passport = require('passport');
const { Strategy: KakaoStrategy} = require('passport-kakao');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log('kakao profile', profile);
        try {
            // 이메일이 있는지 확인하고 있으면 로그인 // 없으면 회원가입
            const query = `SELECT * FROM users WHERE snsId = '${profile.id}' AND provider='kakao'`;
            const exUser = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (exUser[0]) {
                done(null, exUser[0]);
            } else {
                const query = `SELECT * FROM users WHERE email = '${profile._json?.kakao_account?.email}'`
                const checkUser = await sequelize.query(query, { type: QueryTypes.SELECT });
                if (checkUser[0].email === profile._json?.kakao_account?.email) {
                    return done(null, checkUser[0], { message: checkUser[0].email });
                }
                const registerQuery = `INSERT INTO users (email, nick, snsId, provider) VALUES ('${profile._json?.kakao_account?.email}', '${profile.displayName}', '${profile.id}', 'kakao')`;
                const newUser = await sequelize.query(registerQuery, { type: QueryTypes.INSERT });
                done(null, newUser[0]);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}


