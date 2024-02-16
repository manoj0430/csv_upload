const mongoose = require('mongoose');
const multer = require('multer');
const path= require('path');
const FILE_PATH = path.join('/uploads/files');
const fs= require('fs');

const fileSchema = new mongoose.Schema({
    name:
    {
        type : String,
        required : true,
    },
    CSVFile: {
        type: String,
    }

},{
    timestamps: true,
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',FILE_PATH))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
  });

fileSchema.statics.uploadedFile =multer({ storage: storage }).single('CSVFile');
fileSchema.statics.filePath=FILE_PATH;


const File = mongoose.model('File',fileSchema);

module.exports= File;