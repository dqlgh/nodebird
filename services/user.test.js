const { follow } = require('./user');

const User = require('../models/user');
const { describe } = require('../models/user');

describe('follow', () => {
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함.', async () => {
        User.findOne.mockReturnValue({
            addFollowing(id) {
                return Promise.resolve(true);
            }
        })
        const result = await follow(1, 2);
        expect(result).toEqual('ok');
    })
    test('사용자가 없으면 no User를 반환 함.', async () => {
        User.findOne.mockReturnValue(null)
        const result = await follow(1, 2);
        expect(result).toEqual('no User');
    })
    test('db에서 에러가 발생하면 throw', async () => {
        const message = 'DB에러';
        User.findOne.mockReturnValue(Promise.reject(message));
        try {
            await follow(1, 2);
        } catch (error) {

            expect(error).toEqual(message);
        }
    })
})