const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt를 자동으로 기록
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // deletedAt이 유저삭제일 
            charset: 'utf8',
            collate: 'utf8_general_ci',
        })
    }
    
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { // 팔로워
            foreignKey: 'followingId', 
            as: 'Followers',
            through: 'Follow',
        })
        db.User.belongsToMany(db.User, { // 팔로잉
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        })
        db.User.belongsToMany(db.Post, { foreignKey: 'likeUserId', as: 'Liking', through: 'Like' })
    }
}

module.exports = User;