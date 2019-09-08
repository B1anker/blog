const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')
const axios = require('axios').default
const { Signale } = require('signale')

const signale = new Signale()
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
        }
      }
    )
    .then((res) => {
      signale.success('更新index.html成功')
    })
    .catch((err) => {
      signale.error('更新index.html失败')
      throw err
    })
}

function statFile({ key, mac }) {
  const bucketManager = new qiniu.rs.BucketManager(mac, config)
  return new Promise((resolve, reject) => {
    bucketManager.stat('cdn-server', key, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        reject(respErr)
      } else {
        if (respInfo.statusCode == 200) {
          resolve(respBody.fsize)
        } else {
          reject({
            statusCode: respInfo.statusCode,
            respBody
          })
        }
      }
    })
  })
}

//构造上传函数
function uploadFile({ uploadToken, key, file, config }) {
  const putExtra = new qiniu.form_up.PutExtra()
  const formUploader = new qiniu.form_up.FormUploader(config)
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, file, putExtra, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        reject(respErr)
      } else {
        if (respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          reject({
            statusCode: respInfo.statusCode,
            respBody
          })
        }
      }
    })
  })
}

if (process.env['QINIU_ACCESS_KEY'] && process.env['QINIU_SECRET_KEY']) {
  signale.await('开始上传')
  const resolve = (dir) => {
    return path.resolve(__dirname, '..', dir)
  }

  const mac = new qiniu.auth.digest.Mac(
    process.env['QINIU_ACCESS_KEY'],
    process.env['QINIU_SECRET_KEY']
  )

  var config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z2
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: 'cdn-server'
  })
  const uploadToken = putPolicy.uploadToken(mac)

  const addPrefixToFileName = (prefix, file) => `${prefix}/${file}`
  const dirs = [resolve('dist/static')]

  const files = []
  dirs.forEach((dir) => {
    fs.readdirSync(dir).forEach((file) => {
      files.push(addPrefixToFileName(dir, file))
    })
  })

  Promise.all(
    files.map(async (file) => {
      const fileSplited = file.split('/')
      const key = fileSplited[fileSplited.length - 1]
      let needUpload = true
      try {
        const fsize = await statFile({
          key,
          mac
        })
        needUpload = fsize <= 0
      } catch (err) {
        needUpload = true
      }
      if (needUpload) {
        signale.info(`${key}不存在，需上传`)
        try {
          await uploadFile({
            uploadToken,
            key,
            file,
            config
          })
          signale.success(`${key}上传成功`);
        } catch(err) {
          signale.error(`${key}上传失败`);
          signale.error(err)
        }
      } else {
        signale.success(`${key}已存在，跳过上传`);
      }
    })
  ).then(() => {
    uploadIndex()
  })
}
