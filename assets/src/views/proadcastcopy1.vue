<template>
  <div class="wrap">
    <!-- <div style="position:absolute;left:0;top:0;width:100%;height:100%;" class="bg"></div>
    <div style="position:absolute;left:0;width:100%;height:100%;background:#3b3286;" id="bg2"></div>-->
    <div class="titbar w1760">
      <div class="logo">
        <img src="../../static/newimages/logo.png" />
      </div>
      <!-- <div class="content_right">
        <ul>
          <li style="margin-left:0.75rem;" v-items @click="gocollect()" class="collectBtn">
            <i class="collect"></i>
            <span>收藏记录</span>
          </li>
          <li v-items @click="goHistory()" class="historyBtn" @left="historyLeft">
            <i class="histroy"></i>
            <span>观看历史</span>
          </li>
        </ul>
      </div>-->
    </div>
    <div class="play w1760 clearfix" id="box">
      <div class="playbox l" id="myframe">
        <!-- <iframe
          id="ifarm"
          :src="smallVideo"
          allowtransparency="true"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>-->
        <img :src="info.image" :width="width" :height="height" />
      </div>
      <div class="playinfo r">
        <dl class="playtext">
          <dt>{{info.course_name}}</dt>
          <!-- <dd>{{info.description}}</dd> -->
          <!-- <dd>{{buydata}}</dd> -->
          <dd>{{info.description}}</dd>
          <dd>{{aaa}}</dd>
          <!-- <dd>code:{{code}}</dd>
          <dd>url:{{url}}</dd>
          <dd>userToken:{{userToken}}</dd>
          <dd>userID:{{userID}}</dd>
          <dd>PARENTCODE:{{PARENTCODE}}</dd>
          <dd>PLAYTYPE:{{PLAYTYPE}}</dd>
          <dd>BACKURL:{{BACKURL}}</dd>
          <dd>SPID:{{SPID}}</dd>
          <dd>ISLOOP:{{ISLOOP}}</dd>
          <dd>{{smallVideo}}</dd>-->
        </dl>
        <ul class="playtoolbar clearfix">
          <li
            class="item_one"
            @click="broadcast()"
            v-items="{default:true}"
            @left="historyLeft"
            @down="down"
            @up="up"
          >
            <img src="../../static/newimages/bofang.png" alt />
          </li>
          <li class="item_two" @click="collect()" v-items @down="down" @up="up">
            <img :src="collectlogoUrl" alt />
          </li>
          <li class="item_three" @click="buy()" v-items @down="down" @up="up">
            <img src="../../static/newimages/buy.png" alt />
          </li>
        </ul>
      </div>
    </div>
    <!-- <div style="height:3rem;font-size:0.2rem;color:#000;">
      <ul>
        <li>1212</li>
      </ul>
    </div>-->
    <div class="tjbox w1760 clearfix item_list">
      <h2>相关推荐</h2>
      <ul class="clearfix l">
        <li
          v-for="(item,index) in commtend"
          v-items
          @right="commtend_right(item,index)"
          @up="commtend_up(item,index)"
          @down="down"
          @focus="focus(item,index,0)"
          @blur="blur(item,index,0)"
          @click="broadcast_list(item,index)"
          @left="left(item,index)"
          :key="index"
        >
          <span class="pic" href="#">
            <img :src="item.image" />
            <div class="title">
              <h4 class="move">{{item.course_name}}</h4>
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
import PublicLogo from "./component/PublicLogo.vue";
import cut from "../utils/cut";
import service from "../services/commtend";
import authUtils from "../utils/authUtils";
import horse from "../utils/horse";

