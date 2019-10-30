<template>
  <div class="wrap">
    <div class="tjbox_2 w1760">
      <ul class="clearfix">
        <li
          v-for="(item,index) in arr1"
          v-items
          :key="index"
          class="item_disease"
          :ref="index"
          @up="secondup(item,index)"
          @down="down(item,index)"
          @left="secondleft(item,index)"
          @right="right(item,index)"
        >
          <a href="#">
            <em class="viptips" v-if="item.vip!=''">{{item.vip}}</em>
            <img :src="item.img" />
            <h4>{{item.text}}</h4>
          </a>
        </li>
      </ul>
    </div>
    <div class="tjbox w1760">
      <ul class="clearfix">
        <li
          v-for="(item,index) in arr2"
          v-items
          :key="index"
          :ref="index"
          @up="threeup(item,index)"
          @down="down(item,index)"
          @left="left(item,index)"
          @right="right(item,index)"
        >
          <a href="#">
            <img :src="item.img" />
            <h4>{{item.text}}</h4>
          </a>
        </li>
      </ul>
    </div>
    <div class="tjbox_3 w1760 clearfix">
      <h2>常见病 . 高发病</h2>
      <ul class="clearfix l">
        <li
          v-for="(item,index) in commonDisease"
          v-items
          :key="index"
          @up="up(item,index)"
          @down="down(item,index)"
          @left="left(item,index)"
          @right="right(item,index)"
        >
          <a href="#">
            <img :src="item.img" />
            <h4>{{item.text}}</h4>
          </a>
        </li>
      </ul>
      <div class="morebox r">
        <a href v-items @up="up()" @down="down()" @left="left()" @right="right()">
          <img src="../../static/images/icon_more.png" />
          <span>更多</span>
        </a>
      </div>
    </div>
    <div class="tjbox_3 w1760 clearfix">
      <h2>慢性病</h2>
      <ul class="clearfix l">
        <li
          v-for="(item,index) in chronicDisease"
          v-items
          :key="index"
          @up="up(item,index)"
          @down="down(item,index)"
          @left="left(item,index)"
          @right="right(item,index)"
        >
          <a href="#">
            <img :src="item.img" />
            <h4>{{item.text}}</h4>
          </a>
        </li>
      </ul>
      <div class="morebox r">
        <a href v-items @up="up()" @down="down()" @left="left()" @right="right()">
          <img src="../../static/images/icon_more.png" />
          <span>更多</span>
        </a>
      </div>
    </div>
    <div class="keshicate w1760 clearfix">
      <h2>按科室查疾病</h2>
      <ul class="clearfix l">
        <li
          v-for="(item,index) in keshi"
          v-items
          :key="index"
          @up="up(item,index)"
          @down="down(item,index)"
          @left="left(item,index)"
          @right="lastright(item,index)"
          @click="goDiseaseList()"
        >
          <a href="#">
            <img :src="item.img" />
            <span>{{item.text}}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import authUtils from "../utils/authUtils";
import service from "../services/commtend";
export default {
  data() {
    return {
      arr1: [
        {
          text: "中药——天麻",
          img: require("../../static/images/img410_230.jpg"),
          vip: ""
        },
        {
          text: "一天小便几次算正常",
          img: require("../../static/images/img410_230.jpg"),
          vip: "VIP"
        }
      ],
      arr2: [
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        }
      ],
      commonDisease: [
        //常见病
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        }
      ],
      chronicDisease: [
        //慢性病
        {
          text: "治疗疲劳综合征之法—刺激百会穴和神门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "治疗疲劳综合征之法—门穴",
          img: require("../../static/images/img410_230.jpg")
        },
        {
          text: "治疗疲劳综合征之法—刺激百会穴和",
          img: require("../../static/images/img410_230.jpg")
        }
      ],
      keshi: [
        //按科室查病
        {
          text: "儿科",
          img: require("../../static/images/erke.png")
        },
        {
          text: "妇产科",
          img: require("../../static/images/fuchanke.png")
        },
        {
          text: "男科",
          img: require("../../static/images/fuchanke.png")
        },
        {
          text: "骨科",
          img: require("../../static/images/guke.png")
        },
        {
          text: "内科",
          img: require("../../static/images/neike.png")
        },
        {
          text: "皮肤科",
          img: require("../../static/images/pifuke.png")
        },
        {
          text: "生殖科",
          img: require("../../static/images/shengzhike.png")
        },
        {
          text: "外科",
          img: require("../../static/images/waike.png")
        },
        {
          text: "五官科",
          img: require("../../static/images/wuguanke.png")
        },
        {
          text: "中医科",
          img: require("../../static/images/zhongyike.png")
        },
        {
          text: "肿瘤科",
          img: require("../../static/images/zhongliuke.png")
        }
      ]
    };
  },
  created() {
    
  },
  methods: {

    goDiseaseList() {
      this.$router.push({
        name: "diseaseList"
      });
    },
    getscrollIntoView(b) {
      this.$service.pointer.$el.scrollIntoView(b);
    },
    threeup(e, index) {
      if (index == 1) {
        this.$service.move(this.$el.querySelectorAll(".item_disease")[0]);
      } else if (index == 3) {
        this.$service.move(this.$el.querySelectorAll(".item_disease")[1]);
      } else {
        this.$service.move("up");
      }
      this.getscrollIntoView(false);
    },
    secondleft(e, index) {
      if (index == 1) {
        this.$service.move(this.$el.querySelectorAll(".item_disease")[0]);
      } else {
        this.$service.move("left");
      }
    },
    secondup(e, index) {
      // console.log(this.current)
      this.getscrollIntoView(false);
      let a = authUtils.getNavCurrent();
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
    lastright(e,index) {
      let arr = this.$service.pointer.$el.parentNode.children; //获取父节点所有的子节点数量
      if (index == arr.length - 1) {
        return;
      } else {
      this.$service.move("right");
      }
    }
  },
  mounted() {}
};
</script>
<style scoped>
@import url("../../static/css/style3.css");
.focus {
  transition: 0.5s;
  transform: scale(1.06);
  outline: 2px solid #ffffff;
}
</style>

