<template>
  <div id="app">
   
      <router-view :key="$route.fullPath"></router-view>
   
  </div>
</template>
<script>
import authUtils from "./utils/authUtils";

export default {
  name: "App",
  data() {
    return {
      transitionName: "",
      cashViews: ["commtend",]
    };
  },
  mounted() {},
  methods: {},
  watch: {
    //使用watch 监听$router的变化
    $route(val) {}
  }
};
</script>
<style>
</style>
