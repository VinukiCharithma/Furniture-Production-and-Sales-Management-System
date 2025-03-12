const Emp = require("../Model/EmpModel");

//Employee Display
const getAllEmp = async (req, res, next) => {
    let emps;
    //get all emps
    try{
        emps = await Emp.find();
    } catch (err){
        console.log(err);
    }
    //emp not found
    if(!emps){
        return res.status(404).json({message:"Employees no found"});
    }

    //display employees
    return res.status(200).json({emps});
};

//Employee Insert
const addEmp = async (req, res, next) => {
    const {first_name,last_name,phone,job,status,username,password} = req.body;
    let emps;

    try{
       emps = new Emp({first_name,last_name,phone,job,status,username,password});
       await emps.save();
    }catch (err) {
        console.log(err);
    }
    //not insert
    if(!emps){
        return res.status(404).send({message:"Unable to add employee"});
    }
    return res.status(200).json({emps});
};


exports.getAllEmp = getAllEmp;
exports.addEmp = addEmp;