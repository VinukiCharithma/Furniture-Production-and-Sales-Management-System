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
    
    const{name,email,password,role,createdAt} = req.body;

    let users;

    try{
        users = new User({name,email,password,role,createdAt});
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
const getById = async (req, res) => {
    const id = req.params.id;
  
    // Ensure the authenticated user is requesting their own data
    if (id !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access." });
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ message: "Error fetching user by ID", error: error.message });
    }
  };

//Update User Details
const updateUser = async (req, res, next) => {

    const id = req.params.id;
    const{name,email,password,role,createdAt} = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id, 
            {name: name, email: email, password: password, role: role, createdAt: createdAt});
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