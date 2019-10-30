<template>
  <div class="wrap">
    <div class="titbar w1760">
      <div class="logo">
        <img src="../../static/images/logo.png" />
      </div>
      <!-- <div class="top_toolbox">
        <a href="#" class="btn_search" v-items>
          <img src="../../static/images/icon_search.png" />搜索
        </a>
        <a href="#" class="btn_login" v-items>
          <img src="../../static/images/icon_login_btn.png" />
        </a>
        <a href="#" class="btn_getvip" v-items>
          <img src="../../static/images/icon_vip_btn.png" />开会员
        </a>
      </div>-->
    </div>
    <div class="play w1760 clearfix">
      <div class="playbox l"></div>
      <div class="playinfo r">
        <dl class="playtext">
          <dt>{{info.course_name}}</dt>
          <dd>{{info.description}}</dd>
        </dl>
        <ul class="playtoolbar clearfix">
          <li class="item" v-items="{default:true}">
            <a href>
              <img src="../../static/images/icon-fullscreem.png" />
              <span>全屏</span>
            </a>
          </li>
          <!-- <li class="item" v-items>
            <a href class="not_collected">
              <img src="../../static/images/icon_shoucang_unselect.png" />
              <span>收藏</span>
            </a>
          </li>
          <li class="item" v-items>
            <a href>
              <img src="../../static/images/icon_joinVIP.png" />
              <span>开通VIP</span>
            </a>
          </li>-->
        </ul>
      </div>
    </div>
    <div class="tab w1760">
      <h2>选集</h2>
      <div class="picScroll_left clearfix">
        <div class="item prev">
          <a href="#" v-items @up="leftIconUp" @down="leftIconDown" @click="clickLeft">
            <img src="../../static/images/icon_arrow_left.png" />
          </a>
        </div>
        <div class="picList">
          <ul>
            <li
              v-for="(item,index) in selectWorks"
              :key="index"
              v-items
              class="item_commtend"
              @left="left(item,index)"
              @up="up(item,index)"
              @down="down(item,index)"
            >
              <a class="pic" href="#">
                <img :src="item.image" />
                <h4 class="title">{{item.course_name}}</h4>
              </a>
            </li>
          </ul>
        </div>
        <div class="item next">
          <a href="#" v-items @up="rightIconUp" @down="rightIconDown" @click="clickRight">
            <img src="../../static/images/icon_arrow_right.png" />
          </a>
        </div>
        <!-- <ul class="tabpage">
          <li class="item" v-items>
            <a href="#">1-6</a>
          </li>
          <li class="item" v-items>
            <a href="#">7-13</a>
          </li>
          <li class="item" v-items>
            <a href="#">13-20</a>
          </li>
        </ul>-->
      </div>
    </div>
    <div class="tjbox w1760 clearfix">
      <h2>为您推荐</h2>
      <ul class="clearfix l">
        <li v-for="(item,index) in commtend" v-items :key="index">
          <a class="pic" href="#">
            <img :src="item.image" />
            <h4 class="title">{{item.course_name}}</h4>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import service from "../services/commtend";

export default {
  name: "proadcast",
  data() {
    return {
      fetchParam: {
        page: 1,
        pagesize: 6
      },
      info: [],
      selectWorks: [
        {
          text: "脆弱的骨头",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "续肠保命",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "狼疮少女",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "无肛女孩",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "失明背后的秘密",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "中了邪的舞蹈",
          img: require("../../static/images/img410_230.jpg")
        }
      ],
      commtend: [
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "小儿推拿——风寒感冒的治疗",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "小儿推拿——风寒感冒的治疗",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "小儿推拿——风寒感冒的治疗",
          img: require("../../static/images/img410_230.jpg")
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.$service.move(this.$service.pointer);
    this.$service.pointer.$el.scrollIntoView(false)
  },
  methods: {
     getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    clickLeft() {
      this.fetchParam.page--;
      if (this.fetchParam.page <= 1) {
        this.fetchParam.page = 1;
      }
      this.getSelectData();
    },
    clickRight() {
      this.fetchParam.page++;
      this.getSelectData();
    },
    getData() {
        var params = { courseid: this.$route.query.courseid};
      service.courseInfo(params).then(ret => {
        this.info = ret.data.info;
        this.commtend = ret.data.recommend;
        this.getSelectData();
      });
    },
    getSelectData() {
      let params = {
        catid: this.info.category_id,
        page: this.fetchParam.page,
        pagesize: this.fetchParam.pagesize
      };
      service.courseList(params).then(ret => {
        this.selectWorks = ret.data.list;
      });
    },
    serviceBack() {
      // this.$router.go(-1);
     window.history.back()
    },
    leftIconUp() {
      this.$service.move(this.$el.querySelectorAll(".item_commtend")[0]);
    },
    rightIconUp() {
      this.$service.move(this.$el.querySelectorAll(".item_commtend")[2]);
    },
    leftIconDown() {
      this.$service.move(this.$el.querySelectorAll(".item_commtend")[3]);
    },
    rightIconDown() {
      this.$service.move(this.$el.querySelectorAll(".item_commtend")[5]);
    },
    left(e, index) {
      console.log(index);
      if (index == 2) {
        this.$service.move(this.$el.querySelectorAll(".item_commtend")[1]);
      } else {
        this.$service.move("left");
      }
    },
    up(e, index) {
      if (index == 0) {
         this.getscrollIntoView(false)
        this.$service.move(this.$el.querySelectorAll(".item")[0]);
      } else {
         this.getscrollIntoView(false)
        this.$service.move("up");
      }
    },
    down(e,index){
      this.getscrollIntoView(true)
       this.$service.move("down");
    }
  }
};
</script>
<style scoped>
@import url("../../static/css/style.css");
.focus {
  transition: 0.5s;
  transform: scale(1.1);
  outline: 2px solid #ffffff;
  background: #169e00;
}
</style>

