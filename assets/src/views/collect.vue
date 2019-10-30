<template>
  <div class="wrap">
    <div class="tjbox w1760 item_list">
      <div class="logo">
        <img src="../../static/newimages/logo.png" />
      </div>
      <h2 style="margin-bottom:0.77rem;">我的收藏</h2>
      <ul class="clearfix">
        <li
          v-for="(item,index) in collects"
          :key="index"
          @click="collectBtn(item,index)"
          @focus="focus(item,index,0)"
          @blur="blur(item,index,0)"
          @left='left(item,index)'
          class="collectItem"
          v-items
        >
          <span>
            <img :src="item.image" />
            <div class="title">
              <h4 class="move">{{item.course_name}}</h4>
            </div>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import PublicLogo from "./component/PublicLogo.vue";
import service from "../services/commtend";
import authUtils from "../utils/authUtils";
import horse from "../utils/horse";

export default {
  name: "watchHistory",
  components: {
    PublicLogo
  },
  data() {
    return {
      collects: [
        { image: require("../../static/newimages/1.jpg"), name: "12132121" },
        { image: require("../../static/newimages/2.jpg"), name: "12132121" },
        { image: require("../../static/newimages/3.jpg"), name: "12132121" },
        { image: require("../../static/newimages/3.jpg"), name: "12132121" },
        { image: require("../../static/newimages/3.jpg"), name: "12132121" }
      ]
    };
  },
  beforeMount() {},

  created() {
    this.parnter=authUtils.getPublicvalue('parnter')
  },
  updated() {},
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    
  },
  watch: {},
  methods: {
    cache() {
      let _this = this;
      let a = authUtils.getPublicvalue("downCurrent");
      console.log(a)
      if (a) {
        if (a.class == "collectItem") {
          setTimeout(function() {
            let el = document.getElementsByClassName("collectItem")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        }
      } else {
        let el = document.getElementsByClassName("collectItem")[0];
        _this.$service.move(el);
      }
    },
    focus(item, index, num) {
      horse.horse(index, num);
    },
    blur(item, index, num) {
      horse.blurHorse(index, num);
    },
    serviceBack() {
      let a = authUtils.getPublicvalue("collectPath");
      if (a) {
        this.$router.push({
          path: a.path,
          query: { id: a.id, courseid: a.id }
        });
      }
      authUtils.clearCurrent('downCurrent')
    },
    getData() {
      let params = {
        tv_user_id: "123"
      };
      service.collectList(params).then(ret => {
        this.collects = ret.data;
        this.cache()
      });
    },
    left(e,index){
      if(index%4==0){
        return false
      }else{
        this.$service.move("left");
      }
    },
    collectBtn(item, index) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "collectItem"
      });
      authUtils.setPublicvalue("historyPath", { path: this.$route.path });
      this.$router.push({
        path: "/proadcastcopy_one",
        query: { courseid: item.id }
      });
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
  border: 2px solid yellow;
  box-shadow: 0px 0px 0.3rem 0.1rem #ffff00;
  border-radius: 0.2rem;
  /* outline: 2px solid #ffffff; */
  /* -moz-outline-radius:0.2rem;  */
  /* z-index: 9999; */
}
.logo {
  position: relative;
  left: 0;
  top: 0.3rem;
  display: block;
  width: 1.98rem;
  height: 0.67rem;
  margin-bottom: 0.6rem;
}
.logo img {
  width: 100%;
  height: 100%;
}

.datebox {
  width: 2.6rem;
  height: 0.67rem;
  background-image: url("../../static/newimages/time_bg.png");
  background-size: 100% 100%;
  margin-bottom: 0.41rem;
  font-size: 0.24rem;
  color: #fff;
  text-align: center;
  line-height: 0.57rem;
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
/* @import url("../../static/css/watchHistory.css"); */
</style>


