var log = require('logging').from(__filename),
    Format = require('./format');

var Lazy = exports.Lazy = function(clone) {
    if (!(this instanceof Lazy)) return new Lazy(clone);

    this._data = {};
    this._urls = {};


    if (clone) {
        var new_lazy = this;
        clone.forEach(function(key, value) {
            new_lazy.set(key, value);
        });
    }

};

Lazy.Lazy = Lazy;
module.exports = Lazy;

Lazy.prototype.set = function(key, val, cb) {
    if (val === undefined) {
        delete this._data[key];
        delete this._urls[Format.url(key)];
    } else {
        this._data[key] = val;
        this._urls[Format.url(key)] = key;
    }
};

Lazy.prototype.get = function(key) {
    return this._data[key];
};

Lazy.prototype.url = function(url) {
    return this.get(this._urls[url]);
};



Lazy.prototype.rm = function(key, cb) {
    this.set(key, undefined, cb);
};

Lazy.prototype.__defineGetter__('size', function() {
    return this.keys.length;
});

Lazy.prototype.__defineGetter__('keys', function() {
    return Object.keys(this._data);
});


Lazy.prototype.forEach = function(fn) {
    var keys = this.keys;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (fn(key, this._data[key]) === false) {
            break;
        }
    }
};

