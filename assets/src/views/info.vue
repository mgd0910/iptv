<template>
  <div class="info" style="background:#020f34;">
    <h1 style="font-size:1rem;">{{boxType}}</h1>
    <p>分辨率:{{boxData.width}}+{{boxData.height}}</p>
    <p>ua:{{boxData.ua}}</p>
    <p>ip:{{boxData.ip}}</p>
    <p>code:{{boxData.code}}</p>
    <p>userToken:{{boxData.userToken}}</p>
    <p>userID:{{boxData.userID}}</p>
    <p>PARENTCODE:{{boxData.PARENTCODE}}</p>
    <p>BACKURL:{{boxData.BACKURL}}</p>
    <p>SPID:{{boxData.SPID}}</p>
    <p>newUrl:{{boxData.newUrl}}</p>
  </div>
</template>
<script>

export default {
  name: "info",
  data() {
    return {
      boxType: "",
      ua: "",
      keycode:'',
      boxData: {
        ua: "",
        ip: "",
        code: "",
        userToken: "",
        userID: "",
        PARENTCODE: "",
        BACKURL: "",
        SPID: "",
        newUrl: "",
        width: "",
        height: ""
      }
    };
  },
  beforeMount() {},

  created() {
    this.boxData.ua = navigator.userAgent;
    
    this.getURL();
    this.boxData.width = window.screen.width;
    this.boxData.height = window.screen.height;
  },
  updated() {},
  mounted() {
    document.onkeydown = function(e) {
    this.keycode=e.keyCode
};
  },
  watch: {},
  methods: {
    serviceBack() {
      this.$router.go(-1);
    },
    getURL() {
      if (process.env.NODE_ENV == "production") {
        var url = Authentication.CTCGetConfig("EPGDomain");
        this.boxData.userToken = Authentication.CTCGetConfig("UserToken");
        this.boxData.userID = Authentication.CTCGetConfig("UserID");
      } else {
        var url = "http://11.11.11.11:8080/123sadfasdf.adf";
        this.boxData.userToken = "UserToken";
        this.boxData.userID = "UserID";
      }
      this.boxData.code = "a5734707d3f24a9081093444f51ecd38";
      this.boxData.PARENTCODE = this.boxData.code;
      this.boxData.PLAYTYPE = 2;
      this.boxData.BACKURL = encodeURI(window.location.href);
      this.boxData.SPID = "XMHD";
      this.boxData.newUrl = url.match(
        /http.*:\/\/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d{1,1000000}/
      );

      this.boxData.newUrl = this.boxData.newUrl[0];

      if (this.boxData.ua.indexOf("ztebw") > -1) {
        this.boxType = "中兴盒子";
        return `${this.boxData.newUrl}/iptvepg/frame223/zteplay/play_auth.jsp?CODE=${this.boxData.code}&PARENTCODE=${this.boxData.PARENTCODE}&USERID=${this.boxData.userID}&USERTOKEN=${this.boxData.userToken}&PLAYTYPE=${this.boxData.PLAYTYPE}&SPID=${this.boxData.SPID}&BACKURL=${this.boxData.BACKURL}`;
      } else {
        this.boxType = "华为盒子";
        return `${this.boxData.newUrl}/EPG/jsp/zyfz/en/play/play_auth.jsp?CODE=${this.boxData.code}&PARENTCODE=${this.boxData.PARENTCODE}&USERID=${this.boxData.userID}&USERTOKEN=${this.boxData.userToken}&PLAYTYPE=${this.boxData.PLAYTYPE}&SPID=${this.boxData.SPID}&BACKURL=${this.boxData.BACKURL}`;
      }
    }
  }
};
</script>
<style scoped>
@import url("../../static/css/style.css");
.info {
  width: 90%;
  margin-left: 0.2rem;
  margin-top: 0.1rem;
  color: white;
  font-size: 0.2rem;
}
</style>


