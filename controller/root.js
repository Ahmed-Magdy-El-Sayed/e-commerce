const {
    getProducts, selectProducts, 
    getProductById, addProduct, 
    updateProduct, removeProduct,
    addComment, updateComment,
    deleteComment
} = require('../models/products');

const { createUser, authUser } = require('../models/users');
const {addToCart, getCartPorducts, removeProductCart, getCartPorductsID} = require('../models/cart')
const {
    postOrder, getOrders, 
    deleteOrderByUser, getAdminOrders,
    changeOrderState, deleteOrderByAdmin,
    getFilteredOrders
} = require('../models/orders');

// functions for home page
const getHome = (req, res)=>{
    let searchVal = req.query.search
    if(searchVal){
        selectProducts(searchVal).then(p=>{
            res.render('index',{products: p, 
                isLoggedIn: res.locals.isLoggedIn,
                isAdmin: res.locals.isLoggedIn? req.session.user.isAdmin: false
            })
        }).catch(()=>{res.status(500).send("error")})
    }else{
        getProducts().then(p=>{
            res.render('index',{products: p,
                isLoggedIn: res.locals.isLoggedIn,
                isAdmin: res.locals.isLoggedIn? req.session.user.isAdmin: false
            })
        }).catch(()=>{res.status(500).send("error")});
    }
}

const getProduct = (req,res) =>{
    const id = req.params.id;
    getProductById(id).then( p=>{
        res.render('product', {
            product: p,
            isLoggedIn: res.locals.isLoggedIn,
            user: res.locals.isLoggedIn? req.session.user : null,
            isAdmin: res.locals.isLoggedIn? req.session.user.isAdmin: false,
            inCart: res.locals.isLoggedIn? req.session.productsIDs.map(({productID})=>{return JSON.stringify(productID) === JSON.stringify(id)? true : false}). includes(true): false
        })
    }).catch(err=>{console.log(err);res.status(500).send("error").end()})
}

const setComment = (req, res)=>{
    addComment(req.body).then(()=>{
        res.status(201).redirect(req.get('referer'))
    }).catch(()=>{
        res.status(500).send('Something went wrong!!')
    })
}

const editComment = (req, res)=>{
    updateComment(req.body).then(()=>{
        res.status(201).end()
    }).catch(()=>{
        res.status(500).send('Something went wrong!!')
    })
}

const removeComment = (req, res)=>{
    deleteComment(req.body).then(()=>{
        res.status(201).end()
    }).catch(()=>{
        res.status(500).send('Something went wrong!!')
    })
}

// function for signup page
const getSignup =(req,res)=>{
    res.render('signup')
}

const postUser = (req,res) =>{
    createUser(req.body).then(m=>{
        m? res.redirect(301,'/login') : res.status(500).send('<div style="text-align:center; color:red">Filed to create account</div>');
    })
}

let loginErr;
// functions for login page
const getLogin =(req,res)=>{
    res.render('login',{
        error: loginErr
    })
    loginErr = null;
}

const checkUser = (req, res) =>{
    const user = req.body;
    authUser(user).then(result=>{
        if(typeof result === 'string') {
            loginErr = result;
            res.redirect(301,'/login');
        }else {
            getCartPorductsID(result._id).then(ids=>{
                req.session.productsIDs =ids
                req.session.user = result;
                res.redirect(301,'/');
            })
        }
    })
}

// function for logout
const logout = (req, res) =>{
    req.session.destroy(err=>{
        if(err) return console.error(err) 
    });
    res.status(301).redirect('/login')
}
// functions for cart page
const addProductCart =(req, res) =>{
    let data = {...req.body, userID: req.session.user._id, timestamp: new Date().toLocaleString()};
    req.session.productsIDs.push({productID:req.body.productID})
    addToCart(data).then(() =>{
        res.status(201).send('done')
    })
}

const getCart = (req, res)=>{console.log(req.session.user.username)
    getCartPorducts(req.session.user._id).then(products=>{
        res.render('cart',{products:products});
    }).catch(()=>{res.status(500).send('internal server error')})
}


const deleteProductCart = (req, res)=>{
    removeProductCart(req.body.id).then(()=>{
        req.session.productsIDs = req.session.productsIDs.map(({_id})=>{
            let temp =[];
            if(_id !== req.body.id) temp.push({_id:_id})
            return temp
        })
        res.status(201).end();
    }).catch(()=>{
        res.status(500).send("error");
    })
}
// functions for Add-product page

const getAddProduct = (req,res)=>{
    res.render('AddProduct', {isAdmin: true})
}

const setProduct = (req, res) =>{
    let product = {
        name: req.body.name,
        type: req.body.type,
        details: req.body.details.split('\r\n').join('.'),
        img: req.file.filename,
        rate: req.body.rate,
        price: req.body.price,
    }
    addProduct(product).then(()=>{
        res.redirect(301,'/');
    }).catch(()=>{
        res.status(500).send("error")
    })
}

const deleteProduct = (req, res)=>{
    removeProduct(req.body).then(()=>{
        res.redirect(301,'/');
    }).catch(()=>{res.status(500).send("error")})
}

const editProduct = (req, res)=>{
    updateProduct(req.body).then(()=>{
        res.status(201).end();
    }).catch(()=>{res.status(500).send("error")})
}

//functions for orders page
const getOrderPage = (req, res) =>{
    getOrders(req.session.user._id).then(orders=>{
        res.render('order',{
            Orders:orders,
            isLoggedIn:true,
            isAdmin: false
        })
    }).catch(()=>{
        res.send('error')
    })
}

const addOrder = (req, res) =>{
    postOrder(req.body).then(()=>{
        res.status(201).end();
    }).catch(()=>{
        res.status(500),end();
    })
}

const cancelOrder = (req, res) =>{
    deleteOrderByUser(req.body.id).then(()=>{res.status(201).end()})
    .catch(()=>{res.status(500).send("error")})
}
//functions for mange-orders page
const getAdminOrdersPage = (req, res) =>{
    getAdminOrders().then(orders=>{
        res.status(200).render('manageOrders',{Orders: orders,isLoggedIn:true,isAdmin: true})
    }).catch(()=>{
        res.status(500).send("error");
    })
}

const updateOrder = (req, res)=>{
    changeOrderState(req.body).then(()=>{
        res.status(201).end()
    }).catch(()=>{
        res.status(500).send("error")
    })
}

const removeOrder = (req, res)=>{
    deleteOrderByAdmin(req.body).then(()=>{
        res.status(201).end()
    }).catch(()=>{
        res.status(500).send("error")
    })
}

const filterOrders = (req, res)=>{
    getFilteredOrders(req.body).then(orders=>{
        res.status(200).render('manageOrders',{
            Orders:orders,
            isLoggedIn:true,
            isAdmin: true
        })
    }).catch(()=>{res.status(500).send(error)})
}


module.exports={
    getHome, 
    getProduct, 
    getSignup, 
    getLogin, 
    postUser, 
    checkUser, 
    logout,
    addProductCart,
    getCart,
    deleteProductCart,
    getAddProduct,
    setProduct,
    deleteProduct,
    editProduct,
    getOrderPage,
    addOrder,
    cancelOrder,
    getAdminOrdersPage,
    updateOrder,
    removeOrder,
    filterOrders,
    setComment,
    editComment,
    removeComment
};