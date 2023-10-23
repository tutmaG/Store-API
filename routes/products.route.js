const express = require("express")
const router = express.Router()


const {getAllProductsStatic,getAllProduc} = require('../controllers/products.cont')

router.route('/').get(getAllProduc)
router.route('/static').get(getAllProductsStatic)

module.exports = router