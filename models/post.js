const Sequelize = require('sequelize');

// 스스로 해보기
// 이미지를 하나밖에 올리지 못한다.
// 이미지를 여러개를 올리려면 게시글당 이미지 여러개 1대 다로써 테이블을 별도 구성해야 하고, 관계설정을 해주면 된다. 
// 예를들면 아이디당 이미지  이런식?

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allownull: false
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }
    
    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
        db.Post.belongsToMany(db.User, { foreignKey: 'likedPostId', as: 'Liked', through: 'Like' })
        // db.sequlize.models.PostHashtag 이렇게 직접 접근할 수 있다.
    }
}

module.exports = Post;

