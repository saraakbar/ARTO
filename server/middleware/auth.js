const jwt = require("jsonwebtoken")
const auth = (req,res,next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
      
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) return res.status(403).send("Invalid Token")
          req.user = user
          next()
        })

        } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong") 
    }
}

module.exports = {auth}