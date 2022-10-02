const router = require('express').Router();
const {
    deleteProduct, editProduct,
    getAdminOrdersPage,
    updateOrder, removeOrder,
    filterOrders,getAddProduct, setProduct,
}= require('../controller/root');
const {isAdmin} = require('../controller/middelwares')
const multer = require('multer');

router.get('/add-Product', isAdmin, getAddProduct)
router.post('/add-Product',multer({
    storage: multer.diskStorage({
        destination:(req, file, cb)=>{
            cb(null, 'images')
        },
        filename:(req, file, cb)=>{
            cb(null, Date.now()+ '.' +file.originalname.split('.')[1])
        }
    })
}).single('img') ,setProduct)
router.post('/delete-product',deleteProduct)
router.post('/edit-product',editProduct)
router.post('/filter',filterOrders)
router.get('/mange-orders', isAdmin, getAdminOrdersPage)
router.post('/order-change', isAdmin, updateOrder)
router.post('/order-cancel', isAdmin, removeOrder)

module.exports = router;