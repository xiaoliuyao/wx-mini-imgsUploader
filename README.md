wx-mini-imgsUploader
===

  一个适用于小程序的多张图片上传的组件。  
  引用的时候需要自己修改：  
  ___utils/upimg.js里的上传图片地址UPIMG_URL（具体看你的区域）；七牛空间的外链地址IMG_DOMAIN；从后端获取上传token的地址。___

#### 效果
![效果1](http://pre7kddvq.bkt.clouddn.com/img_uploader.gif)  
![效果2](http://pre7kddvq.bkt.clouddn.com/img_uploader3.gif)

#### 特点
* 选择图片后按照选择顺序上传到七牛云
* 显示最多可上传的图片数量和已上传的数量
* 点击图片，可选择设为封面、编辑或删除（删除只是页面上的删除，不是从七牛云中删除）
* 每次操作设为封面、编辑、删除或上传的时候，都会返回一个新的图片数组

#### 参数
|参数|是否必需|默认值|描述|
|:--|:--|:--|:--|
|max|false|9|最多上传几张图片（值不可超过9）|
|sizeType|false|['original', 'compressed']|所选的图片的尺寸|
|sourceType|false|['album', 'camera']|图片的来源|


#### 引用

---
index.json
```
{
  "navigationBarTitleText": "多图上传",
  "usingComponents": {
    "imgsUploader":"/component/imgsUploader"
  }
}
```

index.wxml
```
<imgsUploader max="6" sizeType="{{['compressed']}}" sourceType="{{['album']}}" bindgetimgs="getImgs"></imgsUploader>
```

index.js
```
getImgs: function(e) {
    console.log("从子组件得到的图片数组：");
    console.log(e.detail.imgs);
}
```
