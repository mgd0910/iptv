<template>
  <div class="wrap">
    <PublicLogo></PublicLogo>
    <PublicHead></PublicHead>
    <div class="tjbox w1760 item_list">
      <div class="main">
        <img :src="image" alt />
        <div class="content">
          <div class="content_title">{{title}}</div>
          <div class="content_text">{{content}}</div>
        </div>
      </div>
      <ul class="clearfix">
        <li
          v-for="(item,index) in erkeArr"
          v-items
          class="item_moreList"
          :key="index"
          @up="secondup(item,index)"
          @down="down(item,index)"
          @left="secondleft(item,index)"
          @right="lastright(item,index)"
          @focus="focus(item,index,0)"
          @blur="blur(item,index,0)"
          @click="clickItem(item,index)"
        >
          <span>
            <img :src="item.image" />
            <div class="title">
              <h4 class="move">{{item.course_name}}</h4>
            </div>
          </span>
          <div class="mianfei" v-if="item.isfree==1">免费</div>
          <div class="mianfei" v-if="item.isfree==2">收费</div>
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
import horse from "../utils/horse";

export default {
  components: {
    PublicHead,
    PublicLogo
  },
  data() {
    return {
      category: [],
      erkeArr: [],
      title: "",
      content: "",
      image: ""
    };
  },
  created() {
    this.parnter=authUtils.getPublicvalue('parnter')
  },
  mounted() {
    this.getData();
    //  ztebw.defaultalinkBgColor = none;
    // ztebw.defaultFocusColor = none;
    // ztebw.focusWidth = 0;
  },
  methods: {
    cache() {
      let a = authUtils.getPublicvalue("navCurrent");
      let b = authUtils.getPublicvalue("keshiCurrent");
      let _this = this;
      if (b) {
        setTimeout(function() {
          let el = document.getElementsByClassName("item_moreList")[b.index];
          _this.$service.move(el);
          el.scrollIntoView(false);
        }, 600);
        authUtils.clearCurrent("keshiCurrent");
      } else {
        let el = document.getElementsByClassName("nav_item")[a];
        this.$service.move(el);
        el.scrollIntoView(false);
      }
    },
    getData() {
      let params = { catid: this.$route.query.id };
      service.categoryallcourseList(params).then(ret => {
        this.erkeArr = ret.data.course_list;
        this.title = ret.data.category.name;
        this.content = ret.data.category.remark;
        this.image = ret.data.category.image;
        // this.category = ret.data.category;
        this.cache();
      });
    },
    focus(item, index, num) {
      horse.horse(index, num);
    },
    blur(item, index, num) {
      horse.blurHorse(index, num);
    },
    serviceBack() {
      let e = authUtils.getPublicvalue("morePath");
      console.log(e);
      this.$router.push({
        path: e.path,
        query: { id: e.id }
      });
    },
    clickItem(item, index) {
      authUtils.setPublicvalue("keshiCurrent", {
        index: index,
        class: "item_moreList"
      });
      authUtils.setPublicvalue("historyPath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: item.id }
      });
    },
    getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    secondleft(e, index) {
      if (index == 1) {
        this.$service.move(this.$el.querySelectorAll(".item_moreList")[0]);
      } else if (index % 4 == 0) {
        return false;
      } else {
        this.$service.move("left");
      }
    },
    secondup(e, index) {
      if (index <= 3) {
        this.getscrollIntoView(false);
        let a = authUtils.getPublicvalue("navCurrent");
        let el = document.getElementsByClassName("nav_item")[a];
        this.$service.move(el);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    one_up() {
      this.getscrollIntoView(false);
      let a = authUtils.getPublicvalue("navCurrent");
      let el = this.$service.getEleByPath(a.xpath);
      this.$service.move(el);
    },
    up() {
      this.getscrollIntoView(false);
      this.$service.move("up");
    },
    down(item, index) {
      this.getscrollIntoView(true);
      this.$service.move("down");
    },
    left(e, index) {
      this.$service.move("left");
    },
    right(e, index) {
      // let arr = this.$service.pointer.$el.parentNode.children; //获取父节点所有的子节点数量
      // if (index == arr.length - 1) {
      //   return;
      // } else {
      this.$service.move("right");
      // }
    },
    lastright(e, index) {
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
  border: 0.01rem solid yellow;
  box-shadow: 0px 0px 0.3rem 0.1rem #ffff00;
  border-radius: 0.1rem;
}
.title {
  position: absolute;
  left: 0;
  height: 0.5rem;
  bottom: 0;
  display: block;
  opacity: 0.7;
  background: #00082b;
  overflow: hidden;
  width: 100%;
}
.move {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
}
.mianfei {
  display: inline-block;
  color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.24rem;
  background: orange;
  padding: 0.1rem 0.1rem;
}
.main {
  width: 100%;
  height: 3.7rem;
}
.main img {
  display: inline-block;
  width: 6.56rem;
  height: 100%;
  float: left;
}
.content {
  width: 9.98rem;
  height: 5.245rem;
  float: left;
  margin-left: 0.85rem;
}
.content_title {
  font-weight: bold;
  font-size: 0.47rem;
  color: #fff;
}
.content_text {
  width: 100%;
  font-size: 0.3rem;
  margin-top: 0.58rem;
  color: #fff;
}
</style>

