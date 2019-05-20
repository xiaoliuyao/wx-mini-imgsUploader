/**选择图片
 * @param Number count 共可以上传几张图片
 * @param Array  sizeType 图片质量
 * {return} Promise
 *  */
export function chooseImgs(count, sizeType, sourceType) {
  return new Promise((resolve) => {
    wx.chooseImage({
      count: count,
      sizeType: sizeType,
      sourceType: sourceType,
      success: function(res) {
        resolve(res.tempFilePaths);
      }
    })
  })
};

//上传图片的地址，根据你的存储区域而改变
const UPIMG_URL = 'https://upload.qiniup.com';
//七牛空间的外链地址，根据你的存储空间域名而改变
const IMG_DOMAIN = 'http://pre7kddvq.bkt.clouddn.com/';
//七牛uptoken
var token = '';


/**uploadImg 上传单张图片到七牛，用作map()映射,或单个图片上传
 * @param String temp_url 图片临时地址
 * {return} Promise
 */
export function uploadImg(temp_url) {
  var key = temp_url.split("//")[1];
  console.log(key);
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: UPIMG_URL,
      header: {
        'content-type': 'application/json'
      },
      filePath: temp_url,
      name: 'file',
      formData: {
        token: token,
        key: key
      },
      success: function(res) {
        if (res.statusCode == 200) {
          // console.log(res.data);
          if (typeof res.data == "string") {
            var filename = JSON.parse(res.data).key; //获取返回的key
          } else {
            var filename = res.data.key; //获取返回的key
          }
          var imgurl = IMG_DOMAIN + filename;
          resolve(imgurl);
        } else {
          reject('fail to upload:' + res.statusCode);
        }
      },
      fail: function(err) {
        reject('fail to upload');
      }
    })
  })
}



/**从后端获取七牛上传token
 * {return} Promise
 *  */
export function getQiniuToken() {
  return new Promise((resolve, reject) => {
    wx.request({
      // url: 'http://localhost:8004/qiniu_token.php', //换上你自己的获取token的url
      url: 'http://192.168.0.106:8004/qiniu_token.php',//手机上测试
      success: res => {
        if (res.statusCode == 200) {
          token = res.data.token; //更新token
          resolve(token);
        } else {
          reject('fail to get upToken:' + res.statusCode);
        }
      },
      fail: res => {
        reject('fail to get upToken');
      }
    })
  })
}