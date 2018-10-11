var timer;
Page({

  data: {
    showView: true,
    text: "",
    showModalStatus: false,
    animationData: {},
    currentColor: "white"
  },

  onLoad: function(options) {

    showView: (options.showView == "true" ? true : false);

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
          var textColor = thisPage.data.currentColor;

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

  clickCanvas: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    });
    
    that.hideModal();
  },

  clickSetting: function() {
    var that = this;
    that.setData({
      showModalStatus: true
    });
  },

  onchangeColor: function(e) {
    this.setData({
      currentColor: e.target.id
    });
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
  },

  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }
})