const File=require('../models/file');
const fs= require('fs');
const path= require('path');
const csv = require('@fast-csv/parse');
module.exports.home= async(req,res)=>{
    try {
        const files=await File.find({});
        // console.log(files);
        return res.render('home',{
            title:'Home',
            files:files
        })
    } catch (error) {
        console.log(error);
        return
    }
}

module.exports.upload=async(req,res)=>{
    try {
            if(!fs.existsSync("uploads")) {
                fs.mkdirSync("uploads");
                if(!fs.existsSync('uploads/files')){
                    fs.mkdirSync("uploads/files");
                }
              }
            File.uploadedFile(req,res,async (err)=>{
                if(err){ console.log('**************multer Eroor: ', err)};
                if(req.file){
                    let file= await File.create({
                        name:req.file.originalname
                    })
                   file.CSVFile= (File.filePath +'/'+ req.file.filename) ;
                   await file.save();
                    console.log('File added in the database');
                    // console.log('body:',req.body);
                    // console.log('file:',req.file);
                }
               
               return res.redirect('back');
            })
        
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
};

module.exports.delete=async(req,res)=>{
    try {
        const file= await File.findById(req.query.id);
        
        var filePath = path.join(__dirname,'..',file.CSVFile); 
        fs.unlinkSync(filePath);
        await File.findOneAndDelete({_id:req.query.id});
        console.log('File deleted');

        return res.redirect('back');
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.display=async(req,res)=>{
    try {
            let file=await File.findById(req.query.id);
            console.log(path.join(__dirname,'..',file.CSVFile));
            const results = [];
            const header = [];
            fs.createReadStream(path.join(__dirname,'..',file.CSVFile))
                .pipe(csv.parse({ headers: true }))
                .on("headers", (headers) => {
                    headers.map((head) => {
                       header.push(head);
                    });
                    console.log("header => ", header);
                 })
                .on('error', error => console.error(error))
                .on('data', (row) => {
                    // console.log(`ROW=${JSON.stringify(row)}`) ;
                    results.push(row);
                   
                })
                .on('end', (rowCount) => {
                // console.log(`Parsed ${rowCount} rows`)
                console.log(results.length);
                let page = req.query.page;
                console.log("page => ", req.query.page);
                let startSlice = (page - 1) * 100 + 1;
                let endSlice = page * 100;
                let sliceResults = [];
                let totalPages = Math.ceil(results.length / 100);

                if (endSlice < results.length) {
                    sliceResults = results.slice(startSlice, endSlice + 1);
                } else {
                    sliceResults = results.slice(startSlice-1);
                }
                res.render('display',{
                    title:'Display',
                    file:file,
                    head: header,
                    data: sliceResults,
                    length: results.length,
                    page: req.query.page,
                    totalPages: totalPages,
                });
            }
                )
                
               

      
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}
