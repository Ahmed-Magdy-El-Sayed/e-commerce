const forLoggedOut = (req, res, next)=>{
    req.session.user? res.status(301).redirect('/') : next();
}

const isLoggedIn = (req,res,next)=>{
    if(req.session.user) res.locals.isLoggedIn = true;
    else res.locals.isLoggedIn = false;
    next();
}

const notAdminUser = (req,res,next)=>{
    req.session.user? req.session.user.isAdmin ? res.redirect(301,'/') : next() : res.status(301).redirect('/login');
}
const isAdmin = (req,res,next)=>{
    req.session.user? req.session.user.isAdmin ? next() : res.redirect(301,'/') : res.status(301).redirect('/login');
}

module.exports={
    forLoggedOut,
    isLoggedIn,
    isAdmin,
    notAdminUser
}