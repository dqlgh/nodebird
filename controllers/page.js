const Post = require("../models/post");
const User = require('../models/user');
const Hashtag = require("../models/hashtag");

exports.renderProfile = (req, res, next) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
};

exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원 가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => {
    const userid = req.params.userId;
    if (userid) {
        try {
            const posts = await Post.findAll({
                include: [{
                    model: User,
                    attributes: ['id', 'nick'],
                    where: { id: userid },
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Liked'
                }
            ],
                order: [['createdAt', 'DESC']],
            })
            // console.log('page', posts)
            res.render('main', {
                title: 'NodeBird',
                twits: posts ? posts : [],
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    } else {
        try {
            const posts = await Post.findAll({
                include: [{
                    model: User,
                    attributes: ['id', 'nick'],
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Liked'
                }
            ],
                order: [['createdAt', 'DESC']]
            })
            
            const like = posts.map(c => {
                const postId = c.dataValues.id;
                const likedArray = c.Liked;
                const likedUserIds = likedArray.map(v => v.dataValues.id);
                return { id: postId, likedCount: likedArray.length, likedUserIds };
              });
            console.log('likeeeeeeeeeeeeeeeeee :', like)
            res.render('main', {
                title: 'NodeBird',
                twits: posts ? posts : [],
                likes: like ? like : [],
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
};

exports.renderTest = (req, res, next) => {
    res.render('test', { title: 'NodeBird', email: res.locals.user.email });
}

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    console.log('req.query.hashtag :', req.query);
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({
            where: { title: query }
        });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({
                include: [{ model: User, attributes: ['id', 'nick'] }],
                order: [['createdAt', 'DESC']],
            });
        }

        res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
};

exports.renderChangeProfile = (req, res, next) => {
    res.render('changeprofile', { title: 'Nodebird - 내정보' })
}
