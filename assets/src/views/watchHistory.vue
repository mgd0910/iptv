<template>
  <div class="wrap">
    <!-- <PublicLogo></PublicLogo> -->
    <div class="tjbox w1760">
      <div class="logo">
        <img src="../../static/newimages/logo.png" />
      </div>
      <h2 style="margin-bottom:0.77rem;">观看历史</h2>
      <div v-for="(value,num) in historyList" :key="num" class="item_list">
        <p class="datebox">2019-06-07</p>
        <ul class="clearfix">
          <li
            v-for="(item,index) in value.list"
            :key="index"
            v-items
            class="histortItem"
            @click="histortItem(item,index)"
            @focus="focus(item,index,num)"
            @blur="blur(item,index,num)"
            @left="left(item,index,num)"
          >
            <span>
              <img :src="item.image" />
              <div class="title">
                <h4 class="move">{{item.name}}</h4>
              </div>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import PublicLogo from "./component/PublicLogo.vue";
import authUtils from "../utils/authUtils";
import service from "../services/commtend";
import horse from "../utils/horse";

export default {
  name: "watchHistory",
  components: {
    PublicLogo
  },
  data() {
    return {
      userID: "",
      historyList: [
        {
          time: "2019-06-07",
          list: [
            {
              image: require("../../static/newimages/20.jpg"),
              name: "12132121"
            },
            {
              image: require("../../static/newimages/20.jpg"),
              name: "12132121"
            },
            {
              image: require("../../static/newimages/20.jpg"),
              name: "12132121"
            }
          ]
        },
        {
          time: "2019-06-07",
          list: [
            {
              image: require("../../static/newimages/20.jpg"),
              name: "12132121"
            },
            {
              image: require("../../static/newimages/20.jpg"),
              name: "12132121"
            },
            {
              image: require("../../static/newimages/20.jpg"),
              name: "12132121"
            }
          ]
        }
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
    authUtils.clearCurrent("downCurrent");
  },
  watch: {},
  methods: {
    cache() {
      let _this = this;
      let a = authUtils.getPublicvalue("downCurrent");
      if (a) {
        if (a.class == "histortItem") {
          setTimeout(function() {
            let el = document.getElementsByClassName("histortItem")[a.index];
            _this.$service.move(el);
            _this.$service.pointer.$el.scrollIntoView(false);
          }, 600);
        }
      } else {
        let el = document.getElementsByClassName("histortItem")[0];
        _this.$service.move(el);
      }
    },
    focus(item, index, num) {
      horse.horse(index, num);
    },
    left(item, index, num) {
      if (index == 0) {
        return false;
      } else {
        this.$service.move("left");
      }
    },
    blur(item, index, num) {
      horse.blurHorse(index, num);
    },
    serviceBack() {
      let a = authUtils.getPublicvalue("watchHistoryPath");
      if (a) {
        this.$router.push({
          path: a.path,
          query: { id: a.id, courseid: a.id }
        });
      }
    },
    getData() {
      if (process.env.NODE_ENV == "production") {
        this.userID = Authentication.CTCGetConfig("UserID");
      } else {
        this.userID = "123";
      }
      let params = {
        tv_user_id: this.userID
      };
      service.historyList(params).then(ret => {
        // this.historyList=ret.data  (这里暂时没有数据可测试，用的本地的数据。)
        this.cache();
      });
    },
    histortItem(item, index) {
      authUtils.setPublicvalue("downCurrent", {
        index: index,
        class: "histortItem"
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


