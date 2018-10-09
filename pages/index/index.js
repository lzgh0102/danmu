var timer;
Page({

  data: {
    showView: false,
    text: ""
  },

  onLoad: function(options) {

    showView: (options.showView == "true" ? true : false);

    var textColor = "rgb(255, 255, 255)";
    var speed = 5;
    var thisPage = this;
    wx.getSystemInfo({
      success: function(res) {
        var screenHeight = res.screenHeight;
        var screenWidth = res.screenWidth;

        // 定义文字移动的坐标
        var xPosition = screenHeight;

        timer = setInterval(function() {

          var text = thisPage.data.text;
          if (!text) {
            text = "手持弹幕";
          }
          var textCanvas = wx.createCanvasContext('text-canvas');

          // 旋转90度 让文字横屏
          textCanvas.rotate(0.5 * Math.PI);

          // 文字宽度 中间横条0.5倍屏幕宽
          textCanvas.setFontSize(parseInt(screenWidth * 0.5));
          // 获取文字长度
          var textwidth = textCanvas.measureText(text).width;
          textCanvas.setFillStyle(textColor);
          textCanvas.setTextBaseline('middle');
          textCanvas.setTextAlign('start');

          textCanvas.save();
          if (xPosition < -textwidth) {
            xPosition = screenHeight;
          }
          textCanvas.fillText(text, xPosition--, -(0.5 * screenWidth));
          textCanvas.draw();
          textCanvas.restore();
        }, speed);
      }
    });
  },

  // stopIt: function() {
  //   clearInterval(timer);
  // },

  clickCanvas: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    });

    // clear input
    // if (that.data.showView) {
    //   that.setData({
    //     text: ""
    //   });
    // }
  },

  getInput: function(e) {
    var text = e.detail.value;
    this.setData({
      text: text
    })
  },

  focusInput: function() {
    this.setData({
      text: ""
    })
  },

  onUnload: function() {
    clearInterval(timer);
  }
})