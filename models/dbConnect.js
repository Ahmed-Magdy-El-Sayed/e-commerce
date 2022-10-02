const mongoose = require("mongoose");

module.exports = cb=>{
        return new Promise(async (resolve, reject)=>{
                await mongoose.connect('mongodb://localhost:27017/online-shopping')
                .then(()=>{
                        return cb()
                        .then(({resalt, isNeeded})=>{
                                isNeeded? resolve(resalt) : resolve();
                        }).catch(err=>{
                                console.error(err);
                                reject()
                        })
                })
                .catch(err=>{
                        console.error(err)
                        reject()
                })
                mongoose.disconnect();
        })
}