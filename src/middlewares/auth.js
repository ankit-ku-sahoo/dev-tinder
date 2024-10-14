const adminAuth = (req,res,next) => {
    const token = "xyz"

    const isAuthenticated = token === "xyz"
    if(isAuthenticated){
        next()
    }
    else{
        res.status(401).send("Admin not authenticated")
    }
}

const userAuth = (req,res,next) => {
    const token = "xyz"

    const isAuthenticated = token === "xyz"
    if(isAuthenticated){
        next()
    }
    else{
        res.status(401).send("User not authenticated")
    }
}

module.exports = {
    adminAuth, 
    userAuth
}