export default {
  name: "proadcast",
  components: {
    PublicLogo
  },
  data() {
    return {
      collectlogoUrl: "",
      collectText: "",
      collecturl: {
        y: require("../../static/newimages/quxiao.png"),
        n: require("../../static/newimages/shoucang.png")
      },
      operation_type: "",
      isActive: true,
      btnArr: [],
      fetchParam: {
        page: 1,
        pagesize: 6
      },
      myindex: "", //选集移动到按钮的焦点索引
      total: void 0,
      pageNum: 0, //总页数
      info: [],
      selectWorks: [],
      code: "",
      bigVideo: "",
      smallVideo: "",
      dd: "",
      commtend: [],
      url: "",
      userToken: "",
      userID: "",
      ISAUTHORIZATION: "",
      PARENTCODE: "",
      PLAYTYPE: "",
      BACKURL: "",
      SPID: "",
      ISLOOP: "",
      myinfo: {
        url: "",
        dom: ""
      },
      width: "",
      height: "",
      clientHeight: "",
      buyUrl: "",
      accNbr: "",
      prodId: "",
      transactionID: "",
      useToken: "",
      prodPrice: "",
      prodName: "",
      systemCd: "",
      channelCd: "",
      reqTime: "",
      autherKey: "",
      bakUrl: "",
      SPID: "",
      picUrl: "",
      buyInfo: "",
      newbuyInfo: "",
      orderUrl: "",
      rspDesc: "",
      rspCode: "",
      aaa: ""
    };
  },
  created() {
    this.parnter = authUtils.getPublicvalue("parnter");
    // this.pageNum = parseInt(this.total / 6) + (this.total % 6 > 0 ? 1 : 0);
    this.myinfo.url = window.location.href;
    this.getUserid();
    // this.myinfo.url = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=js%E6%8B%BFurl%EF%BC%9F%E5%90%8E%E9%9D%A2%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%80%BC&oq=js%25E6%258B%25BFurl%253F%25E5%2590%258E%25E9%259D%25A2%25E7%259A%2584%25E5%2580%25BC&rsv_pq=dc137cee000b1475&rsv_t=a5f6idsDVW%2BsIMzs2O5Qf2QBOcUuba3HcHQska6OW1jbgZqv06w2GRSrY%2Fg&rqlang=cn&rsv_enter=1&rsv_dl=tb';
  },

  mounted() {
    let _this = this;
    setTimeout(function() {
      _this.getData();
      _this.$service.move(_this.$service.pointer);
      //   let el = document.getElementsByClassName("item_one")[0];
      //   _this.$service.move(el);
      _this.$service.pointer.$el.scrollIntoView(false);
      // if (cut.UrlSearch(this.myinfo.url, "rspCode")) {

      //   this.rspCode = cut.UrlSearch(this.myinfo.url, "rspCode");
      //   this.rspDesc = cut.UrlSearch(this.myinfo.url, "rspDesc");
      //   if (this.rspCode == 0) {
      //     _this.$toast({
      //       content: "订购成功",
      //       type: "success",
      //       onShow: () => {
      //         console.log("on toast show");
      //       },
      //       onHide: () => {
      //         console.log("on toast hide");
      //       }
      //     });
      //   }
      // }
    }, 300);
    //  ztebw.defaultalinkBgColor = none;
    // ztebw.defaultFocusColor = none;
    // ztebw.focusWidth = 0;
    // this.clientHeight = document.body.clientHeight;
    // document.getElementById("bg2").style.top = this.clientHeight - 100 + "px";
    var clientWidth = document.body.clientWidth;
    let parnter=authUtils.getPublicvalue('parnter')
    if (parnter == "huawei") {
      document
        .getElementsByTagName("html")[0]
        .setAttribute(
          "style",
          "font-size: " + clientWidth / 19.29 + "px !important"
        );
    } else if (parnter == "zte") {
      document
        .getElementsByTagName("html")[0]
        .setAttribute(
          "style",
          "font-size: " + clientWidth / 17.09 + "px !important"
        );
    } else {
      document
        .getElementsByTagName("html")[0]
        .setAttribute(
          "style",
          "font-size: " + clientWidth / 19.29 + "px !important"
        );
    }
  },
  methods: {
    //获取id
    getUserid() {
      if (process.env.NODE_ENV == "production") {
        this.userID = Authentication.CTCGetConfig("UserID");
      } else {
        this.url = "http://11.11.11.11:8080/123sadfasdf.adf";
        this.userToken = "UserToken";
        this.userID = "123";
      }
    },
    focus(item, index, num) {
      horse.horse(index, num);
    },
    blur(item, index, num) {
      horse.blurHorse(index, num);
    },
    left(e, index) {
      if (index % 4 == 0) {
        return false;
      } else {
        this.$service.move("left");
      }
    },
    gocollect() {
      authUtils.setPublicvalue("collectPath", {
        path: this.$route.path,
        id: this.$route.query.courseid
      });
      this.$router.push({ path: "/collect" });
      authUtils.setPublicvalue("topTitle", { type: "collect" });
      authUtils.clearCurrent("downCurrent");
    },
    goHistory() {
      authUtils.setPublicvalue("watchHistoryPath", {
        path: this.$route.path,
        id: this.$route.query.courseid
      });
      this.$router.push({ path: "/watchHistory" });
      authUtils.setPublicvalue("topTitle", { type: "history" });
      authUtils.clearCurrent("downCurrent");
    },
    broadcast() {
      window.location.href = this.bigVideo;
      // window.location.href="https://www.baidu.com"
    },
    collect() {
      if (this.collectText == "取消") {
        this.operation_type = 1;
      } else {
        this.operation_type = 0;
      }
      let params = {
        tv_user_id: this.userID,
        course_id: this.$route.query.courseid,
        operation_type: this.operation_type
      };
      service.collectCourse(params).then(ret => {
        console.log(this.operation_type);
        if (this.operation_type == 0) {
          this.$toast({
            content: "收藏成功",
            type: "success",
            onShow: () => {},
            onHide: () => {}
          });
          this.collectlogoUrl = this.collecturl.y;
          this.collectText = "取消";
        } else {
          this.$toast({
            content: "取消成功",
            type: "success",
            onShow: () => {},
            onHide: () => {}
          });
          this.collectlogoUrl = this.collecturl.n;
          this.collectText = "收藏";
        }
      });
    },
    //订购记录
    buyOrder() {
      if (process.env.NODE_ENV == "production") {
        this.url = Authentication.CTCGetConfig("EPGDomain");
      } else {
        this.url = "http://11.11.11.11:8080/123sadfasdf.adf";
        this.userToken = "UserToken";
        this.userID = "UserID";
      }
      let newUrl = this.url.match(
        /http.*:\/\/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d{1,1000000}/
      );
      if (newUrl.length > 0) {
        newUrl = newUrl[0];
      } else {
        return;
      }
      if (this.GLOBAL.debug == 0) {
      } else {
        this.orderUrl = `${newUrl}/orderInterface/order/orderRelationSearch`;
      }
    },
    buy() {
      if (process.env.NODE_ENV == "production") {
        this.url = Authentication.CTCGetConfig("EPGDomain");
        this.accNbr = Authentication.CTCGetConfig("UserID");
        this.prodId = this.code;
        this.transactionID = "channelCd+yyyyyMMddHHmmssfff+8位随机码";
        this.useToken = Authentication.CTCGetConfig("UserToken");
        this.prodPrice = 10;
        this.prodName = "1212";
        this.systemCd = "";
        this.channelCd = "";
        this.reqTime = "20190927162222";
        this.autherKey = "";
        this.bakUrl = window.location.href;
        this.SPID = "XMHD";
        this.picUrl = "";
        this.buyInfo = {
          accNbr: this.accNbr,
          prodId: this.prodId,
          transactionID: this.transactionID,
          useToken: this.useToken,
          prodPrice: this.prodPrice,
          prodName: this.prodName,
          systemCd: this.systemCd,
          channelCd: this.channelCd,
          reqTime: this.reqTime,
          autherKey: this.autherKey,
          bakUrl: this.bakUrl,
          SPID: this.SPID,
          picUrl: this.picUrl
        };
      } else {
        this.url = "http://11.11.11.11:8080/123sadfasdf.adf";
        this.userToken = "UserToken";
        this.userID = "UserID";
      }
      let newUrl = this.url.match(
        /http.*:\/\/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d{1,1000000}/
      );
      if (newUrl.length > 0) {
        newUrl = newUrl[0];
      } else {
        return;
      }
      if (this.GLOBAL.debug == 0) {
      } else {
        this.newbuyInfo = JSON.stringify(this.buyInfo);
        this.buyUrl = `${newUrl}/xxxxxxx/tyDicEpg/jsp/orderIndex.jsp?INFO=${this.newbuyInfo}`;
        // window.location.href = this.buyUrl;
      }
    },
    broadcast_list(item, index) {
      var params = { courseid: item.contentid };
      service.courseInfo(params).then(ret => {
        this.code = ret.data.info.video_code;
        this.auth();
        this.broadcast();
      });
    },
    getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    auth() {
      if (process.env.NODE_ENV == "production") {
        this.url = Authentication.CTCGetConfig("EPGDomain");
        this.userToken = Authentication.CTCGetConfig("UserToken");
        this.userID = Authentication.CTCGetConfig("UserID");
      } else {
        this.url = "http://11.11.11.11:8080/123sadfasdf.adf";
        this.userToken = "UserToken";
        this.userID = "UserID";
      }
      this.dd = navigator.userAgent;
      this.code = this.code;
      this.PARENTCODE = this.code;
      this.PLAYTYPE = 2;
      this.ISAUTHORIZATION = 0;
      this.BACKURL = encodeURI(window.location.href);
      this.SPID = "XMHD";
      this.ISLOOP = 0;
      this.width = document.getElementById("myframe").offsetWidth;
      this.height = document.getElementById("myframe").offsetHeight;
      let WIDTH = document.getElementById("myframe").offsetWidth;
      let HEIGHT = document.getElementById("myframe").offsetHeight;
      let LEFT = document.getElementById("box").offsetLeft;
      let TOP = document.getElementById("box").offsetTop;
      console.log(`width:${WIDTH}height:${HEIGHT}left:${LEFT}top:${TOP}`);
      let newUrl = this.url.match(
        /http.*:\/\/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d{1,1000000}/
      );
      if (newUrl.length > 0) {
        newUrl = newUrl[0];
      } else {
        return;
      }
      if (this.GLOBAL.debug == 0) {
        let parnter = authUtils.getPublicvalue("parnter");
        if (parnter == "huawei") {
          this.bigVideo = `${newUrl}/EPG/jsp/zyfz/en/test/play/play_auth.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&USERID=${this.userID}&USERTOKEN=${this.userToken}&PLAYTYPE=${this.PLAYTYPE}&SPID=${this.SPID}&BACKURL=${this.BACKURL}`;
          this.smallVideo = `${newUrl}/EPG/jsp/zyfz/en/test/smallplay/smallplay.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&ISLOOP=${this.ISLOOP}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&LEFT=${LEFT}&TOP=${TOP}`;
        } else if (parnter == "zte") {
          this.bigVideo = `${newUrl}/iptvepg/frame223/test/zteplay/play_auth.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&USERID=${this.userID}&USERTOKEN=${this.userToken}&PLAYTYPE=${this.PLAYTYPE}&SPID=${this.SPID}&BACKURL=${this.BACKURL}`;
          this.smallVideo = `${newUrl}/iptvepg/frame223/test/smallplay/smallplay.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&ISLOOP=${this.ISLOOP}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&LEFT=${LEFT}&TOP=${TOP}`;
        } else {
          this.bigVideo = `${newUrl}/EPG/jsp/zyfz/en/test/play/play_auth.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&USERID=${this.userID}&USERTOKEN=${this.userToken}&PLAYTYPE=${this.PLAYTYPE}&SPID=${this.SPID}&BACKURL=${this.BACKURL}`;
          this.smallVideo = `${newUrl}/EPG/jsp/zyfz/en/test/smallplay/smallplay.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&ISLOOP=${this.ISLOOP}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&LEFT=${LEFT}&TOP=${TOP}`;
        }
      } else {
        let parnter = authUtils.getPublicvalue("parnter");
        if (parnter == "huawei") {
          this.bigVideo = `${newUrl}/EPG/jsp/zyfz/en/play/play_auth.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&USERID=${this.userID}&USERTOKEN=${this.userToken}&PLAYTYPE=${this.PLAYTYPE}&SPID=${this.SPID}&BACKURL=${this.BACKURL}`;
          this.smallVideo = `${newUrl}/EPG/jsp/zyfz/en/smallplay/smallplay.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&ISLOOP=${this.ISLOOP}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&LEFT=${LEFT}&TOP=${TOP}`;
        } else if (parnter == "zte") {
          this.bigVideo = `${newUrl}/iptvepg/frame223/zteplay/play_auth.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&USERID=${this.userID}&USERTOKEN=${this.userToken}&PLAYTYPE=${this.PLAYTYPE}&SPID=${this.SPID}&BACKURL=${this.BACKURL}`;
          this.smallVideo = `${newUrl}/iptvepg/frame223/smallplay/smallplay.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&ISLOOP=${this.ISLOOP}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&LEFT=${LEFT}&TOP=${TOP}`;
        } else {
          this.bigVideo = `${newUrl}/EPG/jsp/zyfz/en/play/play_auth.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&USERID=${this.userID}&USERTOKEN=${this.userToken}&PLAYTYPE=${this.PLAYTYPE}&SPID=${this.SPID}&BACKURL=${this.BACKURL}`;
          this.smallVideo = `${newUrl}/EPG/jsp/zyfz/en/smallplay/smallplay.jsp?CODE=${this.code}&PARENTCODE=${this.PARENTCODE}&ISLOOP=${this.ISLOOP}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&LEFT=${LEFT}&TOP=${TOP}`;
        }
      }
    },
    getData() {
      if (this.$route.query.courseid) {
        var params = {
          courseid: this.$route.query.courseid,
          tv_user_id: "123"
        };
      } else if (this.$route.query.data_list) {
        var params = {
          courseid: this.$route.query.courseid,
          tv_user_id: "123"
        };
      }
      service.courseInfo(params).then(ret => {
        this.info = ret.data.info;
        if (this.info.favorite == 1) {
          this.collectlogoUrl = this.collecturl.y;
          this.collectText = "取消";
        } else {
          this.collectlogoUrl = this.collecturl.n;
          this.collectText = "收藏";
        }
        this.commtend = ret.data.recommend;
        this.code = ret.data.info.video_code;
        this.auth();
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
        this.total = ret.data.count;
        this.btnArr = [];
        this.sort();
      });
    },
    serviceBack() {
      let e = authUtils.getPublicvalue("historyPath");
      this.$router.push({
        path: e.path,
        query: { id: e.id, type: e.type }
      });
    },
    commtendList() {
      this.$service.move("down");
      this.getscrollIntoView(false);
    },
    sort() {
      //选集排序
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
    },
    fullLeft() {
      return;
    },
    historyLeft() {
      return;
    },
    down(e, index) {
      this.getscrollIntoView(true);
      this.$service.move("down");
    },
    carousel_left(e, index) {
      if (index == 2) {
        this.$service.move(this.$el.querySelectorAll(".item_commtend")[1]);
      } else {
        this.$service.move("left");
      }
    },
    up(e, index) {
      // this.$service.move("up");
      return false;
      this.getscrollIntoView(false);
    },
    carousel_right(value, index) {
      if (index == 2 || index == 5 || index == this.selectWorks.length - 1) {
        return;
      } else {
        this.$service.move("right");
      }
    },
    commtend_right(e, index) {
      if (index == this.commtend.length - 1) {
        return;
      } else {
        this.$service.move("right");
      }
    },
    commtend_up(e, index) {
      if (index <= 3) {
        this.getscrollIntoView(false);
        console.log(this.$el.querySelectorAll(".item_one")[0]);
        this.$service.move(this.$el.querySelectorAll(".item_one")[0]);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    btn_left(e, index) {
      this.$service.move(this.$el.querySelectorAll(".btn_item")[index - 1]);
      this.fetchParam.page = index;
      console.log(this.fetchParam.page);
      this.getSelectData();
    },
    btn_right(e, index) {
      if (index == this.btnArr.length - 1) {
        return;
      } else {
        this.$service.move(this.$el.querySelectorAll(".btn_item")[index + 1]);
        this.fetchParam.page = index + 2;
        console.log(this.fetchParam.page);
        this.getSelectData();
      }
      this.isActive = false;
    },
    btn_down(e, index) {
      this.isActive = false;
      this.$service.move("down");
      if (index == this.btnArr.length - 1) {
        return;
      }
      let page;
      let present = this.$service.pointer.$el;
      let allelement = this.$el.querySelectorAll(".btn_item");
      for (var i = 0; i < allelement.length; i++) {
        if (allelement[i] == present) {
          page = i + 1;
        }
      }
      this.fetchParam.page = page;
      this.getSelectData();

      //这里调用数据
    },
    btn_up(e, index) {
      this.fetchParam.page = index + 1;
      console.log(this.fetchParam.page);
      this.getSelectData();
      this.$service.move("up");
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
.picScroll_left .picList[data-v-07e98dc0] {
  margin-left: 60px;
}

.focus {
  border: 0.02rem solid yellow;
  box-shadow: 0px 0px 0.3rem 0.1rem #ffff00;
  border-radius: 0.1rem;
  /* outline: 2px solid #ffffff; */
  /* -moz-outline-radius:0.2rem;  */
  /* z-index: 9999; */
}
.active {
  outline: 2px solid #ffffff;
  /* background: #169e00; */
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
.bg {
  background-image: url("../../static/newimages/playvideo2.png");
  background-size: 100% 100%;
  background-repeat: repeat-y repeat-x;
}
.playtoolbar li {
  position: relative;
  width: 2.4rem;
  height: 1.36rem;
  float: left;
}

.playtoolbar img {
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
}
.text {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #fff;
  font-size: 0.3rem;
  margin-left: -1rem;
  margin-top: -0.2rem;
  /* transform: translate(-50%, -50%); */
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
.move {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
}

.content_right {
  position: absolute;
  width: 4.5rem;
  top: 0.3rem;
  right: 0;
}
.content_right ul {
  width: 100%;
  height: 0.77rem;
  color: white;
}
.content_right ul li {
  position: relative;
  width: 1.76rem;
  height: 0.67rem;
  line-height: 0.67rem;
  float: right;
  text-align: center;
}
.content_right span {
  width: 1.17rem;
  display: inline-block;
  font-size: 0.28rem;
  margin-left: 0.19rem;
}
.content_right i {
  position: relative;
  width: 0.3rem;
  display: inline-block;
  height: 0.3rem;

  left: 0;
  top: 8%;
}
.histroy {
  background-image: url("../../static/newimages/icon_record.png");
  background-size: 100% 100%;
}
.collect {
  background-image: url("../../static/newimages/icon_collect.png");
  background-size: 100% 100%;
}
</style>

