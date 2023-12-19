const express = require('express');
const passport = require('passport');
const router = express.Router();
const { renderJoin, renderMain, renderProfile, renderTest, renderHashtag, renderChangeProfile } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const Post = require('../models/post');
const User = require('../models/user');

router.use(async (req, res, next) => {
    // console.log('routes page/ req.user : ', req.user);
    // const post = await Post.findAll({
    //     // where: { id: req.user?.id || null },
    //     include: [
    //         { 
    //             model: User,
    //             attributes: ['id', 'nick'],
    //             as: 'Liked'
    //         }
    //     ]
    // })
    // console.log('post', post.map(v => v.Liked).map(users => users.map(user => user.Like)))
    // console.log('post', post.map(v => v.Liked).map(c => c.Like))
    res.locals.user = req.user;
    // res.locals.likePost = post[0]?.Liked || [];
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings.map(f => f.id) || [];
    // await User.findOne({}) deserialize에서 하지 않고 여기서 가져와도 된다.
    // console.log('followings :', req.user?.Followings.map(f => f.id))
    next();
})
router.get('/favicon.ico', (req, res) => {res.status(204).end()} );
router.get('/profile', isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/test', renderTest);

router.get('/', renderMain);

router.get('/hashtag', renderHashtag); // hashtag?hashtag=고양이
router.get('/changeprofile', isLoggedIn, renderChangeProfile)
router.get('/:userId', renderMain)



module.exports = router;