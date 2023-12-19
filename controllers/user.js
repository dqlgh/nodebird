const { User, Post } = require("../models");
const { follow } = require('../services/user');


exports.follow = async (req, res, next) => {
    try {
        const result = await follow(req.user.id, req.params.id);
        
        if (result === 'ok') {
            res.send('success');
        } else if (result === 'no User') {
            res.status(404).send('no User');
        }
    } catch (error) {
        console.error(error);
        next(error)
    }
};

// exports.follow = async (req, res, next) => {
//     // req.user.id, req.params.id
//     try {
//         const user = await User.findOne({ where: { id: req.user.id }});
//         if (user) {
//             await user.addFollowing(parseInt(req.params.id, 10));
//             res.send('success');
//             cache.setUserCache(user);
//             cache.setCacheTTL(Date.now());
//         } else {
//             res.status(404).send('no User');
//         }
//     } catch (error) {
//         console.error(error);
//         next(error)
//     }
// };

exports.unfollow = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no User');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.changeinfo = async (req, res, next) => {
    console.log('changeinfo :', req.user.id, req.params.nick)
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (user) {
            await user.update({ nick: req.params.nick })
            res.send('success');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.like = async (req, res, next) => {
    console.log('like :', req.user.id, req.params.postId)
    try {
        const post = await Post.findOne({ 
            where: { id: req.params.postId },
            include: { model: User}
        });
        if (post) {
            await post.addLiked(parseInt(req.user.id, 10));
            res.send('success');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}