<template>
  <div class="titbar w1760">
    <!-- <div class="logo">
      <img src="../../../static/images/logo.png" />
    </div>-->
    <div class="mainnav">
      <ul>
        <li
          v-for="(item,index) in msg"
          v-items
          class="nav_item"
          :style="{backgroundImage: 'url(' + img[index] + ')','margin-right':index==4 ? margin: activeMargin}"
          :key="index"
          @up="up(item,index)"
          @down="down(item,index)"
          @left="left(item,index)"
          @right="right(item,index)"
          @focus="focus(item,index)"
        >
          <span href="#">{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="debug" v-if="GLOBAL.debug==0">测试版本</div>
    <!-- <div class="debug" v-else-if="GLOBAL.debug==1">线上版本</div> -->

    <!-- <div class="top_toolbox">
      <a href="#" class="btn_search" v-items>
        <img src="../../../static/images/icon_search.png" />搜索
      </a>
      <a href="#" class="btn_login" v-items>
        <img src="../../../static/images/icon_login_btn.png" />
      </a>
      <a href="#" class="btn_getvip" v-items>
        <img src="../../../static/images/icon_vip_btn.png" />开会员
      </a>
    </div>-->
  </div>
</template>
<script>
import authUtils from "../../utils/authUtils";
import service from "../../services/commtend";
export default {
  name: "publichead",
  data() {
    return {
      isActiveWidth:true,
      margin: "0",
      activeMargin: "0.82rem",
      img: [
        require("../../../static/newimages/btn_bg_menu1.png"),
        require("../../../static/newimages/btn_bg_menu2.png"),
        require("../../../static/newimages/btn_bg_menu3.png"),
        require("../../../static/newimages/btn_bg_menu4.png"),
        require("../../../static/newimages/btn_bg_menu5.png")
      ],
      isactive: true,
      Myindex: 0,
      msg: [{ name: "推荐" }, { name: "全部" }],
      routes: ["/commtend", "/whole"],
      currentFocus: "", //记录当前导航
      path: "",
      parnter:''
    };
  },

  created() {
    let navdata = authUtils.getPublicvalue("navdata");
    this.parnter=authUtils.getPublicvalue('parnter')
    if (navdata) {
      let index = 0;
      navdata.forEach(item => {
        index++;
        this.msg.splice(index, 0, item);
        this.routes.splice(index, 0, "/cultivation");
      });
    } else {
      this.getData();
    }
    this.path = this.$route.path;

  },
  watch: {
    path(val) {}
  },
  mounted() {
    let _this = this;
    let a = authUtils.getPublicvalue("navCurrent");
    let b = authUtils.getPublicvalue("downCurrent");
    if (b) {
      let el = document.getElementsByClassName("nav_item")[a];
      el.classList.add("active_blurs");
    }
    if (a || a == 0) {
      setTimeout(function() {
        let el = document.getElementsByClassName("nav_item")[a];
        _this.$service.move(el);
      }, 200);
    } else {
      this.$service.move(this.$service.pointer);
    }
  },
  updated() {},
  methods: {
    getData() {
      service.getNav().then(ret => {
        let index = 0;
        authUtils.setPublicvalue("navdata", ret.data);
        ret.data.forEach(item => {
          index++;
          this.msg.splice(index, 0, item);
          this.routes.splice(index, 0, "/cultivation");
        });
      });
    },
    focus() {
      // this.$service.pointer.$el.classList.remove("active_blurs");
      // this.$service.pointer.$el.classList.remove("active_blur");
      // this.$service.pointer.$el.setAttribute("class").replace("active_blurs","active_blur")
    },
    up(item, index) {
      authUtils.setPublicvalue("navCurrent", index);
      let el = document.getElementsByClassName("collectBtn")[0];
      this.$service.move(el);
    },
    down(item, index) {
      this.$service.pointer.$el.classList.add("active_blur");
      authUtils.setPublicvalue("navCurrent", index);
      this.$service.move("down");
    },
    left(e, index) {
      authUtils.clearCurrent("topTitle");
      let myindex = 0;
      if (index == 0) {
        myindex = 0;
      } else {
        myindex = index - 1;
      }
      if (index > 0) {
        this.$router.push({
          path: this.routes[index - 1],
          query: { id: this.msg[myindex].id }
        });
        // this.$service.move("left");
        authUtils.setPublicvalue("navCurrent", index - 1);
      }
    },
    right(e, index) {
      authUtils.clearCurrent("topTitle");
      let myindex = 0;
      if (index == 5) {
        return;
        myindex = 5;
      } else {
        myindex = index + 1;
      }
      if (index <= this.msg.length) {
        this.$router.push({
          path: this.routes[index + 1],
          query: { id: this.msg[myindex].id }
        });
        // this.$service.move("right");
        authUtils.setPublicvalue("navCurrent", index + 1);
        authUtils.clearCurrent("downCurrent");
      }
    }
  }
};
</script>
<style scoped>
@import url("../../../static/css/style.css");
.focus_one {
  border-radius: 0.1rem;
  background: #169e00;
  border: 1px solid #169e00;
}
.active_blur {
  border: 0.025rem solid #fff;
  border-radius: 0.1rem;
}
.active_blurs {
  background: green;
  border: 1px solid green;
  border-radius: 0.1rem;
}
.debug {
  position: absolute;
  top: -1rem;
  right: 5rem;
  color: white;
  font-size: 0.5rem;
}
.focus {
  /* transition: 0.5s;
  transform: scale(1.1); */
  border: 0.025rem solid yellow;
   box-shadow: 0px 0px 0.3rem 0.1rem #ffff00;
  /* box-shadow: 0px 0px 0.3rem 0.1rem #ffff00; */
  border-radius: 0.2rem;
  /* outline: 0.02rem solid yellow; */
  /* -moz-outline-radius:0.2rem;  */
  /* z-index: 9999; */
}
</style>


