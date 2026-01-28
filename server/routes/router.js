const Router = require('express')
const router = new Router()

const contentController = require('../controller/contentController')
const userController = require('../controller/userController')
const coupleController = require('../controller/coupleController')
const commentController = require('../controller/commentController')

router.get('/contents', contentController.getContent)
router.get('/content/id', contentController.getContentById)
router.put('/update/content', contentController.updateContentById)
router.post('/create/content', contentController.createContent)
router.post('/delete/content', contentController.deleteContent)

router.get('/users', userController.getUsers)
router.get('/user/id', userController.getUserById)
router.put('/update/user', userController.updateUser)
router.post('/create/user', userController.createUser)
router.post('/delete/user', userController.deleteUser)

router.get('/couples', coupleController.getCouples)
router.get('/couple/id', coupleController.getCoupleById)
router.put('/update/couple', coupleController.updateCouple)
router.get('/create/couple', coupleController.createCouple)
router.get('/delete/couple', coupleController.deleteCouple)

router.get('/comments', commentController.getComments)
router.get('/comment/id', commentController.getCommentById)
router.put('/update/comment', commentController.updateComment)
router.get('/create/comment', commentController.createComment)
router.get('/delete/comment', commentController.deleteComment)

module.exports = router;