const mongoose = require("mongoose");

module.exports = cb=>{
        return new Promise(async (resolve, reject)=>{
                await mongoose.connect('mongodb+srv://AhmedMagdy:1YLcRgPR4L0fPQzW@cluster0.kbcoecs.mongodb.net/e-commerce?retryWrites=true&w=majority')
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
                // mongoose.disconnect();
        })
}
