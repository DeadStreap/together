const Router = require('express')
const router = new Router()

const contentController = require('../controller/contentController')

router.get('/content', contentController.getContent)
router.get('/content/id/:id', contentController.getContentById)

module.exports = router;