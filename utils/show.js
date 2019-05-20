function toast_no_icon(title,icon){
  wx.showToast({
    title: title,
    icon: icon
  })
}
exports.toast_no_icon = toast_no_icon;