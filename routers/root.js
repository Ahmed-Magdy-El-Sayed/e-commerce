const express = require('express')
const router = express.Router();

const {getHome, getProduct,
    getSignup, getLogin, 
    postUser, checkUser, 
    logout, addProductCart, 
    getCart, deleteProductCart, 
    getOrderPage, addOrder,
    cancelOrder, setComment,
    editComment, removeComment
}= require('../controller/root');


const {forLoggedOut, notAdminUser} = require('../controller/middelwares')


router.get('/',getHome)

router.get('/product/:id',getProduct)
router.post('/product/comments',setComment)
router.post('/product/comments/edit',editComment)
router.post('/product/comments/delete',removeComment)

router.get('/signup',forLoggedOut,getSignup)
router.post('/signup',postUser)

router.get('/login',forLoggedOut,getLogin)
router.post('/login',checkUser)

router.get('/logout',(req,res,next)=>{req.session.user?next():res.redirect(301,'/login')}, logout)

router.get('/cart', notAdminUser, getCart)
router.post('/cart',addProductCart)
router.post('/cart/delete',deleteProductCart)

router.get('/orders', notAdminUser, getOrderPage)
router.post('/order', addOrder)
router.post('/order/cancel', cancelOrder)



module.exports = router