
const { Post, Hashtag } = require('../models');
const path = require('path');
const fs = require('fs');


exports.afterUploadImage = (req, res) => {
    console.log('afterImage: ', req.file);
    // res.json({ url: `/img/${req.file.filename}` });
    res.json({ url: req.file.location});
};


exports.uploadPost = async (req, res, next) => {
    // req.body.content, /req.body.url
    const { content, url } = req.body;
    try {
        const post = await Post.create({
            content: content,
            img: url,
            UserId: req.user.id,
          });
        const hashtags = content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => {
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() }
                });
            }));
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.deleteTwit = async (req, res, next) => {
    // console.log(req.user.id, req.params)
    try {
        const post = await Post.findOne({ where: { id: req.params.twitId }});
        if (post) {
            await post.destroy({ where: { id: req.params.twitId }});
            if (post.img) {
                const img = post.img.split('/')[2]
                const parentfolder = path.dirname(__dirname)
                const imgfolder = path.join(parentfolder, 'uploads');
                const filepath = path.join(imgfolder, img);
                fs.unlink(filepath, (err) => {
                    err ? console.error(err) : console.log(`${filepath}이미지가 삭제되었다.`)
                })
            }
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};
