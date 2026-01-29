const Router = require('express')
const router = new Router()

const contentController = require('../controller/contentController')
const userController = require('../controller/userController')
const coupleController = require('../controller/coupleController')
const commentController = require('../controller/commentController')

router.get('/contents', contentController.getContent)
router.get('/contents/together/:userId/:partnerId', contentController.getContentTogether)
router.get('/content/id/:id', contentController.getContentById)
router.put('/update/content', contentController.updateContentById)
router.post('/create/content', contentController.createContent)
router.delete('/delete/content', contentController.deleteContent)

router.get('/users', userController.getUsers)
router.get('/user/id/:id', userController.getUserById)
router.post('/auth/user', userController.userAuth)
router.put('/update/user', userController.updateUser)
router.post('/create/user', userController.createUser)
router.delete('/delete/user', userController.deleteUser)

router.get('/couples', coupleController.getCouples)
router.get('/couple/id/:id', coupleController.getCoupleById)
router.put('/update/couple', coupleController.updateCouple)
router.post('/create/couple', coupleController.createCouple)
router.delete('/delete/couple', coupleController.deleteCouple)

router.get('/comments', commentController.getComments)
router.get('/comment/id/:id', commentController.getCommentById)
router.put('/update/comment', commentController.updateComment)
router.post('/create/comment', commentController.createComment)
router.delete('/delete/comment', commentController.deleteComment)

module.exports = router;