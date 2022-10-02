const express = require('express')
const app = express();
const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const {isLoggedIn} = require('./controller/middelwares')

const STORE = new sessionStore({
    uri:"mongodb://localhost:27017/online-shopping",
    collection:"sessions"
})

app.use(express.static('./public'))
app.use(express.static('./images'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(session({
    secret:"lsjgieslgijfo596hchc9xv4dxyuygm9z63zwcam2gmyz5vj6tki63afeas",
    resave: true,
    saveUninitialized: false,
    store:STORE
}))
app.use(isLoggedIn)
app.set('view engine','pug')
app.set('views','./views')

app.use('/',require('./routers/root'))
app.use('/admin',require('./routers/admin'))
app.all('*',(req,res)=>{res.status(404).send('<h1 style="color:red;text-align:center">Page not found !</h1>')})

app.listen(3000,(err)=>{
    err? console.log(err): console.log('server running on port 3000')
})