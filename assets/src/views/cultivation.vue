<template>
  <div class="wrap">
    <PublicLogo></PublicLogo>
    <PublicHead></PublicHead>
    <div class="tjbox_2 w1760">
      <ul class="clearfix">
        <li
          v-for="(item,index) in arr1"
          v-items
          :key="index"
          class="item_cultivation"
          @up="secondup(item,index)"
          @down="down(item,index)"
          @left="secondleft(item,index)"
          @right="secondright(item,index)"
          @click="goProadcast_course_one(item,index)"
        >
          <span>
            <!-- <em class="viptips" v-if="item.vip!=''">{{item.vip}}</em> -->
            <img :src="item.image" />
            <div class="mianfei" v-if="item.isfree==1">免费</div>
            <div class="mianfei" v-if="item.isfree==2">收费</div>
            <!-- <div class="title">
              <h4 class="move">{{item.name}}</h4>
            </div>-->
            <!-- <h4>{{item.name}}</h4> -->
          </span>
        </li>
      </ul>
    </div>

    <div
      class="tjbox_3 w1760 clearfix arr3_item item_list"
      v-for="(value,num) in category_course_list"
      :key="num"
    >
      <h2>{{value.category.name}}</h2>
      <ul class="clearfix l">
        <li
          v-for="(item,index) in value.course_list"
          :key="index"
          v-items
          class="item_column"
          :style="{'margin-right':index==2 ? marginright: activeMargin}"
          @up="up(item,index)"
          @down="down(item,index)"
          @left="one_left(item,index,num)"
          @right="right(num,item,index)"
          @focus="focus(item,index,num)"
          @blur="blur(item,index,num)"
          @click="goProadcast_column(item,index,num)"
        >
          <span>
            <img :src="item.image" />
            <div class="title">
              <h4 class="move">{{item.course_name}}</h4>
            </div>
            <div class="mianfei" v-if="item.isfree==1">免费</div>
            <div class="mianfei" v-if="item.isfree==2">收费</div>
          </span>
        </li>
      </ul>
      <div class="morebox r" v-if="value.course_list.length>=3">
        <span
          href
          v-items
          class="item_more"
          @up="up(num)"
          @down="down()"
          @left="left()"
          @right="right(num)"
          @click="goMore(value.category,num)"
        >
          <span class="whole_main">查看全部内容</span>
        </span>
      </div>
    </div>

    <div class="keshicate w1760 clearfix" v-if="keshiNum!==0">
      <div
        class="tjbox_3 w1760 clearfix keshiLists item_keshilist"
        v-for="(value,num) in disease_category_course_list"
        :key="num"
      >
        <h2>{{value.category.name}}</h2>
        <ul class="clearfix l">
          <li
            v-for="(item,index) in value.course_list"
            :key="index"
            v-items
            class="item_column_keshi"
            :style="{'margin-right':index==2 ? marginright: activeMargin}"
            @up="keshiListUp()"
            @down="down(item,index)"
            @left="keshileft(item,index,num)"
            @right="keshiright(num,item,index)"
            @focus="keshifocus(item,index,num)"
            @blur="keshiblur(item,index,num)"
            @click="goProadcast_column_keshi(item,index,num)"
          >
            <span>
              <img :src="item.image" />
              <div class="title">
                <h4 class="move">{{item.course_name}}</h4>
              </div>
            </span>
          </li>
        </ul>
        <div class="morebox r" v-if="value.course_list.length>=3">
          <span
            href
            v-items
            class="item_more_keshi"
            @down="down()"
            @left="left()"
            @up="keshiListUp()"
            @right="right(num)"
            @click="gokeshiMore(value.category,num)"
          >
            <span class="whole_main">查看全部内容</span>
          </span>
        </div>
      </div>
      <ul class="clearfix l">
        <li
          v-for="(item,index) in keshi"
          v-items
          class="item_keshi"
          :style="{'margin-right':index==3||index==7 ? 0: '0.4rem'}"
          :key="index"
          @up="keshiup(item,index)"
          @down="down(item,index)"
          @left="keshilistleft(item,index)"
          @right="lastright(item,index)"
          @click="goDiseaseList(item,index)"
        >
          <span>
            <img :src="item.image" />
            <em v-if="item.image==''">{{item.name}}</em>
          </span>
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
import horse from "../utils/horse";

