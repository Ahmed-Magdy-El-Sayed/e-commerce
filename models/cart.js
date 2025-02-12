const mongoose = require('mongoose');
const dbConnect = require('./dbConnect')

const cSchema = new mongoose.Schema({
    productID: String,
    name:String,
    qnt:Number,
    price:Number,
    type:String,
    userID: String,
    timestamp: String
})

const cart = new mongoose.model('cart',cSchema)

module.exports = {
    addToCart : data=>{
        try {
            return dbConnect(async ()=>{
                await new cart(data).save()
                return null;
            })
        } catch (err) {
            throw err
        }
    },
    getCartPorducts:id=>{
        try {
            return dbConnect(async ()=>{
                return await cart.find({userID:id})
            })
        } catch (err) {
            throw err
        }
    },
    removeProductCart: id =>{
        try {
            return dbConnect(async()=>{
                await cart.findByIdAndDelete(id)
                return null
            })
        } catch (err) {
            throw err
        }
    },
    getCartPorductsID: id =>{
        try {
            return dbConnect(async ()=>{
                return await cart.find({userID: id},{productID:1})
            })
        } catch (err) {
            throw err
        }
    }
}