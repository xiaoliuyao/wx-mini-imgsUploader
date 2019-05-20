import {
  chooseImgs,
  uploadImg,
  getQiniuToken
} from '../utils/upimg.js';
import {
  toast_no_icon
} from '../utils/show.js';

Component({

  properties: {
    max: {
      type: Number,
      value: 9
    },
    sizeType: {
      type: Array,
      value: ['original', 'compressed']
    },
    sourceType: {
      type: Array,
      value: ['album', 'camera']
    }
  },

  data: {
    imgUrls: [],
    token: ''
  },

  created: function() {
    var _this = this;
    getQiniuToken().then(token => {
      console.log(token);
      _this.setData({
        token: token
      })
    }).catch(info => {
      toast_no_icon(info, 'none');
    })
  },

  methods: {

    //点击 + 按钮,选择并上传图片
    chooseImg: function(e) {

      var that = this;
      if (typeof that.data.token == "undefined" || that.data.token == "") {
        toast_no_icon('上传出错了，请重新打开该页面试试', 'none');
        return false;
      }

      var imgUrls = that.data.imgUrls;

      chooseImgs(that.data.max - imgUrls.length, that.data.sizeType, that.data.sourceType)
        .then(tempFilePaths => {
          // that.setData({
          //   imgUrls: that.data.imgUrls.concat(tempFilePaths)
          // })
          wx.showLoading({
            title: '上传中',
          })
          var promises = tempFilePaths.map(uploadImg);
          Promise.all(promises).then(imgs => {
            // console.log(imgs);
            wx.hideLoading();
            that.setData({
              imgUrls: that.data.imgUrls.concat(imgs)
            })
            that.trigger();
          }).catch(info => {
            wx.hideLoading();
            var info = info ? info : 'error';
            toast_no_icon(info, 'none');
          })

        })
    },

    /**某张图片设为封面
     * @param Number index 图片的序号
     * @param String src 图片的地址
     */
    upFirst: function(index, src) {
      this.data.imgUrls.splice(index, 1);
      this.data.imgUrls.unshift(src);
      this.setData({
        imgUrls: this.data.imgUrls
      })
      //触发
      this.trigger();
    },

    /**编辑图片，即重新上传一张
     * @param Number index 图片的序号
     */
    changeImg: function(index) {
      var that = this;
      chooseImgs(1, that.data.sizeType, that.data.sourceType)
        .then(tempFilePaths => {
          uploadImg(tempFilePaths[0]).then(imgurl => {
            that.data.imgUrls[index] = imgurl;
            that.setData({
              imgUrls: that.data.imgUrls
            })
            that.trigger();
          }).catch(info => {
            toast_no_icon('编辑失败', 'none');
          })
        })
    },

    /**删除图片
     * @param Number index 图片的序号
     */
    delImg: function(index) {
      this.data.imgUrls.splice(index, 1);
      this.setData({
        imgUrls: this.data.imgUrls,
      })
      this.trigger();
    },

    /**触发事件，向父组件传值 */
    trigger: function() {
      var _this = this;
      _this.triggerEvent('getimgs', {
        "imgs": _this.data.imgUrls
      })
    },


    showAction: function(e) {
      // console.log(e.target.dataset.index);
      let dataset = e.target.dataset;
      var _this = this;
      wx.showActionSheet({
        itemList: ['设为封面', '编辑', '删除'],
        itemColor: '#999999',
        success: function(res) {
          // console.log(res.tapIndex);

          switch (res.tapIndex) {
            case 0:
              _this.upFirst(dataset.index, dataset.src);
              break;
            case 1:
              _this.changeImg(dataset.index);
              break;
            case 2:
              _this.delImg(dataset.index);
              break;
            default:
              break;
          }
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      })
    },
  }
})