<template>
  <div class="wrap">
    <PublicLogo></PublicLogo>
    <PublicHead></PublicHead>
    <div
      class="tjbox_4 w1760 item_wholes item_list"
      v-for="(value,num) in category_course_list"
      :key="num"
    >
      <h2>{{value.category.name}}</h2>
      <ul class="clearfix">
        <li
          v-for="(item,index) in value.items"
          v-items
          :key="index"
          :style="{'margin-right':index==2 ? marginright: activeMargin}"
          class="item_whole"
          @up="up(item,index,num)"
          @down="down(item,index)"
          @left="left(item,index,num)"
          @right="right(item,index)"
          @click="clickItem(item,index,num)"
        >
          <div style="height:100%;">
            <img :src="item.image" style="height:100%;width:100%;" />
            <div class="title">
              <span class="move"></span>
              <span v-if="item.image==''">{{item.name}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import PublicHead from "./component/PublicHead.vue";
import PublicLogo from "./component/PublicLogo.vue";

import authUtils from "../utils/authUtils";
import service from "../services/commtend";
import cut from "../utils/cut";
export default {
  name: "whole",
  components: {
    PublicHead,
    PublicLogo
  },
  props: ["current"],
  data() {
    return {
      marginright: "0",
      activeMargin: "0.4rem",
      category_course_list: [],
      url: "",
      backurl: ""
    };
  },
  created() {
    this.getData();
    this.url = window.location.href;
    this.backurl = `${this.url}?${authUtils.getPublicvalue("backurl")}`;
  },
  activated() {
    this.getData();
    this.url = window.location.href;
    this.backurl = `${this.url}?${authUtils.getPublicvalue("backurl")}`;
  },
  mounted() {},
  methods: {
    cache() {
      let _this = this;
      var a = authUtils.getPublicvalue("downCurrent");
      var b = authUtils.getPublicvalue("topTitle");
      if (a) {
        setTimeout(function() {
          console.log(a);
          let el = document
            .getElementsByClassName("item_wholes")
            [a.num].getElementsByClassName("item_whole")[a.index];
          _this.$service.move(el);
          el.scrollIntoView(false);
        }, 600);
      } else if (b) {
        if (b.type == "collect") {
          setTimeout(function() {
            let el = document.getElementsByClassName("collectBtn")[0];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        } else if (b.type == "history") {
          setTimeout(function() {
            let el = document.getElementsByClassName("historyBtn")[0];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        }
      }
    },
    getData() {
      let retdata = authUtils.getPublicvalue("retdatawhole");
      if (retdata) {
        this.category_course_list = retdata.data;
        this.cache();
      } else {
        service.categoryList().then(ret => {
          authUtils.setPublicvalue("retdatawhole", ret);
          this.category_course_list = ret.data;
          this.cache();
        });
      }
    },
    serviceBack() {
      if (cut.GetQueryValue(this.backurl, "fromLaunch")) {
        Utility.setValueByName("exitIptvApp");
      } else {
        if (cut.GetQueryValue(this.backurl, "backUrl")) {
          this.backurl = cut.GetQueryValue(this.backurl, "backUrl");
          window.location.href = this.backurl;
        } else if (cut.GetQueryValue(this.backurl, "backurl")) {
          this.backurl = cut.GetQueryValue(this.backurl, "backurl");
          window.location.href = this.backurl;
        } else {
        }
      }
    },
    clickItem(item, index, num) {
      authUtils.setPublicvalue("morePath", {
        path: this.$route.path
      });
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "item_whole",
        num: num
      });

      this.$router.push({
        path: "/more",
        query: { id: item.id }
      });
    },
    getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    up(e, index, num) {
      if (num == 0) {
        let a = authUtils.getPublicvalue("navCurrent");
        let el = document.getElementsByClassName("nav_item")[a];
        this.$service.move(el);
        this.getscrollIntoView(false);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    down(item, index) {
      this.getscrollIntoView(true);
      this.$service.move("down");
    },
    left(e, index, num) {
      if (num == 0 && index == 1) {
        this.$service.move(this.$el.querySelectorAll(".item_whole")[index - 1]);
      } else if (index % 3 == 0) {
        return;
      } else {
        this.$service.move("left");
      }
    },
    right(e, index) {
      let arr = this.$service.pointer.$el.parentNode.children; //获取父节点所有的子节点数量
      if (index == arr.length - 1) {
        return;
      } else {
        this.$service.move("right");
      }
    }
  }
};
</script>
<style scoped>
@import url("../../static/css/style.css");
.wrap {
  background-image: url("../../static/newimages/body_bg.jpg");
  margin-bottom: 1.37rem;
}
.focus {
  box-shadow: 0px 0px 0.3rem 0.1rem #ffff00;
}
.tjbox_4 ul img {
  width: 100%;
  height: 100%;
}
</style>


