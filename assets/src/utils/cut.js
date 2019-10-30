let cut = {
    //获取播放页面返回索引
    GetQueryValue(ourl, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = ourl.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    getParams(url) {
        var info = url.split("?");
        var newInfo = info[info.length - 1];
        return newInfo
    },
    GetRequest(url) {
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    UrlSearch(str,param) {
        var name, value;
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数 stringvar.substr(start [, length ]
        var arr = str.split("&"); //各个参数放到数组里
       
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                if (name == param) {
                    return arr[i].substr(num + 1);
                }
            }
        }
    },

    //解析xml文件
    parseXML(ret) {
        var xmlDoc = null;
        try //Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(ret);
        }
        catch (e) {
            try //Firefox, Mozilla, Opera, etc.
            {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(ret, "text/xml");
            }
            catch (e) { alert(e.message) }
        }
        return xmlDoc;
    }

}
export default cut

