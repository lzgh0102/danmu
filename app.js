//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'shouchiled-927si',
      traceUser: true
    })
  }
})