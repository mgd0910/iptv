<template>
  <div class="wrap">
    <div class="titbar w1760">
      <div class="logo">
        <img src="../../static/images/logo.png" />
      </div>
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
              <span>1</span>
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
        <el-carousel
          arrow="always"
          height="500px"
          :autoplay="false"
          indicator-position="none"
          ref="carousel"
        >
          <el-carousel-item v-for="(item,index) in pageNum" :key="index">
            <!-- <h3>{{ item }}</h3> -->
            <div class="picList">
              <ul style="margin-top:0.2rem;">
                <li
                  v-for="(value,index) in selectWorks"
                  :key="index"
                  v-items
                  class="item_commtend"
                  @left="carousel_left(value,index)"
                  @up="up(value,index)"
                  @right="carousel_right(value,index)"
                  @down="down(value,index)"
                >
                  <a class="pic" href="#">
                    <img :src="value.img" />
                    <h4 class="title">{{value.text}}</h4>
                  </a>
                </li>
              </ul>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="picScroll_left clearfix">
          <!-- <div class="item prev">
          <a href="#" v-items @up="leftIconUp" @down="leftIconDown" @click="clickLeft">
            <img src="../../static/images/icon_arrow_left.png" />
          </a>
        </div>
        <div class="picList">
          <ul>
            <li
              v-for="(item,index) in selectWorks"
              v-items
              class="item_commtend"
              @left="left(item,index)"
              @up="up(item,index)"
            >
              <a class="pic" href="#">
                <img :src="item.img" />
                <h4 class="title">{{item.text}}</h4>
              </a>
            </li>
          </ul>
        </div>
        <div class="item next">
          <a href="#" v-items @up="rightIconUp" @down="rightIconDown" @click="clickRight">
            <img src="../../static/images/icon_arrow_right.png" />
          </a>
          </div>-->
          <ul class="tabpage">
            <li
              v-for="(item,index) in btnArr"
              v-items
              @right="btn_right(item,index)"
              @left="btn_left(item,index)"
              @up="btn_up(item,index)"
              @down="btn_down(item,index)"
              class="item btn_item"
              style="margin-top:0.5rem;"
              :key="index"
              :class="{'active':isActive?index==fetchParam.page-1:false}"
            >
              <a href="#">{{item.text}}</a>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
    <div class="tjbox w1760 clearfix">
      <h2>为您推荐</h2>
      <ul class="clearfix l">
        <li
          v-for="(item,index) in commtend"
          v-items
          @right="commtend_right(item,index)"
          :key="index"
        >
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
      isActive: true,
      btnArr: [],
      fetchParam: {
        page: 1,
        pagesize: 6
      },
      myindex:'',//选集移动到按钮的焦点索引
      total: 105,
      pageNum: 0, //总页数
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
    this.pageNum = parseInt(this.total / 6) + (this.total % 6 > 0 ? 1 : 0);
    var arr = [];
    var arr1 = [];
    var start = 0;
    var end = 0;
    for (var x = 0; x < this.total; x++) {
      arr.push(x + 1);
    }
    var z = parseInt(arr.length / 6) + (arr.length % 6 > 0 ? 1 : 0);
    for (var y = 0; y < z; y++) {
      var cutArr = arr.slice(0, 6);
      arr.splice(0, 6);
      arr1.push(cutArr);
      start = cutArr.shift();
      end = cutArr.slice(-1);
      if (end == "") {
        this.btnArr.push({ text: start });
      } else {
        this.btnArr.push({ text: start + "-" + end });
      }
    }
    console.log(this.btnArr)
    this.getData();
  },

  mounted() {
    this.$service.move(this.$service.pointer);
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
      if (this.$route.query.data_head) {
        var params = { courseid: this.$route.query.data_head.ref_id };
      } else if (this.$route.query.data_list) {
        var params = { courseid: this.$route.query.data_list.ref_id };
      }
      service.courseInfo(params).then(ret => {
        console.log(ret.data);
        this.info = ret.data.info;
        this.commtend = ret.data.recommend;
        // this.getSelectData();
      });
    },
    getSelectData() {
      // console.log(this.info);
      // let params = {
      //   catid: this.info.category_id,
      //   page: this.fetchParam.page,
      //   pagesize: this.fetchParam.pagesize
      // };
      // service.courseList(params).then(ret => {
      //   this.selectWorks = ret.data;
      // });
    },
    serviceBack() {
      this.$router.go(-1);
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
    down(e, index) {
      this.myindex=index
      if (index >= 3) {
        this.$service.move(
          this.$el.querySelectorAll(".btn_item")[this.fetchParam.page - 1]
        );
        this.getscrollIntoView(true);
      } else {
        this.$service.move("down");
        this.getscrollIntoView(true);
      }
    },
    carousel_left(e, index) {
      if (index == 2) {
        this.$service.move(
          this.$el.querySelectorAll(".item_commtend")[
            1 + (this.fetchParam.page - 1) * 6
          ]
        );
      } else if (index == 0 || index == 3) {
        if (this.fetchParam.page == 1) {
          alert("这里是第一页了");
          return;
        } else {
          this.$refs.carousel.prev();
          this.fetchParam.page--;
          console.log(this.fetchParam.page); //这里执行切换选集页数，调用本页数数据
          this.$service.move(
            this.$el.querySelectorAll(".item_commtend")[
              6 * (this.fetchParam.page - 1)
            ]
          );
        }
      } else {
        this.$service.move("left");
      }
    },
    up(e, index) {
      if (index == 0) {
        this.getscrollIntoView(false);
        this.$service.move(this.$el.querySelectorAll(".item")[0]);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    carousel_right(value, index) {
      let num = parseInt(this.total / 6) + (this.total % 6 > 0 ? 1 : 0);
      if (index == 2 || index == this.selectWorks.length - 1) {
        if (this.fetchParam.page == num) {
          alert("已经到最后一页了");
          return;
        } else {
          this.$refs.carousel.next();

          console.log(this.fetchParam.page + 1); //这里执行切换选集页数，调用本页数数据

          this.$service.move(
            this.$el.querySelectorAll(".item_commtend")[
              6 * this.fetchParam.page
            ]
          );
          this.fetchParam.page++;
        }
      } else {
        this.$service.move("right");
      }
    },
    commtend_right(e, index) {
      if (index == 3) {
        return;
      } else {
        this.$service.move("right");
      }
    },
    btn_left(e, index) {
      let num = parseInt(this.total / 6) + (this.total % 6 > 0 ? 1 : 0);
      if (this.fetchParam.page == 1) {
        alert("这里是首页了");
        return;
      } else {
        this.$refs.carousel.prev();
        this.$service.move(this.$el.querySelectorAll(".btn_item")[index - 1]);
      }
      this.fetchParam.page--;
    },
    btn_right(e, index) {
      this.isActive = false;
      let num = parseInt(this.total / 6) + (this.total % 6 > 0 ? 1 : 0);
      if (this.fetchParam.page == num) {
        alert("这里是最后一页了");
        return;
      } else {
        this.$service.move(this.$el.querySelectorAll(".btn_item")[index + 1]);
        this.$refs.carousel.next();
      }
      this.fetchParam.page++;
    },
    btn_down(e, index) {
      this.isActive = false;
      this.$service.move("down");
      if (index == this.btnArr.length - 1) {
        return;
      } else {
        this.$refs.carousel.next();
      }
      let page;
      let present = this.$service.pointer.$el;
      let allelement = this.$el.querySelectorAll(".btn_item");
      for (var i = 0; i < allelement.length; i++) {
        if (allelement[i] == present) {
          page = i;
        }
      }
      console.log("下" + page);
      //这里调用数据
    },
    btn_up(e, index) {
      console.log(this.fetchParam.page)
      console.log(this.myindex)
      this.$service.move("up");
      this.$refs.carousel.prev()
      let page;
      let present = this.$service.pointer.$el;
      let allelement = this.$el.querySelectorAll(".btn_item");
      for (var i = 0; i < allelement.length; i++) {
        if (allelement[i] == present) {
          page = i;
        }
      }
      console.log("上" + page);
      //这里调用数据
    }
  }
};
</script>
<style scoped>
@import url("../../static/css/style.css");
.picScroll_left .picList[data-v-07e98dc0] {
  margin-left: 0.6rem;
}

.focus {
  transition: 0.5s;
  transform: scale(1.1);
  outline: 2px solid #ffffff;
  /* background: #169e00; */
}
.active {
  outline: 2px solid #ffffff;
  /* background: #169e00; */
}
/* .el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */
</style>

