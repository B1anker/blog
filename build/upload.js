const qiniu = require("qiniu")
const qiniuKey = require('../config/key')
const fs = require('fs')
const path = require('path')

const resolve = (dir) => {
  return path.resolve(__dirname, '..', dir)
}

const mac = new qiniu.auth.digest.Mac(
  qiniuKey.qiniuConfACCESS_KEY,
  qiniuKey.qiniuConfSECRET_KEY
)

const options = {
  scope: 'cdn-server'
}
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
const putExtra = new qiniu.form_up.PutExtra();
const formUploader = new qiniu.form_up.FormUploader(config)
//构造上传函数
function uploadFile(uploadToken, key, localFile) {
  formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
    respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode == 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });
}

const addPrefixToFileName = (prefix, file) => `${prefix}/${file}`
const dirs = [
  resolve('dist/static/js'),
  resolve('dist/static/imgs')
]
const files = []
dirs.forEach((dir) => {
  fs.readdirSync(dir).forEach((file) => {
    files.push(addPrefixToFileName(dir, file))
  })
})

files.forEach((file) => {
  const fileSplited = file.split('/')
  const target = fileSplited[fileSplited.length - 1]
  uploadFile(uploadToken, target, file)
})