const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const { follow, unfollow, changeinfo, like } = require('../controllers/user');

router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/unfollow', isLoggedIn, unfollow); // 직접 구현해봐라. 구현 완료
router.post('/change/:nick', isLoggedIn, changeinfo)
router.post('/:id/blockfollow', isLoggedIn, follow); // 직접 구현해봐라.
router.post('/:postId/like', isLoggedIn, like);

module.exports = router;