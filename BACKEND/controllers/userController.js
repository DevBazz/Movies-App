const generateToken = require('../utils/genToken')
const bcrypt = require('bcryptjs')

const Users = require('../models/Users');


module.exports.createUser = async(req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400).json({message: "All fields are required"})
    }

    const existingUser = await Users.findOne({email})
    if(existingUser) res.status(400).send("User already exists")

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    try {
        const newUser = await Users.create({
        username,
        email,
        password : hashedPassword,
    })

     generateToken(res, newUser._id)

     res.status(201).json({
         id : newUser._id,
         username: newUser.username,
         email: newUser.email,
        isAdmin: newUser.isAdmin
     })
    } catch (error) {
        res.status(500).json({
            message: "Error Creating User"
        })
    }
}


module.exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await Users.findOne({email})

    if (existingUser) {
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password)

      if (isPasswordMatch) {
        generateToken(res, existingUser._id)

        res.status(201).json({
         id : existingUser._id,
         username: existingUser.username,
         email: existingUser.email,
         isAdmin: existingUser.isAdmin
     })
      } else {
        res.status(401).json({
          message: "Invalid Password"})
      }  
    } else {
       res.status(401).json({
        message: "User does not exist"
       }) 
    }
}


module.exports.logoutUser = async(req, res) => {
    
    try {
        res.cookie('jwt', "", {
        httpOnly : true, 
        expires : new Date(0)
    })

    res.status(200).json({message: "Logged Out Successfully"})
    } catch (error) {
        res.status(401).json({error: "Error Logging out User"})
    }
}

module.exports.getAllUsers = async(req, res) => {
    try {
        const users = await Users.find()
        res.json(users)
    } catch (error) {
        res.status(401).json({error: "Failed to retrive all Users"})
    }
}

module.exports.getSpecficUser = async(req, res) => {
  
  try {
    const specficUser = await Users.findById(req.user._id)

    if (specficUser){
      res.json({
       id : specficUser._id,
       username : specficUser.username,
       email : specficUser.email
      })
    }

  } catch (error) {
     res.status.json({error : "Error fetching requested User info"})
  }
}

module.exports.updateUser = async(req, res) => {

   try {
     const {username, email, password} = req.body;

     const user = await Users.findById(req.user._id)
      if(user){
        user.username = username || user.username;
        user.email = email || user.email;

        if (password) {
            
            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword || user.password
        }

        const updatedUser = await user.save()

        res.status(200).json({
        id : updatedUser._id,
        username : updatedUser.username,
        email : updatedUser.email,
        isAdmin : updatedUser.isAdmin
      })
      }

    } catch (error) {
        res.status(401).json({ message: "Failed to update User", error })
    }

    
}