// 监听键盘及遥控器按键
<template>
  <div class="addListenKeyDown"></div>
</template>
<script>
const Kv = {};

Kv.inputNo = 0;
Kv.itemNo = 0;
Kv.position = 0;
Kv.keyboardSelected = false;

if (typeof KeyEvent != "undefined") {
  if (typeof KeyEvent.VK_LEFT != "undefined") {
    var VK_LEFT = KeyEvent.VK_LEFT;
    var VK_UP = KeyEvent.VK_UP;
    var VK_RIGHT = KeyEvent.VK_RIGHT;
    var VK_DOWN = KeyEvent.VK_DOWN;
  }
  if (typeof KeyEvent.VK_ENTER != "undefined") {
    var VK_ENTER = KeyEvent.VK_ENTER;
  }
  if (typeof KeyEvent.VK_RED != "undefined") {
    var VK_RED = KeyEvent.VK_RED;
    var VK_GREEN = KeyEvent.VK_GREEN;
    var VK_YELLOW = KeyEvent.VK_YELLOW;
    var VK_BLUE = KeyEvent.VK_BLUE;
  }
  if (typeof KeyEvent.VK_PLAY != "undefined") {
    var VK_PLAY = KeyEvent.VK_PLAY;
    var VK_PAUSE = KeyEvent.VK_PAUSE;
    var VK_STOP = KeyEvent.VK_STOP;
  }
  if (typeof KeyEvent.VK_FAST_FWD != "undefined") {
    var VK_FAST_FWD = KeyEvent.VK_FAST_FWD;
    var VK_REWIND = KeyEvent.VK_REWIND;
  }
  if (typeof KeyEvent.VK_BACK != "undefined") {
    var VK_BACK = KeyEvent.VK_BACK;
    var VK_HTML5_BACK = KeyEvent.VK_BACK;
  }

  if (typeof KeyEvent.VK_CH_UP != "undefined") {
    var VK_CH_UP = KeyEvent.VK_CH_UP;
    var VK_CH_DOWN = KeyEvent.VK_CH_DOWN;
  }

  if (typeof KeyEvent.VK_0 != "undefined") {
    var VK_0 = KeyEvent.VK_0;
    var VK_1 = KeyEvent.VK_1;
    var VK_2 = KeyEvent.VK_2;
    var VK_3 = KeyEvent.VK_3;
    var VK_4 = KeyEvent.VK_4;
    var VK_5 = KeyEvent.VK_5;
    var VK_6 = KeyEvent.VK_6;
    var VK_7 = KeyEvent.VK_7;
    var VK_8 = KeyEvent.VK_8;
    var VK_9 = KeyEvent.VK_9;
  }
}

if (typeof VK_LEFT == "undefined") {
  var VK_LEFT = 0x25;
  var VK_UP = 0x26;
  var VK_RIGHT = 0x27;
  var VK_DOWN = 0x28;
}
if (typeof VK_ENTER == "undefined") {
  var VK_ENTER = 0x0d;
}
if (typeof VK_RED == "undefined") {
  var VK_RED = 0x74;
  var VK_GREEN = 0x75;
  var VK_YELLOW = 0x76;
  var VK_BLUE = 0x77;
}
if (typeof VK_PLAY == "undefined") {
  var VK_PLAY = 0x50;
  var VK_PAUSE = 0x51;
  var VK_STOP = 0x53;
}
if (typeof VK_FAST_FWD == "undefined") {
  var VK_FAST_FWD = 0x46;
  var VK_REWIND = 0x52;
}
if (typeof VK_BACK == "undefined") {
  var VK_BACK = 0x08;
}
if (typeof VK_0 == "undefined") {
  var VK_0 = 0x30;
  var VK_1 = 0x31;
  var VK_2 = 0x32;
  var VK_3 = 0x33;
  var VK_4 = 0x34;
  var VK_5 = 0x35;
  var VK_6 = 0x36;
  var VK_7 = 0x37;
  var VK_8 = 0x38;
  var VK_9 = 0x39;
}

if (typeof VK_CH_UP == "undefined") {
  var VK_CH_UP = 0x3d;
  var VK_CH_DOWN = 0x4d;
}

if (typeof VK_HTML5_UP == "undefined") {
  var VK_HTML5_UP = 0x01;
  var VK_HTML5_DOWN = 0x02;
  var VK_HTML5_LEFT = 0x03;
  var VK_HTML5_RIGHT = 0x04;
  var VK_HTML5_BACK = 0x016;
}
export default {
  data() {
    return {
      name: "keyboard",
      isKeydown: "false"
    };
  },
  mounted() {
    // let DEFAULT_WIDTH = 1280; //默认屏宽
    // let deviceWidth = window.screen.width; // 设备的宽度
    // let devicePixelRatio = window.devicePixelRatio || 1; // 物理像素和设备独立像素的比例，默认为1
    // let INITIALSCALE = "1";
    // if (DEFAULT_WIDTH > deviceWidth) {
    //   INITIALSCALE = deviceWidth / DEFAULT_WIDTH; //设备的缩放比
    // } else {
    //   INITIALSCALE = DEFAULT_WIDTH / deviceWidth;
    // }
    // var oMeta = document.createElement("meta");
    // oMeta.charset = "utf-8";
    // oMeta.name = "viewport";
    // oMeta.setAttribute("content", "initial-scale=" + INITIALSCALE);
    // document.getElementsByTagName("head")[0].appendChild(oMeta);
  },
  created: function() {
    //console.log("import keyDo init");
    this.initListen();
  },
  methods: {
    initListen() {
      let _this = this;
      document.onkeydown = function(e) {
        
        if (_this.handleKeyCode(e.keyCode)) {
          e.preventDefault();
        }
      };
    },
    handleKeyCode(kc) {
      //console.log("kv:---" + kc);
      if (kc == VK_RIGHT || kc == VK_HTML5_RIGHT) {
        this.KeyRight();
        return true;
      } else if (kc == VK_LEFT || kc == VK_HTML5_LEFT) {
        this.KeyLeft();
        return true;
      } else if (kc == VK_ENTER) {
        this.KeyEnter();
        return true;
      } else if (kc == VK_UP || kc == VK_HTML5_UP) {
        this.KeyUp();
        return true;
      } else if (kc == VK_DOWN || kc == VK_HTML5_DOWN) {
        this.KeyDown();
        return true;
      } else if (
        kc == VK_BACK ||
        kc == VK_HTML5_BACK ||
        kc == 340 ||
        kc == 27 ||
        kc == 461 ||
        kc == 8
      ) {
        this.KeyBack();
        return true;
      } else if (kc == 513 || kc == 832 || kc == 835) {
        this.gotoIndex();
        return true;
      } else if (kc == 125 || kc == 415) {
        return true;
      } else if (kc == 127 || kc == 19) {
        return true;
      }
      return false;
    },
    KeyDown() {
      this.$emit("listenKeyCode", "down");
    },
    KeyUp() {
      this.$emit("listenKeyCode", "up");
    },
    KeyLeft() {
      this.$emit("listenKeyCode", "left");
    },
    KeyRight() {
      this.$emit("listenKeyCode", "right");
    },
    KeyEnter() {
      this.$emit("listenKeyCode", "KeyEnter");
    },
    KeyBack() {
      this.$emit("listenKeyCode", "KeyBack");
    }
  },
  destroyed() {
    //console.log("keyDo component destroyed");
  }
};
</script>
