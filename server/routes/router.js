const Router = require('express')
const router = new Router()

const contentController = require('../controller/contentController')
// const userController = require('../controller/userController')
// const coupleController = require('../controller/coupleController')
// const commentController = require('../controller/commentControler')

router.get('/content', contentController.getContent)
router.get('/content/id/:id', contentController.getContentById)
router.put('/update/content', contentController.updateContentById)
router.post('/create/content', contentController.createContent)
router.post('/delete/content', contentController.deleteContent)

// router.get('/user', userController.getUser)
// router.get('/user/id', userController.getUserById)
// router.put('/update/user', userController.updateUser)
// router.post('/create/user', userController.createUser)
// router.post('/delete/user', userController.deleteUser)

// router.get('/couple', coupleController.getCouple)
// router.get('/couple/id', coupleController.getCoupleById)
// router.put('/update/couple', coupleController.updateCouple)
// router.get('/create/couple', coupleController.createCouple)
// router.get('/delete/couple', coupleController.deleteCouple)

// router.get('/comment', commentController.getComment)
// router.get('/comment/id', commentController.getCommentById)
// router.put('/update/comment', commentController.updateComment)
// router.get('/create/comment', commentController.createComment)
// router.get('/delete/comment', commentController.deleteComment)

module.exports = router;