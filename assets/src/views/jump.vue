<template>
  <div class="box">{{epg_info}}</div>
</template>
<script>
import authUtils from "../utils/authUtils";
import cut from "../utils/cut";

export default {
  name: "jump",
  data() {
    return {
      backurl: "",
      epg_info: ""
    };
  },
  beforeMount() {},

  created() {
   
    authUtils.clear();
    this.backurl = decodeURI(window.location.href);
    // this.backurl="http://113.136.42.38:8282/EPG/jsp/zyfz/en/smallplay/smallplay.jsp?CODE=d5c34a0e8f964e9b9836ee525b5f2dbe&PARENTCODE=d5c34a0e8f964e9b9836ee525b5f2dbe&ISLOOP=0&WIDTH=554&HEIGHT=157&LEFT=23&TOP=41"
    authUtils.setPublicvalue("backurl", cut.getParams(this.backurl));
    this.epg_info = cut.getParams(this.backurl);
    if (this.epg_info.indexOf("HUAWEI") > -1) {
      authUtils.setPublicvalue("parnter", "huawei");
    } else if (this.epg_info.indexOf("ZTE") > -1) {
      authUtils.setPublicvalue("parnter", "zte");
    } else {
      authUtils.setPublicvalue("parnter", "huawei");
    }
    this.$router.push({
      path: "/commtend"
    });
  },
  updated() {},
  mounted() {
    // this.$service.move(this.$service.pointer);
    var clientWidth = document.body.clientWidth;
    if (this.epg_info.indexOf("HUAWEI") > -1) {
      document
        .getElementsByTagName("html")[0]
        .setAttribute(
          "style",
          "font-size: " + clientWidth / 19.29 + "px !important"
        );
    } else if (this.epg_info.indexOf("ZTE") > -1) {
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
  watch: {},
  methods: {}
};
</script>
<style scoped>
.box {
  font-size: 0.2rem;
  color: #fff;
}
</style>


