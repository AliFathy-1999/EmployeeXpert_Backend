const payrollHistory = require("../DB/models/payrollHistory");
const Employee = require("../DB/models/employee");


const getAllEmployeesPayroll = async (limit , page)=>{
    if(!limit) limit =10;
    if(!page) page = 1 ;
    const options = {
        page: page,
        limit: limit,
        populate: {
          path: "employeeId",
          select: "firstName lastName position",
        },
      };
    const paginatedHistory = await payrollHistory.paginate({} , options)
    return paginatedHistory;
}

module.exports = {
    getAllEmployeesPayroll,
}