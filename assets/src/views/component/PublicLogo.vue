<template>
  <div class="titbar w1760">
    <div class="logo">
      <img src="../../../static/newimages/logo.png" />
    </div>
    <div class="content_right">
      <ul>
        <li style="margin-left:0.75rem;" v-items @click="collect" @up='up' @down="down" class="collectBtn">
          <i class="collect"></i>
          <span>收藏记录</span>
        </li>
        <li @left="left" v-items @click="goHistory"  @up='up' @down="down" class="historyBtn">
          <i class="histroy"></i>
          <span>观看历史</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import authUtils from "../../utils/authUtils";
import service from "../../services/commtend";
export default {
  name: "publichead",
  data() {
    return {};
  },
  created() {
    this.parnter=authUtils.getPublicvalue('parnter')
  },
  watch: {},
  mounted() {
    
  },
  updated() {},
  methods: {
    collect() {
      authUtils.setPublicvalue("collectPath", { path: this.$route.path ,id:this.$route.query.id});
      this.$router.push({ path: "/collect" });
      authUtils.setPublicvalue("topTitle", { type: "collect" });
      authUtils.clearCurrent("downCurrent");

    },
    goHistory() {
      authUtils.setPublicvalue("watchHistoryPath", { path: this.$route.path ,id:this.$route.query.id});
      this.$router.push({ path: "/watchHistory" });
      authUtils.setPublicvalue("topTitle", { type: "history" });
      authUtils.clearCurrent("downCurrent");

    },
    up() {
      return
    },
    down() {
      let a = authUtils.getPublicvalue("navCurrent");
      let el = document.getElementsByClassName("nav_item")[a];
      this.$service.move(el);
    },
    left() {
      return;
    },
    right() {}
  }
};
</script>
<style scoped>
@import url("../../../static/css/style.css");
.focus {
  border: 1px solid yellow;
  border-radius: 0.1rem;
  /* box-shadow: 0px 0px 0.3rem 0.1rem #ffff00; */
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
  background-image: url("../../../static/newimages/icon_record.png");
  background-size: 100% 100%;
}
.collect {
  background-image: url("../../../static/newimages/icon_collect.png");
  background-size: 100% 100%;
}
</style>


