var timer;

// 在页面中定义插屏广告
let interstitialAd = null;

Page({

  data: {
    showView: true,
    text: "",
    showModalStatus: false,
    animationData: {},
    currentColor: "white",// font color
    currentBackgroundColor: "black",
    currentSize: 0.5,
    currentSpeed: 5,
    currentSettingItem: "fontColor",
    settingItems: [{
      id: "fontColor",
      name: "字体颜色"
    }, {
      id: "fontSize",
      name: "字体大小"
    }, {
      id: "fontSpeed",
      name: "文字速度"
      }, {
        id: "backgroundColor",
        name: "背景颜色"
      }],
    fontColorItems: ["white", "red", "SpringGreen", "yellow", "lime", "green", "aqua", "blue", "purple", "DeepPink"],
    backgroundColorItems: ["black", "red", "SpringGreen", "yellow", "lime", "green", "aqua", "blue", "purple", "DeepPink"],
    fontSizeItems: [{
      size: 0.6,
      name: "大"
    }, {
      size: 0.5,
      name: "中"
    }, {
      size: 0.4,
      name: "小"
    }],
    fontSpeedItems: [{
      size: 3,
      name: "快"
    }, {
      size: 5,
      name: "中"
    }, {
      size: 10,
      name: "慢"
    }],
  },

  onLoad: function(options) {

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-f2c01707f7269d1b'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    };

    showView: (options.showView == "true" ? true : false);

    var thisPage = this;
    wx.getSystemInfo({
      success: function(res) {
        var screenHeight = res.screenHeight;
        var screenWidth = res.screenWidth;

        // 定义文字移动的坐标
        var xPosition = screenHeight;

        var speed = thisPage.data.currentSpeed;
        if (!speed) {
          speed = 5;
        }
        timer = setInterval(function() {

          var text = thisPage.data.text;
          var textColor = thisPage.data.currentColor;

          if (!text) {
            text = "手持led";
          }
          var textCanvas = wx.createCanvasContext('text-canvas');

          // 旋转90度 让文字横屏
          textCanvas.rotate(0.5 * Math.PI);

          // 文字宽度 中间横条0.5倍屏幕宽
          var textSize = thisPage.data.currentSize;
          if (!textSize) {
            textSize = 0.5;
          }
          textCanvas.setFontSize(parseInt(screenWidth * textSize));
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

  onchangeBackgroundColor: function (e) {
    this.setData({
      currentBackgroundColor: e.target.id
    });
  },

  onchangeSize: function(e) {
    this.setData({
      currentSize: e.target.id
    });
  },

  onchangeSpeed: function(e) {
    this.setData({
      currentSpeed: e.target.id
    });
    clearInterval(timer);
    this.onLoad(this.options);
  },

  onchangeSettingItem: function(e) {
    this.setData({
      currentSettingItem: e.target.id
    });
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    };
  },

  getInput: function(e) {
    var text = e.detail.value;
    if (!text) {
      return
    }
    var that = this;
    wx.cloud.callFunction({
      name: 'msgCheck',
      data: {
        inputText: text
      },
      success(res) {
        console.log('msgCheck success' + JSON.stringify(res))
      },
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '含有敏感信息，请重新输入'
        })
        console.log('msgCheck success' + JSON.stringify(res))
        that.setData({
          text: "请重新输入"
        })
      }
    })
    console.log('msgCheck set text');
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
  },

  toAdPage: function() {
    wx.navigateTo({
      url: '../ad/index'
    })
  }

})