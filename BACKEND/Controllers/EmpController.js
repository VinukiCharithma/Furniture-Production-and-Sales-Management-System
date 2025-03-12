const Emp = require("../Model/EmpModel");

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

exports.getAllEmp = getAllEmp;
