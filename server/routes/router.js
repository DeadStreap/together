const Router = require('express')
const router = new Router()

const contentController = require('../controller/contentController')

router.get('/content', contentController.getContent)
router.get('/content/id/:id', contentController.getContentById)
router.put('/update/content', contentController.updateContentById)
router.post('/delete/content', contentController.deleteContent)
router.post('/create/content', contentController.createContent)

module.exports = router;