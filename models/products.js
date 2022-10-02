const mongoose = require('mongoose');
const dbConnect = require('./dbConnect')
const fs = require('fs');
const path = require('path');

const pSchema = new mongoose.Schema({
    name: String,
    type:String,
    details: String,
    img: String,
    rate: Number,
    price:Number,
    comments:Array
})

const productsModel = new mongoose.model('product',pSchema);

module.exports = {
    getProducts : ()=>{
        try{
            return dbConnect(async()=>{
                return {resalt:await productsModel.find({}), isNeeded:true}
            })
        }catch(err){
            throw err
        }
    },
    selectProducts:name=>{
        try{
        return dbConnect(async ()=>{
            const value = await productsModel.find({}).then(async products=>{
                let matchedProducts = await products.filter(p=>{
                    return p.name.split(' ').map(word =>{
                        return word.toLowerCase() === name.toLowerCase()? true : false;
                    }).includes(true);
                })
                return matchedProducts;
            })
            return {resalt:value, isNeeded:true}
        })
        }catch(err){
            throw err
        }
    },
    getProductById: id=>{
        try{
            return dbConnect(async ()=>{
                return {resalt:await productsModel.findById(id), isNeeded:true}
            })
        }catch(err){
            throw err
        }
    },
    addProduct: product=>{
        try{
            return dbConnect(async ()=>{
                return {resalt: await new productsModel(product).save(), isNeeded:false}
            })
        }catch(err){
            throw err
        }
    },
    updateProduct: ({id, newProduct}) =>{
        try{
            return dbConnect(async()=>{
                return {resalt:await productsModel.updateOne({_id: id},{$set:{...newProduct}}), isNeeded:false}
                
            })
        }catch(err){
            throw err
        }
    }, 
    removeProduct: ({id, img})=>{
        try{
            return dbConnect(async()=>{
                return {resalt:await productsModel.findByIdAndDelete(id).then(()=>{
                    return fs.promises.unlink(path.resolve(__dirname,'..', 'images', img))
                }), isNeeded:false}
            })
        }catch(err){
            throw err
        }
    },
    addComment: comment=>{
        const dataRest = JSON.parse(comment.dataRest)
        try {
            return dbConnect(async()=>{
                return {
                    resalt: await productsModel.findByIdAndUpdate(dataRest.productID,{$push:{comments:{
                        username:dataRest.username,
                        userID:dataRest.userID,
                        rating:comment.rating,
                        title:comment.title,
                        body: comment.body
                    }}}),
                    isNeeded: false
                }
            })
        } catch (err) {
            throw err
        }
    },updateComment:({comment, productID})=>{
        try {
            return dbConnect(async()=>{
                return {resalt:await productsModel.updateOne({_id:productID,'comments.userID':comment.userID},{$set:{
                    'comments.$.title':comment.title,
                    'comments.$.body':comment.body,
                    'comments.$.rating':comment.rating
                }}),isNeeded:false}
            })
        } catch (err) {
            throw err
        }
    },
    deleteComment:data=>{
        try {
            return dbConnect(async ()=>{
                return {resalt:await productsModel.updateOne({_id:data.productID},{$pull:{comments:{'userID':data.userID}}}),isNeeded:false}
            })
        } catch (err) {
            throw err
        }
    }
}