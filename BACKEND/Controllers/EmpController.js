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
        return res.status(404).json({message:"Employees not found"});
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

//Get emp by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let emp;
    try{
        emp = await Emp.findById(id);
    }catch(err){
        console.log(err);
    }
    //emp not found
    if(!emp){
        return res.status(404).json({message:"Employee not found"});
    }
    //display employees
    return res.status(200).json({emp});
};

//Update Emp
const updateEmp = async (req, res, next) => {
    const id = req.params.id;
    const {first_name,last_name,phone,job,status,username,password} = req.body;

    let emp;

    try{
        emp = await Emp.findByIdAndUpdate(id,{first_name,last_name,phone,job,status,username,password});
        emp = await emp.save();
    } catch(err){
        console.log(err);
    }
    //emp not found
    if(!emp){
        return res.status(404).json({message:"Unable to update Employee"});
    }
    //display employees
    return res.status(200).json({emp});

};


exports.getAllEmp = getAllEmp;
exports.addEmp = addEmp;
exports.getById = getById;
exports.updateEmp = updateEmp;