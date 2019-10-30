(function (w) {
    var w = window;
    
    //UT��������ӣ��ܶ�ط�����ĺ��Ӳ�һ��
    var IS_UT = false;
    if (0 < navigator.userAgent.indexOf('JETU')) {
        IS_UT = true;
    }
    /**
     * Volume ��������
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
     * Remote ң������������
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
            //��ԭ�¼�ð������
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
            
            //XXX ��Щ���˵ĺ���,stopPropagation��preventDefault�������޸�
            //�������޸�Ҳ������,�ؼ���ִ�к󲻻�ı� propagationStopped ��  defaultPrevented��ֵ
            //���ɿ�����safeStopPropagation �� safePreventDefault����֮
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
            //TODO �������˻����в�֧��indexOf����function���˴��Ȳ������ظ����
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
        //����ҳʱ��������ش洢
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
            d('��һ��:' + i, _f.name);
            d('url:' + i, _f.location.href);
            for (j = 0; j < _f.frames.length; j++) {
                var _ff = _f.frames[j];
                d('--�ڶ���:', _ff.name);
                d('--url:', _ff.location.href);
                for (k = 0; k < _ff.frames.length; k++) {
                    var _fff = _ff.frames[k];
                    d('----������:', _fff.name);
                    d('----url:', _fff.location.href);
                    d('----������frames.length:', _fff.frames.length);
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
            //XXX UT�ĺ��ӣ��ڵ�һ��ֹͣĬ���¼����Ժ�ÿһ�ζ���ֹͣ
            if (IS_UT) {
                e.defaultPrevented = undefined;
            }
            switch (_key_code) {
            case _R.KEY_UP :
                _R.dispatchEvent('KeyUp', e);
                if (e.preventDefault) {
                    //��ֹĬ���¼���Ӧ
                    e.preventDefault();
                }
                break;
            case _R.KEY_DOWN : 
                _R.dispatchEvent('KeyDown', e);
                if (e.preventDefault) {
                    //��ֹĬ���¼���Ӧ
                    e.preventDefault();
                }
                break;
            case _R.KEY_LEFT : 
                _R.dispatchEvent('KeyLeft', e);
                if (e.preventDefault) {
                    //��ֹĬ���¼���Ӧ
                    e.preventDefault();
                }
                break;
            case _R.KEY_RIGHT : 
                _R.dispatchEvent('KeyRight', e);
                if (e.preventDefault) {
                    //��ֹĬ���¼���Ӧ
                    e.preventDefault();
                }
                break;
            case _R.KEY_OKey : 
                _R.dispatchEvent('KeyOk', e);
                if (e.preventDefault) {
                    //��ֹĬ���¼���Ӧ
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
                    //��ֹĬ���¼���Ӧ
                    e.preventDefault();
                }
                break;
            case _R.KEY_NEXT : 
                _R.dispatchEvent('KeyNext', e);
                if (e.preventDefault) {
                    //��ֹĬ���¼���Ӧ
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
            //ֹͣ�¼�ð��
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
    //ֻ��url��ָ��host�ڲſ���debug����
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
                    //XXX �����˻����У�û��cssText����
                    //XXX UT�ĺ��ӣ���cssText���ԣ����ǲ��ܻ�ȡ��ֻ������
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
                      //���ֻ֧��ѭ��3�㣬�������׽�����ѭ��
                        _str += '[Object]';
                    }
                    else {
                        _str += '{';
                        //Event����ֻ��ѭ��һ�Σ�Ҫ��Ȼ�������ѭ��
                        //TODO UTû��Event����
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
     * DOM ����
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
            tmpdom = null; //������ʱ����
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
        //get��ȡDOM����
        'get' : function(i){
            return this.lists[i];
        },
        //eq��ȡQuery����
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
     * Ajax ����
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
                d('Ajax �����ȡʧ��');
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
    
    //ע�⣬UTҪдȫ·����url
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
                //XXX ���˵ĸ�������У�û��JSON����
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
    * ������
    *
    *
    */
    //���ң�����¼�Ĭ�ϼ�������
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
        //��Щ��꣬���ʱ�������ڣ���ҳ�治��ת���ٰ����ش�����ʧ����ʱӦ�ý�clicked��Ϊ��
        Focus.clicked = null;
    });
    Remote.addEventListener('OTTKeyBack', function () {
        //��Щ��꣬���ʱ�������ڣ���ҳ�治��ת���ٰ����ش�����ʧ����ʱӦ�ý�clicked��Ϊ��
        Focus.clicked = null;
    });
    
    //���������
    w.Focus = {
        locked  : 0, //����Ƿ������������󲻿��ƶ����ֹ�changeҲ��Ч
        node    : null, //��ǰ����Ĺ��ڵ�
        dir     : 0,
        /**
         * ��ʼ�����ڵ㣬��һ��ʼҳ�滹û�й��ʱ�����ô˷���
         * @param node_ ��ǰ�Ĺ��ڵ�
         */
        init    : function (node_) {
            if (!this.node) {
                this.node = node_;
                this.node.on();
            }
            return true;
        },
        /**
         * ������ʷ��¼ע��һ�����ڵ�
         * ��Ϊ��Щ������ڵİ�ť��һ��ʼ�����صģ���Ҫ�����һ����ť(������ť)������ʾ��
         * ������������£�һ��Ҫ��¼������ť�����꣬����ִ�е���������ſ��ù����ʾ��
         * @param main_node  �����ڵ�
         * @param history    ����ʷ��¼���ַ�������ʽ�ǹ��ڵ�����ֵ�������ĸ��ڵ������ֵ
         * "x-y:parent.x-parent.y....top.x-top.y" �磺"0-2:0-0:0-1:1-1:0-0"
         * �����ǿ�����ťʽ������·��|��������·�ɣ�"1-0:0-0:1-1:0-0|0-2:0-0:0-1:1-1:0-0"
         */
        initByhistory : function (main_node, history) {
            if (history instanceof Array) {
                history = history[0];
            }
            var _track = history.split('|'),
                _node;
            if (1 < _track.length) {
                //�е�����Ĺ��
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
                    //�����ʼ�����ͬ��Ҳ�ǵ����꣬��ֱ�ӷ���
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
        clicked : null, //���е�������Ľڵ㱣�������һ������£���ťһ��������ͻ��뿪ҳ�棬���û���뿪ҳ�棬���п��ܻ���ʾ������ť��
        /**
         * ����ƶ�����һ����ť�Ĺ����ʧ������һ����ť�Ĺ������
         * @param next_  ��Ҫ�����Ĺ��ڵ�
         * @param direction_ �ƶ�����
         */
        change : function (next_, direction_) {
            if (this.locked) {
                return;
            }
            //next_�п�����һ���տ�(���»�û������κ���Ԫ�صĽڵ㼯�ϣ����������next_.is_collectionӦ��Ϊ1)
            //������Ӧ��Ҫ�ž�ֻȡ�տǵ������Ӧ���ѿտǺ�status=0�������ͬ������
            if (next_ && !next_.is_collection) {
                direction_ = direction_ || null;
                this.node && this.node.lost();
                this.node = next_;
                this.node.on(direction_);
            }
            return;
        },
        /**
         * �������
         */
        up : function () {
            if (this.locked) {
                return;
            }
            this.dir = 1;
            this.change(this.node.getAbove(), this.DIR_UP);
        },
        /**
         * �������
         */
        down : function () {
            if (this.locked) {
                return;
            }
            this.dir = -1;
            this.change(this.node.getUnder(), this.DIR_DOWN);
        },
        /**
         * �������
         */
        left : function () {
            if (this.locked) {
                return;
            }
            this.dir = 2;
            this.change(this.node.getLeft(), this.DIR_LEFT);
        },
        /**
         * �������
         */
        right : function () {
            if (this.locked) {
                return;
            }
            this.dir = -2;
            this.change(this.node.getRight(), this.DIR_RIGHT);
        },
        /**
         * ������ڵİ�ť�����ok
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
         * ��ȡ��ǰ���ڵ��·�����Թ�������ʷ��¼
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
     * ���ڵ��࣬
     * ���ڵ������һ����ť��Ҳ������һ�Ѱ�ť�ļ���
     * @param args ���ò���
     */
    w.FocusNode = function (args) {
        args = args || {};
        this.x      = args.x || 0; //���������ϵ�е�xֵ
        this.y      = args.y || 0; //���������ϵ�е�yֵ
        this.on     = args.on || null; //������ʱ�Ļص�����
        this.lost   = args.lost || null;//�������ʱ�Ļص�����
        this.ok     = args.ok || null;//��갴ť�����ʱ�Ļص�����
        this.status = ('undefined' == typeof(args.status)) ? 1 : args.status;//���״̬���Ƿ����
        this.data   = args.data || null;//���ڵ���Ҫ���������
        this.id     = args.id || null;//�ڵ�id
        //���¼����¼���ֻ��focus���ϲŻᱻִ��
        this.event_agent    = args.event_agent || {};//�¼��������ô����Ժ��ӽ����¼���Ӧ����ʹ�ô������ڵķ���
        this.cache          = args.cache || 0;//��������ü���ʱ���Ƿ��ס��������ӽ���ID
        this.saved_id       = args.saved_id || null;//��������ü���ʱ�������ӽ���ID��������ٴ�����˼����ǻָ��ýڵ������״̬
        this.saved_dir      = args.saved_dir || null;//��������ü���ʱ�������ӽ���ID��������ٴ�����˼����ǻָ��ýڵ������״̬
        this.onLeftBorder   = args.onLeftBorder || function () {};//����ƶ�����߽�ʱ�Ļص�����
        this.onRightBorder  = args.onRightBorder || function () {};//����ƶ����ұ߽�ʱ�Ļص�����
        this.onTopBorder    = args.onTopBorder || function () {};//����ƶ����ϱ߽�ʱ�Ļص�����
        this.onBottomBorder = args.onBottomBorder || function () {};//����ƶ����±߽�ʱ�Ļص�����
        this.onEnter        = args.onEnter || function () {};//����ƽ���ʱ�Ļص�����
        this.onLeave        = args.onLeave || function () {};//����Ƴ�ȥʱ�Ļص�����
        //�ӽ��
        this.children = [];
        //���ŵ��ӽ��
        this.alive_children = null;
        //���ڵ�
        this.parent  = null;
        //�Ƿ��ǹ�꼯�ϣ�ͨ��args.on���жϣ������on�ص���˵����һ��ʵ����ڵ㣬û����˵����һ����꼯��
        this.is_collection = args.on ? 0 : 1;
    };
    
    w.FocusNode.prototype = {
        /**
         * Ϊ���ڵ����һ���ӽ�㡣
         * @param node ����ӵ��ӹ��ڵ�
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
            //�̳б�����ʷ����
            if (0 == node.cache && 1 == this.cache) {
                node.cache = 1;
            }
            //�����¼�������
            if (!node.on) {
                if (this.event_agent.on) {
                    node.on = this.event_agent.on
                    //�Ƿ��ǹ�꼯�ϣ�ͨ��args.on���жϣ������on�ص���˵����һ��ʵ����ڵ㣬û����˵����һ����꼯��
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
         * �滻ָ��λ�õ��ӽ�㣬��λ��ԭ���Ľڵ���parent������ӹ�ϵ
         * @param x     Ҫ�滻��λ��xֵ
         * @param y     Ҫ�滻��λ��yֵ
         * @param node  �µĽڵ����
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
         * ��ȡָ��λ��(����)���ӽ�㣬�����ݹ�
         * dir=-1��ʾ�Ӻ�����ǰ�ݹ�ȡԪ��
         * @param x     Ҫ��ȡ��λ��xֵ
         * @param y     Ҫ��ȡ��λ��yֵ
         * @param dir   ��������
         */
        getPosterity : function (x, y, dir) {
            if (!this.children[y]) {
                return null;
            }
            var _child = this.children[y][x];
            if (!_child) {
                return null;
            }
            //����ӽ���status��Ϊ1�����ٽ����������
            if (0 < _child.children.length && 1 == _child.status) {
                //�����ʷ��¼���ش򿪣�������ʷ��¼
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
                    //�������Ԫ����
                    return _child.getAliveChild(0, 0);
                }
                
                //dir = -1 ��ʱ�򣬷������һ����Ԫ��
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
         * ��ȡһ�����ӽ�㣬�����ݹ�
         * @param x     Ҫ��ȡ��λ��xֵ
         * @param y     Ҫ��ȡ��λ��yֵ
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
         * ���һ�����õ��ӽ��
         * @param x     Ҫ��ȡ��λ��xֵ
         * @param y     Ҫ��ȡ��λ��yֵ
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
         * ���˵������õ��ӽ��
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
         * ��õ�һ���ӽ��
         */
        getFirstChild : function () {
            var ret = this.onEnter();
            if (false === ret) {
                return null;
            }
            return this.getPosterity(0, 0);
        },
        /**
         * ������һ���ӽ��
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
         * �Ƴ������ӽ�㣬���Ͽ����ӹ�ϵ
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
         * ��ȡ���ڵ���ֵܽڵ�
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
                //����
                _dir = -2;
            }
            else if (-1 == offsetY) {
                //����
                _dir = -3;
            }
            //��������ƶ��У���һ��x���곬������һ��x��������ֵ�������Ϊ��һ��x��ߵ����ֵ
            if (0 != offsetY && _pp.children[_y] && _x >= _pp.children[_y].length) {
                var _uncle = _pp.getPosterity(_pp.children[_y].length - 1, _y, _dir);
            }
            else {
                var _uncle =  _pp.getPosterity(_x, _y, _dir);
            }
            if (_uncle) {
                //�ҵ��Ĳ����û����Ǹ��տ�
                if (1 != _uncle.status || _uncle.is_collection) {
                    return _uncle.getByOffset(offsetX, offsetY);
                }
                return _uncle;
            }
            return _p._getUncle(offsetX, offsetY);
        },
        /**
         * ���ڵ����ڵ�����·��ת�����ַ���
         */
        coordTostr : function () {
            var _str = this.x + '-' + this.y;
            if (this.parent) {
                _str += ':' + this.parent.coordTostr();
            }
            return _str;
        },
        /**
         * ���ݵ�ǰ�ڵ��ƫ��������ȡ�ֵܽ��
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
                //����
                _dir = -2;
            }
            else if (-1 == offsetY) {
                //����
                _dir = -3;
            }
            //��������ƶ��У���һ��x���곬������һ��x��������ֵ�������Ϊ��һ��x��ߵ����ֵ
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
            //�����¼�
            var ret = true;
            if (0 == offsetY) {
                if (0 > offsetX) {
                    //���Ƶ��߽�
                    ret = _p.onLeftBorder();
                    if (1 == _p.cache) {
                        _p.saveId(this.x, this.y);
                    }
                }
                else if (0 < offsetX) {
                    //���Ƶ��߽�
                    ret = _p.onRightBorder();
                    if (1 == _p.cache) {
                        _p.saveId(this.x, this.y);
                    }
                }
            }
            else if (0 == offsetX) {
                if (0 > offsetY) {
                    //���Ƶ��߽�
                    ret = _p.onTopBorder();
                    if (1 == _p.cache) {
                        _p.saveId(this.x, this.y);
                    }
                }
                else if (0 < offsetY) {
                    //���Ƶ��߽�
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
                //����
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
         * ��ȡ���ֵܽڵ�
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
    
    //����
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
                //XXX �����˻����У�û��cssText����
                //XXX ˫ģС������У�����ֱ���á���background-position����background����Ҫ��background-image������
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