const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')
const axios = require('axios').default

const uploadIndex = () => {
  axios
    .put(
      'https://b1anker.com/api/v1/workflow/update/blog/index',
      {
        template: fs.readFileSync(
          path.resolve(__dirname, '../dist/index.html'),
          {
            encoding: 'utf8'
          }
        )
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((res) => {
      if (res.data.message === 'ok') {
        console.log('更新index.html成功')
      } else {
        console.log(res.data)
      }
    })
    .catch((err) => {
      console.log('更新index.html失败')
      console.log(err)
    })
}

if (process.env['QINIU_ACCESS_KEY'] && process.env['QINIU_SECRET_KEY']) {
  console.log('开始上传')
  const resolve = (dir) => {
    return path.resolve(__dirname, '..', dir)
  }

  const mac = new qiniu.auth.digest.Mac(
    process.env['QINIU_ACCESS_KEY'],
    process.env['QINIU_SECRET_KEY']
  )

  const options = {
    scope: 'cdn-server'
  }
  var config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z2
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  const putExtra = new qiniu.form_up.PutExtra()
  const formUploader = new qiniu.form_up.FormUploader(config)
  //构造上传函数
  function uploadFile(uploadToken, key, localFile) {
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, localFile, putExtra, function(
        respErr,
        respBody,
        respInfo
      ) {
        if (respErr) {
          console.log(respErr)
          console.log(`${key}上传失败`)
          reject(respErr)
        }
        if (respInfo.statusCode == 200) {
          console.log(respBody)
          resolve(respBody)
        } else {
          console.log(respInfo.statusCode, respBody)
          reject({
            statusCode: respInfo.statusCode,
            respBody
          })
        }
      })
    })
  }

  const addPrefixToFileName = (prefix, file) => `${prefix}/${file}`
  const dirs = [resolve('dist/static')]

  const files = []
  dirs.forEach((dir) => {
    fs.readdirSync(dir).forEach((file) => {
      files.push(addPrefixToFileName(dir, file))
    })
  })

  Promise.all(
    files.map((file) => {
      const fileSplited = file.split('/')
      const target = fileSplited[fileSplited.length - 1]
      return uploadFile(uploadToken, target, file)
    })
  ).then(() => {
    uploadIndex()
  })
}
