const User = require("../Model/UserModel");

const getAllUsers =  async (req , res , next) => {

    let Users;

    try{
        users = await User.find();
    }catch(err){
        console.log(err);
    }

    if(!users){
        return res.status(404).json({message:"User not found"});
    }

    return res.status(200).json({users});
};

//data insert
const addUsers =  async (req , res, next) => {
    
    const{username,gmail,password,bio,followers,following} = req.body;

    let users;

    try{
        users = new User({username,gmail,password,bio,followers,following});
        await users.save();
    }catch(err){
        console.log(err);
    }
    //not insert users
    if(!users){
        return res.status(404).json({message:"unable to add users"});
    }
    return res.status(200).json({users});
};

//Get by id
const getById = async (req , res, next) => {

    const id = req.params.id;

    let user;

    try{
        user = await User.findById(id);
    }catch(err){
        console.log(err);
    }
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    return res.status(200).json({user});
};

//Update User Details
const updateUser = async (req, res, next) => {

    const id = req.params.id;
    const{username,gmail,password,bio,followers,following} = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id, 
            {username: username, gmail: gmail, password: password, bio: bio, followers: followers, following: following});
            users = await users.save();
    }catch(err){
        console.log(err);
    }
    if(!users){
        return res.status(404).json({message:"Unable to Update User Details"});
    }
    return res.status(200).json({users});
};

//Delete User Details
const deleteUser = async (req, res, next) => {

    const id = req.params.id;

    let user;

    try{
        user = await User.findByIdAndDelete(id);
    }catch(err){
        console.log(err);
    }
    if(!user){
        return res.status(404).json({message:"Unable to Delete User Details"});
    }
    return res.status(200).json({user});
}

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;