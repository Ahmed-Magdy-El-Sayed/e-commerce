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
                return await productsModel.find({})
            })
        }catch(err){
            throw err
        }
    },
    selectProducts:nameSearch=>{
        try{
        return dbConnect(async ()=>{
            const value = await productsModel.find({}).then(async products=>{
                let matchedProducts = await products.filter(p=>{
                    result = nameSearch.split(' ').map(wordSearch=>{
                        return p.name.split(' ').map(word =>{
                            return word.toLowerCase() === wordSearch.toLowerCase()? true : false;
                        }).includes(true)
                    }).includes(false);
                    return result ? false : true;
                })
                return matchedProducts;
            })
            return value
        })
        }catch(err){
            throw err
        }
    },
    getProductById: id=>{
        try{
            return dbConnect(async ()=>{
                return await productsModel.findById(id)
            })
        }catch(err){
            throw err
        }
    },
    addProduct: product=>{
        try{
            return dbConnect(async ()=>{
                await new productsModel(product).save()
                return null
            })
        }catch(err){
            throw err
        }
    },
    updateProduct: ({id, newProduct}) =>{
        try{
            return dbConnect(async()=>{
                await productsModel.updateOne({_id: id},{$set:{...newProduct}})
                return null
            })
        }catch(err){
            throw err
        }
    }, 
    removeProduct: ({id, img})=>{
        try{
            return dbConnect(async()=>{
                await productsModel.findByIdAndDelete(id).then(()=>{
                    fs.promises.unlink(path.resolve(__dirname,'..', 'images', img))
                })
                return null
            })
        }catch(err){
            throw err
        }
    },
    addComment: comment=>{
        const dataRest = JSON.parse(comment.dataRest)
        try {
            return dbConnect(async()=>{
                await productsModel.findByIdAndUpdate(dataRest.productID,{$push:{comments:{
                        username:dataRest.username,
                        userID:dataRest.userID,
                        rating:comment.rating,
                        title:comment.title,
                        body: comment.body
                    }}})
                return null
            })
        } catch (err) {
            throw err
        }
    },updateComment:({comment, productID})=>{
        try {
            return dbConnect(async()=>{
                await productsModel.updateOne({_id:productID,'comments.userID':comment.userID},{$set:{
                    'comments.$.title':comment.title,
                    'comments.$.body':comment.body,
                    'comments.$.rating':comment.rating
                }})
                return null
            })
        } catch (err) {
            throw err
        }
    },
    deleteComment:data=>{
        try {
            return dbConnect(async ()=>{
                await productsModel.updateOne({_id:data.productID},{$pull:{comments:{'userID':data.userID}}})
                return null
            })
        } catch (err) {
            throw err
        }
    }
}