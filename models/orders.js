const mongoose = require('mongoose');
const dbConnect = require('./dbConnect')

const oSchema = new mongoose.Schema({
    productID:String,
    userID:String,
    name:String,
    qnt:String,
    price:Number,
    address:String,
    status:{
        type:String,
        default:'Pending'
    },
    timestamp:String
})

const Orders = new mongoose.model('order',oSchema)

module.exports={
    getOrders: userId=>{
        try {
            return dbConnect(async ()=>{
                return {resalt:await Orders.find({userID: userId}), isNeeded:true}
            })
        } catch (err) {
            throw err
        }
    },
    postOrder: order=>{
        try {
            return dbConnect(async ()=>{
                return {resalt:await new Orders(order).save(), isNeeded:false}
            })
        } catch (err) {
            throw err
        }
    },
    deleteOrderByUser:orderId=>{
        try {
            return dbConnect(async ()=>{
                return {resalt:await Orders.findByIdAndDelete(orderId), isNeeded:false}
            })
        } catch (err) {
            throw err
        }
    },
    getAdminOrders: ()=>{
        try {
            return dbConnect(async ()=>{
                return {resalt:await Orders.find(), isNeeded:true}
            })
        } catch (err) {
            throw err
        }
    },
    changeOrderState: ({id, newStatus})=>{
        try {
            return dbConnect(async ()=>{
                return {resalt:await Orders.findByIdAndUpdate(id, {status: newStatus}), isNeeded:false}
            })
        } catch (err) {
            throw err
        }
    }, 
    deleteOrderByAdmin: ({id})=>{
        try {
            return dbConnect(async ()=>{
                return {resalt:await Orders.findByIdAndDelete(id), isNeeded:false}
            })
        } catch (err) {
            throw err
        }
    },
    getFilteredOrders:data=>{
        let filterOptions = {};
        if(data.id) filterOptions.userID = data.id.replaceAll(/\s/g, '');
        if(data.status) filterOptions.status = data.status;
        try {
            return dbConnect(async()=>{
                let value = await Orders.find(filterOptions).then(orders=>{
                    if(!Object.keys(orders).length) return []
                    else {
                        if(!data.date){
                            return orders
                        }else{
                            return orders.filter(order=>{
                                return new Date(order.timestamp).toLocaleDateString('en') === new Date(data.date).toLocaleDateString('en')
                            })
                        }
                    }
                })
                return {resalt:value, isNeeded:true}
            })
        } catch (err) {
            throw err
        }
    }
}