<template>
  <div class="wrap">
    <PublicHead @focusChange="focusChange"></PublicHead>
    <router-view :key="$route.path + $route.query.t"></router-view>
  </div>
</template>
<script>
import PublicHead from "./component/PublicHead.vue";
import authUtils from "../utils/authUtils";
export default {
  name: "index",
  components: {
    PublicHead
  },
  data() {
    return {
      currentFocus: "",
      downcurrent: ""
    };
  },
  beforeMount() {},
 
  created() {},
  updated() {},
  mounted() {
    
    // let _this = this;
    // let a = authUtils.getDownCurrent();
    // if (a) {
    //   setTimeout(function() {
    //     let el = _this.$service.getEleByPath(a.xpath);
    //     console.log(el);
    //     _this.$service.move(el);
    //     el.scrollIntoView(false);
    //   }, 100);
    //   authUtils.clearCurrent("KEY_PUSHDOCUMENT");
    // } else {
    //   this.$service.move(this.$service.pointer);
    // }
  },
  watch: {},
  methods: {
    focusChange(val) {
      this.currentFocus = val;
    },
    getDownCurrent(val) {
      this.downcurrent = val;
    }
  }
};
</script>
<style scoped>
@import url("../../static/css/style.css");
</style>


