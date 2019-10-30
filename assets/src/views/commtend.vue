<template>
  <div class="wrap">
    <PublicLogo></PublicLogo>
    <PublicHead></PublicHead>
    <swiper :bannerData="bannerList" :listData="listData"></swiper>
    <div class="keshiList">
      <div
        class="keshiItem"
        v-for="(item,index) in keshiItem"
        :key="index"
        :style="{'margin-top': marginTop,'margin-right':index==3||index==7 ? margin: activeMargin}"
        v-items
        @up="keshiup(item,index)"
        @down="down"
        @click="gokeshiList(item,index)"
      >
        <img :src="item.image" alt />
        <span>{{item.title}}</span>
      </div>
    </div>
    <div class="tjbox w1760 item_list" v-for="(value,num) in category_list" :key="num">
      <h2>{{value.category.name}}</h2>
      <ul class="clearfix">
        <li
          v-for="(item,index) in value.item"
          v-items
          id="id"
          class="item_commtend_two"
          :key="index"
          @up="up(item,index)"
          @down="down(item,index)"
          @left="left(item,index)"
          @right="right(item,index)"
          @click="clickItem_two(item,index,num)"
          @focus="focus(item,index,num)"
          @blur="blur(item,index,num)"
        >
          <span>
            <img :src="item.image" />
            <div class="title">
              <h4 class="move">{{item.title}}</h4>
            </div>
            <div class="mianfei" v-if="item.isfree==1">免费</div>
            <div class="mianfei" v-if="item.isfree==2">收费</div>
          </span>
        </li>
      </ul>
    </div>
    <div class="disease tjbox item_list_bottom">
      <div class="disease_title">疾病防治</div>
      <div class="disease_top">
        <div
          v-for="(item,index) in disease_top"
          :key="index"
          @down="down"
          :style="{'margin-right':index==1 ? 0: '0.4rem'}"
          v-items
          @click="diaseaeTop(item,index)"
          class="disease_big"
        >
          <img :src="item.image" />
          <div class="mianfei" v-if="item.isfree==1">免费</div>
          <div class="mianfei" v-if="item.isfree==2">收费</div>
        </div>
      </div>
      <ul class="disease_bottom">
        <li
          v-for="(item,index) in disease_bottom"
          :key="index"
          :style="{'margin-right':index==3 ? 0: '0.4rem'}"
          v-items
          @click="diseaseBottom(item,index)"
          class="disease_small"
          @focus="focus_bottom(item,index,0)"
          @blur="blur_bottom(item,index,0)"
        >
          <span>
            <img :src="item.image" />
            <div class="title">
              <h4 class="move">{{item.title}}</h4>
            </div>
            <div class="mianfei" v-if="item.isfree==1">免费</div>
            <div class="mianfei" v-if="item.isfree==2">收费</div>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import PublicHead from "./component/PublicHead.vue";
import PublicLogo from "./component/PublicLogo.vue";
import swiper from "./swiper.vue";
import authUtils from "../utils/authUtils";
import service from "../services/commtend";
import cut from "../utils/cut";
import horse from "../utils/horse";

