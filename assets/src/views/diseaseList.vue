<template>
  <div class="wrap" style="background:#020f34;">
    <PublicHead></PublicHead>
    <div class="tjbox w1760">
      <ul class="clearfix">
        <li
          class="on item_disease"
          v-items
          clearfix
          v-if="this.$route.query.type=='keshi'"
          @up="one_up()"
          @down="down()"
          @left="secondleft()"
          @right="right()"
        >
          <img :src="category.image" />
          <span>{{category.name}}</span>
        </li>
        <li
          v-for="(item,index) in erkeArr"
          v-items
          class="item_erke"
          :key="index"
          @up="secondup(item,index)"
          @down="down(item,index)"
          @left="secondleft(item,index)"
          @right="lastright(item,index)"
          @click="clickItem(item,index)"
        >
          <span>
            <img :src="item.image" />
            <h4>{{item.course_name}}</h4>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import PublicHead from "./component/PublicHead.vue";
import authUtils from "../utils/authUtils";
import service from "../services/commtend";
export default {
  components: {
    PublicHead
  },
  data() {
    return {
      category: [],
      erkeArr: []
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    let a = authUtils.getPublicvalue('navCurrent');
    let b = authUtils.getPublicvalue('keshiCurrent');
      console.log(b)
    let _this = this;
    if (b) {
      setTimeout(function() {
        let el = document.getElementsByClassName("item_erke")[b.index];
        _this.$service.move(el);
        authUtils.clearCurrent('keshiCurrent')
        // el.scrollIntoView(false);
      }, 600);
    
    } else {
      let el = document.getElementsByClassName("nav_item")[a];
      this.$service.move(el);
      el.scrollIntoView(false);
    }
    //  ztebw.defaultalinkBgColor = none;
    // ztebw.defaultFocusColor = none;
    // ztebw.focusWidth = 0;
  },
  methods: {
    serviceBack() {
      var e=authUtils.getPublicvalue('morePath')
      if (this.$route.query.type == "whole") {
        this.$router.push({
          path: "/whole"
        });
      }else{
        this.$router.push({
          path: "/cultivation",
          query:{id:e.id}
        });
      }
    },
    getData() {
      let params = { catid: this.$route.query.id };
      service.categoryallcourseList(params).then(ret => {
        this.erkeArr = ret.data.course_list;
        this.category = ret.data.category;
      });
    },
    clickItem(item, index) {
      authUtils.setPublicvalue('keshiCurrent',{ index: index, class: "item_erke" });
      console.log(authUtils.getPublicvalue('keshiCurrent'))
      if(this.$route.query.type=='whole'){
         var type='whole'
      }else{
         var type='keshi'
      }
      authUtils.setPublicvalue('historyPath',{
        path: this.$route.path,
        id: this.$route.query.id,
        type: type
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
      console.log(index);
      if (this.$route.query.type == "whole") {
        if (index == 1) {
          this.$service.move(this.$el.querySelectorAll(".item_erke")[0]);
        } else {
          this.$service.move("left");
        }
      } else if (this.$route.query.type == "keshi") {
        if (index == 0) {
          this.$service.move(this.$el.querySelectorAll(".item_disease")[0]);
        } else {
          this.$service.move("left");
        }
      }
    },
    secondup(e, index) {
      console.log(index);
      if (index <= 3) {
        this.getscrollIntoView(false);
        let a = authUtils.getPublicvalue('navCurrent');
        let el = document.getElementsByClassName("nav_item")[a];
        this.$service.move(el);
      } else {
        this.getscrollIntoView(false);
        this.$service.move("up");
      }
    },
    one_up() {
      this.getscrollIntoView(false);
      let a = authUtils.getPublicvalue('navCurrent');
      let el = document.getElementsByClassName("nav_item")[a];
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
      this.getscrollIntoView(false);
      this.$service.move("left");
    },
    right(e, index) {
      // let arr = this.$service.pointer.$el.parentNode.children; //获取父节点所有的子节点数量
      // if (index == arr.length - 1) {
      //   return;
      // } else {
      this.getscrollIntoView(false);
      this.$service.move("right");
      // }
    },
    lastright(e, index) {
      let arr = this.$service.pointer.$el.parentNode.children; //获取父节点所有的子节点数量
      if (index == arr.length - 2) {
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
.focus {
  transition: 0.5s;
  transform: scale(1.06);
  outline: 2px solid #ffffff;
}
</style>

