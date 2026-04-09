const uploadToClouddinary = require("../../helpers/uploadToClouddinary")

module.exports.upload = async(req, res, next)=>{
    if(req.file){
      const result = await uploadToClouddinary(req.file.buffer);
      //console.log("result", result)
      req.body[req.file.fieldname] = result
    } 
    next();
}

