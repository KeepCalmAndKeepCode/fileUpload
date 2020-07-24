const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const multer = require("multer"); // 引入multer模块
const path = require("path");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));  // 引用静态资源路径
// const upload = multer({ 
//   dest: "./public/uploads/",
//   filename(req,file,cb){
//     console.log(file);
//     let fileFormat = (file.originalname).split(".");
//     cb(null, fileFormat[0] + "-" + Date.now() + "." + fileFormat[fileFormat.length - 1]);
//   }
// }).any();
// //文件上传模块的配置
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log(file);
//     cb(null, "./public/uploads");// 保存上传的文件的路径
//   },
//   filename: function (req, file, cb) {
//     console.log(req.files);
//     let fileFormat = (file.originalname).split(".");
//     // 保存上传的文件的名称
//     cb(null, fileFormat[0] + "-" + Date.now() + "." + fileFormat[fileFormat.length - 1]);
//   }
// });
// //将配置匹配给multer对象
// const upload = multer({
//   storage
// }).any();

// var upload = multer({ dest: "./public/uploads/" }).any();
app.post("/upload", multer({ 
  dest: "./public/uploads/"
 }).single("file"), (req, res) => {
  console.log(req.file);
  let file = req.file;
  const fileFormat = file.originalname.split(".");
  const url = file.path.split("public")[1] + "." + fileFormat[fileFormat.length - 1];
  fs.renameSync(file.path,`public/uploads/${file.filename}.${fileFormat[fileFormat.length - 1]}`);
  file.path = `public/uploads/${file.originalname}`
  res.send({
    msg: "Nice ! 上传成功 ~ ",
    data:{
      url
    }
  });

  // console.log(req.body);
  // console.log(req.files);
})

// 多文件上传
app.post("/uploads", multer({ 
  dest: "./public/uploads/"
 }).array("files",10), (req, res) => {
  var files = req.files;
  var filesList = [];
  for(let item of files){
    let fileFormat = item.originalname.split(".");
    filesList.push(item.path.split("public")[1] + "." + fileFormat[fileFormat.length - 1]);
    fs.renameSync(item.path,`public/uploads/${item.filename}.${fileFormat[fileFormat.length - 1]}`);
    item.path = `public/uploads/${item.originalname}`;
  }
  res.send({
    msg: "Nice ! 上传成功 ~ ",
    data:{
      filesList
    }
  });

  // console.log(req.body);
  // console.log(req.files);
})

app.listen(3333, () => {
  console.log("http://localhost:3333");
})