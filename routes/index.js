const express= require('express');
const router=express.Router();
const homeController=require('../controllers/home');

router.get('/',homeController.home);
router.post('/upload',homeController.upload);
router.get('/display',homeController.display);
router.get('/delete',homeController.delete);
module.exports=router;