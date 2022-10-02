const mongoose = require('mongoose');
const dbConnect = require('./dbConnect')
const bcrypt = require("bcrypt")

const uSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdimn:{
        type: Boolean,
        default: false,
    }
})

const usersModel = new mongoose.model('user',uSchema)

module.exports ={
    createUser: async data =>{
        let encrypted;
        await bcrypt.hash(data.password, 10).then( val=>{
            data.password = val;
            encrypted = true;
        }).catch(err=>{
            console.error('encryption error : ',err);
            encrypted= false;
        })
        if(encrypted){
            try {
                return dbConnect(async ()=>{
                    return {resalt:await new usersModel(data).save(), isNeeded:false}
                })
            } catch (err) {
                throw err
            }
        }
    },
    authUser: data =>{
        let value;
        let user; 
        try {
            return dbConnect(async ()=>{
                await usersModel.findOne({ email: data.email })
                .then(u => {user = u})
                if(!user) value = "there is no account match this email"
                else {
                    value = await bcrypt.compare(data.password, user.password)
                    .then(valid =>{
                        if(!valid) return "email and password not matched"
                        else{
                            user.password = null;
                            return user;
                        }
                    })
                }
                return {resalt:value, isNeeded:true}
            })
        } catch (err) {
            throw err
        }
    }
}