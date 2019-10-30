<template>
  <div class="box">
    <div class="mains">
      <div id="benner" class="banner" v-items @up="up" @down="down" @click="haha()">
        <div class="img">
          <img
            :src="item.image"
            class="imga"
            :ref_id="item.ref_id"
            v-for="(item,index) in bannerData"
            :key="index"
          />
        </div>
        <ul class="title">
          <li class="nr active"></li>
          <li class="nr"></li>
          <li class="nr"></li>
          <li class="nr"></li>
          <li class="nr"></li>
        </ul>
      </div>
    </div>
    <div class="swiperList">
      <div
        class="listItem"
        v-for="(item,index) in listData"
        v-items
        @down="down"
        @up="listUp(item,index)"
        :key="index"
        :style="{'margin-right':index==1||index==3 ? marginright: activeMarginright}"
        @click="commteng_right(item,index)"
      >
        <img :src="item.image" />
        <span class="mianfei" v-if="item.isfree==1">免费</span>
        <span class="mianfei" v-if="item.isfree==2">收费</span>
      </div>
    </div>
  </div>
</template>
<script>
import authUtils from "../utils/authUtils";
import swiper from "../utils/swiper";

export default {
  name: "swiper",
  props: ["bannerData", "listData"],
  data() {
    return {
      auto: "",
      marginright: "0",
      activeMarginright: "0.4rem",
      isActive: true,
      listItem: [],
      images: [],
      btns: [
        { index: 1 },
        { index: 2 },
        { index: 3 },
        { index: 4 },
        { index: 5 }
      ]
    };
  },
  beforeMount() {},
  created() {},
  updated() {},
  mounted() {
    let _this = this;
    setTimeout(function() {
      _this.benner("#benner", ".nr", ".imga", 0);
    }, 600);
  },

  beforeDestroy() {
    clearInterval(this.auto);
    this.auto = null;
  },
  watch: {},
  methods: {
    commteng_right(e, index) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "listItem"
      });
      authUtils.setPublicvalue("historyPath", { path: this.$route.path });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: e.ref_id }
      });
    },
    benner(parent, controller, mod, num) {
      // var auto;
      let _this = this;
      var num = num;
      var controller = $(controller);
      var mod = $(mod);
      var benner = $(parent);
      var autoPlayTime = 1500;
      var imgNum = mod.length - 1;

      autoPlay();
      //根据传进来的名字获取这个名字所对应的对象
      function $(name) {
        if (name[0] == "#") {
          return document.getElementById(name.substr(1));
        } else if (name[0] == ".") {
          return document.getElementsByClassName(name.substr(1));
        } else {
          return document.getElementsByTagName(name);
        }
      }

      //实现鼠标划过圆点,变化图片的效果
      //function change(controller, mod){
      //遍历控制器,绑定鼠标划过事件
      for (var i = 0; i < controller.length; i++) {
        //给控制器加个索引,并把i值赋值给索引
        controller[i].index = i;
        //给所有的控制器都加划过事件
        controller[i].onmouseover = function() {
          for (var j = 0; j < controller.length; j++) {
            //将所有控制器改为默认样式
            controller[j].className = "nr";
          }
          //改变所选的控制器样式
          this.className = "nr active";
          //将模型改为默认样式
          for (var x = 0; x < mod.length; x++) {
            mod[x].className = "imga";
          }
          //改变所选控制器对应的模型的样式
          mod[this.index].className = "imga active";
        };
      }
      //}
      //绑定鼠标移入,暂停播放图片
      // benner.onmouseover = function() {
      //   clearInterval(auto);
      // };
      // //绑定鼠标离开,继续播放
      // benner.onmouseleave = function() {
      //   autoPlay();
      // };
      //指定播放那个图片
      function play(num) {
        for (var j = 0; j < controller.length; j++) {
          controller[j].className = "nr";
        }
        controller[num].className = "nr active";
        for (var x = 0; x < mod.length; x++) {
          mod[x].className = "imga";
        }
        mod[num].className = "imga active";
      }
      //自动播放
      function autoPlay() {
        _this.auto = setInterval(function() {
          if (num > imgNum) {
            num = 0;
          }
          play(num);
          num++;
        }, autoPlayTime);
      }
    },
    focus() {
      clearInterval(this.auto);
      this.auto = null;
    },
    blur() {
      this.benner("#benner", ".nr", ".imga", 0);
    },
    right() {
      this.$service.move(this.$el.querySelectorAll(".listItem")[0]);
    },
    getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    up() {
      let a = authUtils.getPublicvalue("navCurrent");
      console.log(a);
      let el = document.getElementsByClassName("nav_item")[a];
      this.$service.move(el);
      this.getscrollIntoView(false);
    },
    down() {
      this.$service.move("down");
      this.getscrollIntoView(false);
    },
    listUp(e, index) {
      if (index == 1 || index == 0) {
        let a = authUtils.getPublicvalue("navCurrent");
        let el = document.getElementsByClassName("nav_item")[a];
        this.$service.move(el);
      } else {
        this.$service.move("up");
      }
      this.getscrollIntoView(false);
    },
    haha() {
      let arr1 = document
        .getElementById("benner")
        .lastChild.getElementsByTagName("li");
      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i].getAttribute("class").indexOf("active") > -1) {
          var ref_id = document
            .getElementById("benner")
            .firstChild.childNodes[i].getAttribute("ref_id");
          authUtils.setPublicvalue("downCurrent", {
            class: "banner"
          });
          authUtils.setPublicvalue("historyPath", { path: this.$route.path });
          this.$router.push({
            path: "/proadcastcopy_one",
            query: { courseid: ref_id }
          });
        }
      }
    }
  }
};
</script>
<style scoped>
.box {
  width: 17.6rem;
  height: 4.84rem;
  margin: 0 auto;
}
.mains {
  width: 8.6rem;
  float: left;
}
.mianfei {
  display: inline-block;
  color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.24rem;
  background: orange;
  padding: 0.1rem 0.1rem;
}
.swiperList {
  width: 8.6rem;
  height: 4.84rem;
  float: right;
}
.swiperList .listItem img {
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
}
.listItem {
  position: relative;
  width: 4.1rem;
  height: 2.31rem;
  float: left;
  margin: 0 0.3rem 0.25rem 0;
}
.focus {
  border: 0.02rem solid yellow;
  box-shadow: 0px 0px 0.3rem 0.1rem #ffff00;
  border-radius: 0.1rem;
}

body {
  padding: 0.2rem;
}

#benner {
  position: relative;
  width: 8.6rem;
  height: 4.84rem;
  border: 0.01rem solid white;
  border-radius: 0.1rem;
  overflow: hidden;
}
#benner .imga {
  display: none;
  width: 8.6rem;
  height: 4.84rem;
}

#benner .img .active {
  display: block;
}

#benner .title {
  position: absolute;
  width: 100%;
  height: 0.16rem;
  border-radius: 0.3rem;
  left: 50%;
  bottom: 10%;
  margin-left: -0.7rem;
}

#benner .title .nr {
  list-style: none;
  width: 0.1rem;
  height: 0.1rem;
  background: #fff;
  border-radius: 0.1rem;
  float: left;
  margin-right: 0.1rem;
  margin-bottom: 0;
  text-align: center;
}

#benner .title .active {
  background: yellow;
}
</style>


