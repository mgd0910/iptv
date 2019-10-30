//localStorage
var _ls;
if (window.sessionStorage) {
    _ls = window.sessionStorage;
}
else if (window.localStorage) {
    _ls = window.localStorage;
}
else if (location.href !== parent.location.href) {
    if (undefined == parent._VIS_STORAGE_SPACE) {
        parent._VIS_STORAGE_SPACE = {};
    }
    if (undefined == parent._VIS_STORAGE_SPACE) {
    }
    else {
        var _data = parent._VIS_STORAGE_SPACE;
        _ls = {
            setItem : function (key_, value_) {
                _data[key_] = value_;
                return true;
            },
            getItem : function (key_) {
                return _data[key_];
            },
            removeItem : function (key_) {
                if (undefined == _data[key_]) {
                    return false;
                }
                delete _data[key_];
                return true;
            },
            clear : function () {
                _data = {};
            },
            getData : function () {
                return _data;
            }
        }
    }
}
if (!_ls) {
    if (window.d) {
        d('warning localStorage is unsupported');
    }
    var ls = null;
}
else {
    var _href          = location.href,
        _page_key_pref = _href.substring(_href.indexOf('viscore') + 8),
        _epg_info_post = _page_key_pref.indexOf('epg_info=');
    if (1 < _epg_info_post) {
        _page_key_pref = _page_key_pref.substring(0, _epg_info_post - 1);
    }
    if ('/' == _page_key_pref.substr(-1)) {
        _page_key_pref = _page_key_pref.substr(0, _page_key_pref.length-1);
    }
    var ls = {
        get        : function (key_) {return _ls.getItem(key_)},
        set        : function (key_, _value) {return _ls.setItem(key_, _value)},
        remove     : function (key_) {return _ls.removeItem(key_)},
        clear      : function () {return _ls.clear()},
        getAll     : function () {
            //浏览器原生接口
            if (_ls.key && 'function' == typeof(_ls.key)) {
                var _d = {}
                for (var i = 0; i < _ls.length; i++) {
                    var _key = _ls.key(i);
                    _d[_key] = _ls.getItem(_key);
                }
                return _d;
            }
            else {
                return _ls.getData();
            }
        },
        pageSet    : function (key_, value_) {
            var _new_key = _page_key_pref + '*' + key_;
            return _ls.setItem(_new_key, value_);
        },
        pageGet    : function (key_) {
            return _ls.getItem(_page_key_pref + '*' + key_);
        },
        pageRemove : function (key_) {
            var _new_key = _page_key_pref + '*' + key_;
            return _ls.removeItem(_new_key);
        },
        pageClear  : function () {
            //浏览器原生接口
            if (_ls.key && 'function' == typeof(_ls.key)) {
                for (var i = 0; i < _ls.length; i++) {
                    var _key = _ls.key(i);
                    if (_key && 0 <= _key.indexOf(_page_key_pref)) {
                        _ls.removeItem(_key);
                    }
                }
            }
            else {
                var _d = _ls.getData();
                for (var i in _d) {
                    if (0 <= i.indexOf(_page_key_pref)) {
                        _ls.removeItem(i);
                    }
                }
            }
            return true;
        },
        pageGetAll    : function () {
            //浏览器原生接口
            if (_ls.key && 'function' == typeof(_ls.key)) {
                var _d = {}
                for (var i = 0; i < _ls.length; i++) {
                    var _key   = _ls.key(i);
                    var _index = _key.indexOf(_page_key_pref);
                    if (0 <= _index) {
                        var _new_key = _key.replace(_page_key_pref + '*', '');
                        _d[_new_key] = _ls.getItem(_key);
                    }
                }
                return _d;
            }
            else {
                var _d = _ls.getData();
                var _p = {};
                for (var i in _d) {
                    var _index = _key.indexOf(_page_key_pref);
                    if (0 <= _index) {
                        var _new_key = _key.replace(_page_key_pref + '*', '');
                        _p[_new_key] = _d[_key];
                    }
                }
            }
        }
    };
}