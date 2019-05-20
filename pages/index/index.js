Page({
  
  data: {},
  onLoad: function() {},

  getImgs: function(e) {
    console.log("从子组件得到的图片数组：");
    console.log(e.detail.imgs);
  }


})