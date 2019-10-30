(function (w) {
    var w = window;
    
    //UT的奇葩盒子，很多地方跟别的盒子不一样
    var IS_UT = false;
    if (0 < navigator.userAgent.indexOf('JETU')) {
        IS_UT = true;
    }
    /**
     * Volume 音量控制
     */
    var Volume = {
        _getManager : function () {
            if (!this.mp) {
                if (!top.mp) {
                    var _i = document.getElementsByTagName('iframe');
                    if (0 == _i.length) {
                        return null;
                    }
                    var _w = _i[0].contentWindow;
                    if (!_w.mp) {
                        return null;
                    }
                    this.mp = _w.mp;
                }
                else {
                    this.mp = top.mp;
                }
            }
            return this.mp;
        },
        mute : function () {
            if(typeof(muteByEPG) == "function") {
                return muteByEPG();
            }
            else if ('undefined' != typeof(smarty_trailer_if_smallvod) && smarty_trailer_if_smallvod.muteByEPG) {
                return smarty_trailer_if_smallvod.muteByEPG();
            }
            else {
                var _mp = this._getManager();
                if (!_mp) {
                    return false;
                }
                var flag = _mp.getMuteFlag() > 0 ? 0 : 1;
                _mp.setMuteFlag(flag);
                return true;
            }
        },
        turnUp : function () {
            if(typeof(adjustVolumeByEPG) == "function") {
                return adjustVolumeByEPG('+');
            }
            else if ('undefined' != typeof(smarty_trailer_if_smallvod) && smarty_trailer_if_smallvod.adjustVolumeByEPG) {
                return smarty_trailer_if_smallvod.adjustVolumeByEPG('+');
            }
            else {
                var _mp = this._getManager();
                if (!_mp) {
                    return false;
                }
                var _curr_vol = _mp.getVolume(),
                    _dest_vol = _curr_vol + 5;
                if (100 < _dest_vol) {
                    _dest_vol = 100;
                }
                _mp.setVolume(_dest_vol);
                return true;
            }
        },
        turnDown : function () {
            if(typeof(adjustVolumeByEPG) == "function") {
                return adjustVolumeByEPG('-');
            }
            else if ('undefined' != typeof(smarty_trailer_if_smallvod) && smarty_trailer_if_smallvod.adjustVolumeByEPG) {
                return smarty_trailer_if_smallvod.adjustVolumeByEPG('-');
            }
            else {
                var _mp = this._getManager();
                if (!_mp) {
                    return false;
                }
                var _curr_vol = _mp.getVolume(),
                    _dest_vol = _curr_vol - 5;
                if (0 > _dest_vol) {
                    _dest_vol = 0;
                }
                _mp.setVolume(_dest_vol);
                return true;
            }
        }
    }
    //end Volume
    
    
    /**
     * Remote 遥控器按键控制
     */
    
    var Remote = {
        KEY_UP       : 38,
        KEY_DOWN     : 40,
        KEY_LEFT     : 37,
        KEY_RIGHT    : 39,
        KEY_OKey     : 13,
        KEY_BACK     : 8,
        KEY_BACK2    : 18,//OTT KEY BACK
        KEY_BACK3    : 27,//SICHUANYIDONG KEY BACK
        KEY_PREV     : 33,
        KEY_NEXT     : 34,
        KEY_VOL_UP   : 259,
        KEY_VOL_DOWN : 260,
        KEY_MUTE     : 261,
        KEY_HOME     : 272,
        KEY_HOME2    : 613,
        dispatchEvent : function(eventName, e) {
            this._eventRegistry = this._eventRegistry || {};
            this._defaultHandlers = this._defaultHandlers || {};
            var listeners = this._eventRegistry[eventName] || [];
            var defaultHandler = this._defaultHandlers[eventName];
            if (!listeners.length && !defaultHandler)
                return;
    
            e = e || {};
            e.type = eventName;
            //还原事件冒泡设置
            if (e.propagationStopped) {
                e.propagationStopped = null;
            }
            if (!e.stopPropagation) {
                e.stopPropagation = function() {
                    this.propagationStopped = true;
                };
            }
            
            if (!e.preventDefault) {
                e.preventDefault = function() {
                    this.defaultPrevented = true;
                };
            }
            
            //XXX 有些中兴的盒子,stopPropagation和preventDefault不允许被修改
            //不允许修改也就算了,关键是执行后不会改变 propagationStopped 和  defaultPrevented的值
            //看吧可以用safeStopPropagation 和 safePreventDefault代替之
            if (!e.safeStopPropagation) {
                e.safeStopPropagation = function() {
                    this.stopPropagation();
                    this.propagationStopped = true;
                };
            }
            
            if (!e.safePreventDefault) {
                e.safePreventDefault = function() {
                    this.preventDefault();
                    this.defaultPrevented = true;
                };
            }
    
            for (var i=0; i<listeners.length; i++) {
                listeners[i](e);
                if (e.propagationStopped)
                    break;
            }
            
            if (defaultHandler && !e.defaultPrevented)
                defaultHandler(e);
        },
        
        setDefaultHandler : function(eventName, callback) {
            this._defaultHandlers = this._defaultHandlers || {};
            
            if (this._defaultHandlers[eventName])
                throw new Error("The default handler for '" + eventName + "' is already set");
                
            this._defaultHandlers[eventName] = callback;
        },
        
        addEventListener : function(eventName, callback) {
            this._eventRegistry = this._eventRegistry || {};
    
            var listeners = this._eventRegistry[eventName];
            if (!listeners) {
                var listeners = this._eventRegistry[eventName] = [];
            }
            //TODO 部分中兴机顶盒不支持indexOf查找function，此处先不进行重复检测
            //if (listeners.indexOf(callback) == -1)
            listeners.push(callback);
        },
        
        removeListener : function(eventName, callback) {
            this._eventRegistry = this._eventRegistry || {};

            var listeners = this._eventRegistry[eventName];
            if (!listeners)
                return;

            var index = listeners.indexOf(callback);
            if (index !== -1)
                listeners.splice(index, 1);
        },
        
        removeAllListeners : function(eventName) {
            if (this._eventRegistry) this._eventRegistry[eventName] = [];
        }
    }
    
    Remote.setDefaultHandler('KeyBack', function () {
        vis_onunload();
        document.forms[0].page_seq.value="";
        page_back();
    });
    
    Remote.setDefaultHandler('OTTKeyBack', function () {
        vis_onunload();
        document.forms[0].page_seq.value="";
        page_back();
    });

    Remote.setDefaultHandler('KeyHome', function () {
        //回首页时，清除本地存储
        if (_ls && _ls.clear) {
            _ls.clear();
        }
        vis_onunload();
        back_url = epg_url+'?vas_info=' + encodeURI('<vas_action>back</vas_action>');
        vis_to_rewrite(back_url, '', 0);
    });
    
    Remote.setDefaultHandler('KeyVolUp', function () {
        Volume.turnUp();
    });
    
    Remote.setDefaultHandler('KeyVolDown', function () {
        Volume.turnDown();
    });
    
    Remote.setDefaultHandler('KeyMute', function () {
        Volume.mute();
    });
    Remote.setDefaultHandler('KeyPrev', function () {
        page_prev();
    });
    Remote.setDefaultHandler('KeyNext', function () {
        page_next();
    });
    w.remote = {
        onKeyUp : function (cb) {
            Remote.addEventListener('KeyUp', cb);
        },
        onKeyDown : function (cb) {
            Remote.addEventListener('KeyDown', cb);
        },
        onKeyLeft : function (cb) {
            Remote.addEventListener('KeyLeft', cb);
        },
        onKeyRight : function (cb) {
            Remote.addEventListener('KeyRight', cb);
        },
        onKeyOk : function (cb) {
            Remote.addEventListener('KeyOk', cb);
        },
        onKeyBack : function (cb) {
            Remote.addEventListener('KeyBack', cb);
        },
        onOTTKeyBack : function (cb) {
            Remote.addEventListener('OTTKeyBack', cb);
        },
        onKeyPrev : function (cb) {
            Remote.addEventListener('KeyPrev', cb);
        },
        onKeyNext : function (cb) {
            Remote.addEventListener('KeyNext', cb);
        },
        onKeyVolUp : function (cb) {
            Remote.addEventListener('KeyVolUp', cb);
        },
        onKeyVolDown : function (cb) {
            Remote.addEventListener('KeyVolDown', cb);
        },
        onKeyMute : function (cb) {
            Remote.addEventListener('KeyMute', cb);
        },
        onKeyHome : function (cb) {
            Remote.addEventListener('KeyHome', cb);
        },
        onKeyInput : function (cb) {
            Remote.addEventListener('KeyInput', cb);
        },
        on : function(events) {
            for (var name in events) {
                Remote.addEventListener(name, events[name]);
            }
        },
        removeListener     : function (eventName, callback) {return Remote.removeListener(eventName, callback)},
        removeAllListeners : function (eventName) {return Remote.removeAllListeners(eventName)},
        listen             : Remote
    };
    w.onload = function () {
        /*
        d('top.frames.length:', top.frames.length);
        for (i = 0; i < top.frames.length; i++) {
            var _f = top.frames[i];
            d('第一层:' + i, _f.name);
            d('url:' + i, _f.location.href);
            for (j = 0; j < _f.frames.length; j++) {
                var _ff = _f.frames[j];
                d('--第二层:', _ff.name);
                d('--url:', _ff.location.href);
                for (k = 0; k < _ff.frames.length; k++) {
                    var _fff = _ff.frames[k];
                    d('----第三层:', _fff.name);
                    d('----url:', _fff.location.href);
                    d('----第三层frames.length:', _fff.frames.length);
                }
            }
        }
        */
        document.onkeydown = function (e) {
            e = e || window.event;
            if (!e) {
                return false;
            }
            var _R        = remote.listen;
            var _key_code = e.keyCode;
            //XXX UT的盒子，在第一次停止默认事件后，以后每一次都会停止
            if (IS_UT) {
                e.defaultPrevented = undefined;
            }
            switch (_key_code) {
            case _R.KEY_UP :
                _R.dispatchEvent('KeyUp', e);
                if (e.preventDefault) {
                    //禁止默认事件响应
                    e.preventDefault();
                }
                break;
            case _R.KEY_DOWN : 
                _R.dispatchEvent('KeyDown', e);
                if (e.preventDefault) {
                    //禁止默认事件响应
                    e.preventDefault();
                }
                break;
            case _R.KEY_LEFT : 
                _R.dispatchEvent('KeyLeft', e);
                if (e.preventDefault) {
                    //禁止默认事件响应
                    e.preventDefault();
                }
                break;
            case _R.KEY_RIGHT : 
                _R.dispatchEvent('KeyRight', e);
                if (e.preventDefault) {
                    //禁止默认事件响应
                    e.preventDefault();
                }
                break;
            case _R.KEY_OKey : 
                _R.dispatchEvent('KeyOk', e);
                if (e.preventDefault) {
                    //禁止默认事件响应
                    e.preventDefault();
                }
                break;
            case _R.KEY_BACK : 
                _R.dispatchEvent('KeyBack', e);
                break;
            case _R.KEY_BACK2 : 
                _R.dispatchEvent('OTTKeyBack', e);
                break;
            case _R.KEY_BACK3 :
                _R.dispatchEvent('KeyBack', e);
                break;
            case _R.KEY_PREV : 
                _R.dispatchEvent('KeyPrev', e);
                if (e.preventDefault) {
                    //禁止默认事件响应
                    e.preventDefault();
                }
                break;
            case _R.KEY_NEXT : 
                _R.dispatchEvent('KeyNext', e);
                if (e.preventDefault) {
                    //禁止默认事件响应
                    e.preventDefault();
                }
                break;
            case _R.KEY_VOL_UP : 
                _R.dispatchEvent('KeyVolUp', e);
                break;
            case _R.KEY_VOL_DOWN : 
                _R.dispatchEvent('KeyVolDown', e);
                break;
            case _R.KEY_MUTE : 
                _R.dispatchEvent('KeyMute', e);
                break;
            case _R.KEY_HOME : 
            case _R.KEY_HOME2 : 
                _R.dispatchEvent('KeyHome', e);
                break;
            default :
                _R.dispatchEvent('KeyInput', e);
                break;
            }
            //停止事件冒泡
            if(e && e.stopPropagation) {
                e.stopPropagation();
            }
            else if (window.event && window.event.cancelBubble) {
                window.event.cancelBubble = true;
            }
        };
        if (w.partner && ('ott' != partner && 'BOTT' != partner)) {
            if (top.EPG && !window.smarty_trailer_if_smallvod) {
                if (top.EPG.EPG) {
                    top.EPG.EPG.focus();
                }
                else {
                    top.EPG.focus();
                }
            }
        }
    }
    // end Remote
    
    
    /**
     * debug
     */
    //只有url在指定host内才开启debug功能
    var _hosts = ['http://10.61.13.81', 'http://10.61.13.55', 'http://10.61.13.71', 'http://10.61.13.67','http://10.61.13.147'],
        _is_open = false;
    for (var i = 0; i < _hosts.length; i++) {
        if (0 <= location.href.indexOf(_hosts[i])) {
            _is_open = true;
            break;
        }
    }
    if (_is_open) {
        var debug = {
            is_opened : false,
            args      : [],
            div       : null,
            box       : null,
            init      : function () {
                var _doc               = w.document,
                    _div               = _doc.createElement("div");
                    _box               = _doc.createElement("div");
                    _box.id            = "debug_box";
                    //XXX 老中兴机顶盒，没有cssText属性
                    //XXX UT的盒子，有cssText属性，但是不能获取，只能设置
                    if (_box.style.cssText || IS_UT) {
                        _box.style.cssText = "margin: 0;color: #00ff00; word-wrap: break-word; word-break: normal;position: relative;";
                    }
                    else {
                        _box.style.margin   = '0';
                        _box.style.color    = '#00ff00';
                        _box.style.position = 'relative';
                    }
                     _div.appendChild(_box);
                    _div.id            = "debug_div";
                    if (_box.style.cssText || IS_UT) {
                        _div.style.cssText = "display:none; position:absolute;border: 1px solid green; left:20px; top:20px; width:1200px; height:auto; font-size: 12px; z-index:99999; padding: 5px; background-color: rgba(0, 0, 0, 0.6);";
                    }
                    else {
                        _div.style.display              = 'none';
                        _div.style.position             = 'absolute';
                        _div.style.border               = '1px solid green';
                        _div.style.padding              = '5px';
                        _div.style.left                 = '20px';
                        _div.style.top                  = '20px';
                        _div.style.width                = '1200px';
                        _div.style.height               = 'auto';
                        _div.style['font-size']         = '12px';
                        _div.style['z-index']           = '99999';
                        _div.style['background-color']  = 'rgba(0, 0, 0, 0.6)';
                    }
                    _doc.body.appendChild(_div);
                    this.div = _div;
                    this.box = _box;
            },
            write     : function () {
                var _d = this;
                return function () {
                    var _msgs = [],
                        _str  = '',
                        _args;
                    if (1 > arguments.length) {
                        if (_d.args) {
                            _args = _d.args;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        _args = arguments;
                    }
                    for(var i = 0; i < _args.length; i++) {
                        _msgs.push(_d.parse(_args[i], 0));
                    }
                    if (_d.is_opened) {
                        _str = "\r\n<br />------------------------------\r\n<br />" + _str;
                    }
                    _d.box.innerHTML = _d.box.innerHTML + _str + _msgs.join(',');
                    if (!_d.is_opened) {
                        _d.div.style.display = 'block';
                        _d.is_opened = true;
                    }
                    _d.args = [];
                    return true;
                }
            },
            parse      : function (variable_, level_) {
                var _str = '';
                if ('undefined' == typeof(variable_)) {
                    _str += '[undefined]';
                }
                else if (variable_ === null) {
                    _str += '[null]';
                }
                else if (variable_ instanceof Function) {
                    _str += '[function]';
                }
                else if (variable_.nodeType && 1 == variable_.nodeType) {
                    _str += '[HTML node]';
                }
                else if (variable_ instanceof Array) {
                    if (variable_[0] instanceof Array || variable_[0] instanceof Object) {
                        for(var i = 0; i < variable_.length; i++) {
                            _str += "\r\n<br />";
                            _str += new Array(level_ + 1).join('    ') + arguments.callee(variable_[i], level_ + 1);
                        }
                    }
                    else {
                        _str = '[' + variable_.join(',') + ']';
                    }
                }
                else if (variable_ instanceof Object) {
                    if (variable_.Infinity) {
                        _str += '[Infinity Object]';
                    }
                    else if (2 < level_) {
                      //最多只支持循环3层，否则容易进入死循环
                        _str += '[Object]';
                    }
                    else {
                        _str += '{';
                        //Event对象，只能循环一次，要不然会进入死循环
                        //TODO UT没有Event对象
                        if (window.Event && variable_ instanceof Event) {
                            for(var i in variable_) {
                                _str += "\r\n<br />";
                                _str += new Array(level_ + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;') + i + ':' + variable_[i];
                            }
                        }
                        else {
                            for(var i in variable_) {
                                _str += "\r\n<br />";
                                _str += new Array(level_ + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;') + i + ':' + arguments.callee(variable_[i], level_ + 1);
                            }
                        }
                        _str += "\r\n<br />" + new Array(level_ + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;') + '}';
                    }
                }
                else {
                    if (!variable_ && 0 !== variable_ && '0' !== variable_) {
                        _str += "[empty]";
                    }
                    else {
                        _str += variable_;
                    }
                }
                return _str;
            },
            clean : function () {
                var _d = this;
                return function () {
                    _d.is_opened = false;
                    _d.div.style.display = 'none';
                    _d.box.innerText = '';
                    return true;
                }
            }
        }
        debug.init();
        w.d  = debug.write();
        w.c  = debug.clean();
        w.cd = function () {
            debug.args = arguments;
            w.c();
            w.d();
        };
    }
    else {
        w.d  = 
        w.c  = 
        w.cd = function () {
            return false;
        };
    }
    //end debug
    
    
    /**
     * DOM 操作
     * @capatibility: >=ie8 | chrome | firefox | opera
     * @author: Joye
     */
    var com = {
        'strToDom' : function(html) {
            var frag = document.createDocumentFragment();
            var tmpdom = document.createElement('div');
            tmpdom.innerHTML = html;
            while(tmpdom.firstChild){
                frag.appendChild(tmpdom.firstChild);
            }
            tmpdom = null; //清理临时对象
            return frag;
        },
        'query' : function(lists) {
            if(typeof lists == 'object' && lists.length != 0){
                var queryNodes = function(){
                    this.lists = lists;
                    this.length = lists.length;
                };
                queryNodes.prototype = handle;
                var jNodes = new queryNodes;
                for(var i=0;i<lists.length;i++){
                    jNodes[i] = lists[i];
                }
                return jNodes;
            }
            return lists;
        } 
    };
    
    var handle = {
        'each' : function(func){
            for(var i=0;i<this.length;i++){
                func.call(this, i);
            }    
        },
        //get获取DOM对象
        'get' : function(i){
            return this.lists[i];
        },
        //eq获取Query对象
        'eq' : function(i){
            return com.query([this.get(i)]);
        },
        'append' : function(html){
            if(html == undefined){
                html = '';
            }
            this.each(function(i){
                this.get(i).appendChild(com.strToDom(html));
            });
            return this;
        },
        'prepend' : function(html){
            if(html == undefined){
                html = '';
            }
            this.each(function(i){
                if(this.get(i).firstChild){
                    this.get(i).insertBefore(com.strToDom(html), this.get(i).firstChild);
                }else{
                    this.get(i).appendChild(com.strToDom(html));
                }
            });
            return this;
        },
        'after' : function(html){
            if(html == undefined){
                html = '';
            }
            this.each(function(i){
                var nx = this.get(i).nextSibling;
                if(nx != null){
                    this.parent().get(0).insertBefore(com.strToDom(html), nx);
                }else{
                    this.parent().get(0).appendChild(com.strToDom(html));
                }
            });
            return this;
        },
        'before' : function(html){
            if(html == undefined){
                html = '';
            }
            this.each(function(i){
                this.parent().get(0).insertBefore(com.strToDom(html), this.get(i));
            });
            return this;
        },
        'html' : function(html){
            if(html === undefined){
                return this.get(0).innerHTML;
            }
            this.each(function(i){
                this.get(i).innerHTML = html;
            });
        },
        'parent' : function(){
            var elobj = [];
            this.each(function(i){
                elobj.push(this.get(i).parentNode); 
            });
            return com.query(elobj);
        },
        'child' : function(){
            var elobj = [];
            this.each(function(i){
                var cn = this.get(i).childNodes;
                for(var j = 0; j < cn.length; j++){
                    elobj.push(cn[j]);  
                }   
            });
            return com.query(elobj);
        },
        'remove' : function(){
            this.each(function(i){
                this.get(i).parentNode.removeChild(this.get(i));
            });
        },
        'replace' : function(html){
            this.each(function(i){
                this.get(i).parentNode.replaceChild(com.strToDom(html), this.get(i));
            });
        }
    };
    
    function $$(s) {
        return $(s) && com.query([el]);
    }
    function $(s) {
        if(typeof s !== 'string') {
            return null;
        }
        if(document.querySelectorAll) {
            var _els = document.querySelectorAll(s);
            if (0 == _els.length) {
                return null;
            }
            var _el = _els[0];
        }
        else {
            var _el = document.getElementById(s.slice(1));
        }
        return _el;
    }
    w.$  = $;
    w.$$ = $$;
    // end DOM
    
    
    /**
     * Ajax 操作
     */
    function Ajax(url, args) {
        this.url        = url || "";
        this.params     = args.parameters || "";
        this.mime       = args.mime || "text/html";
        this.onComplete = args.onComplete || this.defaultOnCompleteFunc;
        this.onLoading  = args.onLoading || this.defaultOnLoadingFunc;
        this.onError    = args.onError || this.defaultOnErrorFunc;
        this.method     = args.method || "get";
        //REMIND: yinwm -- 2007/03/30  Cost to much code, refine it later.
        if (typeof(args.sync) == "undefined" || args.sync == null) { 
            this.sync = true;
        }
        else {
            this.sync = args.sync ? true : false; //NOTE: yinwm -- 2007/03/30 Convert all other ones like string, number to boolean value.
        }
        this.loadData();
    }

    Ajax.prototype = {
        READY_STATE_COMPLETE : 4,
        getRequest : function () {
            var req = null;
            if (window.XMLHttpRequest) {
                req = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return req || false;
        },

        //NOTE: yinwm -- convert paramater map to string 
        parseParams : function () {
            if (typeof (this.params) == "string") {
                return this.params;
            }
            else {
                var s = [];
                for (var k in this.params) {
                    s.push(k + "=" + this.params[k]);
                }
                return s.join('&');
            }
        },

        loadData : function () {
            this.req = this.getRequest();
            
            if (this.req) {
                this.onLoading();
                try {
                    if (this.params) {
                        var _params = this.parseParams();
                        if (this.method == "get") {
                            if (0 < this.url.indexOf('?')) {
                                this.url += '&' + _params;
                            }
                            else {
                                this.url += '?' + _params;
                            }
                        }
                        else {
                            this.params = _params;
                        }
                    }
                    var loader = this;
                    this.req.onreadystatechange = function () {
                        if (loader.req.readyState == loader.READY_STATE_COMPLETE) {
                            loader.onComplete.call(loader, loader.req.responseText);
                        }
                    }
                    this.req.open(this.method, this.url, this.sync);
        
                    if (this.method == "post") {
                        this.req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    }
        
                    if (this.req.overrideMimeType) {
                        this.req.overrideMimeType(this.mime);
                    }
                    this.req.send(this.method == "post" ? this.params : null);
                } 
                catch (e) {
                    // throw e
                    this.onError.call(this, e);
                }
            }
            else {
                // throw e
                d('Ajax 对象获取失败');
            }
        },

        defaultOnCompleteFunc : function () {
            //alert(this.req.responseText);
        },

        defaultOnLoadingFunc : function () {
        },

        defaultOnErrorFunc : function (error) {
            //alert(error);
        }
    }
    
    //注意，UT要写全路径的url
    w.get = function () {
        if (1 > arguments.length) {
            return false;
        }
        var _url  = arguments[0],
            _data = {};
        if (2 == arguments.length) {
            if ('function' == typeof(arguments[1])) {
                _data.onComplete = arguments[1];
            }
            else {
                _data.parameters = arguments[1];
            }
        }
        else if (3 == arguments.length) {
            _data.parameters = arguments[1];
            if ('function' == typeof(arguments[2])) {
                _data.onComplete = arguments[2];
            }
        }
        _data.method = 'get';
        new Ajax(_url, _data);
    }
    
    w.post = function () {
        if (1 > arguments.length) {
            return false;
        }
        var _url  = arguments[0],
            _data = {};
        if (2 == arguments.length) {
            if ('function' == typeof(arguments[1])) {
                _data.onComplete = arguments[1];
            }
            else {
                _data.parameters = arguments[1];
            }
        }
        else if (3 == arguments.length) {
            _data.parameters = arguments[1];
            if ('function' == typeof(arguments[2])) {
                _data.onComplete = arguments[2];
            }
        }
        _data.method = 'post';
        new Ajax(_url, _data);
    }
    
    w.getJson = function () {
        if (1 > arguments.length) {
            return false;
        }
        var _url  = arguments[0],
            _data = {},
            _cb;
        if (2 == arguments.length) {
            if ('function' == typeof(arguments[1])) {
                _cb = arguments[1];
            }
            else if ('get' == arguments[1] || 'post' == arguments[1]) {
                _data.method = arguments[1];
            }
            else {
                _data.parameters = arguments[1];
            }
        }
        else if (3 == arguments.length) {
            if ('get' == arguments[1] || 'post' == arguments[1]) {
                _data.method = arguments[1];
            }
            else {
                _data.parameters = arguments[1];
            }
            if ('function' == typeof(arguments[2])) {
                _cb = arguments[2];
            }
        }
        else if (4 == arguments.length) {
            _data.method = arguments[1];
            _data.parameters = arguments[2];
            if ('function' == typeof(arguments[3])) {
                _cb = arguments[3];
            }
        }
        if (_cb) {
            _data.onComplete = function (data_) {
                //XXX 中兴的高清机顶盒，没有JSON对象
                if (!window.JSON || JSON.parse == 'undefined') {
                    data_ = eval(data_);
                }
                else {
                    data_ = JSON.parse(data_)
                }
                return _cb(data_);
            }
        }
        new Ajax(_url, _data);
    };
    
    /**
    * 光标控制
    *
    *
    */
    //添加遥控器事件默认监听函数
    Remote.setDefaultHandler('KeyUp', function () {
        Focus.up();
    });
    Remote.setDefaultHandler('KeyDown', function () {
        Focus.down();
    });
    Remote.setDefaultHandler('KeyLeft', function () {
        Focus.left();
    });
    Remote.setDefaultHandler('KeyRight', function () {
        Focus.right();
    });
    Remote.setDefaultHandler('KeyOk', function () {
        Focus.ok();
    });
    Remote.addEventListener('KeyBack', function () {
        //有些光标，点击时弹出窗口，但页面不跳转，再按返回窗口消失，此时应该将clicked置为空
        Focus.clicked = null;
    });
    Remote.addEventListener('OTTKeyBack', function () {
        //有些光标，点击时弹出窗口，但页面不跳转，再按返回窗口消失，此时应该将clicked置为空
        Focus.clicked = null;
    });
    
    //光标管理对象
    w.Focus = {
        locked  : 0, //光标是否锁定，锁定后不可移动。手工change也无效
        node    : null, //当前亮起的光标节点
        dir     : 0,
        /**
         * 初始化光标节点，在一开始页面还没有光标时，调用此方法
         * @param node_ 当前的光标节点
         */
        init    : function (node_) {
            if (!this.node) {
                this.node = node_;
                this.node.on();
            }
            return true;
        },
        /**
         * 根据历史记录注册一个光标节点
         * 因为有些光标所在的按钮，一开始是隐藏的，需要点击另一个按钮(开启按钮)才能显示。
         * 所以这种情况下，一定要记录开启按钮的坐标，而且执行点击函数。才可让光标显示。
         * @param main_node  光标根节点
         * @param history    是历史记录的字符串，格式是光标节点坐标值，和他的父节点的坐标值
         * "x-y:parent.x-parent.y....top.x-top.y" 如："0-2:0-0:0-1:1-1:0-0"
         * 或者是开启按钮式的坐标路由|光标的坐标路由："1-0:0-0:1-1:0-0|0-2:0-0:0-1:1-1:0-0"
         */
        initByhistory : function (main_node, history) {
            if (history instanceof Array) {
                history = history[0];
            }
            var _track = history.split('|'),
                _node;
            if (1 < _track.length) {
                //有点击过的光标
                var _clicked = _track[0].split(':');
                _clicked.pop();
                var coord_str = _clicked.pop();
                _node = main_node;
                while(coord_str) {
                    var coord = coord_str.split('-');
                    var _x = coord[0];
                    var _y = coord[1];
                    var _node = _node.getChild(_x, _y);
                    if (!_node) {
                        break;
                    }
                    coord_str = _clicked.pop();
                }
                if (_node) {
                    _node.ok();
                    this.clicked = _node;
                    //如果初始化光标同事也是点击光标，则直接返回
                    if (_track[1] == _track[0]) {
                        this.node = _node;
                        return true;
                    }
                }
            }
            var _track_arr = _track.pop().split(':');
            _track_arr.pop();
            var coord_str = _track_arr.pop();
            _node = main_node;
            while(coord_str) {
                var coord = coord_str.split('-');
                var _x = coord[0];
                var _y = coord[1];
                _node.onEnter();
                var _node = _node.getChild(_x, _y);
                if (!_node) {
                    break;
                }
                coord_str = _track_arr.pop();
            }
            if (_node) {
                if (_node.is_collection) {
                    _node = _node.getFirstChild();
                }
                if (!_node) {
                    _node = main_node.getFirstChild();
                }
                this.node = _node;
                _node.on();
                return true;
            }
            else {
                this.init(main_node.getFirstChild());
                return false;
            }
        },
        clicked : null, //把有点击动作的节点保存在这里，一般情况下，按钮一旦点击，就会离开页面，如果没有离开页面，很有可能会显示其他按钮。
        /**
         * 光标移动，让一个按钮的光标消失，让下一个按钮的光标亮起
         * @param next_  需要点亮的光标节点
         * @param direction_ 移动方向
         */
        change : function (next_, direction_) {
            if (this.locked) {
                return;
            }
            //next_有可能是一个空壳(底下还没有添加任何子元素的节点集合，这种情况下next_.is_collection应该为1)
            //理论上应该要杜绝只取空壳的情况。应当把空壳和status=0的情况做同样处理
            if (next_ && !next_.is_collection) {
                direction_ = direction_ || null;
                this.node && this.node.lost();
                this.node = next_;
                this.node.on(direction_);
            }
            return;
        },
        /**
         * 光标上移
         */
        up : function () {
            if (this.locked) {
                return;
            }
            this.dir = 1;
            this.change(this.node.getAbove(), this.DIR_UP);
        },
        /**
         * 光标下移
         */
        down : function () {
            if (this.locked) {
                return;
            }
            this.dir = -1;
            this.change(this.node.getUnder(), this.DIR_DOWN);
        },
        /**
         * 光标左移
         */
        left : function () {
            if (this.locked) {
                return;
            }
            this.dir = 2;
            this.change(this.node.getLeft(), this.DIR_LEFT);
        },
        /**
         * 光标右移
         */
        right : function () {
            if (this.locked) {
                return;
            }
            this.dir = -2;
            this.change(this.node.getRight(), this.DIR_RIGHT);
        },
        /**
         * 光标所在的按钮被点击ok
         */
        ok : function () {
            if (this.locked) {
                return;
            }
            if (false !== this.node.ok()) {
                this.clicked = this.node;
            }
        },
        /**
         * 获取当前光标节点的路径，以供保存历史记录
         */
        getHistory : function () {
            var _coord = this.node.coordTostr();
            if (this.clicked) {
                _coord = this.clicked.coordTostr() + '|' + _coord;
            }
            return _coord;
        },
        DIR_UP    : 1,
        DIR_DOWN  : 2,
        DIR_LEFT  : 3,
        DIR_RIGHT : 4
    };
    
    
    /**
     * 光标节点类，
     * 光标节点可以是一个按钮，也可以是一堆按钮的集合
     * @param args 设置参数
     */
    w.FocusNode = function (args) {
        args = args || {};
        this.x      = args.x || 0; //光标在坐标系中的x值
        this.y      = args.y || 0; //光标在坐标系中的y值
        this.on     = args.on || null; //光标点亮时的回调函数
        this.lost   = args.lost || null;//光标移走时的回调函数
        this.ok     = args.ok || null;//光标按钮被点击时的回调函数
        this.status = ('undefined' == typeof(args.status)) ? 1 : args.status;//光标状态，是否可用
        this.data   = args.data || null;//光标节点需要保存的数据
        this.id     = args.id || null;//节点id
        //以下几个事件，只有focus集合才会被执行
        this.event_agent    = args.event_agent || {};//事件代理，设置此属性后，子结点的事件响应都将使用此属性内的方法
        this.cache          = args.cache || 0;//光标跳出该集合时，是否记住光标所在子结点的ID
        this.saved_id       = args.saved_id || null;//光标跳出该集合时，所在子结点的ID，当光标再次跳入此集合是恢复该节点的亮起状态
        this.saved_dir      = args.saved_dir || null;//光标跳出该集合时，所在子结点的ID，当光标再次跳入此集合是恢复该节点的亮起状态
        this.onLeftBorder   = args.onLeftBorder || function () {};//光标移动到左边界时的回调函数
        this.onRightBorder  = args.onRightBorder || function () {};//光标移动到右边界时的回调函数
        this.onTopBorder    = args.onTopBorder || function () {};//光标移动到上边界时的回调函数
        this.onBottomBorder = args.onBottomBorder || function () {};//光标移动到下边界时的回调函数
        this.onEnter        = args.onEnter || function () {};//光标移进来时的回调函数
        this.onLeave        = args.onLeave || function () {};//光标移出去时的回调函数
        //子结点
        this.children = [];
        //活着的子结点
        this.alive_children = null;
        //父节点
        this.parent  = null;
        //是否是光标集合，通过args.on来判断，如果有on回调，说明是一个实体光标节点，没有则说明是一个光标集合
        this.is_collection = args.on ? 0 : 1;
    };
    
    w.FocusNode.prototype = {
        /**
         * 为本节点添加一个子结点。
         * @param node 待添加的子光标节点
         */
        addChild : function (node) {
            if (!(node instanceof FocusNode)) {
                d('addChild failed: node is not a FocusNode Object', node);
            }
            var _x = node.x, _y = node.y;
            node.parent = this;
            if (!this.children[_y]) {
                this.children[_y] = [];
            }
            //继承保存历史开关
            if (0 == node.cache && 1 == this.cache) {
                node.cache = 1;
            }
            //设置事件代理方法
            if (!node.on) {
                if (this.event_agent.on) {
                    node.on = this.event_agent.on
                    //是否是光标集合，通过args.on来判断，如果有on回调，说明是一个实体光标节点，没有则说明是一个光标集合
                    node.is_collection = 0;
                }
                else {
                    node.on = function () {};
                }
            }
            if (!node.lost) {
                if (this.event_agent.lost) {
                    node.lost = this.event_agent.lost
                }
                else {
                    node.lost = function () {};
                }
            }
            if (!node.ok) {
                if (this.event_agent.ok) {
                    node.ok = this.event_agent.ok
                }
                else {
                    node.ok = function () {};
                }
            }
            this.children[_y][_x] = node;
        },
        /**
         * 替换指定位置的子结点，该位置原来的节点会和parent解除父子关系
         * @param x     要替换的位置x值
         * @param y     要替换的位置y值
         * @param node  新的节点对象
         */
        replaceChild : function (x, y, node) {
            if (!this.children[y]) {
                return false;
            }
            if (this.children[y][x]) {
                this.children[y][x].parent = null;
            }
            node.x = x;
            node.y = y;
            node.parent = this;
            this.children[y][x] = node;
            return true;
        },
        /**
         * 获取指定位置(或方向)的子结点，会向后递归
         * dir=-1表示从后面往前递归取元素
         * @param x     要获取的位置x值
         * @param y     要获取的位置y值
         * @param dir   搜索方向
         */
        getPosterity : function (x, y, dir) {
            if (!this.children[y]) {
                return null;
            }
            var _child = this.children[y][x];
            if (!_child) {
                return null;
            }
            //如果子结点的status不为1，则不再进入深层搜索
            if (0 < _child.children.length && 1 == _child.status) {
                //如果历史记录开关打开，且有历史记录
                if (1 == _child.cache && _child.saved_id && (0 == Focus.dir || _child.saved_dir == -Focus.dir)) {
                    var ret = _child.onEnter();
                    if (false === ret) {
                        return null;
                    }
                    return _child.getPosterity(_child.saved_id[0], _child.saved_id[1]);
                }
                if (_child.alive_children) {
                    var ret = _child.onEnter();
                    if (false === ret) {
                        return null;
                    }
                    //启动异次元搜索
                    return _child.getAliveChild(0, 0);
                }
                
                //dir = -1 的时候，返回最后一个子元素
                if (-1 == dir) {
                    return _child.getLastChild();
                }
                else if (-2 == dir) {
                    if (1 < _child.children.length) {
                        return _child.getFirstChild();
                    }
                    else {
                        return _child.getLastChild();
                    }
                }
                else if (-3 == dir) {
                    if (1 == _child.children.length && 1 < _child.children[0].length) {
                        return _child.getFirstChild();
                    }
                    else {
                        return _child.getLastChild();
                    }
                }
                else {
                    return _child.getFirstChild();
                }
            }
            return _child;
        },
        /**
         * 获取一个儿子结点，不向后递归
         * @param x     要获取的位置x值
         * @param y     要获取的位置y值
         */
        getChild : function (x, y) {
            if (!this.children[y]) {
                return null;
            }
            var _child = this.children[y][x];
            if (!_child) {
                return null;
            }
            return _child;
        },
        /**
         * 获得一个可用的子结点
         * @param x     要获取的位置x值
         * @param y     要获取的位置y值
         */
        getAliveChild : function (x, y) {
            if (!this.alive_children) {
                return null;
            }
            if (!this.alive_children[y]) {
                return null;
            }
            var _len = this.alive_children[y].length - 1;
            if (x > _len) {
                return this.alive_children[y][_len]
            }
            return this.alive_children[y][x] || null;
        },
        /**
         * 过滤掉不可用的子结点
         */
        filterDisabled : function () {
            var _c = this.children,
                _x = 0,
                _y = -1,
                _z = -1;
            this.alive_children = [];
            for(var i = 0; i < _c.length; i++) {
                if (_c[i]) {
                    for (var j = 0; j < _c[i].length; j++) {
                        if (_c[i][j] && 1 == _c[i][j].status) {
                            if (_z != i) {
                                _y++;
                                _x = 0;
                                this.alive_children[_y] = [];
                                _z = i;
                            }
                            var _node = _c[i][j];
                            _node.aX = _x;
                            _node.aY = _y;
                            this.alive_children[_y][_x] = _node;
                            _x++;
                        }
                    }
                }
            }
        },
        /**
         * 获得第一个子结点
         */
        getFirstChild : function () {
            var ret = this.onEnter();
            if (false === ret) {
                return null;
            }
            return this.getPosterity(0, 0);
        },
        /**
         * 获得最后一个子结点
         */
        getLastChild : function () {
            var ret = this.onEnter();
            if (false === ret) {
                return null;
            }
            var _lengthY = this.children.length;
            if (0 == _lengthY) {
                return null;
            }
            var _lengthX = this.children[_lengthY - 1].length;
            if (0 == _lengthX) {
                return null;
            }
            return this.getPosterity(_lengthX - 1, _lengthY - 1, -1);
        },
        /**
         * 移除所有子结点，并断开父子关系
         */
        removeChildren : function () {
            for(var i = 0; i < this.children.length; i++) {
                var _child_row = this.children[i];
                for (var j = 0; j < _child_row.length; j++) {
                    _child_row[j].parent = null;
                }
            }
            this.children = [];
        },
        /**
         * 获取父节点的兄弟节点
         */
        _getUncle : function (offsetX, offsetY) {
            var _p   = this.parent,
                _x   = _p.x + offsetX,
                _y   = _p.y + offsetY,
                _dir = 1;
            if (!_p.parent) {
                return null;
            }
            var _pp  = _p.parent;
            if (-1 == offsetX) {
                //左移
                _dir = -2;
            }
            else if (-1 == offsetY) {
                //上移
                _dir = -3;
            }
            //如果上下移动中，上一个x坐标超过了下一个x坐标的最大值，则调整为下一个x左边的最大值
            if (0 != offsetY && _pp.children[_y] && _x >= _pp.children[_y].length) {
                var _uncle = _pp.getPosterity(_pp.children[_y].length - 1, _y, _dir);
            }
            else {
                var _uncle =  _pp.getPosterity(_x, _y, _dir);
            }
            if (_uncle) {
                //找到的不可用或者是个空壳
                if (1 != _uncle.status || _uncle.is_collection) {
                    return _uncle.getByOffset(offsetX, offsetY);
                }
                return _uncle;
            }
            return _p._getUncle(offsetX, offsetY);
        },
        /**
         * 将节点所在的坐标路由转换成字符串
         */
        coordTostr : function () {
            var _str = this.x + '-' + this.y;
            if (this.parent) {
                _str += ':' + this.parent.coordTostr();
            }
            return _str;
        },
        /**
         * 根据当前节点的偏移量来获取兄弟结点
         */
        getByOffset : function (offsetX, offsetY) {
            var _p   = this.parent,
                _x   = this.x + offsetX,
                _y   = this.y + offsetY,
                _dir = 1;;
            if (!_p) {
                return null;
            }
            if (-1 == offsetX) {
                //左移
                _dir = -2;
            }
            else if (-1 == offsetY) {
                //上移
                _dir = -3;
            }
            //如果上下移动中，上一个x坐标超过了下一个x坐标的最大值，则调整为下一个x左边的最大值
            if (0 != offsetY && _p.children[_y] && _x >= _p.children[_y].length) {
                var _next = _p.getPosterity(_p.children[_y].length - 1, _y, _dir);
            }
            else {
                var _next = _p.getPosterity(_x, _y, _dir);
            }
            if (_next) {
                if (0 == _next.status) {
                    return _next.getByOffset(offsetX, offsetY);
                }
                return _next;
            }
            //触发事件
            var ret = true;
            if (0 == offsetY) {
                if (0 > offsetX) {
                    //左移到边界
                    ret = _p.onLeftBorder();
                    if (1 == _p.cache) {
                        _p.saveId(this.x, this.y);
                    }
                }
                else if (0 < offsetX) {
                    //右移到边界
                    ret = _p.onRightBorder();
                    if (1 == _p.cache) {
                        _p.saveId(this.x, this.y);
                    }
                }
            }
            else if (0 == offsetX) {
                if (0 > offsetY) {
                    //上移到边界
                    ret = _p.onTopBorder();
                    if (1 == _p.cache) {
                        _p.saveId(this.x, this.y);
                    }
                }
                else if (0 < offsetY) {
                    //下移到边界
                    ret = _p.onBottomBorder();
                    if (1 == _p.cache) {
                        _p.saveId(this.x, this.y);
                    }
                }
            }
            if (false === ret) {
                return null;
            }
            var _uncle = this._getUncle(offsetX, offsetY);
            if (_uncle) {
                _p.onLeave();
                //跳出
            }
            return _uncle;
        },
        saveId : function (x, y) {
            this.saved_id  = [x, y];
            this.saved_dir = Focus.dir;
            if (this.parent.cache) {
                this.parent.saveId(this.x, this.y);
            }
        },
        /**
         * 获取左兄弟节点
         */
        getLeft : function () {
            var _node = this.getByOffset(-1, 0);
            if (!_node && undefined != this.aX && this.parent && this.parent.alive_children) {
                _node = this.parent.getAliveChild(this.aX - 1, this.aY);
            }
            return _node;
        },
        getRight : function () {
            var _node = this.getByOffset(1, 0);
            if (!_node && undefined != this.aX && this.parent && this.parent.alive_children) {
                _node = this.parent.getAliveChild(this.aX + 1, this.aY);
            }
            return _node;
        },
        getAbove : function () {
            var _node = this.getByOffset(0, -1);
            if (!_node && undefined != this.aX && this.parent && this.parent.alive_children) {
                _node = this.parent.getAliveChild(this.aX, this.aY - 1);
            }
            return _node;
        },
        getUnder : function () {
            var _node = this.getByOffset(0, 1);
            if (!_node && undefined != this.aX && this.parent && this.parent.alive_children) {
                _node = this.parent.getAliveChild(this.aX, this.aY + 1);
            }
            return _node;
        }
    };
    //end Focus
    
    //光标框
    w.focus_ui = {
        x        : 0, 
        y        : 0,
        fillet_w : 0,
        fillet_h : 0,
        border_w : 0,
        border_h : 0,
        z_index  : 999,
        w        : 300,
        h        : 200,
        display  : 0,
        div_s    : [],
        init  : function (fillet_width_, fillet_height_, border_width_, border_height_, file_dir_) {
            this.border_w = border_width_;
            this.border_h = border_height_;
            this.fillet_w = fillet_width_;
            this.fillet_h = fillet_height_;
            var _doc = w.document, _div, _top, _left, _width, _height, _bg_file, _bg_offset;
            for (var i = 0; i < 8; i++) {
                switch(i) {
                case 0 :
                    _top = 0; _left = 0; _width = fillet_width_; _height = fillet_height_;
                    _bg_file = 'focus_bg_0'; _bg_offset = '';
                    break;
                case 1 :
                    _top = 0; _left = fillet_width_; _width = this.w; _height = fillet_height_;
                    _bg_file = 'focus_bg_1'; _bg_offset = '';
                    break;
                case 2 :
                    _top = 0; _left = (fillet_width_ + this.w); _width = fillet_width_; _height = fillet_height_;
                    _bg_file = 'focus_bg_0'; _bg_offset = 'background-position:0px ' + (fillet_height_ * 2) + 'px';
                    break;
                case 3 :
                    _top = fillet_height_; _left = (fillet_width_ + this.w); _width = fillet_width_; _height = this.h;
                    _bg_file = 'focus_bg_2'; _bg_offset = '';
                    break;
                case 4 :
                    _top = (fillet_height_ + this.h); _left = (fillet_width_ + this.w); _width = fillet_width_; _height = fillet_height_;
                    _bg_file = 'focus_bg_0'; _bg_offset = 'background-position:0px ' + fillet_height_ + 'px';
                    break;
                case 5 :
                    _top = (fillet_height_ + this.h); _left = fillet_width_; _width = this.w; _height = fillet_height_;
                    _bg_file = 'focus_bg_1'; _bg_offset = 'background-position:0px ' + fillet_height_ + 'px';
                    break;
                case 6 :
                    _top = (fillet_height_ + this.h); _left = 0; _width = fillet_width_; _height = fillet_height_;
                    _bg_file = 'focus_bg_0'; _bg_offset = 'background-position:0px ' + (fillet_height_ * 3) + 'px';
                    break;
                case 7 :
                    _top = fillet_height_; _left = 0; _width = fillet_width_; _height = this.h;
                    _bg_file = 'focus_bg_2'; _bg_offset = 'background-position:' + fillet_width_ + 'px 0px';
                    break;
                }
                _div = _doc.createElement("div");
                //XXX 老中兴机顶盒，没有cssText属性
                //XXX 双模小红机顶盒，不能直接用“带background-position”的background，需要用background-image来代替
                if (IS_UT || _div.style.cssText) {
                    _div.style.cssText = "z-index:999;display: none; position: absolute; top:" + _top
                    + "px; left:" + _left + "px; width: " + _width + "px; height: " + _height
                    + "px;  background-image: url('" + file_dir_ + "/" + _bg_file + ".png');" + _bg_offset;
                }
                else {
                    _div.style['z-index']    = 999;
                    _div.style['display']    = 'none';
                    _div.style['position']   = 'absolute';
                    _div.style['top']        = _top + 'px';
                    _div.style['left']       = _left + 'px';
                    _div.style['width']      = _width + 'px';
                    _div.style['height']     = _height + 'px';
                    _div.style['background-image'] = "url('" + file_dir_ + "/" + _bg_file + ".png')";
                    if (_bg_offset) {
                        _div.style['background-position'] = _bg_offset.replace('background-position:', '');
                    }
                }
                _doc.body.appendChild(_div);
                this.div_s.push(_div);
            }
        },
        on    : function () {
            if (1 == this.display) {
                return;
            }
            for (var i = 0; i < 8; i++) {
                this.div_s[i].style.display = '';
            }
            this.display = 1;
        },
        lost : function () {
            for (var i = 0; i < 8; i++) {
                this.div_s[i].style.display = 'none';
            }
            this.display = 0;
        },
        setSize : function (w, h) {
            w = w - 2 * (this.fillet_w - this.border_w);
            h = h - 2 * (this.fillet_h - this.border_h);
            if (0 >= w) {
                w = 1;
            }
            if (0 >= h) {
                h = 1;
            }
            var div_s = this.div_s;
            div_s[1].style.width  = w + 'px';
            div_s[5].style.width  = w + 'px';
            div_s[3].style.height = h + 'px';
            div_s[7].style.height = h + 'px';
            this.h = h;
            this.w = w;
            this.setPost(this.x, this.y);
        },
        setPost : function (x, y) {
            y = y - this.border_h;
            x = x - this.border_w;
            var div_s = this.div_s;
            div_s[0].style.left  = x + 'px';
            div_s[0].style.top   = y + 'px';
            div_s[1].style.left  = (this.fillet_w + x) + 'px';
            div_s[1].style.top   = y + 'px';
            div_s[2].style.left  = (this.fillet_w + this.w + x) + 'px';
            div_s[2].style.top   = y + 'px';
            div_s[3].style.left  = (this.fillet_w + this.w + x) + 'px';
            div_s[3].style.top   = (this.fillet_h + y) + 'px';
            div_s[4].style.left  = (this.fillet_w + this.w + x) + 'px';
            div_s[4].style.top   = (this.fillet_h + this.h + y) + 'px';
            div_s[5].style.left  = (this.fillet_w + x) + 'px';
            div_s[5].style.top   = (this.fillet_h + this.h + y) + 'px';
            div_s[6].style.left  = x + 'px';
            div_s[6].style.top   = (this.fillet_h + this.h + y) + 'px';
            div_s[7].style.left  = x + 'px';
            div_s[7].style.top   = (this.fillet_h + y) + 'px';
            this.x = x;
            this.y = y;
        }
    };
})(window);