export default {
  name: "commtend",
  props: ["current"],
  components: {
    PublicHead,
    swiper,
    PublicLogo
  },
  data() {
    return {
      bannerList: [],
      bannerData: [],
      listData: [],
      margin: "0",
      activeMargin: "0.4rem",
      marginTop: "0.4rem",
      disease_top: [
        { img: require("../../static/newimages/9.jpg") },
        { img: require("../../static/newimages/10.jpg") }
      ],
      disease_bottom: [
        { img: require("../../static/newimages/11.jpg") },
        { img: require("../../static/newimages/12.jpg") },
        { img: require("../../static/newimages/13.jpg") },
        { img: require("../../static/newimages/14.jpg") }
      ],
      keshiItem: [
        { img: require("../../static/newimages/ks1.jpg"), name: "" },
        { img: require("../../static/newimages/ks2.jpg"), name: "外科" },
        { img: require("../../static/newimages/ks3.jpg"), name: "男科" },
        { img: require("../../static/newimages/ks4.jpg"), name: "妇产科" },
        { img: require("../../static/newimages/ks5.jpg"), name: "肿瘤科" },
        { img: require("../../static/newimages/ks6.jpg"), name: "传染科" },
        { img: require("../../static/newimages/ks7.jpg"), name: "急诊科" },
        { img: require("../../static/newimages/ks8.jpg"), name: "全部科室" }
      ],
      slidesReal: [
        { img: require("../../static/images/tj1.jpg") },
        { img: require("../../static/images/tj2.jpg") },
        { img: require("../../static/images/tj3.jpg") },
        { img: require("../../static/images/tj4.jpg") }
      ],
      backurl: "",
      url: "",
      downcurrent: "",
      category_list: [],
      arr1: [],
      data: [],
      childDiseas: [], //小儿推拿
      cup: [], //拔罐刮痧
      acupuncture: [], //针灸推拿
      great: [],
      id: "", //大家都在看
      video_code: "",
      epg_info: "", //地址栏携带的参数
      partner: "" //平台参数
    };
  },
  created() {
    this.parnter = authUtils.getPublicvalue("parnter");
    // if(true){
    //   require('../../static/css/style.css')
    // }else{
    //    require('../../static/css/style.css')
    // }
  },
  mounted() {
    let _this = this;
    this.getData();
    this.url = window.location.href;
    this.backurl = `${this.url}?${authUtils.getPublicvalue("backurl")}`;
  },
  updated() {},
  methods: {
    cache() {
      let _this = this;
      let a = authUtils.getPublicvalue("downCurrent");
      let b = authUtils.getPublicvalue("topTitle");
      if (a) {
        if (a.class == "item_commtend_one") {
          setTimeout(function() {
            let el = document.getElementsByClassName("item_commtend_one")[
              a.index
            ];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        } else if (a.class == "item_commtend_two") {
          setTimeout(function() {
            let el = document
              .getElementsByClassName("item_list")
              [a.num].getElementsByClassName("item_commtend_two")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        } else if (a.class == "disease_big") {
          setTimeout(function() {
            let el = document.getElementsByClassName("disease_big")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        } else if (a.class == "disease_small") {
          setTimeout(function() {
            let el = document.getElementsByClassName("disease_small")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        } else if (a.class == "keshiItem") {
          setTimeout(function() {
            let el = document.getElementsByClassName("keshiItem")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        } else if (a.class == "listItem") {
          setTimeout(function() {
            let el = document.getElementsByClassName("listItem")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        } else if (a.class == "banner") {
          setTimeout(function() {
            let el = document.getElementsByClassName("banner")[0];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        }
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
      } else {
        let el = document.getElementsByClassName("nav_item")[0];
        _this.$service.move(el);
      }
    },
    focus(item, index, num) {
      horse.horse(index, num);
    },
    blur(item, index, num) {
      horse.blurHorse(index, num);
    },
    focus_bottom(item, index, num) {
      horse.bottom_horse(index, num);
    },
    blur_bottom(item, index, num) {
      horse.bottom_horse_stop(index, num);
    },
    gokeshiList(e, index) {
      console.log(e);
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "keshiItem"
      });
      authUtils.setPublicvalue("morePath", {
        path: this.$route.path
      });
      this.$router.push({
        path: "/more",
        query: { id: e.ref_id }
      });
    },
    clickMe(item, index) {},
    //获取列表数据
    getData() {
      let retData = authUtils.getPublicvalue("retdatacommtend");
      if (retData) {
        this.arr1 = retData.data.index_head_list;
        this.category_list = retData.data.category_list;
        this.bannerList = retData.data.index_head_banner;
        this.listData = retData.data.index_head_list;
        this.disease_top = retData.data.index_bottom_big_list;
        this.disease_bottom = retData.data.index_bottom_small_list;
        this.keshiItem = retData.data.index_head_department_list;
        this.cache();
      } else {
        service.homepage().then(ret => {
          authUtils.setPublicvalue("retdatacommtend", ret);
          this.arr1 = ret.data.index_head_list;
          this.category_list = ret.data.category_list;
          this.bannerList = ret.data.index_head_banner;
          this.listData = ret.data.index_head_list;
          this.disease_top = ret.data.index_bottom_big_list;
          this.disease_bottom = ret.data.index_bottom_small_list;
          this.keshiItem = ret.data.index_head_department_list;
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
          return;
        }
      }
    },
    clickItem_one(item, index) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "item_commtend_one"
      });
      authUtils.setPublicvalue("historyPath", { path: this.$route.path });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: item.ref_id }
      });
    },
    clickItem_two(item, index, num) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "item_commtend_two",
        num: num
      });
      authUtils.setPublicvalue("historyPath", { path: this.$route.path });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: item.ref_id }
      });
    },
    diaseaeTop(item, index) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "disease_big"
      });
      authUtils.setPublicvalue("historyPath", { path: this.$route.path });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: item.ref_id }
      });
    },
    diseaseBottom(item, index) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "disease_small"
      });
      authUtils.setPublicvalue("historyPath", { path: this.$route.path });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: item.ref_id }
      });
    },
    getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    secondleft(e, index) {
      if (index % 4 == 1) {
        this.$service.move(
          this.$el.querySelectorAll(".item_commtend_one")[index - 1]
        );
      } else {
        this.$service.move("left");
      }
    },
    secondup(e, index) {
      const num = this.arr1.length;
      if (index < 4) {
        let a = authUtils.getPublicvalue("navCurrent");
        let el = document.getElementsByClassName("nav_item")[a];
        this.$service.move(el);
      } else {
        this.$service.move("up");
      }
      this.getscrollIntoView(false);
    },
    keshiup(item, index) {
      if (index == 1) {
        let el = document.getElementsByClassName("banner")[0];
        this.$service.move(el);
        this.getscrollIntoView(false);
      } else {
        this.$service.move("up");
        this.getscrollIntoView(false);
      }
    },
    up() {
      this.getscrollIntoView(false);
      this.$service.move("up");
    },
    enddown(e, index) {},
    down(item, index) {
      this.getscrollIntoView(true);
      this.$service.move("down");
    },
    left(e, index) {
      this.$service.move("left");
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
@import url("../../static/css/style1.css");
@import url("../../static/css/toast.css");
.focus {
  border: 0.02rem solid yellow;
  box-shadow: 0px 0px 0.3rem 0.1rem #ffff00;
  border-radius: 0.1rem;
  
}
.wrap {
  background-image: url("../../static/newimages/body_bg.jpg");
}
.moveParent {
  position: relative;
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
  border-radius: 0 0 0.1rem 0.1rem;
}
.disease_big {
  position: relative;
  width: 8.6rem;
  height: 2.27rem;
  display: inline-block;
}
.disease_small {
  position: relative;
  width: 4.1rem;
  height: 2.31rem;
  display: inline-block;
}
.move {
  position: relative;
  bottom: 0;
  left: 0;
  /* text-indent: 0.17rem; */
  width: 100%;
  height: 100%;
  font-size: 0.36rem;
  color: #fff;
  font-weight: normal;
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
.keshiList {
  width: 17.6rem;
  height: 4.4rem;
  margin: 0 auto;
  margin-bottom: 0.8rem;
}
.keshiItem {
  position: relative;
  width: 4.1rem;
  height: 2rem;
  display: inline-block;
  border-radius: 0.1rem;
}
.keshiItem img {
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
}
.keshiItem span {
  position: absolute;
  left: 50%;
  top: 50%;
  display: inline-block;
  font-size: 0.46rem;
  width: 100%;

  text-align: center;
  /* transform: translate(-50%, -50%); */
  margin-top: -0.25rem;
  margin-left: -2.05rem;
  /* border: 1px solid red; */
  font-weight: bold;
  color: white;
}
.disease {
  width: 17.6rem;
  height: 100%;
  margin: 0 auto;
}
.disease_title {
  font-size: 0.48rem;
  color: white;
  font-weight: bold;
}
.disease_top {
  width: 100%;
  height: 2.27rem;

  margin-top: 0.39rem;
}
.disease_top img {
  width: 8.6rem;
  height: 100%;
  border-radius: 0.1rem;
}
.disease_bottom {
  width: 100%;
  height: 2.4rem;
  margin-top: 0.43rem;
  margin-bottom: 1.37rem;
}
.disease_bottom img {
  width: 4.1rem;
  height: 100%;
  border-radius: 0.1rem;
}
</style>


