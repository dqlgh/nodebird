const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('serializeUser', user)
        done(null, user.id);  // user의 id만 추출
    });

    // 세션 { 1231232132: 1 } => (세션쿠키: 유저아이디) -> 메모리에 저장돼요.
    passport.deserializeUser((id, done) => {
        User.findOne({ 
            where: { id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings'
                },
            ]
        })
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err));
    });


    // const cache = {};
    // const cacheTTL = 60 * 60 * 1000; // 캐시의 유효시간 (1시간)
    // passport.deserializeUser((id, done) => {

    //     User.findOne({ 
    //         where: { id },
    //         include: [
    //             {
    //                 model: User,
    //                 attributes: ['id', 'nick'],
    //                 as: 'Followers',
    //             },
    //             {
    //                 model: User,
    //                 attributes: ['id', 'nick'],
    //                 as: 'Followings'
    //             }
    //         ]
    //     })
    //     .then((user) => {
    //         done(null, user);
    //     })
    //     .catch(err => done(err));
    // });







    // passport.deserializeUser(async (id, done) => {
    //     try {
    //         const query = `SELECT * FROM users WHERE id = ${id}`;
    //         const queryString = `SELECT U.*, f.followingId AS followingId, f.followingNick, f.followerId, f.followerNick
    //                             FROM users U
    //                             LEFT OUTER JOIN (
    //                                 SELECT F1.followingId, U1.nick AS followingNick, F2.followerId, U2.nick AS followerNick
    //                                 FROM follow F1
    //                                 LEFT OUTER JOIN users U1 ON F1.followingId = U1.id
    //                                 LEFT OUTER JOIN follow F2 ON F1.followerId = F2.followerId
    //                                 LEFT OUTER JOIN users U2 ON F2.followerId = U2.id
    //                             ) AS F ON U.id = F.followingId WHERE id = ${id}`
    //         const user = await sequelize.query(queryString, {type: QueryTypes.SELECT });
    //         done(null, user[0])    
    //     } catch (error) {
    //         console.error(error);
    //         done(error);
    //     }
    // });

    local();
    kakao();
};

