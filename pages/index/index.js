Page({

  onLoad: function(e) {
    var textColor = "rgb(255, 255, 255)";
    var speed = 10;
    var text = "测试文字";
    var thisPage = this;
    wx.getSystemInfo({
      success: function(res) {
        var screenHeight = res.screenHeight;
        var screenWidth = res.screenWidth;

        // 定义文字移动的坐标
        var xPosition = screenHeight;

        var timer = setInterval(function() {

          var textCanvas = wx.createCanvasContext('text-canvas');

          // 旋转90度 让文字横屏
          textCanvas.rotate(0.5 * Math.PI);

          // 文字宽度 中间横条0.5倍屏幕宽
          textCanvas.setFontSize(parseInt(screenWidth * 0.5));
          // 获取文字长度
          var textwidth = textCanvas.measureText(text).width;
          textCanvas.setFillStyle(textColor);
          textCanvas.setTextAlign("start");

          textCanvas.save();
          if (xPosition < -textwidth) {
            xPosition = screenHeight;
          }
          textCanvas.fillText(text, xPosition--, -(0.25 * screenWidth));
          textCanvas.draw();
          textCanvas.restore();
        }, speed);
      }
    });
  },

  stopIt: function() {
    clearInterval(timer);
  },

  onUnload: function() {
    clearInterval(timer);
  }
})