export default {
  name: "cultivation",
  components: {
    PublicHead,
    PublicLogo
  },
  props: ["current"],
  data() {
    return {
      marginright: "0",
      activeMargin: "0.4rem",
      arr1: [],
      arr2: [],
      keshi: [
        //按科室查病
      ],
      keshiNum: "",
      category_course_list: [],
      disease_category_course_list: [],
      url: "",
      backurl: ""
    };
  },
  mounted() {
    this.getData();
    this.url = window.location.href;
    this.backurl = this.url + authUtils.getPublicvalue("backurl");
    console.log(this.backurl);
  },
  watch: {},
  created() {
    this.parnter=authUtils.getPublicvalue('parnter')
  },
  methods: {
    cache() {
      let _this = this;
      let a = authUtils.getPublicvalue("downCurrent");
      let b = authUtils.getPublicvalue("topTitle");
      if (a) {
        if (a.class == "item_cultivation") {
          setTimeout(function() {
            let el = document.getElementsByClassName("item_cultivation")[
              a.index
            ];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
          authUtils.clearCurrent("downCurrent");
        } else if (a.class == "arr_items") {
          setTimeout(function() {
            let el = document.getElementsByClassName("arr_items")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
          authUtils.clearCurrent("downCurrent");
        } else if (a.class == "item_column") {
          setTimeout(function() {
            let el = document
              .getElementsByClassName("arr3_item")
              [a.num].getElementsByClassName("item_column")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
          authUtils.clearCurrent("downCurrent");
        } else if (a.class == "item_keshi") {
          setTimeout(function() {
            let el = document.getElementsByClassName("item_keshi")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
          authUtils.clearCurrent("downCurrent");
        } else if (a.class == "item_more") {
          setTimeout(function() {
            let el = document
              .getElementsByClassName("arr3_item")
              [a.num].getElementsByClassName("item_more")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
          authUtils.clearCurrent("downCurrent");
        } else if (a.class == "item_column_keshi") {
          setTimeout(function() {
            let el = document
              .getElementsByClassName("keshiLists")
              [a.num].getElementsByClassName("item_column_keshi")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
          authUtils.clearCurrent("downCurrent");
        } else if (a.class == "item_more_keshi") {
          setTimeout(function() {
            let el = document
              .getElementsByClassName("keshiLists")
              [a.num].getElementsByClassName("item_more_keshi")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
          authUtils.clearCurrent("downCurrent");
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
      }
    },
    keshifocus(item, index, num) {
      horse.horseKeshi(index, num);
    },
    keshiblur(item, index, num) {
      horse.blurKeshiHorse(index, num);
    },
    focus(item, index, num) {
      horse.horse(index, num);
    },
    blur(item, index, num) {
      horse.blurHorse(index, num);
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
        }
      }
    },
    getData() {
      let params = { catid: this.$route.query.id };
      // let retData = authUtils.getPublicvalue("retdatacultivation");
      // if (retData) {
      //   this.category_course_list = retData.data.category_course_list;
      //   retData.data.course_list.forEach((item, index) => {
      //     if (index <= 1) {
      //       this.arr1.push({
      //         id: item.id,
      //         ref_id: item.ref_id,
      //         image: item.image,
      //         name: item.course_name,
      //         isfree: item.isfree
      //       });
      //     } else {
      //       this.arr2.push({
      //         id: item.id,
      //         image: item.image,
      //         name: item.course_name
      //       });
      //     }
      //   });
      //   this.keshi = retData.data.disease_cat_list;
      //   this.keshiNum = this.keshi.length;
      //   this.disease_category_course_list =
      //     retData.data.disease_category_course_list;
      //   this.cache();
      // } else {
        service.categoryCourseList(params).then(ret => {
          authUtils.setPublicvalue("retdatacultivation", ret);
          this.category_course_list = ret.data.category_course_list;
          ret.data.course_list.forEach((item, index) => {
            if (index <= 1) {
              this.arr1.push({
                id: item.id,
                ref_id: item.ref_id,
                image: item.image,
                name: item.course_name,
                isfree: item.isfree
              });
            } else {
              this.arr2.push({
                id: item.id,
                image: item.image,
                name: item.course_name
              });
            }
          });
          this.keshi = ret.data.disease_cat_list;
          this.keshiNum = this.keshi.length;
          this.disease_category_course_list =
            ret.data.disease_category_course_list;
        });
        this.cache();
      // }
    },
    goMore(e, num) {
      authUtils.setPublicvalue("morePath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      authUtils.setPublicvalue("downCurrent", {
        index: 0,
        class: "item_more",
        num: num
      });

      this.$router.push({
        path: "/more",
        query: { id: e.id }
      });
    },

    gokeshiMore(e, num) {
      authUtils.setPublicvalue("morePath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      authUtils.setPublicvalue("downCurrent", {
        index: 0,
        class: "item_more_keshi",
        num: num
      });

      this.$router.push({
        path: "/more",
        query: { id: e.id }
      });
    },
    goProadcast_course_one(e, index) {
      console.log(e);
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "item_cultivation"
      });
      authUtils.setPublicvalue("historyPath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: e.ref_id }
      });
    },
    goProadcast_course_two(e, index) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "arr_items"
      });
      authUtils.setPublicvalue("historyPath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: e.id }
      });
    },
    goProadcast_column_keshi(e, index, num) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "item_column_keshi",
        num: num
      });
      authUtils.setPublicvalue("historyPath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: e.contentid }
      });
    },
    goProadcast_column(e, index, num) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "item_column",
        num: num
      });
      authUtils.setPublicvalue("historyPath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: e.contentid }
      });
    },
    goDiseaseList(e, index) {
      authUtils.setPublicvalue("morePath", {
        path: this.$route.path,
        id: this.$route.query.id
      });
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "item_keshi"
      });
      this.$router.push({
        path: "/more",
        query: { id: e.id, type: "keshi" }
      });
    },
    getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    keshiup(e, index) {
      if (
        this.arr1.length == 0 &&
        this.arr2.length == 0 &&
        this.category_course_list == 0
      ) {
        this.getscrollIntoView(false);
        let a = authUtils.getPublicvalue("navCurrent");
        let el = this.$service.getEleByPath(a.xpath);
        this.$service.move(el);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    keshiListUp() {
      this.getscrollIntoView(false);
      this.$service.move("up");
    },
    threeup(e, index) {
      if (index == 1) {
        this.getscrollIntoView(false);
        this.$service.move(this.$el.querySelectorAll(".item_cultivation")[0]);
      } else if (index == 3) {
        this.getscrollIntoView(false);
        this.$service.move(this.$el.querySelectorAll(".item_cultivation")[1]);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    secondleft(e, index) {
      if (index == 1) {
        this.$service.move(this.$el.querySelectorAll(".item_cultivation")[0]);
      } else {
        return false;
      }
    },
    one_left(e, index, num) {
      if (index == 1 && num == 0) {
        this.$service.move(this.$el.querySelectorAll(".item_column")[0]);
      } else if (index == 0) {
        return false;
      } else {
        this.$service.move("left");
      }
    },
    secondup(e, index) {
      let a = authUtils.getPublicvalue("navCurrent");
      let el = document.getElementsByClassName("nav_item")[a];
      el.classList.remove("active_blur");
      this.getscrollIntoView(false);
      this.$service.move(el);
    },
    up(num) {
      let arrlength = this.arr2.length;
      if (num == 0) {
        this.getscrollIntoView(false);
        this.$service.move(this.$el.querySelectorAll(".item_cultivation")[1]);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    down(item, index) {
      this.getscrollIntoView(true);
      this.$service.move("down");
    },
    left(e, index) {
      this.$service.move("left");
    },
    keshileft(e, index) {
      if (index == 0) {
        return false;
      } else {
        this.$service.move("left");
      }
    },
    keshilistleft(e, index) {
      if (index % 4 == 0) {
        return false;
      } else {
        this.$service.move("left");
      }
    },
    right(num, e, index) {
      if (
        this.category_course_list[num].course_list.length - 1 == index &&
        index !== 2
      ) {
        return;
      } else {
        this.$service.move("right");
      }
    },
    keshiright(num, e, index) {
      if (
        this.disease_category_course_list[num].course_list.length - 1 ==
          index &&
        index !== 2
      ) {
        return;
      } else {
        this.$service.move("right");
      }
    },
    secondright(e, index) {
      let arr = this.$service.pointer.$el.parentNode.children; //获取父节点所有的子节点数量
      if (index == arr.length - 1) {
        return;
      } else {
        this.$service.move("right");
      }
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
.blur {
  background: red;
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
.move {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
}
.whole_main {
  width: 100%;
  height: 100%;
  display: inline-block;
  font-size: 0.46rem;
  color: white;
  background-image: url("../../static/newimages/more.jpg");
  background-size: 100% 100%;
  line-height: 2.65rem;
  border-radius: 0.1rem;
}
.item_more_keshi {
  width: 100%;
  height: 100%;
  display: inline-block;
  position: relative;
}
</style>


