(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Paris || (g.Paris = {})).templates = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}
},{"fs":2}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
var jade = require('@lukekarrys/jade-runtime');

var templatizer = {};



// accordion.jade compiled template
templatizer["accordion"] = function tmpl_accordion(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(Math) {}).call(this, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined);
    return buf.join("");
};

// accordion.jade:accordion compiled template
templatizer["accordion"]["accordion"] = function tmpl_accordion_accordion(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var uuid = Math.random().toString(36).substr(2, 5);
    buf.push('<div role="tablist" aria-multiselectable="true"' + jade.cls([ "component", "component-accordion", data.modifiers ], [ null, null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var item = $$obj[index];
                var slug = item.slug || uuid + "-" + index;
                buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var item = $$obj[index];
                var slug = item.slug || uuid + "-" + index;
                buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
            }
        }
    }).call(this);
    buf.push("</div>");
    return buf.join("");
};

// buttons.jade compiled template
templatizer["buttons"] = function tmpl_buttons(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// buttons.jade:button compiled template
templatizer["buttons"]["button"] = function tmpl_buttons_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// buttons.jade:buttons compiled template
templatizer["buttons"]["buttons"] = function tmpl_buttons_buttons(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-buttons", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        var title_tag = data.title_tag || "h2";
        buf.push("<" + title_tag + ' class="buttons-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + title_tag + ">");
    }
    buf.push("<ul" + jade.cls([ "buttons-items", data.activeCenter ], [ null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["buttons"]["button"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["buttons"]["button"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};

// demande.jade compiled template
templatizer["demande"] = function tmpl_demande(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// demande.jade:button compiled template
templatizer["demande"]["button"] = function tmpl_demande_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// demande.jade:demande compiled template
templatizer["demande"]["demande"] = function tmpl_demande_demande(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="component component-demande"><h2>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2><p>" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    if (data.button) {
        buf.push(templatizer["demande"]["button"](data.button));
    }
    buf.push("</div>");
    return buf.join("");
};

// districts.jade compiled template
templatizer["districts"] = function tmpl_districts(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined);
    return buf.join("");
};

// districts.jade:button compiled template
templatizer["districts"]["button"] = function tmpl_districts_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// districts.jade:districts compiled template
templatizer["districts"]["districts"] = function tmpl_districts_districts(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var activeIndex;
    var uuid = Math.random().toString(36).substr(2, 5);
    buf.push('<div class="component component-districts"><h4 class="districts-heading">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h4><ul role="tablist" class="districts-items-wrapper">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var item = $$obj[index];
                item = JSON.parse(JSON.stringify(item || {}));
                item.modifiers = item.modifiers || [];
                item.modifiers.push("stateful");
                item.attributes = item.attributes || {};
                item.attributes.type = "button";
                if (!item.enabled) {
                    item.attributes.disabled = "disabled";
                } else if (typeof activeIndex === "undefined") {
                    activeIndex = index;
                    item.modifiers.push("active");
                }
                var slug = uuid + "-" + index;
                var attributes = {};
                attributes["id"] = "h-" + slug;
                attributes["roles"] = "tab";
                attributes["aria-controls"] = "#" + slug;
                attributes["aria-selected"] = index === activeIndex ? "true" : "false";
                attributes["class"] = "districts-item";
                buf.push("<li" + jade.attrs(jade.merge([ attributes ]), false) + ">");
                buf.push(templatizer["districts"]["button"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var item = $$obj[index];
                item = JSON.parse(JSON.stringify(item || {}));
                item.modifiers = item.modifiers || [];
                item.modifiers.push("stateful");
                item.attributes = item.attributes || {};
                item.attributes.type = "button";
                if (!item.enabled) {
                    item.attributes.disabled = "disabled";
                } else if (typeof activeIndex === "undefined") {
                    activeIndex = index;
                    item.modifiers.push("active");
                }
                var slug = uuid + "-" + index;
                var attributes = {};
                attributes["id"] = "h-" + slug;
                attributes["roles"] = "tab";
                attributes["aria-controls"] = "#" + slug;
                attributes["aria-selected"] = index === activeIndex ? "true" : "false";
                attributes["class"] = "districts-item";
                buf.push("<li" + jade.attrs(jade.merge([ attributes ]), false) + ">");
                buf.push(templatizer["districts"]["button"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var item = $$obj[index];
                if (item.enabled) {
                    var slug = uuid + "-" + index;
                    var attributes = {};
                    attributes["id"] = slug;
                    attributes["roles"] = "tabpanel";
                    attributes["aria-labelledby"] = "h-" + slug;
                    attributes["aria-hidden"] = index === activeIndex ? "false" : "true";
                    attributes["class"] = {
                        active: index === activeIndex
                    };
                    buf.push("<div" + jade.attrs(jade.merge([ {
                        "class": "districts-panel"
                    }, attributes ]), false) + '><div class="districts-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '</div><div class="districts-item-content">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div>");
                }
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var item = $$obj[index];
                if (item.enabled) {
                    var slug = uuid + "-" + index;
                    var attributes = {};
                    attributes["id"] = slug;
                    attributes["roles"] = "tabpanel";
                    attributes["aria-labelledby"] = "h-" + slug;
                    attributes["aria-hidden"] = index === activeIndex ? "false" : "true";
                    attributes["class"] = {
                        active: index === activeIndex
                    };
                    buf.push("<div" + jade.attrs(jade.merge([ {
                        "class": "districts-panel"
                    }, attributes ]), false) + '><div class="districts-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '</div><div class="districts-item-content">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div>");
                }
            }
        }
    }).call(this);
    buf.push("</div>");
    return buf.join("");
};

// events.jade compiled template
templatizer["events"] = function tmpl_events(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// events.jade:card compiled template
templatizer["events"]["card"] = function tmpl_events_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.cls([ "card", data.modifiers ], [ null, true ]) + "><div" + jade.attr("style", "background-image: url(" + data.image.src + ")", true, false) + ' class="card-image"></div><div class="card-content">');
    if (data.category) {
        buf.push('<div class="card-category">' + jade.escape(null == (jade_interp = data.category) ? "" : jade_interp) + "</div>");
    }
    buf.push('<h3 class="card-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    if (data.text) {
        buf.push('<div class="card-text">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</div>");
    }
    if (data.hours) {
        buf.push("<div" + jade.cls([ "card-hours", data.modifiers ], [ null, true ]) + ">" + jade.escape(null == (jade_interp = data.hours) ? "" : jade_interp) + "</div>");
    }
    buf.push("</div></a>");
    return buf.join("");
};


// events.jade:button compiled template
templatizer["events"]["button"] = function tmpl_events_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// events.jade:news-card compiled template
templatizer["events"]["news-card"] = function tmpl_events_news_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.attr("onclick", data.onclick, true, false) + jade.attr("target", data.target, true, false) + jade.cls([ "news-card", data.modifiers ], [ null, true ]) + '><div class="news-card-wrapper"><div' + jade.attr("style", data.image && "background-image: url(" + data.image + ");", true, false) + ' class="news-card-image"></div><div class="news-card-content"><div class="news-card-category"><span>' + jade.escape(null == (jade_interp = data.category) ? "" : jade_interp) + '</span></div><div class="news-card-title">');
    if (data.target === "_blank") {
        buf.push('<span class="icon-link-external"></span>');
    }
    buf.push(jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
    if (data.date) {
        buf.push('<div class="news-card-date"><span>' + jade.escape(null == (jade_interp = data.date) ? "" : jade_interp) + "</span></div>");
    }
    if (data.arrondissement) {
        buf.push('<div class="news-card-arrondissement"><span>' + jade.escape(null == (jade_interp = data.arrondissement) ? "" : jade_interp) + "</span></div>");
    }
    if (data.counters) {
        buf.push('<div class="news-card-counters"><div class="news-card-counter facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="news-card-counter twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
    }
    buf.push("</div></div></a>");
    return buf.join("");
};


// events.jade:news-list compiled template
templatizer["events"]["news-list"] = function tmpl_events_news_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.modifiers && data.modifiers.indexOf("news-cards") !== -1) {
        if (data.modifiers.indexOf("large-first-child") !== -1) {
            buf.push("<ul" + jade.cls([ "news-list", data.modifiers ], [ null, true ]) + ">");
            (function() {
                var $$obj = data.items.slice(0, 5);
                if ("number" == typeof $$obj.length) {
                    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                        var item = $$obj[index];
                        buf.push('<li class="news-list-card-item">');
                        if (index === 0) {
                            var item = JSON.parse(JSON.stringify(item));
                            item.modifiers = [ "large" ];
                            buf.push(templatizer["events"]["news-card"](item));
                        } else {
                            buf.push(templatizer["events"]["news-card"](item));
                        }
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var index in $$obj) {
                        $$l++;
                        var item = $$obj[index];
                        buf.push('<li class="news-list-card-item">');
                        if (index === 0) {
                            var item = JSON.parse(JSON.stringify(item));
                            item.modifiers = [ "large" ];
                            buf.push(templatizer["events"]["news-card"](item));
                        } else {
                            buf.push(templatizer["events"]["news-card"](item));
                        }
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        } else {
            buf.push("<ul" + jade.cls([ "news-list", "gallery", data.modifiers ], [ null, null, true ]) + ">");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="news-list-card-item">');
                        buf.push(templatizer["events"]["news-card"](item));
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="news-list-card-item">');
                        buf.push(templatizer["events"]["news-card"](item));
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
    } else {
        buf.push("<ul" + jade.cls([ "news-list", "gallery", data.modifiers ], [ null, null, true ]) + ">");
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="news-list-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' class="news-item"><div class="news-item-meta"><div class="news-item-date">' + jade.escape(null == (jade_interp = item.date) ? "" : jade_interp) + '</div><div class="news-item-category">' + jade.escape(null == (jade_interp = item.category) ? "" : jade_interp) + '</div></div><div class="news-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    if (item.counters) {
                        buf.push('<div class="social-counters"><div class="facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
                    }
                    buf.push("</a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="news-list-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' class="news-item"><div class="news-item-meta"><div class="news-item-date">' + jade.escape(null == (jade_interp = item.date) ? "" : jade_interp) + '</div><div class="news-item-category">' + jade.escape(null == (jade_interp = item.category) ? "" : jade_interp) + '</div></div><div class="news-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    if (item.counters) {
                        buf.push('<div class="social-counters"><div class="facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
                    }
                    buf.push("</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    return buf.join("");
};


// events.jade:events compiled template
templatizer["events"]["events"] = function tmpl_events_events(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-events", data.modifiers ], [ null, null, true ]) + '><div class="events-heading"><h2' + jade.attr("id", data.title.id, true, false) + ' class="anchor">' + jade.escape(null == (jade_interp = data.title.text) ? "" : jade_interp));
    if (data.title.logo) {
        buf.push("<a" + jade.attr("href", data.title.logo.href, true, false) + jade.attr("target", data.title.logo.target, true, false) + "><img" + jade.attr("src", data.title.logo.src, true, false) + jade.attr("alt", data.title.logo.alt, true, false) + "/></a>");
    }
    buf.push("</h2>");
    if (data.title.link) {
        buf.push('<div class="events-title-links"><a' + jade.attr("href", data.title.link.href, true, false) + ">" + jade.escape(null == (jade_interp = data.title.link.text) ? "" : jade_interp) + "</a></div>");
    }
    buf.push("</div>");
    if (data.items) {
        if (data.items.length >= 3) {
            var news_list_data = {
                modifiers: [ "news-cards", "gallery" ],
                items: data.items
            };
            buf.push(templatizer["events"]["news-list"](news_list_data));
        } else {
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        item.modifiers = [ "large" ];
                        buf.push(templatizer["events"]["card"](item));
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        item.modifiers = [ "large" ];
                        buf.push(templatizer["events"]["card"](item));
                    }
                }
            }).call(this);
        }
    }
    buf.push("</div>");
    return buf.join("");
};

// expandable.jade compiled template
templatizer["expandable"] = function tmpl_expandable(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// expandable.jade:expandable compiled template
templatizer["expandable"]["expandable"] = function tmpl_expandable_expandable(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-expandable", data.modifiers ], [ null, null, true ]) + '><div class="expandable-button js-expandmore">' + jade.escape(null == (jade_interp = data.button.text) ? "" : jade_interp) + '</div><div class="expandable-content js-to_expand">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};

// faq.jade compiled template
templatizer["faq"] = function tmpl_faq(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(Math) {}).call(this, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined);
    return buf.join("");
};

// faq.jade:accordion compiled template
templatizer["faq"]["accordion"] = function tmpl_faq_accordion(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var uuid = Math.random().toString(36).substr(2, 5);
    buf.push('<div role="tablist" aria-multiselectable="true"' + jade.cls([ "component", "component-accordion", data.modifiers ], [ null, null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var item = $$obj[index];
                var slug = item.slug || uuid + "-" + index;
                buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var item = $$obj[index];
                var slug = item.slug || uuid + "-" + index;
                buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
            }
        }
    }).call(this);
    buf.push("</div>");
    return buf.join("");
};


// faq.jade:faq compiled template
templatizer["faq"]["faq"] = function tmpl_faq_faq(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push(templatizer["faq"]["accordion"](data));
    return buf.join("");
};

// form.jade compiled template
templatizer["form"] = function tmpl_form(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined);
    return buf.join("");
};

// form.jade:button compiled template
templatizer["form"]["button"] = function tmpl_form_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// form.jade:form-title compiled template
templatizer["form"]["form-title"] = function tmpl_form_form_title(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<h2>" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</h2>");
    return buf.join("");
};


// form.jade:form-text compiled template
templatizer["form"]["form-text"] = function tmpl_form_form_text(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("title", data.label, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("value", data.value, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field"/>');
    return buf.join("");
};


// form.jade:form-email compiled template
templatizer["form"]["form-email"] = function tmpl_form_form_email(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push(templatizer["form"]["form-text"](data));
    return buf.join("");
};


// form.jade:form-tel compiled template
templatizer["form"]["form-tel"] = function tmpl_form_form_tel(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push(templatizer["form"]["form-text"](data));
    return buf.join("");
};


// form.jade:form-url compiled template
templatizer["form"]["form-url"] = function tmpl_form_form_url(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push(templatizer["form"]["form-text"](data));
    return buf.join("");
};


// form.jade:form-citizen compiled template
templatizer["form"]["form-citizen"] = function tmpl_form_form_citizen(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data.type = "text";
    buf.push(templatizer["form"]["form-text"](data));
    return buf.join("");
};


// form.jade:form-hidden compiled template
templatizer["form"]["form-hidden"] = function tmpl_form_form_hidden(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("value", data.value, true, false) + ' class="form-field"/>');
    return buf.join("");
};


// form.jade:form-select compiled template
templatizer["form"]["form-select"] = function tmpl_form_form_select(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><select" + jade.attr("name", data.name, true, false) + jade.attr("title", data.label, true, false) + jade.attr("id", data.id, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<option" + jade.attr("value", item.value, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</option>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<option" + jade.attr("value", item.value, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</option>");
            }
        }
    }).call(this);
    buf.push("</select>");
    return buf.join("");
};


// form.jade:form-textarea compiled template
templatizer["form"]["form-textarea"] = function tmpl_form_form_textarea(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><textarea" + jade.attr("name", data.name, true, false) + jade.attr("title", data.label, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("maxlength", data.maxlength, true, false) + jade.attr("rows", data.rows, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">' + jade.escape(null == (jade_interp = data.value) ? "" : jade_interp) + "</textarea>");
    return buf.join("");
};


// form.jade:form-checkbox compiled template
templatizer["form"]["form-checkbox"] = function tmpl_form_form_checkbox(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div>");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<div><label><input" + jade.attr("type", data.type, true, false) + jade.attr("title", data.label, true, false) + jade.attr("name", data.name + (data.type === "checkbox" ? "[]" : ""), true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<div><label><input" + jade.attr("type", data.type, true, false) + jade.attr("title", data.label, true, false) + jade.attr("name", data.name + (data.type === "checkbox" ? "[]" : ""), true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
            }
        }
    }).call(this);
    return buf.join("");
};


// form.jade:form-radio compiled template
templatizer["form"]["form-radio"] = function tmpl_form_form_radio(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push(templatizer["form"]["form-checkbox"](data));
    return buf.join("");
};


// form.jade:form-cgu compiled template
templatizer["form"]["form-cgu"] = function tmpl_form_form_cgu(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data.label += " *";
    buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + '</div><div><label><input type="checkbox"' + jade.attr("name", data.name, true, false) + ' value="true" required="required" class="form-field"/>' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "&nbsp;");
    if (data.link) {
        buf.push("<a" + jade.attr("href", data.link.href, true, false) + ' target="_blank">' + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a>");
    }
    buf.push("</label></div>");
    return buf.join("");
};


// form.jade:form-matrix compiled template
templatizer["form"]["form-matrix"] = function tmpl_form_form_matrix(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var type = data.multiple ? "checkbox" : "radio";
    buf.push('<table><tr><th><div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div></th>");
    (function() {
        var $$obj = data.options;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var option = $$obj[$index];
                var width = Math.round(70 / data.options.length);
                buf.push("<th" + jade.attr("style", "width: " + width + "%", true, false) + ' class="matrix-option">' + jade.escape(null == (jade_interp = option.text) ? "" : jade_interp) + "</th>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var option = $$obj[$index];
                var width = Math.round(70 / data.options.length);
                buf.push("<th" + jade.attr("style", "width: " + width + "%", true, false) + ' class="matrix-option">' + jade.escape(null == (jade_interp = option.text) ? "" : jade_interp) + "</th>");
            }
        }
    }).call(this);
    buf.push("</tr>");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<tr" + jade.cls([ "matrix-item", item.error ? "error" : null ], [ null, true ]) + '><th class="matrix-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '<input type="hidden"' + jade.attr("name", data.name + "[" + item.name + "]", true, false) + ' value="" class="form-field"/></th>');
                var i = 0;
                while (i < data.options.length) {
                    if (data.multiple) {
                        var checked = (item.checked || []).indexOf(data.options[i].value) !== -1;
                        var requiredAttribute = {
                            "data-grouprequired": data.required
                        };
                    } else {
                        var checked = item.checked === data.options[i].value;
                        var requiredAttribute = {
                            required: data.required
                        };
                    }
                    buf.push('<td class="matrix-item-option"><input' + jade.attrs(jade.merge([ {
                        type: jade.escape(type),
                        name: jade.escape(data.name + "[" + item.name + "]" + (data.multiple ? "[]" : "")),
                        value: jade.escape(data.options[i].value),
                        checked: jade.escape(checked),
                        "class": "form-field"
                    }, requiredAttribute ]), false) + "/></td>");
                    i++;
                }
                buf.push("</tr>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<tr" + jade.cls([ "matrix-item", item.error ? "error" : null ], [ null, true ]) + '><th class="matrix-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '<input type="hidden"' + jade.attr("name", data.name + "[" + item.name + "]", true, false) + ' value="" class="form-field"/></th>');
                var i = 0;
                while (i < data.options.length) {
                    if (data.multiple) {
                        var checked = (item.checked || []).indexOf(data.options[i].value) !== -1;
                        var requiredAttribute = {
                            "data-grouprequired": data.required
                        };
                    } else {
                        var checked = item.checked === data.options[i].value;
                        var requiredAttribute = {
                            required: data.required
                        };
                    }
                    buf.push('<td class="matrix-item-option"><input' + jade.attrs(jade.merge([ {
                        type: jade.escape(type),
                        name: jade.escape(data.name + "[" + item.name + "]" + (data.multiple ? "[]" : "")),
                        value: jade.escape(data.options[i].value),
                        checked: jade.escape(checked),
                        "class": "form-field"
                    }, requiredAttribute ]), false) + "/></td>");
                    i++;
                }
                buf.push("</tr>");
            }
        }
    }).call(this);
    buf.push("</table>");
    return buf.join("");
};


// form.jade:form-captcha compiled template
templatizer["form"]["form-captcha"] = function tmpl_form_form_captcha(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="g-recaptcha"></div><noscript><div style="width: 302px; height: 482px;"><div style="width: 302px; height: 422px;"><div style="width: 302px; height: 422px; position: relative;"><iframe src="https://www.google.com/recaptcha/api/fallback?k=6LdKnQ8TAAAAAFEvA3kXmpPPp_xPHx6pKJoTc2HT" frameborder="0" scrolling="no" style="width: 302px; height:422px; border-style: none;"></iframe></div><div style="width: 300px; height: 60px; border-style: none; bottom: 12px; left: 25px; margin: 0px; padding: 0px; right: 25px; background: #f9f9f9; border: 1px solid #c1c1c1; border-radius: 3px;"><textarea id="g-recaptcha-response" name="g-recaptcha-response" style="width: 250px; height: 40px; border: 1px solid #c1c1c1; margin: 10px 25px; padding: 0px; resize: none;" class="g-recaptcha-response"></textarea></div></div></div></noscript>');
    return buf.join("");
};


// form.jade:form-buttons compiled template
templatizer["form"]["form-buttons"] = function tmpl_form_form_buttons(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                var button = JSON.parse(JSON.stringify(item || []));
                button.modifiers = button.modifiers || [];
                if (item.attributes && item.attributes.type === "submit") {
                    button.modifiers.push("action");
                }
                buf.push(templatizer["form"]["button"](button));
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                var button = JSON.parse(JSON.stringify(item || []));
                button.modifiers = button.modifiers || [];
                if (item.attributes && item.attributes.type === "submit") {
                    button.modifiers.push("action");
                }
                buf.push(templatizer["form"]["button"](button));
            }
        }
    }).call(this);
    return buf.join("");
};


// form.jade:form compiled template
templatizer["form"]["form"] = function tmpl_form_form(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("data-thanks", data.thanks, true, false) + jade.attr("data-error", data.error, true, false) + jade.cls([ "component", "component-form", data.modifiers ], [ null, null, true ]) + "><form" + jade.attr("action", data.action, true, false) + jade.attr("method", data.method || "POST", true, false) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                item = JSON.parse(JSON.stringify(item || []));
                item.modifiers = item.modifiers || [];
                item.modifiers.push("form-item-" + item.type);
                if ([ "email", "tel", "citizen", "url" ].indexOf(item.type) !== -1) {
                    item.modifiers.push("form-item-text");
                }
                if (item.required === true) {
                    item.modifiers.push("required");
                    item.label += " *";
                }
                if (item.error === true) {
                    item.modifiers.push("error");
                }
                buf.push("<div" + jade.cls([ "form-item", item.modifiers ], [ null, true ]) + ">");
                buf.push(templatizer["form"]["form-" + item.type](item));
                if (item.help) {
                    buf.push('<p class="form-item-help">' + jade.escape(null == (jade_interp = item.help) ? "" : jade_interp) + "</p>");
                }
                buf.push("</div>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                item = JSON.parse(JSON.stringify(item || []));
                item.modifiers = item.modifiers || [];
                item.modifiers.push("form-item-" + item.type);
                if ([ "email", "tel", "citizen", "url" ].indexOf(item.type) !== -1) {
                    item.modifiers.push("form-item-text");
                }
                if (item.required === true) {
                    item.modifiers.push("required");
                    item.label += " *";
                }
                if (item.error === true) {
                    item.modifiers.push("error");
                }
                buf.push("<div" + jade.cls([ "form-item", item.modifiers ], [ null, true ]) + ">");
                buf.push(templatizer["form"]["form-" + item.type](item));
                if (item.help) {
                    buf.push('<p class="form-item-help">' + jade.escape(null == (jade_interp = item.help) ? "" : jade_interp) + "</p>");
                }
                buf.push("</div>");
            }
        }
    }).call(this);
    buf.push("</form></div>");
    return buf.join("");
};

// frame.jade compiled template
templatizer["frame"] = function tmpl_frame(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// frame.jade:frame compiled template
templatizer["frame"]["frame"] = function tmpl_frame_frame(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-frame", data ? data.modifiers : [] ], [ null, null, true ]) + "><fieldset>");
    if (data.title) {
        buf.push("<legend>" + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</legend>");
    }
    buf.push("<div>");
    if (block) {
        block && block(buf);
    } else if (data.content) {
        buf.push(null == (jade_interp = data.content) ? "" : jade_interp);
    }
    buf.push("</div></fieldset></div>");
    return buf.join("");
};

// gallery.jade compiled template
templatizer["gallery"] = function tmpl_gallery(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// gallery.jade:gallery compiled template
templatizer["gallery"]["gallery"] = function tmpl_gallery_gallery(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-gallery", data.modifiers ], [ null, null, true ]) + '><div class="gallery-wrapper">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<div class="gallery-cell"><img' + jade.attr("data-flickity-lazyload", item.src, true, false) + jade.attr("alt", item.alt, true, false) + jade.attr("title", item.title, true, false) + ' class="gallery-cell-image"/>');
                if (item.title || item.credit) {
                    buf.push('<div class="gallery-caption">');
                    if (item.title) {
                        buf.push('<div class="gallery-title">' + (null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    }
                    if (item.credit) {
                        buf.push('<div class="gallery-credit">' + (null == (jade_interp = item.credit) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</div>");
                }
                buf.push("</div>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<div class="gallery-cell"><img' + jade.attr("data-flickity-lazyload", item.src, true, false) + jade.attr("alt", item.alt, true, false) + jade.attr("title", item.title, true, false) + ' class="gallery-cell-image"/>');
                if (item.title || item.credit) {
                    buf.push('<div class="gallery-caption">');
                    if (item.title) {
                        buf.push('<div class="gallery-title">' + (null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    }
                    if (item.credit) {
                        buf.push('<div class="gallery-credit">' + (null == (jade_interp = item.credit) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</div>");
                }
                buf.push("</div>");
            }
        }
    }).call(this);
    buf.push("</div></div>");
    return buf.join("");
};

// html.jade compiled template
templatizer["html"] = function tmpl_html(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// html.jade:html compiled template
templatizer["html"]["html"] = function tmpl_html_html(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-html", data ? data.modifiers : [] ], [ null, null, true ]) + '><div class="html-wrapper">');
    if (data.cookie === false) {
        if (block) {
            block && block(buf);
        } else if (data.block) {
            buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
        }
    } else {
        if (data.placeholder) {
            buf.push('<div class="html-placeholder">' + (null == (jade_interp = data.placeholder) ? "" : jade_interp) + "</div>");
        }
        buf.push('<script type="text/html" class="html-embed">');
        if (block) {
            buf.push(null == (jade_interp = block) ? "" : jade_interp);
        } else if (data.block) {
            buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
        }
        buf.push("</script>");
    }
    buf.push("</div></div>");
    return buf.join("");
};

// image.jade compiled template
templatizer["image"] = function tmpl_image(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// image.jade:image compiled template
templatizer["image"]["image"] = function tmpl_image_image(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-image", data.modifiers ], [ null, null, true ]) + ">");
    var title = [ data.title ];
    if (data.credit) {
        title.push("(" + data.credit + ")");
    }
    title = title.join(" ");
    if (data.srcset) {
        buf.push("<img" + jade.attr("src", data.src, true, false) + jade.attr("srcset", data.srcset.join(", "), true, false) + ' sizes="(min-width: 1160px) 770px, 100vw"' + jade.attr("alt", data.alt, true, false) + jade.attr("title", title, true, false) + "/>");
    } else {
        if (data.href) {
            buf.push("<a" + jade.attr("href", data.href, true, false) + "><img" + jade.attr("src", data.src, true, false) + jade.attr("alt", data.alt, true, false) + jade.attr("title", title, true, false) + "/></a>");
        } else {
            buf.push("<img" + jade.attr("src", data.src, true, false) + jade.attr("alt", data.alt, true, false) + jade.attr("title", title, true, false) + "/>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};

// jecoute.jade compiled template
templatizer["jecoute"] = function tmpl_jecoute(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// jecoute.jade:button compiled template
templatizer["jecoute"]["button"] = function tmpl_jecoute_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// jecoute.jade:jecoute compiled template
templatizer["jecoute"]["jecoute"] = function tmpl_jecoute_jecoute(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("data-thanks", data.thanks, true, false) + jade.attr("data-error", data.error, true, false) + jade.attr("data-desc", data.desc, true, false) + jade.cls([ "component", "component-jecoute", data.modifiers ], [ null, null, true ]) + '><div class="jecoute-title"><h2>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h2></div><div class="jecoute-content"><p class="jecoute-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p><form" + jade.attrs(jade.merge([ {
        method: "post",
        "class": "jecoute-form"
    }, data.form ]), false) + ">");
    var textarea = JSON.parse(JSON.stringify(data.textarea));
    delete textarea.value;
    buf.push("<textarea" + jade.attrs(jade.merge([ {
        name: "message",
        required: true,
        "aria-required": "true"
    }, textarea ]), false) + ">" + jade.escape(null == (jade_interp = data.textarea.value) ? "" : jade_interp) + "</textarea>");
    if (data.email) {
        buf.push("<input" + jade.attrs(jade.merge([ {
            type: "email",
            name: "email",
            required: true,
            "aria-required": "true"
        }, data.email ]), false) + "/>");
    }
    if (data.upload) {
        var upload = JSON.parse(JSON.stringify(data.upload));
        buf.push('<div class="jecoute-upload"><label type="button" class="button secondary icon"><i' + jade.cls([ "icon", "icon-" + upload.button.icon + "" ], [ null, true ]) + '></i><span class="button-text">' + jade.escape(null == (jade_interp = upload.button.text) ? "" : jade_interp) + '</span><input type="file" name="files" formenctype="multipart/form-data" multiple="multiple"/></label><p><em>' + jade.escape((jade_interp = upload.title) == null ? "" : jade_interp) + ' :&nbsp;</em><span class="upload-size">' + jade.escape((jade_interp = upload.size) == null ? "" : jade_interp) + ",&nbsp;</span><a" + jade.attr("href", upload.link.href, true, false) + jade.attr("target", upload.link.target, true, false) + ">" + jade.escape(null == (jade_interp = upload.link.text) ? "" : jade_interp) + '</a></p><output><ul class="output-items"></ul></output></div>');
    }
    if (data.policy) {
        var policy = JSON.parse(JSON.stringify(data.policy));
        buf.push('<p class="jecoute-policy"><label><input type="checkbox" name="policy" required="required"/><span><em>' + jade.escape(null == (jade_interp = policy.text) ? "" : jade_interp) + "</em><a" + jade.attr("href", policy.link.href, true, false) + jade.attr("target", policy.link.target, true, false) + ">" + jade.escape(null == (jade_interp = policy.link.text) ? "" : jade_interp) + "</a></span></label></p>");
    }
    var button = JSON.parse(JSON.stringify(data.button));
    button.modifiers = [ "secondary", "action" ];
    button.attributes = {
        type: "submit"
    };
    buf.push(templatizer["jecoute"]["button"](button));
    buf.push('</form><p class="jecoute-message">');
    if (data.desc) {
        buf.push("<em>" + jade.escape(null == (jade_interp = data.desc) ? "" : jade_interp) + "</em>");
    }
    buf.push("</p></div></div>");
    return buf.join("");
};

// links.jade compiled template
templatizer["links"] = function tmpl_links(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// links.jade:links compiled template
templatizer["links"]["links"] = function tmpl_links_links(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-links", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        var title_tag = data.title_tag || "h2";
        buf.push("<" + title_tag + ' class="links-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + title_tag + ">");
    }
    buf.push('<ul class="links-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                if (item.target && item.target === "_blank" || item.filetype || item.filesize) {
                    buf.push('<span class="links-item-attributes">');
                    if (item.target && item.target === "_blank") {
                        buf.push('<span class="links-item-target">' + jade.escape(null == (jade_interp = item.target_text || "nouvelle fenêtre") ? "" : jade_interp) + "</span>");
                    }
                    if (item.filetype) {
                        buf.push('<span class="links-item-filetype">' + jade.escape(null == (jade_interp = item.filetype) ? "" : jade_interp) + "</span>");
                    }
                    if (item.filesize) {
                        buf.push('<span class="links-item-filesize">' + jade.escape(null == (jade_interp = item.filesize) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</span>");
                }
                buf.push("</a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                if (item.target && item.target === "_blank" || item.filetype || item.filesize) {
                    buf.push('<span class="links-item-attributes">');
                    if (item.target && item.target === "_blank") {
                        buf.push('<span class="links-item-target">' + jade.escape(null == (jade_interp = item.target_text || "nouvelle fenêtre") ? "" : jade_interp) + "</span>");
                    }
                    if (item.filetype) {
                        buf.push('<span class="links-item-filetype">' + jade.escape(null == (jade_interp = item.filetype) ? "" : jade_interp) + "</span>");
                    }
                    if (item.filesize) {
                        buf.push('<span class="links-item-filesize">' + jade.escape(null == (jade_interp = item.filesize) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</span>");
                }
                buf.push("</a></li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};

// map.jade compiled template
templatizer["map"] = function tmpl_map(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// map.jade:map compiled template
templatizer["map"]["map"] = function tmpl_map_map(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attrs(jade.merge([ {
        "class": (jade_interp = [ null, null, true ], jade.joinClasses([ "component", "component-map", data.modifiers ].map(jade.joinClasses).map(function(cls, i) {
            return jade_interp[i] ? jade.escape(cls) : cls;
        })))
    }, data.attributes ]), false) + '><div class="component-map-map"></div></div>');
    return buf.join("");
};

// news-push.jade compiled template
templatizer["news-push"] = function tmpl_news_push(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// news-push.jade:news-push compiled template
templatizer["news-push"]["news-push"] = function tmpl_news_push_news_push(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-news-push", data.modifiers ], [ null, null, true ]) + '><div class="news-push-wrapper"><div class="news-push-after"></div>');
    var title = [ data.title ];
    if (data.image.credit) {
        title.push("(" + data.image.credit + ")");
    }
    buf.push("<a" + jade.attr("href", data.href, true, false) + ' class="news-push-image"><img' + jade.attr("src", data.image.src, true, false) + ' alt=""' + jade.attr("title", title.join(" "), true, false) + '/></a><div class="news-push-content"><h2 class="news-push-title"><span>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</span></h2><p class="news-push-content-text"><a' + jade.attr("href", data.href, true, false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</a>" + jade.escape(null == (jade_interp = " ") ? "" : jade_interp) + "<a" + jade.attr("href", data.href, true, false) + ' class="next">' + jade.escape(null == (jade_interp = data.follow) ? "" : jade_interp) + "</a></p></div></div>");
    if (data.link && data.link.href && data.link.text) {
        buf.push("<a" + jade.attr("href", data.link.href, true, false) + ' class="news-push-link"><span>' + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</span></a>");
    }
    buf.push("</div>");
    return buf.join("");
};

// opening-hours.jade compiled template
templatizer["opening-hours"] = function tmpl_opening_hours(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, data_expandable) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "data_expandable" in locals_for_with ? locals_for_with.data_expandable : typeof data_expandable !== "undefined" ? data_expandable : undefined);
    return buf.join("");
};

// opening-hours.jade:button compiled template
templatizer["opening-hours"]["button"] = function tmpl_opening_hours_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// opening-hours.jade:other-hours compiled template
templatizer["opening-hours"]["other-hours"] = function tmpl_opening_hours_other_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="component component-opening-hours-other"><div class="opening-hours-other"><h3 class="opening-hours-other-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        }
    }).call(this);
    buf.push("</div></div>");
    return buf.join("");
};


// opening-hours.jade:expandable compiled template
templatizer["opening-hours"]["expandable"] = function tmpl_opening_hours_expandable(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-expandable", data.modifiers ], [ null, null, true ]) + '><div class="expandable-button js-expandmore">' + jade.escape(null == (jade_interp = data.button.text) ? "" : jade_interp) + '</div><div class="expandable-content js-to_expand">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// opening-hours.jade:opening-hours compiled template
templatizer["opening-hours"]["opening-hours"] = function tmpl_opening_hours_opening_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-opening-hours", data.modifiers ], [ null, null, true ]) + '><div class="opening-hours-heading"><h2' + jade.attr("id", data.title.id, true, false) + ' class="anchor">' + jade.escape(null == (jade_interp = data.title.text) ? "" : jade_interp) + "</h2>");
    if (data.title.link) {
        buf.push('<div class="opening-hours-title-links"><a' + jade.attr("href", data.title.link.href, true, false) + ">" + jade.escape(null == (jade_interp = data.title.link.text) ? "" : jade_interp) + "</a></div>");
    }
    buf.push("</div>");
    if (data.status) {
        buf.push("<p" + jade.cls([ "opening-hours-status", data.status.open ? "is-open" : "is-closed" ], [ null, true ]) + '><i class="icon icon-clock"></i>' + jade.escape(null == (jade_interp = data.status.text) ? "" : jade_interp) + "</p>");
    }
    if (data.current_hours) {
        buf.push("<table" + jade.attr("summary", data.current_hours.summary, true, false) + ">");
        if (data.current_hours.caption) {
            buf.push("<caption>" + jade.escape(null == (jade_interp = data.current_hours.caption) ? "" : jade_interp) + "</caption>");
        }
        if (data.current_hours.items) {
            (function() {
                var $$obj = data.current_hours.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<tr><th>" + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</td></tr>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<tr><th>" + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</td></tr>");
                    }
                }
            }).call(this);
        }
        buf.push("</table>");
    }
    if (data.planned_closures) {
        buf.push('<div class="opening-hours-planned-closures"><i class="icon icon-alert"></i>' + jade.escape(null == (jade_interp = data.planned_closures.text) ? "" : jade_interp));
        if (data.planned_closures.items) {
            buf.push("<ul>");
            (function() {
                var $$obj = data.planned_closures.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li>" + jade.escape(null == (jade_interp = item) ? "" : jade_interp) + "</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li>" + jade.escape(null == (jade_interp = item) ? "" : jade_interp) + "</li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
        buf.push("</div>");
    }
    if (data.text_piscine) {
        buf.push('<div class="opening-hours-text-piscine">' + jade.escape(null == (jade_interp = data.text_piscine.text) ? "" : jade_interp) + "</div>");
    }
    if (data.pills) {
        buf.push(templatizer["opening-hours"]["pills"](data.pills.data));
    }
    if (data.button && data.other_hours) {
        data_expandable = {
            button: data.button
        };
        buf.push(templatizer["opening-hours"]["expandable"].call({
            block: function(buf) {
                buf.push(templatizer["opening-hours"]["other-hours"](data.other_hours));
            }
        }, data_expandable));
    }
    buf.push("</div>");
    return buf.join("");
};

// other-hours.jade compiled template
templatizer["other-hours"] = function tmpl_other_hours(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// other-hours.jade:other-hours compiled template
templatizer["other-hours"]["other-hours"] = function tmpl_other_hours_other_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="component component-opening-hours-other"><div class="opening-hours-other"><h3 class="opening-hours-other-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        }
    }).call(this);
    buf.push("</div></div>");
    return buf.join("");
};

// pills.jade compiled template
templatizer["pills"] = function tmpl_pills(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math, data_expandable) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined, "data_expandable" in locals_for_with ? locals_for_with.data_expandable : typeof data_expandable !== "undefined" ? data_expandable : undefined);
    return buf.join("");
};

// pills.jade:button compiled template
templatizer["pills"]["button"] = function tmpl_pills_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// pills.jade:other-hours compiled template
templatizer["pills"]["other-hours"] = function tmpl_pills_other_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="component component-opening-hours-other"><div class="opening-hours-other"><h3 class="opening-hours-other-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        }
    }).call(this);
    buf.push("</div></div>");
    return buf.join("");
};


// pills.jade:expandable compiled template
templatizer["pills"]["expandable"] = function tmpl_pills_expandable(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-expandable", data.modifiers ], [ null, null, true ]) + '><div class="expandable-button js-expandmore">' + jade.escape(null == (jade_interp = data.button.text) ? "" : jade_interp) + '</div><div class="expandable-content js-to_expand">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// pills.jade:opening-hours compiled template
templatizer["pills"]["opening-hours"] = function tmpl_pills_opening_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-opening-hours", data.modifiers ], [ null, null, true ]) + '><div class="opening-hours-heading"><h2' + jade.attr("id", data.title.id, true, false) + ' class="anchor">' + jade.escape(null == (jade_interp = data.title.text) ? "" : jade_interp) + "</h2>");
    if (data.title.link) {
        buf.push('<div class="opening-hours-title-links"><a' + jade.attr("href", data.title.link.href, true, false) + ">" + jade.escape(null == (jade_interp = data.title.link.text) ? "" : jade_interp) + "</a></div>");
    }
    buf.push("</div>");
    if (data.status) {
        buf.push("<p" + jade.cls([ "opening-hours-status", data.status.open ? "is-open" : "is-closed" ], [ null, true ]) + '><i class="icon icon-clock"></i>' + jade.escape(null == (jade_interp = data.status.text) ? "" : jade_interp) + "</p>");
    }
    if (data.current_hours) {
        buf.push("<table" + jade.attr("summary", data.current_hours.summary, true, false) + ">");
        if (data.current_hours.caption) {
            buf.push("<caption>" + jade.escape(null == (jade_interp = data.current_hours.caption) ? "" : jade_interp) + "</caption>");
        }
        if (data.current_hours.items) {
            (function() {
                var $$obj = data.current_hours.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<tr><th>" + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</td></tr>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<tr><th>" + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</td></tr>");
                    }
                }
            }).call(this);
        }
        buf.push("</table>");
    }
    if (data.planned_closures) {
        buf.push('<div class="opening-hours-planned-closures"><i class="icon icon-alert"></i>' + jade.escape(null == (jade_interp = data.planned_closures.text) ? "" : jade_interp));
        if (data.planned_closures.items) {
            buf.push("<ul>");
            (function() {
                var $$obj = data.planned_closures.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li>" + jade.escape(null == (jade_interp = item) ? "" : jade_interp) + "</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li>" + jade.escape(null == (jade_interp = item) ? "" : jade_interp) + "</li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
        buf.push("</div>");
    }
    if (data.text_piscine) {
        buf.push('<div class="opening-hours-text-piscine">' + jade.escape(null == (jade_interp = data.text_piscine.text) ? "" : jade_interp) + "</div>");
    }
    if (data.pills) {
        buf.push(templatizer["pills"]["pills"](data.pills.data));
    }
    if (data.button && data.other_hours) {
        data_expandable = {
            button: data.button
        };
        buf.push(templatizer["pills"]["expandable"].call({
            block: function(buf) {
                buf.push(templatizer["pills"]["other-hours"](data.other_hours));
            }
        }, data_expandable));
    }
    buf.push("</div>");
    return buf.join("");
};


// pills.jade:other-hours compiled template
templatizer["pills"]["other-hours"] = function tmpl_pills_other_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="component component-opening-hours-other"><div class="opening-hours-other"><h3 class="opening-hours-other-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<table" + jade.attr("summary", item.summary, true, false) + ">");
                if (item.caption) {
                    buf.push("<caption>" + jade.escape(null == (jade_interp = item.caption) ? "" : jade_interp));
                    if (item.comment) {
                        buf.push('<div class="other-hours-comment">' + jade.escape(null == (jade_interp = item.comment) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</caption>");
                }
                if (item.items) {
                    (function() {
                        var $$obj = item.items;
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var i = $$obj[$index];
                                buf.push("<tr><th>" + jade.escape(null == (jade_interp = i.title) ? "" : jade_interp) + "</th><td>" + jade.escape(null == (jade_interp = i.text) ? "" : jade_interp) + "</td></tr>");
                            }
                        }
                    }).call(this);
                }
                buf.push("</table>");
            }
        }
    }).call(this);
    buf.push("</div></div>");
    return buf.join("");
};


// pills.jade:button compiled template
templatizer["pills"]["button"] = function tmpl_pills_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// pills.jade:expandable compiled template
templatizer["pills"]["expandable"] = function tmpl_pills_expandable(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-expandable", data.modifiers ], [ null, null, true ]) + '><div class="expandable-button js-expandmore">' + jade.escape(null == (jade_interp = data.button.text) ? "" : jade_interp) + '</div><div class="expandable-content js-to_expand">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// pills.jade:rush-half-hours compiled template
templatizer["pills"]["rush-half-hours"] = function tmpl_pills_rush_half_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.button) {
        data_expandable = {
            button: data.button
        };
        buf.push(templatizer["pills"]["expandable"].call({
            block: function(buf) {
                buf.push(templatizer["pills"]["rush-half-hours-block"](data));
            }
        }, data_expandable));
    } else {
        buf.push(templatizer["pills"]["rush-half-hours-block"](data));
    }
    return buf.join("");
};


// pills.jade:rush-half-hours-block compiled template
templatizer["pills"]["rush-half-hours-block"] = function tmpl_pills_rush_half_hours_block(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-rush-half-hours", data.modifiers ], [ null, null, true ]) + "><h2" + jade.attr("id", data.title.id, true, false) + ' class="anchor">' + jade.escape(null == (jade_interp = data.title.text) ? "" : jade_interp) + '</h2><div class="hidden-on-small">');
    buf.push(templatizer["pills"]["rush-half-hours-table"](data));
    buf.push('</div><div class="only-on-small">');
    buf.push(templatizer["pills"]["rush-half-hours-table"](data, 0, 4));
    buf.push(templatizer["pills"]["rush-half-hours-table"](data, 4, 8));
    buf.push("</div>");
    if (data.text) {
        buf.push('<p class="rush-half-hours-text">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    }
    buf.push("</div>");
    return buf.join("");
};


// pills.jade:rush-half-hours-table compiled template
templatizer["pills"]["rush-half-hours-table"] = function tmpl_pills_rush_half_hours_table(data, beginning, end) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data = JSON.parse(JSON.stringify(data || {}));
    beginning = beginning || 0;
    end = end || 500;
    (function() {
        var $$obj = data.days.slice(beginning, end);
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var day = $$obj[index];
                buf.push("<h4>" + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + "</h4><table" + jade.attr("summary", data.summary, true, false) + "><tr>");
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    } else {
                        var $$l = 0;
                        for (var i in $$obj) {
                            $$l++;
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    }
                }).call(this);
                buf.push("</tr></table>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var day = $$obj[index];
                buf.push("<h4>" + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + "</h4><table" + jade.attr("summary", data.summary, true, false) + "><tr>");
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    } else {
                        var $$l = 0;
                        for (var i in $$obj) {
                            $$l++;
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    }
                }).call(this);
                buf.push("</tr></table>");
            }
        }
    }).call(this);
    return buf.join("");
};


// pills.jade:rush-half-hours-td compiled template
templatizer["pills"]["rush-half-hours-td"] = function tmpl_pills_rush_half_hours_td(traffic) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<td" + jade.cls([ "traffic-" + traffic + "" ], [ true ]) + ">");
    var icon = 0;
    {
        while (icon < traffic) {
            buf.push('<i aria-hidden="true" class="rush-hours-traffic-icon"></i>');
            icon++;
        }
    }
    buf.push("</td>");
    return buf.join("");
};


// pills.jade:button compiled template
templatizer["pills"]["button"] = function tmpl_pills_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// pills.jade:expandable compiled template
templatizer["pills"]["expandable"] = function tmpl_pills_expandable(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-expandable", data.modifiers ], [ null, null, true ]) + '><div class="expandable-button js-expandmore">' + jade.escape(null == (jade_interp = data.button.text) ? "" : jade_interp) + '</div><div class="expandable-content js-to_expand">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// pills.jade:rush-hours compiled template
templatizer["pills"]["rush-hours"] = function tmpl_pills_rush_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.button) {
        data_expandable = {
            button: data.button
        };
        buf.push(templatizer["pills"]["expandable"].call({
            block: function(buf) {
                buf.push(templatizer["pills"]["rush-hours-block"](data));
            }
        }, data_expandable));
    } else {
        buf.push(templatizer["pills"]["rush-hours-block"](data));
    }
    return buf.join("");
};


// pills.jade:rush-hours-block compiled template
templatizer["pills"]["rush-hours-block"] = function tmpl_pills_rush_hours_block(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-rush-hours", data.modifiers ], [ null, null, true ]) + "><h2" + jade.attr("id", data.title.id, true, false) + ' class="anchor">' + jade.escape(null == (jade_interp = data.title.text) ? "" : jade_interp) + '</h2><div class="hidden-on-small">');
    buf.push(templatizer["pills"]["rush-hours-table"](data));
    buf.push('</div><div class="only-on-small">');
    buf.push(templatizer["pills"]["rush-hours-table"](data, 0, 4));
    buf.push(templatizer["pills"]["rush-hours-table"](data, 4, 8));
    buf.push("</div>");
    if (data.text) {
        buf.push('<p class="rush-hours-text">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    }
    buf.push("</div>");
    return buf.join("");
};


// pills.jade:rush-hours-table compiled template
templatizer["pills"]["rush-hours-table"] = function tmpl_pills_rush_hours_table(data, beginning, end) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data = JSON.parse(JSON.stringify(data || {}));
    beginning = beginning || 0;
    end = end || 100;
    buf.push("<table" + jade.attr("summary", data.summary, true, false) + ">");
    if (data.caption) {
        buf.push("<caption>" + jade.escape(null == (jade_interp = data.caption) ? "" : jade_interp) + "</caption>");
    }
    buf.push("<tr><th></th>");
    (function() {
        var $$obj = data.days.slice(beginning, end);
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var day = $$obj[$index];
                buf.push('<th scope="col"><div class="hidden-on-small">' + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + '</div><div aria-hidden="true" class="only-on-small">' + jade.escape(null == (jade_interp = day.slice(0, 3)) ? "" : jade_interp) + "</div></th>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var day = $$obj[$index];
                buf.push('<th scope="col"><div class="hidden-on-small">' + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + '</div><div aria-hidden="true" class="only-on-small">' + jade.escape(null == (jade_interp = day.slice(0, 3)) ? "" : jade_interp) + "</div></th>");
            }
        }
    }).call(this);
    buf.push("</tr>");
    if (data.items) {
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<tr><th><div class="rush-hours-interval">' + jade.escape(null == (jade_interp = item.from) ? "" : jade_interp) + '<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = " - " + item.to) ? "" : jade_interp) + "</div></div></th>");
                    (function() {
                        var $$obj = item.traffic.slice(beginning, end);
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var t = $$obj[$index];
                                buf.push(templatizer["pills"]["rush-hours-td"](t));
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var t = $$obj[$index];
                                buf.push(templatizer["pills"]["rush-hours-td"](t));
                            }
                        }
                    }).call(this);
                    buf.push("</tr>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<tr><th><div class="rush-hours-interval">' + jade.escape(null == (jade_interp = item.from) ? "" : jade_interp) + '<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = " - " + item.to) ? "" : jade_interp) + "</div></div></th>");
                    (function() {
                        var $$obj = item.traffic.slice(beginning, end);
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var t = $$obj[$index];
                                buf.push(templatizer["pills"]["rush-hours-td"](t));
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var t = $$obj[$index];
                                buf.push(templatizer["pills"]["rush-hours-td"](t));
                            }
                        }
                    }).call(this);
                    buf.push("</tr>");
                }
            }
        }).call(this);
    }
    buf.push("</table>");
    return buf.join("");
};


// pills.jade:rush-hours-td compiled template
templatizer["pills"]["rush-hours-td"] = function tmpl_pills_rush_hours_td(traffic) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<td" + jade.cls([ "traffic-" + traffic + "" ], [ true ]) + ">");
    var icon = 0;
    {
        while (icon < traffic) {
            buf.push('<i aria-hidden="true" class="rush-hours-traffic-icon"></i>');
            icon++;
        }
    }
    buf.push("</td>");
    return buf.join("");
};


// pills.jade:pills compiled template
templatizer["pills"]["pills"] = function tmpl_pills_pills(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var activeIndex;
    var uuid = Math.random().toString(36).substr(2, 5);
    buf.push('<div class="component component-pills"><h4 class="pills-heading">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h4><ul role="tablist" class="pills-items-wrapper">');
    (function() {
        var $$obj = data.components;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var item = $$obj[index];
                item = JSON.parse(JSON.stringify(item || {}));
                item.modifiers = item.modifiers || [];
                item.modifiers.push("secondary");
                item.attributes = item.attributes || {};
                item.attributes.type = "button";
                buf.push("<!-- - if (typeof activeIndex === 'undefined') { activeIndex = index; item.modifiers.push(\"active\"); }-->");
                var slug = uuid + "-" + index;
                var attributes = {};
                attributes["id"] = "h-" + slug;
                attributes["roles"] = "tab";
                attributes["aria-controls"] = "#" + slug;
                attributes["aria-selected"] = index === activeIndex ? "true" : "false";
                attributes["class"] = "pills-item";
                buf.push("<li" + jade.attrs(jade.merge([ attributes ]), false) + ">");
                buf.push(templatizer["pills"]["button"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var item = $$obj[index];
                item = JSON.parse(JSON.stringify(item || {}));
                item.modifiers = item.modifiers || [];
                item.modifiers.push("secondary");
                item.attributes = item.attributes || {};
                item.attributes.type = "button";
                buf.push("<!-- - if (typeof activeIndex === 'undefined') { activeIndex = index; item.modifiers.push(\"active\"); }-->");
                var slug = uuid + "-" + index;
                var attributes = {};
                attributes["id"] = "h-" + slug;
                attributes["roles"] = "tab";
                attributes["aria-controls"] = "#" + slug;
                attributes["aria-selected"] = index === activeIndex ? "true" : "false";
                attributes["class"] = "pills-item";
                buf.push("<li" + jade.attrs(jade.merge([ attributes ]), false) + ">");
                buf.push(templatizer["pills"]["button"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    (function() {
        var $$obj = data.components;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var item = $$obj[index];
                item = JSON.parse(JSON.stringify(item || {}));
                var slug = uuid + "-" + index;
                {
                    var attributes = {};
                    attributes["id"] = slug;
                    attributes["roles"] = "tabpanel";
                    attributes["aria-labelledby"] = "h-" + slug;
                    attributes["aria-hidden"] = index === activeIndex ? "false" : "true";
                    attributes["class"] = {
                        active: index === activeIndex
                    };
                    buf.push("<div" + jade.attrs(jade.merge([ {
                        "class": "pills-panel"
                    }, attributes ]), false) + ">");
                    buf.push(templatizer["pills"][item.type](item.data));
                    buf.push("</div>");
                }
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var item = $$obj[index];
                item = JSON.parse(JSON.stringify(item || {}));
                var slug = uuid + "-" + index;
                {
                    var attributes = {};
                    attributes["id"] = slug;
                    attributes["roles"] = "tabpanel";
                    attributes["aria-labelledby"] = "h-" + slug;
                    attributes["aria-hidden"] = index === activeIndex ? "false" : "true";
                    attributes["class"] = {
                        active: index === activeIndex
                    };
                    buf.push("<div" + jade.attrs(jade.merge([ {
                        "class": "pills-panel"
                    }, attributes ]), false) + ">");
                    buf.push(templatizer["pills"][item.type](item.data));
                    buf.push("</div>");
                }
            }
        }
    }).call(this);
    buf.push("</div>");
    return buf.join("");
};

// place.jade compiled template
templatizer["place"] = function tmpl_place(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// place.jade:button compiled template
templatizer["place"]["button"] = function tmpl_place_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// place.jade:place compiled template
templatizer["place"]["place"] = function tmpl_place_place(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-place", data.modifiers ], [ null, null, true ]) + '><div class="place-content">');
    if (data.title) {
        buf.push('<div class="place-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
    }
    if (data.address) {
        buf.push('<div class="place-address">' + (null == (jade_interp = data.address) ? "" : jade_interp) + "</div>");
    }
    if (data.items && data.items.length) {
        buf.push('<ul class="place-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="place-item"><i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="place-item"><i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push("</div>");
    if (data.button) {
        var button = JSON.parse(JSON.stringify(data.button));
        button.modifiers = [ "marker" ];
        buf.push(templatizer["place"]["button"](button));
    }
    buf.push("</div>");
    return buf.join("");
};

// postit.jade compiled template
templatizer["postit"] = function tmpl_postit(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// postit.jade:postit compiled template
templatizer["postit"]["postit"] = function tmpl_postit_postit(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-postit", data ? data.modifiers : [] ], [ null, null, true ]) + ">");
    if (data.title) {
        buf.push('<h2 id="postit" class="anchor">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    }
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    } else {
        buf.push("<p>postit</p>");
    }
    buf.push("</div>");
    return buf.join("");
};

// rush-half-hours.jade compiled template
templatizer["rush-half-hours"] = function tmpl_rush_half_hours(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, data_expandable) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "data_expandable" in locals_for_with ? locals_for_with.data_expandable : typeof data_expandable !== "undefined" ? data_expandable : undefined);
    return buf.join("");
};

// rush-half-hours.jade:button compiled template
templatizer["rush-half-hours"]["button"] = function tmpl_rush_half_hours_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// rush-half-hours.jade:expandable compiled template
templatizer["rush-half-hours"]["expandable"] = function tmpl_rush_half_hours_expandable(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-expandable", data.modifiers ], [ null, null, true ]) + '><div class="expandable-button js-expandmore">' + jade.escape(null == (jade_interp = data.button.text) ? "" : jade_interp) + '</div><div class="expandable-content js-to_expand">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// rush-half-hours.jade:rush-half-hours compiled template
templatizer["rush-half-hours"]["rush-half-hours"] = function tmpl_rush_half_hours_rush_half_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.button) {
        data_expandable = {
            button: data.button
        };
        buf.push(templatizer["rush-half-hours"]["expandable"].call({
            block: function(buf) {
                buf.push(templatizer["rush-half-hours"]["rush-half-hours-block"](data));
            }
        }, data_expandable));
    } else {
        buf.push(templatizer["rush-half-hours"]["rush-half-hours-block"](data));
    }
    return buf.join("");
};


// rush-half-hours.jade:rush-half-hours-block compiled template
templatizer["rush-half-hours"]["rush-half-hours-block"] = function tmpl_rush_half_hours_rush_half_hours_block(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-rush-half-hours", data.modifiers ], [ null, null, true ]) + "><h2" + jade.attr("id", data.title.id, true, false) + ' class="anchor">' + jade.escape(null == (jade_interp = data.title.text) ? "" : jade_interp) + '</h2><div class="hidden-on-small">');
    buf.push(templatizer["rush-half-hours"]["rush-half-hours-table"](data));
    buf.push('</div><div class="only-on-small">');
    buf.push(templatizer["rush-half-hours"]["rush-half-hours-table"](data, 0, 4));
    buf.push(templatizer["rush-half-hours"]["rush-half-hours-table"](data, 4, 8));
    buf.push("</div>");
    if (data.text) {
        buf.push('<p class="rush-half-hours-text">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    }
    buf.push("</div>");
    return buf.join("");
};


// rush-half-hours.jade:rush-half-hours-table compiled template
templatizer["rush-half-hours"]["rush-half-hours-table"] = function tmpl_rush_half_hours_rush_half_hours_table(data, beginning, end) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data = JSON.parse(JSON.stringify(data || {}));
    beginning = beginning || 0;
    end = end || 500;
    (function() {
        var $$obj = data.days.slice(beginning, end);
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var day = $$obj[index];
                buf.push("<h4>" + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + "</h4><table" + jade.attr("summary", data.summary, true, false) + "><tr>");
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    } else {
                        var $$l = 0;
                        for (var i in $$obj) {
                            $$l++;
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    }
                }).call(this);
                buf.push("</tr></table>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var day = $$obj[index];
                buf.push("<h4>" + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + "</h4><table" + jade.attr("summary", data.summary, true, false) + "><tr>");
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    } else {
                        var $$l = 0;
                        for (var i in $$obj) {
                            $$l++;
                            var item = $$obj[i];
                            buf.push("<td" + jade.cls([ "traffic-" + item.traffic[index] + "" ], [ true ]) + '><div class="rush-hour-bar"></div><div class="rush-hour-label">');
                            if (item.from.slice(item.from.indexOf("h") + 1) != 30) {
                                if (item.from.slice(0, 1) != 1 && item.from.slice(0, 1) != 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 2)) ? "" : jade_interp));
                                }
                                if (item.from.slice(0, 1) == 1 || item.from.slice(0, 1) == 2) {
                                    buf.push(jade.escape(null == (jade_interp = item.from.slice(0, 3)) ? "" : jade_interp));
                                }
                            }
                            buf.push("</div></td>");
                        }
                    }
                }).call(this);
                buf.push("</tr></table>");
            }
        }
    }).call(this);
    return buf.join("");
};


// rush-half-hours.jade:rush-half-hours-td compiled template
templatizer["rush-half-hours"]["rush-half-hours-td"] = function tmpl_rush_half_hours_rush_half_hours_td(traffic) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<td" + jade.cls([ "traffic-" + traffic + "" ], [ true ]) + ">");
    var icon = 0;
    {
        while (icon < traffic) {
            buf.push('<i aria-hidden="true" class="rush-hours-traffic-icon"></i>');
            icon++;
        }
    }
    buf.push("</td>");
    return buf.join("");
};

// rush-hours.jade compiled template
templatizer["rush-hours"] = function tmpl_rush_hours(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, data_expandable) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "data_expandable" in locals_for_with ? locals_for_with.data_expandable : typeof data_expandable !== "undefined" ? data_expandable : undefined);
    return buf.join("");
};

// rush-hours.jade:button compiled template
templatizer["rush-hours"]["button"] = function tmpl_rush_hours_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// rush-hours.jade:expandable compiled template
templatizer["rush-hours"]["expandable"] = function tmpl_rush_hours_expandable(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-expandable", data.modifiers ], [ null, null, true ]) + '><div class="expandable-button js-expandmore">' + jade.escape(null == (jade_interp = data.button.text) ? "" : jade_interp) + '</div><div class="expandable-content js-to_expand">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// rush-hours.jade:rush-hours compiled template
templatizer["rush-hours"]["rush-hours"] = function tmpl_rush_hours_rush_hours(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.button) {
        data_expandable = {
            button: data.button
        };
        buf.push(templatizer["rush-hours"]["expandable"].call({
            block: function(buf) {
                buf.push(templatizer["rush-hours"]["rush-hours-block"](data));
            }
        }, data_expandable));
    } else {
        buf.push(templatizer["rush-hours"]["rush-hours-block"](data));
    }
    return buf.join("");
};


// rush-hours.jade:rush-hours-block compiled template
templatizer["rush-hours"]["rush-hours-block"] = function tmpl_rush_hours_rush_hours_block(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-rush-hours", data.modifiers ], [ null, null, true ]) + "><h2" + jade.attr("id", data.title.id, true, false) + ' class="anchor">' + jade.escape(null == (jade_interp = data.title.text) ? "" : jade_interp) + '</h2><div class="hidden-on-small">');
    buf.push(templatizer["rush-hours"]["rush-hours-table"](data));
    buf.push('</div><div class="only-on-small">');
    buf.push(templatizer["rush-hours"]["rush-hours-table"](data, 0, 4));
    buf.push(templatizer["rush-hours"]["rush-hours-table"](data, 4, 8));
    buf.push("</div>");
    if (data.text) {
        buf.push('<p class="rush-hours-text">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    }
    buf.push("</div>");
    return buf.join("");
};


// rush-hours.jade:rush-hours-table compiled template
templatizer["rush-hours"]["rush-hours-table"] = function tmpl_rush_hours_rush_hours_table(data, beginning, end) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data = JSON.parse(JSON.stringify(data || {}));
    beginning = beginning || 0;
    end = end || 100;
    buf.push("<table" + jade.attr("summary", data.summary, true, false) + ">");
    if (data.caption) {
        buf.push("<caption>" + jade.escape(null == (jade_interp = data.caption) ? "" : jade_interp) + "</caption>");
    }
    buf.push("<tr><th></th>");
    (function() {
        var $$obj = data.days.slice(beginning, end);
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var day = $$obj[$index];
                buf.push('<th scope="col"><div class="hidden-on-small">' + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + '</div><div aria-hidden="true" class="only-on-small">' + jade.escape(null == (jade_interp = day.slice(0, 3)) ? "" : jade_interp) + "</div></th>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var day = $$obj[$index];
                buf.push('<th scope="col"><div class="hidden-on-small">' + jade.escape(null == (jade_interp = day) ? "" : jade_interp) + '</div><div aria-hidden="true" class="only-on-small">' + jade.escape(null == (jade_interp = day.slice(0, 3)) ? "" : jade_interp) + "</div></th>");
            }
        }
    }).call(this);
    buf.push("</tr>");
    if (data.items) {
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<tr><th><div class="rush-hours-interval">' + jade.escape(null == (jade_interp = item.from) ? "" : jade_interp) + '<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = " - " + item.to) ? "" : jade_interp) + "</div></div></th>");
                    (function() {
                        var $$obj = item.traffic.slice(beginning, end);
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var t = $$obj[$index];
                                buf.push(templatizer["rush-hours"]["rush-hours-td"](t));
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var t = $$obj[$index];
                                buf.push(templatizer["rush-hours"]["rush-hours-td"](t));
                            }
                        }
                    }).call(this);
                    buf.push("</tr>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<tr><th><div class="rush-hours-interval">' + jade.escape(null == (jade_interp = item.from) ? "" : jade_interp) + '<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = " - " + item.to) ? "" : jade_interp) + "</div></div></th>");
                    (function() {
                        var $$obj = item.traffic.slice(beginning, end);
                        if ("number" == typeof $$obj.length) {
                            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                var t = $$obj[$index];
                                buf.push(templatizer["rush-hours"]["rush-hours-td"](t));
                            }
                        } else {
                            var $$l = 0;
                            for (var $index in $$obj) {
                                $$l++;
                                var t = $$obj[$index];
                                buf.push(templatizer["rush-hours"]["rush-hours-td"](t));
                            }
                        }
                    }).call(this);
                    buf.push("</tr>");
                }
            }
        }).call(this);
    }
    buf.push("</table>");
    return buf.join("");
};


// rush-hours.jade:rush-hours-td compiled template
templatizer["rush-hours"]["rush-hours-td"] = function tmpl_rush_hours_rush_hours_td(traffic) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<td" + jade.cls([ "traffic-" + traffic + "" ], [ true ]) + ">");
    var icon = 0;
    {
        while (icon < traffic) {
            buf.push('<i aria-hidden="true" class="rush-hours-traffic-icon"></i>');
            icon++;
        }
    }
    buf.push("</td>");
    return buf.join("");
};

// sharelines.jade compiled template
templatizer["sharelines"] = function tmpl_sharelines(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// sharelines.jade:share compiled template
templatizer["sharelines"]["share"] = function tmpl_sharelines_share(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
    if (data.items && data.items.length) {
        buf.push('<ul class="share-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push("</div>");
    return buf.join("");
};


// sharelines.jade:sharelines compiled template
templatizer["sharelines"]["sharelines"] = function tmpl_sharelines_sharelines(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-sharelines", data.modifiers ], [ null, null, true ]) + '><h2 class="sharelines-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h2><ul class="sharelines-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<li class="sharelines-item">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                var share = JSON.parse(JSON.stringify(item.share));
                share.modifiers = [ "circles" ];
                buf.push(templatizer["sharelines"]["share"](share));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<li class="sharelines-item">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                var share = JSON.parse(JSON.stringify(item.share));
                share.modifiers = [ "circles" ];
                buf.push(templatizer["sharelines"]["share"](share));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};

// table.jade compiled template
templatizer["table"] = function tmpl_table(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// table.jade:table compiled template
templatizer["table"]["table"] = function tmpl_table_table(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-table", data.modifiers ], [ null, null, true ]) + "><table" + jade.attr("summary", data.summary, true, false) + ">");
    if (data.caption) {
        buf.push("<caption>" + jade.escape(null == (jade_interp = data.caption) ? "" : jade_interp) + "</caption>");
    }
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</table></div>");
    return buf.join("");
};

// text.jade compiled template
templatizer["text"] = function tmpl_text(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// text.jade:text compiled template
templatizer["text"]["text"] = function tmpl_text_text(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-text", data ? data.modifiers : [] ], [ null, null, true ]) + ">");
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div>");
    return buf.join("");
};

// verbatim.jade compiled template
templatizer["verbatim"] = function tmpl_verbatim(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// verbatim.jade:share compiled template
templatizer["verbatim"]["share"] = function tmpl_verbatim_share(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
    if (data.items && data.items.length) {
        buf.push('<ul class="share-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push("</div>");
    return buf.join("");
};


// verbatim.jade:verbatim compiled template
templatizer["verbatim"]["verbatim"] = function tmpl_verbatim_verbatim(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<blockquote" + jade.cls([ "component", "component-verbatim", data.modifiers ], [ null, null, true ]) + '><p class="verbatim-text">' + jade.escape(null == (jade_interp = data.quote) ? "" : jade_interp) + '</p><footer><div class="verbatim-separate"></div><cite><div class="verbatim-author">' + jade.escape(null == (jade_interp = data.author) ? "" : jade_interp) + ',</div><div class="verbatim-function">' + jade.escape(null == (jade_interp = data.function) ? "" : jade_interp) + "</div></cite>");
    var share = JSON.parse(JSON.stringify(data.share));
    share.modifiers = [ "circles" ];
    buf.push(templatizer["verbatim"]["share"](share));
    buf.push("</footer></blockquote>");
    return buf.join("");
};

// video.jade compiled template
templatizer["video"] = function tmpl_video(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// video.jade:video compiled template
templatizer["video"]["video"] = function tmpl_video_video(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-video", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        buf.push('<h3 class="video-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<div class="video-wrapper">');
    if (data.cookie === false) {
        if (block) {
            buf.push(null == (jade_interp = block) ? "" : jade_interp);
        } else if (data.block) {
            buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
        }
    } else {
        if (data.placeholder) {
            buf.push('<div class="video-placeholder">' + (null == (jade_interp = data.placeholder) ? "" : jade_interp) + "</div>");
        }
        buf.push('<script type="text/html" class="video-embed">');
        if (block) {
            buf.push(null == (jade_interp = block) ? "" : jade_interp);
        } else if (data.block) {
            buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
        }
        buf.push("</script>");
    }
    buf.push("</div></div>");
    return buf.join("");
};

// agenda.jade compiled template
templatizer["agenda"] = function tmpl_agenda(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// agenda.jade:news-card compiled template
templatizer["agenda"]["news-card"] = function tmpl_agenda_news_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.attr("onclick", data.onclick, true, false) + jade.attr("target", data.target, true, false) + jade.cls([ "news-card", data.modifiers ], [ null, true ]) + '><div class="news-card-wrapper"><div' + jade.attr("style", data.image && "background-image: url(" + data.image + ");", true, false) + ' class="news-card-image"></div><div class="news-card-content"><div class="news-card-category"><span>' + jade.escape(null == (jade_interp = data.category) ? "" : jade_interp) + '</span></div><div class="news-card-title">');
    if (data.target === "_blank") {
        buf.push('<span class="icon-link-external"></span>');
    }
    buf.push(jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
    if (data.date) {
        buf.push('<div class="news-card-date"><span>' + jade.escape(null == (jade_interp = data.date) ? "" : jade_interp) + "</span></div>");
    }
    if (data.arrondissement) {
        buf.push('<div class="news-card-arrondissement"><span>' + jade.escape(null == (jade_interp = data.arrondissement) ? "" : jade_interp) + "</span></div>");
    }
    if (data.counters) {
        buf.push('<div class="news-card-counters"><div class="news-card-counter facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="news-card-counter twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
    }
    buf.push("</div></div></a>");
    return buf.join("");
};


// agenda.jade:agenda compiled template
templatizer["agenda"]["agenda"] = function tmpl_agenda_agenda(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="agenda-agenda"><div class="agenda-agenda-filters component-form"><label>' + jade.escape(null == (jade_interp = "Filtrer par") ? "" : jade_interp) + '</label><div class="form-item form-item-select"><select><option value="month">Mois </option><option value="arr">Arrondissement </option></select></div></div><div class="agenda-agenda-nav-month"></div><div class="agenda-agenda-arrondissement"><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "1er") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "2e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "3e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "4e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "5e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "6e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "7e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "8e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "9e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "10e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "11e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "12e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "13e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "14e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "15e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "16e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "17e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "18e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "19e") ? "" : jade_interp) + '</span><span class="agenda-agenda-arrondissement-change">' + jade.escape(null == (jade_interp = "20e") ? "" : jade_interp) + "</span></div></div><ul" + jade.cls([ "agenda-block", "gallery", data.modifiers ], [ null, null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<li class="agenda-card-item">');
                buf.push(templatizer["agenda"]["news-card"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<li class="agenda-card-item">');
                buf.push(templatizer["agenda"]["news-card"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul><ul" + jade.cls([ "agenda-block", "gallery", data.modifiers + " agenda-clone" ], [ null, null, true ]) + '></ul><div class="agenda-clear"></div>');
    return buf.join("");
};

// anchors-list.jade compiled template
templatizer["anchors-list"] = function tmpl_anchors_list(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// anchors-list.jade:anchors-list compiled template
templatizer["anchors-list"]["anchors-list"] = function tmpl_anchors_list_anchors_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = data || {};
    buf.push("<nav" + jade.attrs(jade.merge([ {
        "aria-label": jade.escape(data.title),
        "class": "anchors-list"
    }, data.attributes || {} ]), false) + ">");
    if (data.title) {
        buf.push('<div aria-hidden="true" class="anchors-list-title"><span>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span></div>");
    }
    if (data.items && data.items.length) {
        buf.push('<ul class="anchors-list-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push("<li" + jade.cls([ "anchors-list-item", item.modifiers ], [ null, true ]) + "><a" + jade.attrs(jade.merge([ {
                        href: jade.escape(item.href),
                        "class": "anchors-list-link"
                    }, item.attributes || {} ]), false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</a><span class="anchors-list-progress"></span></li>');
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push("<li" + jade.cls([ "anchors-list-item", item.modifiers ], [ null, true ]) + "><a" + jade.attrs(jade.merge([ {
                        href: jade.escape(item.href),
                        "class": "anchors-list-link"
                    }, item.attributes || {} ]), false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</a><span class="anchors-list-progress"></span></li>');
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push("</nav>");
    return buf.join("");
};

// block-aside-checkboxes.jade compiled template
templatizer["block-aside-checkboxes"] = function tmpl_block_aside_checkboxes(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// block-aside-checkboxes.jade:block-aside compiled template
templatizer["block-aside-checkboxes"]["block-aside"] = function tmpl_block_aside_checkboxes_block_aside(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-aside", data.modifiers ], [ null, true ]) + ">");
    if (data.title) {
        buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-aside-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<div class="block-aside-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-aside-checkboxes.jade:block-aside-checkboxes compiled template
templatizer["block-aside-checkboxes"]["block-aside-checkboxes"] = function tmpl_block_aside_checkboxes_block_aside_checkboxes(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    modifiers.push("block-aside-checkboxes");
    buf.push(templatizer["block-aside-checkboxes"]["block-aside"].call({
        block: function(buf) {
            buf.push('<ul class="block-aside-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", "?" + data.name + "[]=" + item.value + "", true, false) + jade.attr("data-name", "" + data.name + "", true, false) + jade.attr("data-value", "" + item.value + "", true, false) + jade.cls([ {
                            checked: item.checked
                        } ], [ true ]) + '><div class="block-aside-item-checkbox"></div><div class="block-aside-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        if (item.number) {
                            buf.push(" (" + jade.escape((jade_interp = item.number) == null ? "" : jade_interp) + ")");
                        }
                        buf.push("</div></a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", "?" + data.name + "[]=" + item.value + "", true, false) + jade.attr("data-name", "" + data.name + "", true, false) + jade.attr("data-value", "" + item.value + "", true, false) + jade.cls([ {
                            checked: item.checked
                        } ], [ true ]) + '><div class="block-aside-item-checkbox"></div><div class="block-aside-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        if (item.number) {
                            buf.push(" (" + jade.escape((jade_interp = item.number) == null ? "" : jade_interp) + ")");
                        }
                        buf.push("</div></a></li>");
                    }
                }
            }).call(this);
            buf.push('</ul><select multiple="multiple"' + jade.attr("name", "" + data.name + "[]", true, false) + ' class="block-aside-select">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<option" + jade.attr("value", item.value, true, false) + jade.attr("selected", item.checked, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        if (item.number) {
                            buf.push(" (" + jade.escape((jade_interp = item.number) == null ? "" : jade_interp) + ")");
                        }
                        buf.push("</option>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<option" + jade.attr("value", item.value, true, false) + jade.attr("selected", item.checked, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        if (item.number) {
                            buf.push(" (" + jade.escape((jade_interp = item.number) == null ? "" : jade_interp) + ")");
                        }
                        buf.push("</option>");
                    }
                }
            }).call(this);
            buf.push("</select>");
        }
    }, {
        title: data.title,
        title_id: "filter-#{data.name}",
        modifiers: modifiers
    }));
    return buf.join("");
};

// block-aside-contact.jade compiled template
templatizer["block-aside-contact"] = function tmpl_block_aside_contact(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// block-aside-contact.jade:block-aside compiled template
templatizer["block-aside-contact"]["block-aside"] = function tmpl_block_aside_contact_block_aside(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-aside", data.modifiers ], [ null, true ]) + ">");
    if (data.title) {
        buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-aside-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<div class="block-aside-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-aside-contact.jade:block-aside-contact compiled template
templatizer["block-aside-contact"]["block-aside-contact"] = function tmpl_block_aside_contact_block_aside_contact(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var block_modifiers = data.modifiers || [];
    block_modifiers.push("block-aside-contact");
    buf.push(templatizer["block-aside-contact"]["block-aside"].call({
        block: function(buf) {
            if (data.map) {
                buf.push('<div class="block-aside-minimap">');
                if (data.map.href) {
                    buf.push("<a" + jade.attr("href", data.map.href, true, false) + jade.attr("onclick", data.map.onclick, true, false) + jade.attr("target", data.map.target, true, false) + jade.attr("title", data.map.title, true, false) + "><img" + jade.attr("src", data.map.src, true, false) + jade.attr("alt", data.map.alt, true, false) + "/></a>");
                } else {
                    buf.push("<img" + jade.attr("src", data.map.src, true, false) + "/>");
                }
                buf.push("</div>");
            }
            buf.push('<ul class="block-aside-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        var modifiers = item.modifiers || [];
                        if (item.icon) {
                            modifiers.push("has-icon");
                        }
                        if (item.title) {
                            buf.push("<li" + jade.cls([ "block-aside-item", modifiers ], [ null, true ]) + ">");
                            if (!item.icon) {
                                buf.push(jade.escape(null == (jade_interp = item.title + " ") ? "" : jade_interp));
                            }
                            if (item.href) {
                                buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.cls([ item.hcard_properties ], [ true ]) + ">");
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.title + " :") ? "" : jade_interp) + "</span>");
                                }
                                buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a>");
                            } else {
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.title + " :") ? "" : jade_interp) + "</span>");
                                }
                                buf.push("<span" + jade.cls([ item.hcard_properties ], [ true ]) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span>");
                            }
                            buf.push("</li>");
                        } else {
                            buf.push("<li" + jade.cls([ "block-aside-item", modifiers, item.hcard_properties ], [ null, true, true ]) + ">");
                            if (item.href) {
                                buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">");
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                                }
                                buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a>");
                            } else {
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                                }
                                buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                            }
                            buf.push("</li>");
                        }
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        var modifiers = item.modifiers || [];
                        if (item.icon) {
                            modifiers.push("has-icon");
                        }
                        if (item.title) {
                            buf.push("<li" + jade.cls([ "block-aside-item", modifiers ], [ null, true ]) + ">");
                            if (!item.icon) {
                                buf.push(jade.escape(null == (jade_interp = item.title + " ") ? "" : jade_interp));
                            }
                            if (item.href) {
                                buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.cls([ item.hcard_properties ], [ true ]) + ">");
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.title + " :") ? "" : jade_interp) + "</span>");
                                }
                                buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a>");
                            } else {
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.title + " :") ? "" : jade_interp) + "</span>");
                                }
                                buf.push("<span" + jade.cls([ item.hcard_properties ], [ true ]) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span>");
                            }
                            buf.push("</li>");
                        } else {
                            buf.push("<li" + jade.cls([ "block-aside-item", modifiers, item.hcard_properties ], [ null, true, true ]) + ">");
                            if (item.href) {
                                buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">");
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                                }
                                buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a>");
                            } else {
                                if (item.icon) {
                                    buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                                }
                                buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                            }
                            buf.push("</li>");
                        }
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
    }, {
        title: data.title,
        modifiers: block_modifiers
    }));
    return buf.join("");
};

// block-aside-links.jade compiled template
templatizer["block-aside-links"] = function tmpl_block_aside_links(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// block-aside-links.jade:block-aside compiled template
templatizer["block-aside-links"]["block-aside"] = function tmpl_block_aside_links_block_aside(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-aside", data.modifiers ], [ null, true ]) + ">");
    if (data.title) {
        buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-aside-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<div class="block-aside-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-aside-links.jade:block-aside-links compiled template
templatizer["block-aside-links"]["block-aside-links"] = function tmpl_block_aside_links_block_aside_links(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    modifiers.push("block-aside-links");
    buf.push(templatizer["block-aside-links"]["block-aside"].call({
        block: function(buf) {
            buf.push('<ul class="block-aside-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
    }, {
        title: data.title,
        modifiers: modifiers
    }));
    return buf.join("");
};

// block-aside.jade compiled template
templatizer["block-aside"] = function tmpl_block_aside(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// block-aside.jade:block-aside compiled template
templatizer["block-aside"]["block-aside"] = function tmpl_block_aside_block_aside(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-aside", data.modifiers ], [ null, true ]) + ">");
    if (data.title) {
        buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-aside-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<div class="block-aside-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};

// block-content-jecoute.jade compiled template
templatizer["block-content-jecoute"] = function tmpl_block_content_jecoute(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// block-content-jecoute.jade:block-content compiled template
templatizer["block-content-jecoute"]["block-content"] = function tmpl_block_content_jecoute_block_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var attributes = data.attributes || {};
    buf.push("<div" + jade.attrs(jade.merge([ {
        "class": (jade_interp = [ null, true ], jade.joinClasses([ "block-content", data.modifiers ].map(jade.joinClasses).map(function(cls, i) {
            return jade_interp[i] ? jade.escape(cls) : cls;
        })))
    }, attributes ]), false) + '><h3 class="block-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h3><div class="block-content-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-content-jecoute.jade:button compiled template
templatizer["block-content-jecoute"]["button"] = function tmpl_block_content_jecoute_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// block-content-jecoute.jade:icon-switch compiled template
templatizer["block-content-jecoute"]["icon-switch"] = function tmpl_block_content_jecoute_icon_switch(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    if (data.action.type) {
        modifiers.push("icon-switch-" + data.action.type);
    }
    if (data.active === true) {
        modifiers.push("active");
    }
    buf.push("<div" + jade.attr("data-action", data.action.type, true, false) + jade.attr("data-action-id", data.action.id, true, false) + jade.attr("data-action-fallback-link", data.action.fallback_link, true, false) + jade.cls([ "icon-switch", modifiers ], [ null, true ]) + "><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[0], true, false) + ' type="button" class="icon-switch-on"><span' + jade.cls([ "icon", "icon-" + data.icon[0] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[0]) ? "" : jade_interp) + "</span></button><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[1], true, false) + ' type="button" class="icon-switch-off"><span' + jade.cls([ "icon", "icon-" + data.icon[1] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[1]) ? "" : jade_interp) + "</span></button></div>");
    return buf.join("");
};


// block-content-jecoute.jade:block-content-jecoute compiled template
templatizer["block-content-jecoute"]["block-content-jecoute"] = function tmpl_block_content_jecoute_block_content_jecoute(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    modifiers.push("block-content-jecoute");
    buf.push(templatizer["block-content-jecoute"]["block-content"].call({
        block: function(buf) {
            if (data.items && data.items.length) {
                var pause = JSON.parse(JSON.stringify(data.pause || []));
                pause.action = {
                    type: "pause"
                };
                pause.icon = [ "pause", "play" ];
                buf.push(templatizer["block-content-jecoute"]["icon-switch"](pause));
                buf.push('<div class="block-content-items">');
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<div class="block-content-item"><div class="block-content-timer"><span class="start">' + jade.escape(null == (jade_interp = item.question.time) ? "" : jade_interp) + '</span><span class="end">' + jade.escape(null == (jade_interp = item.answer.time) ? "" : jade_interp) + '</span><div class="block-content-bar"><div class="progress"></div></div></div><div class="block-content-question-answer"><div class="block-content-question"><div class="user">' + jade.escape(null == (jade_interp = item.question.user) ? "" : jade_interp) + '</div><div class="text">' + jade.escape(null == (jade_interp = item.question.text) ? "" : jade_interp) + '</div></div><div class="block-content-answer"><div class="user">' + jade.escape(null == (jade_interp = item.answer.user) ? "" : jade_interp) + '</div><div class="text">' + (null == (jade_interp = item.answer.text) ? "" : jade_interp) + "</div></div></div></div>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<div class="block-content-item"><div class="block-content-timer"><span class="start">' + jade.escape(null == (jade_interp = item.question.time) ? "" : jade_interp) + '</span><span class="end">' + jade.escape(null == (jade_interp = item.answer.time) ? "" : jade_interp) + '</span><div class="block-content-bar"><div class="progress"></div></div></div><div class="block-content-question-answer"><div class="block-content-question"><div class="user">' + jade.escape(null == (jade_interp = item.question.user) ? "" : jade_interp) + '</div><div class="text">' + jade.escape(null == (jade_interp = item.question.text) ? "" : jade_interp) + '</div></div><div class="block-content-answer"><div class="user">' + jade.escape(null == (jade_interp = item.answer.user) ? "" : jade_interp) + '</div><div class="text">' + (null == (jade_interp = item.answer.text) ? "" : jade_interp) + "</div></div></div></div>");
                        }
                    }
                }).call(this);
                buf.push("</div>");
            }
            if (data.text) {
                buf.push('<p class="block-content-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
            }
            var button = JSON.parse(JSON.stringify(data.button));
            button.modifiers = [ "action" ];
            buf.push('<div class="block-content-button">');
            buf.push(templatizer["block-content-jecoute"]["button"](button));
            buf.push("</div>");
        }
    }, {
        title: data.title,
        modifiers: modifiers
    }));
    return buf.join("");
};

// block-content-newsletter.jade compiled template
templatizer["block-content-newsletter"] = function tmpl_block_content_newsletter(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// block-content-newsletter.jade:block-content compiled template
templatizer["block-content-newsletter"]["block-content"] = function tmpl_block_content_newsletter_block_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var attributes = data.attributes || {};
    buf.push("<div" + jade.attrs(jade.merge([ {
        "class": (jade_interp = [ null, true ], jade.joinClasses([ "block-content", data.modifiers ].map(jade.joinClasses).map(function(cls, i) {
            return jade_interp[i] ? jade.escape(cls) : cls;
        })))
    }, attributes ]), false) + '><h3 class="block-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h3><div class="block-content-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-content-newsletter.jade:button compiled template
templatizer["block-content-newsletter"]["button"] = function tmpl_block_content_newsletter_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// block-content-newsletter.jade:block-content-newsletter compiled template
templatizer["block-content-newsletter"]["block-content-newsletter"] = function tmpl_block_content_newsletter_block_content_newsletter(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    modifiers.push("block-content-newsletter");
    buf.push(templatizer["block-content-newsletter"]["block-content"].call({
        block: function(buf) {
            buf.push('<p class="block-content-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
            if (data.form) {
                buf.push("<form" + jade.attrs(jade.merge([ {
                    "class": "block-content-form"
                }, data.form ]), false) + '><input type="email"' + jade.attr("placeholder", data.input.placeholder, true, false) + jade.attr("title", data.input.placeholder, true, false) + jade.attr("id", data.input.id, true, false) + jade.attr("name", data.input.name, true, false) + ' required="required" aria-required="true"/><button type="submit"' + jade.attr("title", data.submit.title, true, false) + ' class="button action">' + jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp) + "</button></form>");
            } else if (data.button) {
                var button = JSON.parse(JSON.stringify(data.button || []));
                button.modifiers = button.modifiers || [];
                button.modifiers.push("action");
                buf.push(templatizer["block-content-newsletter"]["button"](button));
            }
            if (data.link) {
                buf.push('<div class="block-content-link"><a' + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + jade.attr("target", data.link.target, true, false) + ">" + (null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></div>");
            }
            if (data.engagements) {
                buf.push('<div class="block-content-link"><a' + jade.attr("href", data.engagements.href, true, false) + jade.attr("onclick", data.engagements.onclick, true, false) + jade.attr("target", data.engagements.target, true, false) + ">" + (null == (jade_interp = data.engagements.text) ? "" : jade_interp) + "</a></div>");
            }
        }
    }, {
        title: data.title,
        modifiers: modifiers,
        attributes: {
            "data-thanks": data.thanks
        }
    }));
    return buf.join("");
};

// block-content-social.jade compiled template
templatizer["block-content-social"] = function tmpl_block_content_social(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// block-content-social.jade:block-content compiled template
templatizer["block-content-social"]["block-content"] = function tmpl_block_content_social_block_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var attributes = data.attributes || {};
    buf.push("<div" + jade.attrs(jade.merge([ {
        "class": (jade_interp = [ null, true ], jade.joinClasses([ "block-content", data.modifiers ].map(jade.joinClasses).map(function(cls, i) {
            return jade_interp[i] ? jade.escape(cls) : cls;
        })))
    }, attributes ]), false) + '><h3 class="block-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h3><div class="block-content-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-content-social.jade:block-content-social compiled template
templatizer["block-content-social"]["block-content-social"] = function tmpl_block_content_social_block_content_social(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    modifiers.push("block-content-social");
    buf.push(templatizer["block-content-social"]["block-content"].call({
        block: function(buf) {
            buf.push('<ul class="block-content-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="block-content-item"><a' + jade.attr("href", item.link.href, true, false) + jade.attr("onclick", item.link.onclick, true, false) + jade.attr("target", item.link.target, true, false) + '><div class="block-content-count"><i aria-hidden="true"' + jade.cls([ "block-content-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>" + jade.escape(null == (jade_interp = item.count) ? "" : jade_interp) + '<span class="block-content-unit">' + jade.escape(null == (jade_interp = " " + item.unit) ? "" : jade_interp) + '</span></div><div class="block-content-link">' + jade.escape(null == (jade_interp = item.link.text) ? "" : jade_interp) + "</div></a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="block-content-item"><a' + jade.attr("href", item.link.href, true, false) + jade.attr("onclick", item.link.onclick, true, false) + jade.attr("target", item.link.target, true, false) + '><div class="block-content-count"><i aria-hidden="true"' + jade.cls([ "block-content-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>" + jade.escape(null == (jade_interp = item.count) ? "" : jade_interp) + '<span class="block-content-unit">' + jade.escape(null == (jade_interp = " " + item.unit) ? "" : jade_interp) + '</span></div><div class="block-content-link">' + jade.escape(null == (jade_interp = item.link.text) ? "" : jade_interp) + "</div></a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
            if (data.link) {
                buf.push("<a" + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + ' class="block-content-link">' + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a>");
            }
        }
    }, {
        title: data.title,
        modifiers: modifiers
    }));
    return buf.join("");
};

// block-content-tweet.jade compiled template
templatizer["block-content-tweet"] = function tmpl_block_content_tweet(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// block-content-tweet.jade:block-content compiled template
templatizer["block-content-tweet"]["block-content"] = function tmpl_block_content_tweet_block_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var attributes = data.attributes || {};
    buf.push("<div" + jade.attrs(jade.merge([ {
        "class": (jade_interp = [ null, true ], jade.joinClasses([ "block-content", data.modifiers ].map(jade.joinClasses).map(function(cls, i) {
            return jade_interp[i] ? jade.escape(cls) : cls;
        })))
    }, attributes ]), false) + '><h3 class="block-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h3><div class="block-content-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-content-tweet.jade:icon-switch compiled template
templatizer["block-content-tweet"]["icon-switch"] = function tmpl_block_content_tweet_icon_switch(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    if (data.action.type) {
        modifiers.push("icon-switch-" + data.action.type);
    }
    if (data.active === true) {
        modifiers.push("active");
    }
    buf.push("<div" + jade.attr("data-action", data.action.type, true, false) + jade.attr("data-action-id", data.action.id, true, false) + jade.attr("data-action-fallback-link", data.action.fallback_link, true, false) + jade.cls([ "icon-switch", modifiers ], [ null, true ]) + "><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[0], true, false) + ' type="button" class="icon-switch-on"><span' + jade.cls([ "icon", "icon-" + data.icon[0] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[0]) ? "" : jade_interp) + "</span></button><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[1], true, false) + ' type="button" class="icon-switch-off"><span' + jade.cls([ "icon", "icon-" + data.icon[1] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[1]) ? "" : jade_interp) + "</span></button></div>");
    return buf.join("");
};


// block-content-tweet.jade:block-content-tweet compiled template
templatizer["block-content-tweet"]["block-content-tweet"] = function tmpl_block_content_tweet_block_content_tweet(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    modifiers.push("block-content-tweet");
    buf.push(templatizer["block-content-tweet"]["block-content"].call({
        block: function(buf) {
            if (data.items && data.items.length) {
                var pause = JSON.parse(JSON.stringify(data.pause || []));
                pause.action = {
                    type: "pause"
                };
                pause.icon = [ "pause", "play" ];
                if (data.items.length > 1) {
                    buf.push(templatizer["block-content-tweet"]["icon-switch"](pause));
                }
                buf.push('<div class="block-content-items">');
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<div class="block-content-item"><div class="user">' + jade.escape(null == (jade_interp = item.user) ? "" : jade_interp) + '</div><div class="text">' + (null == (jade_interp = item.text) ? "" : jade_interp) + '</div><div class="block-content-links"><div class="block-content-links-time"><a' + jade.attr("href", item.links.time.href, true, false) + jade.attr("target", item.links.time.target, true, false) + ">" + jade.escape(null == (jade_interp = item.links.time.text) ? "" : jade_interp) + '</a></div><div class="block-content-links-actions"><a' + jade.attr("href", item.links.reply.href, true, false) + jade.attr("target", item.links.reply.target, true, false) + ' class="reply">' + jade.escape(null == (jade_interp = item.links.reply.text) ? "" : jade_interp) + "</a><a" + jade.attr("href", item.links.retweet.href, true, false) + jade.attr("target", item.links.retweet.target, true, false) + ' class="retweet">' + jade.escape(null == (jade_interp = item.links.retweet.text) ? "" : jade_interp) + "</a><a" + jade.attr("href", item.links.like.href, true, false) + jade.attr("target", item.links.like.target, true, false) + ' class="like">' + jade.escape(null == (jade_interp = item.links.like.text) ? "" : jade_interp) + "</a></div></div></div>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<div class="block-content-item"><div class="user">' + jade.escape(null == (jade_interp = item.user) ? "" : jade_interp) + '</div><div class="text">' + (null == (jade_interp = item.text) ? "" : jade_interp) + '</div><div class="block-content-links"><div class="block-content-links-time"><a' + jade.attr("href", item.links.time.href, true, false) + jade.attr("target", item.links.time.target, true, false) + ">" + jade.escape(null == (jade_interp = item.links.time.text) ? "" : jade_interp) + '</a></div><div class="block-content-links-actions"><a' + jade.attr("href", item.links.reply.href, true, false) + jade.attr("target", item.links.reply.target, true, false) + ' class="reply">' + jade.escape(null == (jade_interp = item.links.reply.text) ? "" : jade_interp) + "</a><a" + jade.attr("href", item.links.retweet.href, true, false) + jade.attr("target", item.links.retweet.target, true, false) + ' class="retweet">' + jade.escape(null == (jade_interp = item.links.retweet.text) ? "" : jade_interp) + "</a><a" + jade.attr("href", item.links.like.href, true, false) + jade.attr("target", item.links.like.target, true, false) + ' class="like">' + jade.escape(null == (jade_interp = item.links.like.text) ? "" : jade_interp) + "</a></div></div></div>");
                        }
                    }
                }).call(this);
                buf.push("</div>");
            }
        }
    }, {
        title: data.title,
        modifiers: modifiers
    }));
    return buf.join("");
};

// block-content.jade compiled template
templatizer["block-content"] = function tmpl_block_content(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// block-content.jade:block-content compiled template
templatizer["block-content"]["block-content"] = function tmpl_block_content_block_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var attributes = data.attributes || {};
    buf.push("<div" + jade.attrs(jade.merge([ {
        "class": (jade_interp = [ null, true ], jade.joinClasses([ "block-content", data.modifiers ].map(jade.joinClasses).map(function(cls, i) {
            return jade_interp[i] ? jade.escape(cls) : cls;
        })))
    }, attributes ]), false) + '><h3 class="block-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h3><div class="block-content-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};

// block-search-field.jade compiled template
templatizer["block-search-field"] = function tmpl_block_search_field(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// block-search-field.jade:block-search compiled template
templatizer["block-search-field"]["block-search"] = function tmpl_block_search_field_block_search(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-search", data.modifiers ], [ null, true ]) + '><div class="block-search-header">');
    if (data.name_categorie) {
        buf.push('<div class="block-search-categorie">' + jade.escape(null == (jade_interp = data.name_categorie) ? "" : jade_interp) + "</div>");
    }
    buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-search-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    var top_link = data.top_link || {};
    if (top_link.href) {
        buf.push('<span class="block-search-top-link"><a' + jade.attr("href", top_link.href, true, false) + jade.attr("title", top_link.text, true, false) + jade.attr("id", top_link.id, true, false) + ">" + jade.escape(null == (jade_interp = top_link.text) ? "" : jade_interp) + "</a></span>");
    }
    buf.push('</div><div class="block-search-content">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-search-field.jade:button compiled template
templatizer["block-search-field"]["button"] = function tmpl_block_search_field_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// block-search-field.jade:search-field compiled template
templatizer["block-search-field"]["search-field"] = function tmpl_block_search_field_search_field(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    if (data.around) {
        modifiers.push("with-around");
    }
    buf.push("<form" + jade.attr("action", data.action, true, false) + jade.attr("method", data.method ? data.method : "get", true, false) + ' autocomplete="off"' + jade.cls([ "search-field", modifiers ], [ null, true ]) + "><input" + jade.attr("id", data.input.id, true, false) + ' type="text" name="search"' + jade.attr("placeholder", data.input.placeholder, true, false) + jade.attr("title", data.input.placeholder, true, false) + jade.attr("value", data.input.value, true, false) + ' class="search-field-input"/><button type="submit"' + jade.attr("title", data.submit.title, true, false) + ' class="search-field-submit">');
    if (data.submit.icon) {
        buf.push("<span>" + jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp) + '</span><i aria-hidden="true" class="icon icon-search-v2"></i>');
    } else {
        buf.push(jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp));
    }
    buf.push("</button>");
    if (data.around) {
        var around = JSON.parse(JSON.stringify(data.around));
        around.modifiers = [ "marker", "around" ];
        buf.push(templatizer["block-search-field"]["button"](around));
    }
    buf.push("</form>");
    return buf.join("");
};


// block-search-field.jade:block-search-field compiled template
templatizer["block-search-field"]["block-search-field"] = function tmpl_block_search_field_block_search_field(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data = JSON.parse(JSON.stringify(data));
    data.modifiers = data.modifiers || [];
    data.modifiers.push("block-search-field");
    buf.push(templatizer["block-search-field"]["block-search"].call({
        block: function(buf) {
            buf.push(templatizer["block-search-field"]["search-field"](data.search_field));
        }
    }, data));
    return buf.join("");
};

// block-search-filters.jade compiled template
templatizer["block-search-filters"] = function tmpl_block_search_filters(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// block-search-filters.jade:block-search compiled template
templatizer["block-search-filters"]["block-search"] = function tmpl_block_search_filters_block_search(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-search", data.modifiers ], [ null, true ]) + '><div class="block-search-header">');
    if (data.name_categorie) {
        buf.push('<div class="block-search-categorie">' + jade.escape(null == (jade_interp = data.name_categorie) ? "" : jade_interp) + "</div>");
    }
    buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-search-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    var top_link = data.top_link || {};
    if (top_link.href) {
        buf.push('<span class="block-search-top-link"><a' + jade.attr("href", top_link.href, true, false) + jade.attr("title", top_link.text, true, false) + jade.attr("id", top_link.id, true, false) + ">" + jade.escape(null == (jade_interp = top_link.text) ? "" : jade_interp) + "</a></span>");
    }
    buf.push('</div><div class="block-search-content">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// block-search-filters.jade:button compiled template
templatizer["block-search-filters"]["button"] = function tmpl_block_search_filters_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// block-search-filters.jade:block-search-filters compiled template
templatizer["block-search-filters"]["block-search-filters"] = function tmpl_block_search_filters_block_search_filters(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data = JSON.parse(JSON.stringify(data));
    data.modifiers = data.modifiers || [];
    data.modifiers.push("block-search-filters");
    buf.push(templatizer["block-search-filters"]["block-search"].call({
        block: function(buf) {
            buf.push('<div class="block-search-filters-items-wrapper"><div id="js-currentrefined"></div><div id="js-refinementlist" class="block-search-filters-autocomplete"></div></div>');
            if (data.more) {
                buf.push('<button class="block-search-filters-more js-open-search-modal">' + jade.escape(null == (jade_interp = data.more.text) ? "" : jade_interp) + "</button>");
            }
            buf.push('<div class="block-search-filters-secondary"><div id="js-facet-open" class="block-search-filters-secondary-item"></div><div id="js-facet-accessibility" class="block-search-filters-secondary-item"></div><div id="js-facet-address_postcode" class="block-search-filters-secondary-item"></div></div>');
        }
    }, data));
    return buf.join("");
};

// block-search.jade compiled template
templatizer["block-search"] = function tmpl_block_search(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// block-search.jade:block-search compiled template
templatizer["block-search"]["block-search"] = function tmpl_block_search_block_search(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-search", data.modifiers ], [ null, true ]) + '><div class="block-search-header">');
    if (data.name_categorie) {
        buf.push('<div class="block-search-categorie">' + jade.escape(null == (jade_interp = data.name_categorie) ? "" : jade_interp) + "</div>");
    }
    buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-search-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    var top_link = data.top_link || {};
    if (top_link.href) {
        buf.push('<span class="block-search-top-link"><a' + jade.attr("href", top_link.href, true, false) + jade.attr("title", top_link.text, true, false) + jade.attr("id", top_link.id, true, false) + ">" + jade.escape(null == (jade_interp = top_link.text) ? "" : jade_interp) + "</a></span>");
    }
    buf.push('</div><div class="block-search-content">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    buf.push("</div></div>");
    return buf.join("");
};

// breadcrumbs.jade compiled template
templatizer["breadcrumbs"] = function tmpl_breadcrumbs(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// breadcrumbs.jade:breadcrumbs compiled template
templatizer["breadcrumbs"]["breadcrumbs"] = function tmpl_breadcrumbs_breadcrumbs(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<a id="breadcrumbs" class="offset-header breadcrumbs-offset-header"></a><ol class="breadcrumbs">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var item = $$obj[index];
                buf.push('<li class="breadcrumbs-item">');
                if (item.href) {
                    var last = index + 1 === data.items.length;
                    buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("tabindex", last ? -1 : null, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a>");
                } else {
                    buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                }
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var item = $$obj[index];
                buf.push('<li class="breadcrumbs-item">');
                if (item.href) {
                    var last = index + 1 === data.items.length;
                    buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("tabindex", last ? -1 : null, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a>");
                } else {
                    buf.push(jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                }
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ol>");
    return buf.join("");
};

// block-map.jade compiled template
templatizer["block-map"] = function tmpl_block_map(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// block-map.jade:block-map compiled template
templatizer["block-map"]["block-map"] = function tmpl_block_map_block_map(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    data = JSON.parse(JSON.stringify(data));
    data.modifiers = data.modifiers || [];
    data.modifiers.push("block-map");
    buf.push('<div id="map"></div><div class="map-caption"><div class="map-caption-icon is-open"></div>' + jade.escape(null == (jade_interp = "Équipement ouvert") ? "" : jade_interp) + '<div class="map-caption-icon is-closed"></div>' + jade.escape(null == (jade_interp = "Équipement fermé") ? "" : jade_interp) + '<div class="map-caption-icon is-unknown"></div>' + jade.escape(null == (jade_interp = "Horaires non renseignés") ? "" : jade_interp) + "</div>");
    return buf.join("");
};

// button-top.jade compiled template
templatizer["button-top"] = function tmpl_button_top(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// button-top.jade:button-top compiled template
templatizer["button-top"]["button-top"] = function tmpl_button_top_button_top(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<a href="#" class="button-top"><i aria-hidden="true" class="icon-arrow-top"></i><div class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.accessibility_label) ? "" : jade_interp) + "</div></a>");
    return buf.join("");
};

// button.jade compiled template
templatizer["button"] = function tmpl_button(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// button.jade:button compiled template
templatizer["button"]["button"] = function tmpl_button_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};

// card.jade compiled template
templatizer["card"] = function tmpl_card(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// card.jade:card compiled template
templatizer["card"]["card"] = function tmpl_card_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.cls([ "card", data.modifiers ], [ null, true ]) + "><div" + jade.attr("style", "background-image: url(" + data.image.src + ")", true, false) + ' class="card-image"></div><div class="card-content">');
    if (data.category) {
        buf.push('<div class="card-category">' + jade.escape(null == (jade_interp = data.category) ? "" : jade_interp) + "</div>");
    }
    buf.push('<h3 class="card-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    if (data.text) {
        buf.push('<div class="card-text">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</div>");
    }
    if (data.hours) {
        buf.push("<div" + jade.cls([ "card-hours", data.modifiers ], [ null, true ]) + ">" + jade.escape(null == (jade_interp = data.hours) ? "" : jade_interp) + "</div>");
    }
    buf.push("</div></a>");
    return buf.join("");
};

// cross-content.jade compiled template
templatizer["cross-content"] = function tmpl_cross_content(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// cross-content.jade:cross-content compiled template
templatizer["cross-content"]["cross-content"] = function tmpl_cross_content_cross_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="cross-content">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("style", "background-image: url(" + item.background + ");", true, false) + jade.cls([ "cross-content-item", item.modifiers ], [ null, true ]) + '><h2 class="cross-content-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</h2>");
                if (item.icon) {
                    buf.push("<i" + jade.cls([ "cross-content-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<p class="cross-content-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</p></a>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("style", "background-image: url(" + item.background + ");", true, false) + jade.cls([ "cross-content-item", item.modifiers ], [ null, true ]) + '><h2 class="cross-content-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</h2>");
                if (item.icon) {
                    buf.push("<i" + jade.cls([ "cross-content-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<p class="cross-content-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</p></a>");
            }
        }
    }).call(this);
    buf.push("</div>");
    return buf.join("");
};

// document-heading.jade compiled template
templatizer["document-heading"] = function tmpl_document_heading(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// document-heading.jade:tags compiled template
templatizer["document-heading"]["tags"] = function tmpl_document_heading_tags(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<ul class="tags">');
    (function() {
        var $$obj = data;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var tag = $$obj[index];
                buf.push("<li>");
                if (tag.href) {
                    buf.push("<a" + jade.attr("href", "" + tag.href + "", true, false) + ' class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</a>");
                } else {
                    buf.push('<span class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</span>");
                }
                if (index < data.length - 1) {
                    buf.push('<span class="tags-separator">—</span>');
                }
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var tag = $$obj[index];
                buf.push("<li>");
                if (tag.href) {
                    buf.push("<a" + jade.attr("href", "" + tag.href + "", true, false) + ' class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</a>");
                } else {
                    buf.push('<span class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</span>");
                }
                if (index < data.length - 1) {
                    buf.push('<span class="tags-separator">—</span>');
                }
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    return buf.join("");
};


// document-heading.jade:icon-switch compiled template
templatizer["document-heading"]["icon-switch"] = function tmpl_document_heading_icon_switch(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    if (data.action.type) {
        modifiers.push("icon-switch-" + data.action.type);
    }
    if (data.active === true) {
        modifiers.push("active");
    }
    buf.push("<div" + jade.attr("data-action", data.action.type, true, false) + jade.attr("data-action-id", data.action.id, true, false) + jade.attr("data-action-fallback-link", data.action.fallback_link, true, false) + jade.cls([ "icon-switch", modifiers ], [ null, true ]) + "><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[0], true, false) + ' type="button" class="icon-switch-on"><span' + jade.cls([ "icon", "icon-" + data.icon[0] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[0]) ? "" : jade_interp) + "</span></button><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[1], true, false) + ' type="button" class="icon-switch-off"><span' + jade.cls([ "icon", "icon-" + data.icon[1] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[1]) ? "" : jade_interp) + "</span></button></div>");
    return buf.join("");
};


// document-heading.jade:document-heading compiled template
templatizer["document-heading"]["document-heading"] = function tmpl_document_heading_document_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="document-heading"><div' + jade.attr("style", data.image && 'background-image:url("' + data.image + '")', true, false) + ' class="document-heading-background"></div><div class="document-heading-wrapper"><div class="document-heading-content"><div class="document-heading-content-wrapper"><h1 class="document-heading-title">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</h1>");
    if (data.icons) {
        buf.push('<div class="document-heading-icons">');
        (function() {
            var $$obj = data.icons;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var icon = $$obj[$index];
                    buf.push(templatizer["document-heading"]["icon-switch"](icon));
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var icon = $$obj[$index];
                    buf.push(templatizer["document-heading"]["icon-switch"](icon));
                }
            }
        }).call(this);
        buf.push("</div>");
    }
    if (data.tags) {
        buf.push(templatizer["document-heading"]["tags"](data.tags));
    }
    buf.push("</div></div></div></div>");
    return buf.join("");
};

// error-heading.jade compiled template
templatizer["error-heading"] = function tmpl_error_heading(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// error-heading.jade:button compiled template
templatizer["error-heading"]["button"] = function tmpl_error_heading_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// error-heading.jade:error-heading compiled template
templatizer["error-heading"]["error-heading"] = function tmpl_error_heading_error_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "error-heading", data.modifiers ], [ null, true ]) + "><div" + jade.attr("style", data.background ? "background-image: url(" + data.background + ")" : "", true, false) + ' class="error-heading-wrapper layout-wrapper"><a id="logo"' + jade.attr("href", data.logo.href, true, false) + jade.attr("title", data.logo.title, true, false) + ' class="error-heading-logo"><div class="error-heading-logo-nef"></div><div class="error-heading-logo-paris">' + jade.escape(null == (jade_interp = data.logo.text) ? "" : jade_interp) + '</div></a><div class="error-heading-content">');
    if (data.title) {
        buf.push("<h1>" + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h1>");
    }
    if (data.trace) {
        buf.push('<p class="error-heading-trace">' + jade.escape(null == (jade_interp = data.trace) ? "" : jade_interp) + "</p>");
    }
    if (data.button) {
        var button = JSON.parse(JSON.stringify(data.button || []));
        button.modifiers = button.modifiers || [];
        button.modifiers.push("white");
        buf.push(templatizer["error-heading"]["button"](button));
    }
    buf.push("</div></div></div>");
    return buf.join("");
};

// footer.jade compiled template
templatizer["footer"] = function tmpl_footer(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// footer.jade:footer compiled template
templatizer["footer"]["footer"] = function tmpl_footer_footer(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<footer role="contentinfo" class="footer"><div class="layout-wrapper footer-wrapper"><a' + jade.attr("href", data.logo.href, true, false) + ' class="footer-logo">' + jade.escape(null == (jade_interp = data.logo.alt) ? "" : jade_interp) + '</a><ul class="footer-links">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ item.modifiers ], [ true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("target", item.target, true, false) + jade.attr("lang", item.lang, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ item.modifiers ], [ true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("target", item.target, true, false) + jade.attr("lang", item.lang, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
            }
        }
    }).call(this);
    buf.push("</ul></div></footer>");
    return buf.join("");
};

// gallery-ugc.jade compiled template
templatizer["gallery-ugc"] = function tmpl_gallery_ugc(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// gallery-ugc.jade:gallery-ugc compiled template
templatizer["gallery-ugc"]["gallery-ugc"] = function tmpl_gallery_ugc_gallery_ugc(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="gallery-ugc"><div class="gallery-ugc-title">' + jade.escape(null == (jade_interp = data.title + " :") ? "" : jade_interp) + "</div>");
    (function() {
        var $$obj = data.hashtags;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var hashtag = $$obj[$index];
                buf.push('<button type="button"' + jade.attr("title", hashtag.text, true, false) + jade.attr("data-hashtag", hashtag.id, true, false) + jade.cls([ "gallery-ugc-hashtag", hashtag.current ? "current" : null ], [ null, true ]) + ">" + jade.escape(null == (jade_interp = hashtag.text) ? "" : jade_interp) + "</button>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var hashtag = $$obj[$index];
                buf.push('<button type="button"' + jade.attr("title", hashtag.text, true, false) + jade.attr("data-hashtag", hashtag.id, true, false) + jade.cls([ "gallery-ugc-hashtag", hashtag.current ? "current" : null ], [ null, true ]) + ">" + jade.escape(null == (jade_interp = hashtag.text) ? "" : jade_interp) + "</button>");
            }
        }
    }).call(this);
    (function() {
        var $$obj = data.hashtags;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var hashtag = $$obj[$index];
                buf.push("<ul" + jade.attr("style", hashtag.current ? "" : "display: none;", true, false) + jade.attr("id", "gallery-ugc-" + hashtag.id + "", true, false) + ' class="gallery-ugc-content">');
                (function() {
                    var $$obj = hashtag.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<li class="gallery-ugc-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' target="_blank"' + jade.attr("style", "background-image: url(" + item.image + ");", true, false) + jade.attr("title", item.title, true, false) + ' class="gallery-ugc-image"><div class="overlay"><div class="gallery-ugc-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<li class="gallery-ugc-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' target="_blank"' + jade.attr("style", "background-image: url(" + item.image + ");", true, false) + jade.attr("title", item.title, true, false) + ' class="gallery-ugc-image"><div class="overlay"><div class="gallery-ugc-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
                        }
                    }
                }).call(this);
                buf.push("</ul>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var hashtag = $$obj[$index];
                buf.push("<ul" + jade.attr("style", hashtag.current ? "" : "display: none;", true, false) + jade.attr("id", "gallery-ugc-" + hashtag.id + "", true, false) + ' class="gallery-ugc-content">');
                (function() {
                    var $$obj = hashtag.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<li class="gallery-ugc-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' target="_blank"' + jade.attr("style", "background-image: url(" + item.image + ");", true, false) + jade.attr("title", item.title, true, false) + ' class="gallery-ugc-image"><div class="overlay"><div class="gallery-ugc-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<li class="gallery-ugc-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' target="_blank"' + jade.attr("style", "background-image: url(" + item.image + ");", true, false) + jade.attr("title", item.title, true, false) + ' class="gallery-ugc-image"><div class="overlay"><div class="gallery-ugc-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
                        }
                    }
                }).call(this);
                buf.push("</ul>");
            }
        }
    }).call(this);
    buf.push("</div>");
    return buf.join("");
};

// get-involved-list.jade compiled template
templatizer["get-involved-list"] = function tmpl_get_involved_list(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// get-involved-list.jade:button compiled template
templatizer["get-involved-list"]["button"] = function tmpl_get_involved_list_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// get-involved-list.jade:heading compiled template
templatizer["get-involved-list"]["heading"] = function tmpl_get_involved_list_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "heading", data.modifiers ], [ null, true ]) + ">");
    if (data.anchor && data.activeAnchor) {
        buf.push("<h2" + jade.attr("id", data.anchor, true, false) + ' class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    } else {
        buf.push('<h2 class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
        if (data.link) {
            buf.push('<div class="heading-links">');
            if (data.link.external) {
                buf.push('<span class="icon-dailymotion"> </span>');
            }
            buf.push("<a" + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + ">" + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};


// get-involved-list.jade:intro-text compiled template
templatizer["get-involved-list"]["intro-text"] = function tmpl_get_involved_list_intro_text(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<p class="intro-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    return buf.join("");
};


// get-involved-list.jade:get-involved-item compiled template
templatizer["get-involved-list"]["get-involved-item"] = function tmpl_get_involved_list_get_involved_item(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<li" + jade.cls([ "get-involved-list-item", data.modifiers ], [ null, true ]) + '><div class="get-involved-list-item-category">' + jade.escape(null == (jade_interp = data.category) ? "" : jade_interp) + '</div><div class="get-involved-list-item-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
    var button = JSON.parse(JSON.stringify(data.button));
    button.modifiers = [ "action", "get-involved-list-item-button" ];
    buf.push(templatizer["get-involved-list"]["button"](button));
    buf.push("</li>");
    return buf.join("");
};


// get-involved-list.jade:get-involved-list compiled template
templatizer["get-involved-list"]["get-involved-list"] = function tmpl_get_involved_list_get_involved_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="get-involved-list">');
    if (data.intro) {
        buf.push(templatizer["get-involved-list"]["intro-text"](data.intro));
    }
    if (data.heading) {
        buf.push(templatizer["get-involved-list"]["heading"](data.heading));
    }
    if (data.nav) {
        buf.push('<div class="get-involved-nav">');
        if (data.nav.title) {
            buf.push('<h3 class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.nav.title) ? "" : jade_interp) + "</h3>");
        }
        buf.push('<ul class="get-involved-nav-items">');
        (function() {
            var $$obj = data.nav.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="get-involved-nav-item"><div class="get-involved-list-item-title">' + (null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    var button = JSON.parse(JSON.stringify(item.button));
                    button.modifiers = [ "action" ];
                    buf.push(templatizer["get-involved-list"]["button"](button));
                    buf.push("</li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="get-involved-nav-item"><div class="get-involved-list-item-title">' + (null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    var button = JSON.parse(JSON.stringify(item.button));
                    button.modifiers = [ "action" ];
                    buf.push(templatizer["get-involved-list"]["button"](button));
                    buf.push("</li>");
                }
            }
        }).call(this);
        buf.push("</ul></div>");
    }
    if (data.items_title) {
        buf.push('<h3 class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.items_title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<ul class="get-involved-list-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push(templatizer["get-involved-list"]["get-involved-item"](item));
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push(templatizer["get-involved-list"]["get-involved-item"](item));
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};

// get-involved.jade compiled template
templatizer["get-involved"] = function tmpl_get_involved(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// get-involved.jade:heading compiled template
templatizer["get-involved"]["heading"] = function tmpl_get_involved_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "heading", data.modifiers ], [ null, true ]) + ">");
    if (data.anchor && data.activeAnchor) {
        buf.push("<h2" + jade.attr("id", data.anchor, true, false) + ' class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    } else {
        buf.push('<h2 class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
        if (data.link) {
            buf.push('<div class="heading-links">');
            if (data.link.external) {
                buf.push('<span class="icon-dailymotion"> </span>');
            }
            buf.push("<a" + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + ">" + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};


// get-involved.jade:get-involved compiled template
templatizer["get-involved"]["get-involved"] = function tmpl_get_involved_get_involved(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="get-involved"><div class="layout-wrapper">');
    buf.push(templatizer["get-involved"]["heading"](data.heading));
    buf.push('<ul class="get-involved-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<li class="get-involved-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("style", "background-image: url(" + item.image.src + ");", true, false) + jade.cls([ "get-involved-card", item.modifiers ], [ null, true ]) + '><div class="get-involved-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<li class="get-involved-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("style", "background-image: url(" + item.image.src + ");", true, false) + jade.cls([ "get-involved-card", item.modifiers ], [ null, true ]) + '><div class="get-involved-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></a></li>");
            }
        }
    }).call(this);
    buf.push("</ul></div></div>");
    return buf.join("");
};

// heading-qfap.jade compiled template
templatizer["heading-qfap"] = function tmpl_heading_qfap(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// heading-qfap.jade:heading-qfap compiled template
templatizer["heading-qfap"]["heading-qfap"] = function tmpl_heading_qfap_heading_qfap(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="heading-qfap">');
    if (data.logo) {
        buf.push("<a" + jade.attr("href", data.logo.href, true, false) + ' target="_blank" class="heading-qfap-logo"><svg class="heading-qfap-logo-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 282.9 159.9" enable-background="new 0 0 282.9 159.9" xml:space="preserve">\n  <g class="heading-qfap-logo-quefaire" fill="#FFFFFF">\n    <path class="heading-qfap-logo-q" d="M54.2,79.4L46.5,69c2.8-3.2,5-7,6.1-11.5c3.5-14.3-5.2-28.8-19.5-32.3c-2.3-0.5-4.5-0.8-6.7-0.7 C14.5,24.6,3.8,32.7,0.8,44.7C-2.8,59,6,73.5,20.3,77c2.2,0.6,4.5,0.8,6.7,0.8c4,0,7.8-1,11.2-2.6l7.7,10.3c1.7,2.3,5,2.8,7.3,1.1 S56,81.6,54.2,79.4z M26.9,70.4c-1.6,0-3.2-0.2-4.8-0.6c-10.3-2.5-16.5-12.9-14-23.2c2.1-8.5,9.6-14.5,18.4-14.6 c1.6,0,3.2,0.2,4.8,0.6c10.3,2.5,16.5,12.9,14,23.2C43.2,64.3,35.6,70.3,26.9,70.4z"/>\n    <path d="M62.1,25.3l4.1,24.1c0.5,2.8,0.9,7.1,4.9,6.4c3.6-0.6,3.1-3.3,2.7-6.1l-4.4-25.6l7.3-1.3l4.6,27.1 c0.7,3.9,1.4,10.7-9.2,12.5c-6.9,1.2-11.5-1.3-12.7-8.3l-4.7-27.6L62.1,25.3z"/>\n    <path d="M96.6,19.5l1.2,6.9l-7.4,1.3l1.4,8.1l6.6-1.1l1.2,6.9l-6.6,1.1l1.4,8.4l7.5-1.3l1.2,6.9l-14.9,2.5L81.8,22 L96.6,19.5z"/>\n    <path d="M128,14.1l1.2,6.9l-7.5,1.3l1.4,7.9l6.8-1.2l1.2,6.9l-6.8,1.2l2.6,15.4l-7.3,1.3l-6.4-37.2L128,14.1z"/>\n    <path d="M144.9,11.2l15.3,35.6l-7.8,1.3l-2.5-6l-7.4,1.3l-0.3,6.5l-7.3,1.2l2.3-38.6L144.9,11.2z M144.3,26.9 l-1.8-5.5l-0.1,0l0.2,5.8l0.1,10.2l5.2-0.9L144.3,26.9z"/>\n    <path d="M164.2,7.9l6.4,37.2l-7.3,1.3l-6.4-37.2L164.2,7.9z"/>\n    <path d="M175.7,44.2L169.4,7l7.4-1.3c4.7-0.8,13.1-1.7,14.9,8.4c0.7,4.1-0.3,7.9-3.6,10.5l9.3,15.8l-7.7,1.3 l-9.4-16l-0.1,0l2.9,17.2L175.7,44.2z M179.5,21.7l1.3-0.2c3.4-0.6,4.3-3.1,3.8-6.1c-0.5-2.7-2.1-4.6-5.8-3.8l-1,0.2L179.5,21.7z"/>\n    <path d="M210.3,0l1.2,6.9L204,8.2l1.4,8.1l6.6-1.1l1.2,6.9l-6.6,1.1l1.4,8.4l7.5-1.3l1.2,6.9l-14.9,2.5l-6.4-37.2 L210.3,0z"/>\n  </g>\n\n  <g class="heading-qfap-logo-label">\n    <polygon fill="#FFFFFF" points="256.6,76.1 282.9,72.3 266.9,45.7 275.8,14.9 230,21.4 251.2,43.6 66.6,75.4 70.4,98.1 43.6,102.7 60.2,128.9 52.3,159.9 97.8,152.1 76.1,132.5 260.7,100.7 "/>\n    <g fill="#FFFFFF" fill-opacity="0.3">\n      <polygon points="94,129.4 97.8,152.1 76.1,132.5 "/>\n      <polygon points="251.2,43.6 230,21.4 234.2,46.6 "/>\n    </g>\n  </g>\n\n  <g class="heading-qfap-logo-aparis" fill="#F94F4F">\n    <path d="M95.3,107.4l-1.3,5.3l-3.9,0.7l6-23.7l3.8-0.7l13.4,20.4l-4,0.7l-3-4.6L95.3,107.4z M91.9,84.7l3.5-2.2 l4.1,4.1l-3.2,0.5L91.9,84.7z M98.6,93.3l-2.5,10.5l8.3-1.4L98.6,93.3z"/>\n    <path d="M129.5,83.9c5.6-0.9,9.2,1.3,10,6c0.9,5-1.8,8.4-7.4,9.4l-5.1,0.9l1.1,6.7l-3.7,0.6l-3.8-22.1L129.5,83.9z M126.4,96.9l4.9-0.8c3.4-0.6,5.1-2.4,4.6-5.4c-0.5-2.9-2.7-4-6.1-3.4l-4.9,0.8L126.4,96.9z"/>\n    <path d="M146.5,98.6l-1.3,5.3l-3.9,0.7l6-23.7l3.8-0.7l13.4,20.4l-4,0.7l-3-4.6L146.5,98.6z M149.9,84.6l-2.5,10.5 l8.3-1.4L149.9,84.6z"/>\n    <path d="M176.4,91.8c-0.3,0.1-0.7,0.1-1,0.2l-5.2,0.9l1.1,6.7l-3.7,0.6l-3.8-22.1l9-1.5c5.6-1,9.4,1.2,10.2,6 c0.6,3.5-0.6,6.3-3.3,7.9l6.2,6.5l-4.2,0.7L176.4,91.8z M174.8,88.6c3.4-0.6,5.1-2.4,4.6-5.4c-0.5-2.9-2.7-4-6.1-3.4l-5.2,0.9 l1.5,8.7L174.8,88.6z"/>\n    <path d="M190.4,96.3l-3.8-22.1l3.7-0.6l3.8,22.1L190.4,96.3z"/>\n    <path d="M211.5,72.1l-1,3.5c-2.6-1-5.1-1.2-6.8-0.9c-2.2,0.4-3.5,1.4-3.2,2.9c0.8,4.8,12.3,0.2,13.6,8.2 c0.7,3.9-2.4,7-7.2,7.8c-3.5,0.6-7-0.3-9.6-2l1.1-3.5c2.6,1.7,5.7,2.3,8,1.9c2.6-0.4,4-1.7,3.7-3.4c-0.8-4.9-12.3-0.1-13.6-8 c-0.6-3.8,2.2-6.7,7-7.5C206.2,70.7,209.2,71.1,211.5,72.1z"/>\n    <path d="M222.2,74.7c-0.6-4,1.5-6.7,5.5-7.4c3.8-0.6,6.6,0.8,7.2,4.2c0.9,5-4.1,6.1-3.4,10.3l-2.8,0.5 c-0.9-5.1,3.5-5.9,2.9-9.7c-0.3-1.8-1.8-2.5-3.7-2.2c-2,0.4-3.1,1.6-2.8,3.8L222.2,74.7z M233,87.1c0.2,1.2-0.5,2.3-1.6,2.5 c-1.1,0.2-2.1-0.5-2.3-1.8c-0.2-1.2,0.5-2.2,1.6-2.4S232.8,85.9,233,87.1z"/>\n  </g>\n</svg>\n<div class="heading-qfap-logo-text">' + jade.escape(null == (jade_interp = data.logo.text) ? "" : jade_interp) + "</div></a>");
    }
    buf.push('<div class="heading-qfap-title"><p>' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    if (data.link) {
        buf.push('<p class="heading-qfap-title-link"><span class="icon-link-external"></span><a' + jade.attr("href", data.link.href, true, false) + ' target="_blank">' + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></p>");
    }
    buf.push("</div></div>");
    return buf.join("");
};

// heading.jade compiled template
templatizer["heading"] = function tmpl_heading(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// heading.jade:heading compiled template
templatizer["heading"]["heading"] = function tmpl_heading_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "heading", data.modifiers ], [ null, true ]) + ">");
    if (data.anchor && data.activeAnchor) {
        buf.push("<h2" + jade.attr("id", data.anchor, true, false) + ' class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    } else {
        buf.push('<h2 class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
        if (data.link) {
            buf.push('<div class="heading-links">');
            if (data.link.external) {
                buf.push('<span class="icon-dailymotion"> </span>');
            }
            buf.push("<a" + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + ">" + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};

// hub-heading.jade compiled template
templatizer["hub-heading"] = function tmpl_hub_heading(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// hub-heading.jade:hub-heading compiled template
templatizer["hub-heading"]["hub-heading"] = function tmpl_hub_heading_hub_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("style", data.image && "background-image:url('" + data.image + "')", true, false) + jade.cls([ "hub-heading", data.modifiers ], [ null, true ]) + '><div class="hub-heading-wrapper layout-wrapper"><div class="hub-heading-content">');
    if (block) {
        block && block(buf);
    } else if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    } else if (data.text) {
        buf.push("<h1>" + (null == (jade_interp = data.text) ? "" : jade_interp) + "</h1>");
    }
    buf.push("</div></div></div>");
    return buf.join("");
};

// icon-switch.jade compiled template
templatizer["icon-switch"] = function tmpl_icon_switch(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// icon-switch.jade:icon-switch compiled template
templatizer["icon-switch"]["icon-switch"] = function tmpl_icon_switch_icon_switch(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    if (data.action.type) {
        modifiers.push("icon-switch-" + data.action.type);
    }
    if (data.active === true) {
        modifiers.push("active");
    }
    buf.push("<div" + jade.attr("data-action", data.action.type, true, false) + jade.attr("data-action-id", data.action.id, true, false) + jade.attr("data-action-fallback-link", data.action.fallback_link, true, false) + jade.cls([ "icon-switch", modifiers ], [ null, true ]) + "><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[0], true, false) + ' type="button" class="icon-switch-on"><span' + jade.cls([ "icon", "icon-" + data.icon[0] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[0]) ? "" : jade_interp) + "</span></button><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[1], true, false) + ' type="button" class="icon-switch-off"><span' + jade.cls([ "icon", "icon-" + data.icon[1] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[1]) ? "" : jade_interp) + "</span></button></div>");
    return buf.join("");
};

// image-full.jade compiled template
templatizer["image-full"] = function tmpl_image_full(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// image-full.jade:image-full compiled template
templatizer["image-full"]["image-full"] = function tmpl_image_full_image_full(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var title = [ data.title ];
    buf.push("<a" + jade.attr("href", data.image, true, false) + jade.cls([ "image-full", data.modifiers ], [ null, true ]) + '><div class="image-full-wrapper"><img' + jade.attr("src", data.image, true, false) + jade.attr("alt", data.alt, true, false) + jade.attr("title", title.join(" "), true, false) + '/><div class="image-full-text">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div></div></a>");
    return buf.join("");
};

// image-text.jade compiled template
templatizer["image-text"] = function tmpl_image_text(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// image-text.jade:image-text compiled template
templatizer["image-text"]["image-text"] = function tmpl_image_text_image_text(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "image-text", data.modifiers ], [ null, true ]) + ">");
    var title = [ data.title ];
    if (data.img && data.img.credit) {
        title.push("(" + data.img.credit + ")");
    }
    buf.push('<div class="image-text-img"><img' + jade.attr("src", data.img.src, true, false) + jade.attr("alt", data.img.alt, true, false) + jade.attr("title", title.join(" "), true, false) + '/></div><div class="image-text-wrapper"><h3><span class="image-text-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</span><small class="image-text-subtitle">' + jade.escape(null == (jade_interp = data.subtitle) ? "" : jade_interp) + '</small></h3><div class="image-text-content">' + (null == (jade_interp = data.text) ? "" : jade_interp) + "</div>");
    if (data.link && data.link.href && data.link.text) {
        buf.push("<a" + jade.attr("href", data.link.href, true, false) + ' class="image-text-link">' + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a>");
    }
    buf.push("</div></div>");
    return buf.join("");
};

// intro-text.jade compiled template
templatizer["intro-text"] = function tmpl_intro_text(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// intro-text.jade:intro-text compiled template
templatizer["intro-text"]["intro-text"] = function tmpl_intro_text_intro_text(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<p class="intro-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    return buf.join("");
};

// jumbotron-treize.jade compiled template
templatizer["jumbotron-treize"] = function tmpl_jumbotron_treize(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// jumbotron-treize.jade:button compiled template
templatizer["jumbotron-treize"]["button"] = function tmpl_jumbotron_treize_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// jumbotron-treize.jade:jumbotron-treize compiled template
templatizer["jumbotron-treize"]["jumbotron-treize"] = function tmpl_jumbotron_treize_jumbotron_treize(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("style", "background-image: url(" + data.image + ");", true, false) + jade.attr("id", data.id, true, false) + jade.cls([ "jumbotron-treize", data.modifiers ], [ null, true ]) + '><div class="jumbotron-treize-wrapper"><div class="jumbotron-treize-content">');
    var tag = data.tag || "h3";
    buf.push("<" + tag + ' class="jumbotron-treize-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + tag + '><h2 class="jumbotron-treize-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + '</h2><div class="treize-credit">' + jade.escape(null == (jade_interp = data.credit) ? "" : jade_interp) + "</div>");
    if (data.button) {
        var button = JSON.parse(JSON.stringify(data.button));
        buf.push(templatizer["jumbotron-treize"]["button"](button));
    }
    buf.push("</div></div></div>");
    return buf.join("");
};

// jumbotron.jade compiled template
templatizer["jumbotron"] = function tmpl_jumbotron(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// jumbotron.jade:button compiled template
templatizer["jumbotron"]["button"] = function tmpl_jumbotron_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// jumbotron.jade:jumbotron compiled template
templatizer["jumbotron"]["jumbotron"] = function tmpl_jumbotron_jumbotron(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.attr("onclick", data.onclick, true, false) + jade.attr("style", "background-image: url(" + data.image + ");", true, false) + jade.attr("id", data.id, true, false) + jade.cls([ "jumbotron", data.modifiers ], [ null, true ]) + '><div class="jumbotron-wrapper"><div class="layout-wrapper jumbotron-content layout-outside">');
    var tag = data.tag || "h2";
    buf.push("<" + tag + ' class="jumbotron-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + tag + '><div class="jumbotron-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</div>");
    if (data.button) {
        var button = JSON.parse(JSON.stringify(data.button));
        buf.push(templatizer["jumbotron"]["button"](button));
    }
    if (block) {
        buf.push('<div class="jumbotron-block">');
        block && block(buf);
        buf.push("</div>");
    }
    buf.push("</div></div></a>");
    return buf.join("");
};

// last-update.jade compiled template
templatizer["last-update"] = function tmpl_last_update(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// last-update.jade:last-update compiled template
templatizer["last-update"]["last-update"] = function tmpl_last_update_last_update(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="last-update">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</div>");
    return buf.join("");
};

// links-group.jade compiled template
templatizer["links-group"] = function tmpl_links_group(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// links-group.jade:intro-text compiled template
templatizer["links-group"]["intro-text"] = function tmpl_links_group_intro_text(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<p class="intro-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p>");
    return buf.join("");
};


// links-group.jade:links-group compiled template
templatizer["links-group"]["links-group"] = function tmpl_links_group_links_group(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "links-group", data.modifiers ], [ null, true ]) + ">");
    if (data.anchor && data.activeAnchor) {
        buf.push("<h2" + jade.attr("id", data.anchor, true, false) + ' class="links-group-header"><a' + jade.attr("href", data.href, true, false) + jade.attr("style", data.background ? "background-image: url(" + data.background + ");" : null, true, false) + '><div class="links-group-header-wrapper"><div class="links-group-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
        if (data.subtitle) {
            buf.push('<div class="links-group-subtitle">' + jade.escape(null == (jade_interp = data.subtitle) ? "" : jade_interp) + "</div>");
        }
        buf.push("</div></a></h2>");
    } else if (data.title) {
        buf.push('<h2 class="links-group-header"><a' + jade.attr("href", data.href, true, false) + jade.attr("style", data.background ? "background-image: url(" + data.background + ");" : null, true, false) + '><div class="links-group-header-wrapper"><div class="links-group-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
        if (data.subtitle) {
            buf.push('<div class="links-group-subtitle">' + jade.escape(null == (jade_interp = data.subtitle) ? "" : jade_interp) + "</div>");
        }
        buf.push("</div></a></h2>");
    }
    buf.push('<div class="links-group-content">');
    if (data.text) {
        buf.push(templatizer["links-group"]["intro-text"]({
            text: data.text
        }));
    }
    buf.push('<ul class="links-group-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<li class="links-group-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + '><span class="links-group-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</span><i aria-hidden="true" class="links-group-item-icon"></i></a></li>');
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<li class="links-group-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + '><span class="links-group-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</span><i aria-hidden="true" class="links-group-item-icon"></i></a></li>');
            }
        }
    }).call(this);
    buf.push("</ul></div></div>");
    return buf.join("");
};

// jumbotron-slider.jade compiled template
templatizer["jumbotron-slider"] = function tmpl_jumbotron_slider(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// jumbotron-slider.jade:jumbotron-slider compiled template
templatizer["jumbotron-slider"]["jumbotron-slider"] = function tmpl_jumbotron_slider_jumbotron_slider(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var tag = data.href ? "a" : "div";
    buf.push("<" + tag + jade.attr("href", data.href, true, false) + jade.attr("style", "color:" + data.colorlink + ";", true, false) + jade.cls([ "jumbotron-slider", data.modifiers ], [ null, true ]) + "><div" + jade.attr("style", "background-color:" + data.bgimage + ";background-image: url(" + data.image + ");", true, false) + ' class="jumbotron-slider-content"></div><div' + jade.attr("style", "background-color:" + data.bgnotice + ";", true, false) + ' class="jumbotron-slider-notice"><p class="jumbotron-slider-notice-content"><span class="jumbotron-slider-notice-content-wrapper"><span class="jumbotron-slider-notice-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span>");
    if (data.text) {
        buf.push((null == (jade_interp = "&nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp;") ? "" : jade_interp) + '<span class="jumbotron-slider-notice-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span>");
    }
    if (data.href) {
        buf.push('<i class="icon-arrow-small-right"></i>');
    }
    buf.push("</span></p></div></" + tag + ">");
    return buf.join("");
};

// municipal-site-list.jade compiled template
templatizer["municipal-site-list"] = function tmpl_municipal_site_list(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// municipal-site-list.jade:button compiled template
templatizer["municipal-site-list"]["button"] = function tmpl_municipal_site_list_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// municipal-site-list.jade:municipal-site-list compiled template
templatizer["municipal-site-list"]["municipal-site-list"] = function tmpl_municipal_site_list_municipal_site_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="municipal-site-list"><p class="municipal-site-list-intro">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + '</p><ul class="municipal-site-list-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                item = JSON.parse(JSON.stringify(item || {}));
                buf.push("<li>");
                buf.push(templatizer["municipal-site-list"]["button"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                item = JSON.parse(JSON.stringify(item || {}));
                buf.push("<li>");
                buf.push(templatizer["municipal-site-list"]["button"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};

// municipal-team.jade compiled template
templatizer["municipal-team"] = function tmpl_municipal_team(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// municipal-team.jade:heading compiled template
templatizer["municipal-team"]["heading"] = function tmpl_municipal_team_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "heading", data.modifiers ], [ null, true ]) + ">");
    if (data.anchor && data.activeAnchor) {
        buf.push("<h2" + jade.attr("id", data.anchor, true, false) + ' class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    } else {
        buf.push('<h2 class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
        if (data.link) {
            buf.push('<div class="heading-links">');
            if (data.link.external) {
                buf.push('<span class="icon-dailymotion"> </span>');
            }
            buf.push("<a" + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + ">" + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};


// municipal-team.jade:municipal-team compiled template
templatizer["municipal-team"]["municipal-team"] = function tmpl_municipal_team_municipal_team(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="municipal-team"><div class="layout-wrapper">');
    buf.push(templatizer["municipal-team"]["heading"](data.heading));
    buf.push('<div class="municipal-team-content"><img' + jade.attr("src", data.img.src, true, false) + ' alt="" class="municipal-team-img"/><p class="municipal-team-intro">' + jade.escape(null == (jade_interp = data.intro) ? "" : jade_interp) + '</p><p class="municipal-team-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p></div></div></div>");
    return buf.join("");
};

// news-card.jade compiled template
templatizer["news-card"] = function tmpl_news_card(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// news-card.jade:news-card compiled template
templatizer["news-card"]["news-card"] = function tmpl_news_card_news_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.attr("onclick", data.onclick, true, false) + jade.attr("target", data.target, true, false) + jade.cls([ "news-card", data.modifiers ], [ null, true ]) + '><div class="news-card-wrapper"><div' + jade.attr("style", data.image && "background-image: url(" + data.image + ");", true, false) + ' class="news-card-image"></div><div class="news-card-content"><div class="news-card-category"><span>' + jade.escape(null == (jade_interp = data.category) ? "" : jade_interp) + '</span></div><div class="news-card-title">');
    if (data.target === "_blank") {
        buf.push('<span class="icon-link-external"></span>');
    }
    buf.push(jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
    if (data.date) {
        buf.push('<div class="news-card-date"><span>' + jade.escape(null == (jade_interp = data.date) ? "" : jade_interp) + "</span></div>");
    }
    if (data.arrondissement) {
        buf.push('<div class="news-card-arrondissement"><span>' + jade.escape(null == (jade_interp = data.arrondissement) ? "" : jade_interp) + "</span></div>");
    }
    if (data.counters) {
        buf.push('<div class="news-card-counters"><div class="news-card-counter facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="news-card-counter twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
    }
    buf.push("</div></div></a>");
    return buf.join("");
};

// news-list.jade compiled template
templatizer["news-list"] = function tmpl_news_list(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// news-list.jade:news-card compiled template
templatizer["news-list"]["news-card"] = function tmpl_news_list_news_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.attr("onclick", data.onclick, true, false) + jade.attr("target", data.target, true, false) + jade.cls([ "news-card", data.modifiers ], [ null, true ]) + '><div class="news-card-wrapper"><div' + jade.attr("style", data.image && "background-image: url(" + data.image + ");", true, false) + ' class="news-card-image"></div><div class="news-card-content"><div class="news-card-category"><span>' + jade.escape(null == (jade_interp = data.category) ? "" : jade_interp) + '</span></div><div class="news-card-title">');
    if (data.target === "_blank") {
        buf.push('<span class="icon-link-external"></span>');
    }
    buf.push(jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
    if (data.date) {
        buf.push('<div class="news-card-date"><span>' + jade.escape(null == (jade_interp = data.date) ? "" : jade_interp) + "</span></div>");
    }
    if (data.arrondissement) {
        buf.push('<div class="news-card-arrondissement"><span>' + jade.escape(null == (jade_interp = data.arrondissement) ? "" : jade_interp) + "</span></div>");
    }
    if (data.counters) {
        buf.push('<div class="news-card-counters"><div class="news-card-counter facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="news-card-counter twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = data.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = data.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
    }
    buf.push("</div></div></a>");
    return buf.join("");
};


// news-list.jade:news-list compiled template
templatizer["news-list"]["news-list"] = function tmpl_news_list_news_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.modifiers && data.modifiers.indexOf("news-cards") !== -1) {
        if (data.modifiers.indexOf("large-first-child") !== -1) {
            buf.push("<ul" + jade.cls([ "news-list", data.modifiers ], [ null, true ]) + ">");
            (function() {
                var $$obj = data.items.slice(0, 5);
                if ("number" == typeof $$obj.length) {
                    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                        var item = $$obj[index];
                        buf.push('<li class="news-list-card-item">');
                        if (index === 0) {
                            var item = JSON.parse(JSON.stringify(item));
                            item.modifiers = [ "large" ];
                            buf.push(templatizer["news-list"]["news-card"](item));
                        } else {
                            buf.push(templatizer["news-list"]["news-card"](item));
                        }
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var index in $$obj) {
                        $$l++;
                        var item = $$obj[index];
                        buf.push('<li class="news-list-card-item">');
                        if (index === 0) {
                            var item = JSON.parse(JSON.stringify(item));
                            item.modifiers = [ "large" ];
                            buf.push(templatizer["news-list"]["news-card"](item));
                        } else {
                            buf.push(templatizer["news-list"]["news-card"](item));
                        }
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        } else {
            buf.push("<ul" + jade.cls([ "news-list", "gallery", data.modifiers ], [ null, null, true ]) + ">");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="news-list-card-item">');
                        buf.push(templatizer["news-list"]["news-card"](item));
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="news-list-card-item">');
                        buf.push(templatizer["news-list"]["news-card"](item));
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
    } else {
        buf.push("<ul" + jade.cls([ "news-list", "gallery", data.modifiers ], [ null, null, true ]) + ">");
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="news-list-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' class="news-item"><div class="news-item-meta"><div class="news-item-date">' + jade.escape(null == (jade_interp = item.date) ? "" : jade_interp) + '</div><div class="news-item-category">' + jade.escape(null == (jade_interp = item.category) ? "" : jade_interp) + '</div></div><div class="news-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    if (item.counters) {
                        buf.push('<div class="social-counters"><div class="facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
                    }
                    buf.push("</a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="news-list-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ' class="news-item"><div class="news-item-meta"><div class="news-item-date">' + jade.escape(null == (jade_interp = item.date) ? "" : jade_interp) + '</div><div class="news-item-category">' + jade.escape(null == (jade_interp = item.category) ? "" : jade_interp) + '</div></div><div class="news-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</div>");
                    if (item.counters) {
                        buf.push('<div class="social-counters"><div class="facebook-counter"><i aria-hidden="true" class="icon icon-facebook"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.facebook[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.facebook[1]) ? "" : jade_interp) + '</span></div><div class="twitter-counter"><i aria-hidden="true" class="icon icon-twitter"></i><span class="counter-value">' + jade.escape(null == (jade_interp = item.counters.twitter[0]) ? "" : jade_interp) + '</span><span class="counter-label">' + jade.escape(null == (jade_interp = item.counters.twitter[1]) ? "" : jade_interp) + "</span></div></div>");
                    }
                    buf.push("</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    return buf.join("");
};

// notice.jade compiled template
templatizer["notice"] = function tmpl_notice(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// notice.jade:button compiled template
templatizer["notice"]["button"] = function tmpl_notice_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// notice.jade:notice compiled template
templatizer["notice"]["notice"] = function tmpl_notice_notice(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("id", data.id, true, false) + jade.cls([ "notice", data.modifiers ], [ null, true ]) + ">");
    if (data.closable === true) {
        buf.push('<button type="button" class="close">');
        if (data.close_label) {
            buf.push('<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.close_label) ? "" : jade_interp) + "</div>");
        }
        buf.push("</button>");
    } else if (data.closable) {
        buf.push('<div class="notice-button">');
        buf.push(templatizer["notice"]["button"](data.closable));
        buf.push("</div>");
    }
    buf.push('<p class="notice-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    } else if (block) {
        block && block(buf);
    } else {
        if (data.href) {
            buf.push("<a" + jade.attr("href", data.href, true, false) + ' class="notice-content-link"><span class="notice-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span>");
            if (data.text) {
                buf.push((null == (jade_interp = "&nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp;") ? "" : jade_interp) + '<span class="notice-content-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span>");
            }
            buf.push("</a>");
        } else {
            buf.push('<span class="notice-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span>");
        }
    }
    buf.push("</p></div>");
    return buf.join("");
};

// pagination.jade compiled template
templatizer["pagination"] = function tmpl_pagination(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(parseInt) {}).call(this, "parseInt" in locals_for_with ? locals_for_with.parseInt : typeof parseInt !== "undefined" ? parseInt : undefined);
    return buf.join("");
};

// pagination.jade:pagination compiled template
templatizer["pagination"]["pagination"] = function tmpl_pagination_pagination(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<nav" + jade.attr("aria-label", data.text.label, true, false) + ' class="pagination">');
    var current = parseInt(data.current) || 1;
    var total = parseInt(data.total) || 0;
    var prev = current - 1;
    var next = current + 1;
    var items_before = function() {
        if (current < 3) {
            return 1;
        } else if (current > total - 1 && total > 3) {
            return 3;
        } else {
            return 2;
        }
    };
    var items_after = function() {
        if (current < 3) {
            return current * -1 + 5;
        } else if (current > total - 2) {
            return total - current;
        } else {
            return 2;
        }
    };
    var link_title = data.text.link_title || "${page}";
    buf.push("<ul>");
    if (current !== 1) {
        buf.push('<li class="previous">');
        var href = prev === 1 ? data.base_url : data.url.replace("${page}", prev);
        buf.push("<a" + jade.attr("href", href, true, false) + jade.attr("aria-label", data.text.prev, true, false) + ' data-page="prev"' + jade.attr("title", link_title.replace("${page}", prev), true, false) + '><span aria-hidden="true">&lt;</span></a></li>');
        var item = current - items_before();
        while (item < current) {
            var href = item === 1 ? data.base_url : data.url.replace("${page}", item);
            buf.push('<li class="hidden-on-small"><a' + jade.attr("href", href, true, false) + jade.attr("data-page", item, true, false) + jade.attr("title", link_title.replace("${page}", item), true, false) + ">" + jade.escape(null == (jade_interp = item) ? "" : jade_interp) + "</a></li>");
            item++;
        }
    }
    buf.push('<li class="current">');
    var href = current === 1 ? data.base_url : data.url.replace("${page}", current);
    buf.push("<a" + jade.attr("href", href, true, false) + jade.attr("data-page", current, true, false) + ">" + jade.escape(null == (jade_interp = current) ? "" : jade_interp) + "</a></li>");
    if (current !== total && total > 1) {
        var item = current;
        while (item < total && item < current + items_after()) {
            item++;
            var href = item === 1 ? data.base_url : data.url.replace("${page}", item);
            buf.push('<li class="hidden-on-small"><a' + jade.attr("href", href, true, false) + jade.attr("data-page", item, true, false) + jade.attr("title", link_title.replace("${page}", item), true, false) + ">" + jade.escape(null == (jade_interp = item) ? "" : jade_interp) + "</a></li>");
        }
        buf.push('<li class="next"><a' + jade.attr("href", data.url.replace("${page}", next), true, false) + jade.attr("aria-label", data.text.next, true, false) + ' data-page="next"' + jade.attr("title", link_title.replace("${page}", next), true, false) + '><span aria-hidden="true">&gt;</span></a></li>');
    }
    buf.push("</ul></nav>");
    return buf.join("");
};

// person-block.jade compiled template
templatizer["person-block"] = function tmpl_person_block(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// person-block.jade:button compiled template
templatizer["person-block"]["button"] = function tmpl_person_block_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// person-block.jade:buttons compiled template
templatizer["person-block"]["buttons"] = function tmpl_person_block_buttons(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-buttons", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        var title_tag = data.title_tag || "h2";
        buf.push("<" + title_tag + ' class="buttons-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + title_tag + ">");
    }
    buf.push("<ul" + jade.cls([ "buttons-items", data.activeCenter ], [ null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["person-block"]["button"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["person-block"]["button"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};


// person-block.jade:person-block compiled template
templatizer["person-block"]["person-block"] = function tmpl_person_block_person_block(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="person-block"><div class="person-block-portrait"><span' + jade.attr("style", "background-image: url(" + data.image + ");", true, false) + '></span></div><div class="person-block-content"><h3 class="person-block-title"><a' + jade.attr("href", data.href, true, false) + ">" + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</a></h3><div class="person-block-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + '</div></div><div class="person-block-button">');
    var button = JSON.parse(JSON.stringify(data.button));
    button.href = data.href;
    button.icon = "arrow-right";
    button.modifiers = [ "action" ];
    buf.push(templatizer["person-block"]["button"](button));
    buf.push("</div></div>");
    return buf.join("");
};

// poll.jade compiled template
templatizer["poll"] = function tmpl_poll(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// poll.jade:button compiled template
templatizer["poll"]["button"] = function tmpl_poll_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// poll.jade:icon-switch compiled template
templatizer["poll"]["icon-switch"] = function tmpl_poll_icon_switch(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    if (data.action.type) {
        modifiers.push("icon-switch-" + data.action.type);
    }
    if (data.active === true) {
        modifiers.push("active");
    }
    buf.push("<div" + jade.attr("data-action", data.action.type, true, false) + jade.attr("data-action-id", data.action.id, true, false) + jade.attr("data-action-fallback-link", data.action.fallback_link, true, false) + jade.cls([ "icon-switch", modifiers ], [ null, true ]) + "><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[0], true, false) + ' type="button" class="icon-switch-on"><span' + jade.cls([ "icon", "icon-" + data.icon[0] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[0]) ? "" : jade_interp) + "</span></button><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[1], true, false) + ' type="button" class="icon-switch-off"><span' + jade.cls([ "icon", "icon-" + data.icon[1] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[1]) ? "" : jade_interp) + "</span></button></div>");
    return buf.join("");
};


// poll.jade:button compiled template
templatizer["poll"]["button"] = function tmpl_poll_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// poll.jade:search-field compiled template
templatizer["poll"]["search-field"] = function tmpl_poll_search_field(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    if (data.around) {
        modifiers.push("with-around");
    }
    buf.push("<form" + jade.attr("action", data.action, true, false) + jade.attr("method", data.method ? data.method : "get", true, false) + ' autocomplete="off"' + jade.cls([ "search-field", modifiers ], [ null, true ]) + "><input" + jade.attr("id", data.input.id, true, false) + ' type="text" name="search"' + jade.attr("placeholder", data.input.placeholder, true, false) + jade.attr("title", data.input.placeholder, true, false) + jade.attr("value", data.input.value, true, false) + ' class="search-field-input"/><button type="submit"' + jade.attr("title", data.submit.title, true, false) + ' class="search-field-submit">');
    if (data.submit.icon) {
        buf.push("<span>" + jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp) + '</span><i aria-hidden="true" class="icon icon-search-v2"></i>');
    } else {
        buf.push(jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp));
    }
    buf.push("</button>");
    if (data.around) {
        var around = JSON.parse(JSON.stringify(data.around));
        around.modifiers = [ "marker", "around" ];
        buf.push(templatizer["poll"]["button"](around));
    }
    buf.push("</form>");
    return buf.join("");
};


// poll.jade:poll compiled template
templatizer["poll"]["poll"] = function tmpl_poll_poll(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="poll"><div class="poll-wrapper">');
    var pause = JSON.parse(JSON.stringify(data.pause || []));
    pause.action = {
        type: "pause"
    };
    pause.icon = [ "pause", "play" ];
    buf.push(templatizer["poll"]["icon-switch"](pause));
    if (data.heading) {
        buf.push('<h2 class="poll-heading">' + jade.escape(null == (jade_interp = data.heading) ? "" : jade_interp) + "</h2>");
    }
    buf.push("<div" + jade.attr("id", data.id, true, false) + jade.attr("data-thanks", data.thanks, true, false) + ' class="poll-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</div>");
    if (data.items && data.items.length) {
        buf.push("<ul" + jade.cls([ "poll-options", data.modifiers ], [ null, true ]) + ">");
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push("<li>");
                    var button = JSON.parse(JSON.stringify(item));
                    button.modifiers = [ "action", "secondary" ];
                    button.attributes = {
                        "data-value": item.value
                    };
                    buf.push(templatizer["poll"]["button"](button));
                    buf.push("</li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push("<li>");
                    var button = JSON.parse(JSON.stringify(item));
                    button.modifiers = [ "action", "secondary" ];
                    button.attributes = {
                        "data-value": item.value
                    };
                    buf.push(templatizer["poll"]["button"](button));
                    buf.push("</li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    } else if (data.form) {
        buf.push('<form class="poll-form"><input type="text"' + jade.attr("placeholder", data.form.input.placeholder, true, false) + jade.attr("title", data.form.input.placeholder, true, false) + jade.attr("id", data.form.input.id, true, false) + jade.attr("aria-describedby", data.id, true, false) + ' class="poll-input"/>');
        var submit = JSON.parse(JSON.stringify(data.form.submit));
        submit.modifiers = [ "action", "secondary", "poll-submit" ];
        submit.attributes = {
            type: "submit"
        };
        buf.push(templatizer["poll"]["button"](submit));
        buf.push("</form>");
    }
    if (data.more) {
        buf.push('<div class="poll-more"><a' + jade.attr("href", data.more.href, true, false) + ">" + jade.escape(null == (jade_interp = data.more.text) ? "" : jade_interp) + "</a></div>");
    }
    buf.push("</div></div>");
    return buf.join("");
};

// que-faire.jade compiled template
templatizer["que-faire"] = function tmpl_que_faire(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// que-faire.jade:que-faire compiled template
templatizer["que-faire"]["que-faire"] = function tmpl_que_faire_que_faire(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="que-faire"><div' + jade.attr("style", "background-image: url(" + data.background + ");", true, false) + ' class="que-faire-wrapper"><a' + jade.attr("href", data.logo.href, true, false) + jade.attr("style", "background-image: url(" + data.logo.image + ");", true, false) + ' target="_blank" class="que-faire-logo"><span>' + jade.escape(null == (jade_interp = data.logo.alt) ? "" : jade_interp) + '</span></a><ul class="que-faire-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<li class="que-faire-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ' class="button button-que-faire"><span>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<li class="que-faire-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ' class="button button-que-faire"><span>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    if (data.more) {
        buf.push("<a" + jade.attr("href", data.more.href, true, false) + ' target="_blank" class="button button-que-faire more"><span>' + (null == (jade_interp = data.more.text) ? "" : jade_interp) + "</span></a>");
    }
    buf.push("</div></div>");
    return buf.join("");
};

// quick-access.jade compiled template
templatizer["quick-access"] = function tmpl_quick_access(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// quick-access.jade:button compiled template
templatizer["quick-access"]["button"] = function tmpl_quick_access_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// quick-access.jade:heading compiled template
templatizer["quick-access"]["heading"] = function tmpl_quick_access_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "heading", data.modifiers ], [ null, true ]) + ">");
    if (data.anchor && data.activeAnchor) {
        buf.push("<h2" + jade.attr("id", data.anchor, true, false) + ' class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    } else {
        buf.push('<h2 class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
        if (data.link) {
            buf.push('<div class="heading-links">');
            if (data.link.external) {
                buf.push('<span class="icon-dailymotion"> </span>');
            }
            buf.push("<a" + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + ">" + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};


// quick-access.jade:icon-switch compiled template
templatizer["quick-access"]["icon-switch"] = function tmpl_quick_access_icon_switch(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    if (data.action.type) {
        modifiers.push("icon-switch-" + data.action.type);
    }
    if (data.active === true) {
        modifiers.push("active");
    }
    buf.push("<div" + jade.attr("data-action", data.action.type, true, false) + jade.attr("data-action-id", data.action.id, true, false) + jade.attr("data-action-fallback-link", data.action.fallback_link, true, false) + jade.cls([ "icon-switch", modifiers ], [ null, true ]) + "><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[0], true, false) + ' type="button" class="icon-switch-on"><span' + jade.cls([ "icon", "icon-" + data.icon[0] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[0]) ? "" : jade_interp) + "</span></button><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[1], true, false) + ' type="button" class="icon-switch-off"><span' + jade.cls([ "icon", "icon-" + data.icon[1] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[1]) ? "" : jade_interp) + "</span></button></div>");
    return buf.join("");
};


// quick-access.jade:button compiled template
templatizer["quick-access"]["button"] = function tmpl_quick_access_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// quick-access.jade:notice compiled template
templatizer["quick-access"]["notice"] = function tmpl_quick_access_notice(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("id", data.id, true, false) + jade.cls([ "notice", data.modifiers ], [ null, true ]) + ">");
    if (data.closable === true) {
        buf.push('<button type="button" class="close">');
        if (data.close_label) {
            buf.push('<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.close_label) ? "" : jade_interp) + "</div>");
        }
        buf.push("</button>");
    } else if (data.closable) {
        buf.push('<div class="notice-button">');
        buf.push(templatizer["quick-access"]["button"](data.closable));
        buf.push("</div>");
    }
    buf.push('<p class="notice-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    } else if (block) {
        block && block(buf);
    } else {
        if (data.href) {
            buf.push("<a" + jade.attr("href", data.href, true, false) + ' class="notice-content-link"><span class="notice-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span>");
            if (data.text) {
                buf.push((null == (jade_interp = "&nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp;") ? "" : jade_interp) + '<span class="notice-content-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span>");
            }
            buf.push("</a>");
        } else {
            buf.push('<span class="notice-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span>");
        }
    }
    buf.push("</p></div>");
    return buf.join("");
};


// quick-access.jade:button compiled template
templatizer["quick-access"]["button"] = function tmpl_quick_access_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// quick-access.jade:search-field compiled template
templatizer["quick-access"]["search-field"] = function tmpl_quick_access_search_field(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    if (data.around) {
        modifiers.push("with-around");
    }
    buf.push("<form" + jade.attr("action", data.action, true, false) + jade.attr("method", data.method ? data.method : "get", true, false) + ' autocomplete="off"' + jade.cls([ "search-field", modifiers ], [ null, true ]) + "><input" + jade.attr("id", data.input.id, true, false) + ' type="text" name="search"' + jade.attr("placeholder", data.input.placeholder, true, false) + jade.attr("title", data.input.placeholder, true, false) + jade.attr("value", data.input.value, true, false) + ' class="search-field-input"/><button type="submit"' + jade.attr("title", data.submit.title, true, false) + ' class="search-field-submit">');
    if (data.submit.icon) {
        buf.push("<span>" + jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp) + '</span><i aria-hidden="true" class="icon icon-search-v2"></i>');
    } else {
        buf.push(jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp));
    }
    buf.push("</button>");
    if (data.around) {
        var around = JSON.parse(JSON.stringify(data.around));
        around.modifiers = [ "marker", "around" ];
        buf.push(templatizer["quick-access"]["button"](around));
    }
    buf.push("</form>");
    return buf.join("");
};


// quick-access.jade:quick-access compiled template
templatizer["quick-access"]["quick-access"] = function tmpl_quick_access_quick_access(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("id", data.id, true, false) + jade.cls([ "quick-access", data.modifiers ], [ null, true ]) + ">");
    if (data.background) {
        if (data.background.image) {
            buf.push("<div" + jade.attr("style", "background-image: url(" + data.background.image + ");", true, false) + ' class="quick-access-background"></div>');
        }
        if (data.background.video) {
            buf.push('<video autoplay="autoplay" loop="loop" muted="muted"' + jade.attr("poster", data.background.image, true, false) + ' class="quick-access-video">');
            (function() {
                var $$obj = data.background.video.sources;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var source = $$obj[$index];
                        buf.push("<source" + jade.attrs(jade.merge([ source ]), false) + "/>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var source = $$obj[$index];
                        buf.push("<source" + jade.attrs(jade.merge([ source ]), false) + "/>");
                    }
                }
            }).call(this);
            buf.push("</video>");
            var pause = JSON.parse(JSON.stringify(data.background.video.pause || []));
            pause.action = {
                type: "pause"
            };
            pause.icon = [ "pause", "play" ];
            buf.push(templatizer["quick-access"]["icon-switch"](pause));
        }
    }
    buf.push('<div class="quick-access-wrapper layout-wrapper"><div role="search" class="quick-access-search">');
    buf.push(templatizer["quick-access"]["search-field"](data.search));
    buf.push("</div>");
    if (data.heading) {
        buf.push(templatizer["quick-access"]["heading"](data.heading));
    }
    if (data.items && data.items.length) {
        buf.push('<ul class="quick-access-buttons">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push("<li>");
                    var button = JSON.parse(JSON.stringify(item));
                    button.modifiers = button.modifiers || [];
                    if (button.modifiers.indexOf("primary") === -1) button.modifiers.push("secondary");
                    buf.push(templatizer["quick-access"]["button"](button));
                    buf.push("</li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push("<li>");
                    var button = JSON.parse(JSON.stringify(item));
                    button.modifiers = button.modifiers || [];
                    if (button.modifiers.indexOf("primary") === -1) button.modifiers.push("secondary");
                    buf.push(templatizer["quick-access"]["button"](button));
                    buf.push("</li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push('<div class="quick-access-results"><ul></ul>');
    var button = JSON.parse(JSON.stringify(data.results.button));
    button.modifiers = [ "action", "primary", "quick-access-results-more" ];
    buf.push(templatizer["quick-access"]["button"](button));
    buf.push('</div></div><button type="button" class="quick-access-close-search">');
    if (data.search.close_label) {
        buf.push('<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.search.close_label) ? "" : jade_interp) + "</div>");
    }
    buf.push("</button>");
    if (data.notice) {
        buf.push(templatizer["quick-access"]["notice"](data.notice));
    }
    buf.push("</div>");
    return buf.join("");
};

// rheader.jade compiled template
templatizer["rheader"] = function tmpl_rheader(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// rheader.jade:button compiled template
templatizer["rheader"]["button"] = function tmpl_rheader_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// rheader.jade:heading compiled template
templatizer["rheader"]["heading"] = function tmpl_rheader_heading(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "heading", data.modifiers ], [ null, true ]) + ">");
    if (data.anchor && data.activeAnchor) {
        buf.push("<h2" + jade.attr("id", data.anchor, true, false) + ' class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    } else {
        buf.push('<h2 class="heading-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
        if (data.link) {
            buf.push('<div class="heading-links">');
            if (data.link.external) {
                buf.push('<span class="icon-dailymotion"> </span>');
            }
            buf.push("<a" + jade.attr("href", data.link.href, true, false) + jade.attr("onclick", data.link.onclick, true, false) + ">" + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</a></div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};


// rheader.jade:icon-switch compiled template
templatizer["rheader"]["icon-switch"] = function tmpl_rheader_icon_switch(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    if (data.action.type) {
        modifiers.push("icon-switch-" + data.action.type);
    }
    if (data.active === true) {
        modifiers.push("active");
    }
    buf.push("<div" + jade.attr("data-action", data.action.type, true, false) + jade.attr("data-action-id", data.action.id, true, false) + jade.attr("data-action-fallback-link", data.action.fallback_link, true, false) + jade.cls([ "icon-switch", modifiers ], [ null, true ]) + "><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[0], true, false) + ' type="button" class="icon-switch-on"><span' + jade.cls([ "icon", "icon-" + data.icon[0] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[0]) ? "" : jade_interp) + "</span></button><button" + jade.attr("data-href", data.href, true, false) + jade.attr("title", data.label[1], true, false) + ' type="button" class="icon-switch-off"><span' + jade.cls([ "icon", "icon-" + data.icon[1] + "" ], [ null, true ]) + '></span><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.label[1]) ? "" : jade_interp) + "</span></button></div>");
    return buf.join("");
};


// rheader.jade:button compiled template
templatizer["rheader"]["button"] = function tmpl_rheader_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// rheader.jade:notice compiled template
templatizer["rheader"]["notice"] = function tmpl_rheader_notice(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("id", data.id, true, false) + jade.cls([ "notice", data.modifiers ], [ null, true ]) + ">");
    if (data.closable === true) {
        buf.push('<button type="button" class="close">');
        if (data.close_label) {
            buf.push('<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.close_label) ? "" : jade_interp) + "</div>");
        }
        buf.push("</button>");
    } else if (data.closable) {
        buf.push('<div class="notice-button">');
        buf.push(templatizer["rheader"]["button"](data.closable));
        buf.push("</div>");
    }
    buf.push('<p class="notice-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    } else if (block) {
        block && block(buf);
    } else {
        if (data.href) {
            buf.push("<a" + jade.attr("href", data.href, true, false) + ' class="notice-content-link"><span class="notice-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span>");
            if (data.text) {
                buf.push((null == (jade_interp = "&nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp;") ? "" : jade_interp) + '<span class="notice-content-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span>");
            }
            buf.push("</a>");
        } else {
            buf.push('<span class="notice-content-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</span>");
        }
    }
    buf.push("</p></div>");
    return buf.join("");
};


// rheader.jade:button compiled template
templatizer["rheader"]["button"] = function tmpl_rheader_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// rheader.jade:search-field compiled template
templatizer["rheader"]["search-field"] = function tmpl_rheader_search_field(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    if (data.around) {
        modifiers.push("with-around");
    }
    buf.push("<form" + jade.attr("action", data.action, true, false) + jade.attr("method", data.method ? data.method : "get", true, false) + ' autocomplete="off"' + jade.cls([ "search-field", modifiers ], [ null, true ]) + "><input" + jade.attr("id", data.input.id, true, false) + ' type="text" name="search"' + jade.attr("placeholder", data.input.placeholder, true, false) + jade.attr("title", data.input.placeholder, true, false) + jade.attr("value", data.input.value, true, false) + ' class="search-field-input"/><button type="submit"' + jade.attr("title", data.submit.title, true, false) + ' class="search-field-submit">');
    if (data.submit.icon) {
        buf.push("<span>" + jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp) + '</span><i aria-hidden="true" class="icon icon-search-v2"></i>');
    } else {
        buf.push(jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp));
    }
    buf.push("</button>");
    if (data.around) {
        var around = JSON.parse(JSON.stringify(data.around));
        around.modifiers = [ "marker", "around" ];
        buf.push(templatizer["rheader"]["button"](around));
    }
    buf.push("</form>");
    return buf.join("");
};


// rheader.jade:quick-access compiled template
templatizer["rheader"]["quick-access"] = function tmpl_rheader_quick_access(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("id", data.id, true, false) + jade.cls([ "quick-access", data.modifiers ], [ null, true ]) + ">");
    if (data.background) {
        if (data.background.image) {
            buf.push("<div" + jade.attr("style", "background-image: url(" + data.background.image + ");", true, false) + ' class="quick-access-background"></div>');
        }
        if (data.background.video) {
            buf.push('<video autoplay="autoplay" loop="loop" muted="muted"' + jade.attr("poster", data.background.image, true, false) + ' class="quick-access-video">');
            (function() {
                var $$obj = data.background.video.sources;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var source = $$obj[$index];
                        buf.push("<source" + jade.attrs(jade.merge([ source ]), false) + "/>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var source = $$obj[$index];
                        buf.push("<source" + jade.attrs(jade.merge([ source ]), false) + "/>");
                    }
                }
            }).call(this);
            buf.push("</video>");
            var pause = JSON.parse(JSON.stringify(data.background.video.pause || []));
            pause.action = {
                type: "pause"
            };
            pause.icon = [ "pause", "play" ];
            buf.push(templatizer["rheader"]["icon-switch"](pause));
        }
    }
    buf.push('<div class="quick-access-wrapper layout-wrapper"><div role="search" class="quick-access-search">');
    buf.push(templatizer["rheader"]["search-field"](data.search));
    buf.push("</div>");
    if (data.heading) {
        buf.push(templatizer["rheader"]["heading"](data.heading));
    }
    if (data.items && data.items.length) {
        buf.push('<ul class="quick-access-buttons">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push("<li>");
                    var button = JSON.parse(JSON.stringify(item));
                    button.modifiers = button.modifiers || [];
                    if (button.modifiers.indexOf("primary") === -1) button.modifiers.push("secondary");
                    buf.push(templatizer["rheader"]["button"](button));
                    buf.push("</li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push("<li>");
                    var button = JSON.parse(JSON.stringify(item));
                    button.modifiers = button.modifiers || [];
                    if (button.modifiers.indexOf("primary") === -1) button.modifiers.push("secondary");
                    buf.push(templatizer["rheader"]["button"](button));
                    buf.push("</li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push('<div class="quick-access-results"><ul></ul>');
    var button = JSON.parse(JSON.stringify(data.results.button));
    button.modifiers = [ "action", "primary", "quick-access-results-more" ];
    buf.push(templatizer["rheader"]["button"](button));
    buf.push('</div></div><button type="button" class="quick-access-close-search">');
    if (data.search.close_label) {
        buf.push('<div class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.search.close_label) ? "" : jade_interp) + "</div>");
    }
    buf.push("</button>");
    if (data.notice) {
        buf.push(templatizer["rheader"]["notice"](data.notice));
    }
    buf.push("</div>");
    return buf.join("");
};


// rheader.jade:rheader compiled template
templatizer["rheader"]["rheader"] = function tmpl_rheader_rheader(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<header role="banner"' + jade.cls([ "rheader", data.modifiers ], [ null, true ]) + ">");
    var search = data.buttons.search;
    var around = data.buttons.around;
    var menu = data.buttons.menu;
    buf.push('<div class="rheader-wrapper"><a id="logo"' + jade.attr("href", data.logo.href, true, false) + jade.attr("title", data.logo.title, true, false) + ' class="rheader-logo">');
    if (data.logo.h1) {
        buf.push('<h1 class="rheader-logo-paris">' + jade.escape(null == (jade_interp = data.logo.text) ? "" : jade_interp) + "</h1>");
    } else {
        buf.push('<div class="rheader-logo-paris">' + jade.escape(null == (jade_interp = data.logo.text) ? "" : jade_interp) + "</div>");
    }
    buf.push("</a>");
    if (data.locales) {
        buf.push('<ul class="rheader-locales">');
        (function() {
            var $$obj = data.locales;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var locale = $$obj[$index];
                    buf.push("<li><a" + jade.attr("href", locale.href, true, false) + jade.attr("lang", locale.lang, true, false) + jade.attr("title", locale.text, true, false) + jade.attr("target", locale.target, true, false) + jade.cls([ locale.current ? "current" : null ], [ true ]) + ">");
                    if (locale.current) {
                        buf.push("<strong>" + jade.escape(null == (jade_interp = locale.lang) ? "" : jade_interp) + "</strong>");
                    } else {
                        buf.push(jade.escape(null == (jade_interp = locale.lang) ? "" : jade_interp));
                    }
                    buf.push("</a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var locale = $$obj[$index];
                    buf.push("<li><a" + jade.attr("href", locale.href, true, false) + jade.attr("lang", locale.lang, true, false) + jade.attr("title", locale.text, true, false) + jade.attr("target", locale.target, true, false) + jade.cls([ locale.current ? "current" : null ], [ true ]) + ">");
                    if (locale.current) {
                        buf.push("<strong>" + jade.escape(null == (jade_interp = locale.lang) ? "" : jade_interp) + "</strong>");
                    } else {
                        buf.push(jade.escape(null == (jade_interp = locale.lang) ? "" : jade_interp));
                    }
                    buf.push("</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    if (search) {
        buf.push("<a" + jade.attr("href", search.href, true, false) + jade.attr("title", search.text, true, false) + jade.attr("target", search.target, true, false) + ' aria-controls="rheader-search" role="button"' + jade.cls([ "rheader-button", "rheader-button-search", search.current ? "active" : null ], [ null, null, true ]) + ">");
        if (search.icon) {
            buf.push("<i" + jade.cls([ "rheader-button-icon", "icon-" + search.icon + "" ], [ null, true ]) + ">     </i>");
        }
        buf.push("</a>");
    }
    if (around) {
        buf.push("<a" + jade.attr("href", around.href, true, false) + jade.attr("title", around.text, true, false) + jade.attr("target", around.target, true, false) + ' role="button"' + jade.cls([ "rheader-button", "rheader-button-around", around.current ? "active" : null ], [ null, null, true ]) + ">");
        if (around.icon) {
            buf.push("<i" + jade.cls([ "rheader-button-icon", "icon-" + around.icon + "" ], [ null, true ]) + '></i><span class="rheader-button-text">' + jade.escape(null == (jade_interp = around.text) ? "" : jade_interp) + "</span>");
        }
        buf.push("</a>");
    }
    buf.push('<a id="nav-toggle"' + jade.attr("href", menu.href, true, false) + jade.attr("target", menu.target, true, false) + ' rel="nofollow" role="button" class="rheader-button rheader-button-menu"><span class="rheader-button-text">' + jade.escape(null == (jade_interp = menu.text) ? "" : jade_interp) + '</span></a><nav id="navigation"' + jade.attr("aria-label", data.navigation_label, true, false) + ' tabindex="-1" role="navigation" class="rheader-nav"><ul>');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                var tag = item.current ? "strong" : "span";
                buf.push("<li" + jade.cls([ "rheader-nav-item", item.modifiers, item.current ? "current" : null ], [ null, true, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("aria-label", item.hover ? item.text + " " + item.hover : null, true, false) + ">");
                if (item.icon) {
                    buf.push('<i aria-hidden="true"' + jade.cls([ "rheader-nav-item-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                }
                if (item.hover) {
                    buf.push("<" + tag + ' class="rheader-nav-item-front"><span class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></" + tag + "><" + tag + ' class="rheader-nav-item-back"><span class="rheader-nav-item-hover">' + jade.escape(null == (jade_interp = item.hover) ? "" : jade_interp) + "</span></" + tag + ">");
                } else {
                    buf.push("<" + tag + ' class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</" + tag + ">");
                }
                buf.push("</a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                var tag = item.current ? "strong" : "span";
                buf.push("<li" + jade.cls([ "rheader-nav-item", item.modifiers, item.current ? "current" : null ], [ null, true, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("aria-label", item.hover ? item.text + " " + item.hover : null, true, false) + ">");
                if (item.icon) {
                    buf.push('<i aria-hidden="true"' + jade.cls([ "rheader-nav-item-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                }
                if (item.hover) {
                    buf.push("<" + tag + ' class="rheader-nav-item-front"><span class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></" + tag + "><" + tag + ' class="rheader-nav-item-back"><span class="rheader-nav-item-hover">' + jade.escape(null == (jade_interp = item.hover) ? "" : jade_interp) + "</span></" + tag + ">");
                } else {
                    buf.push("<" + tag + ' class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</" + tag + ">");
                }
                buf.push("</a></li>");
            }
        }
    }).call(this);
    buf.push("</ul></nav></div>");
    if (data.modifiers && data.modifiers.indexOf("standalone") !== -1) {
        buf.push(templatizer["rheader"]["rheader-mobile-nav"](data));
    }
    buf.push("</header>");
    if (data.quick_access) {
        var quick_access = JSON.parse(JSON.stringify(data.quick_access));
        quick_access.id = "rheader-search";
        buf.push(templatizer["rheader"]["quick-access"](quick_access));
    }
    return buf.join("");
};


// rheader.jade:rheader-mobile-nav compiled template
templatizer["rheader"]["rheader-mobile-nav"] = function tmpl_rheader_rheader_mobile_nav(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div id="rheader-mobile-nav" class="rheader-mobile-nav">');
    var around = data.buttons.around;
    if (data.locales) {
        buf.push('<ul class="rheader-locales">');
        (function() {
            var $$obj = data.locales;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var locale = $$obj[$index];
                    buf.push("<li><a" + jade.attr("href", locale.href, true, false) + jade.attr("target", locale.target, true, false) + jade.cls([ locale.current ? "current" : null ], [ true ]) + ">" + jade.escape(null == (jade_interp = locale.text) ? "" : jade_interp) + "</a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var locale = $$obj[$index];
                    buf.push("<li><a" + jade.attr("href", locale.href, true, false) + jade.attr("target", locale.target, true, false) + jade.cls([ locale.current ? "current" : null ], [ true ]) + ">" + jade.escape(null == (jade_interp = locale.text) ? "" : jade_interp) + "</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push('<ul class="rheader-nav">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                if (item.modifiers && item.modifiers.indexOf("account") !== -1 && around) {
                    buf.push('<li class="rheader-nav-item around"><a' + jade.attr("href", around.href, true, false) + jade.attr("title", around.text, true, false) + jade.attr("target", around.target, true, false) + ' class="rheader-button rheader-button-around">');
                    if (around.icon) {
                        buf.push("<i" + jade.cls([ "rheader-button-icon", "icon-" + around.icon + "" ], [ null, true ]) + '></i><span class="rheader-button-text">' + jade.escape(null == (jade_interp = around.text) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</a></li>");
                }
                buf.push("<li" + jade.cls([ "rheader-nav-item", item.modifiers, item.current ? "current" : null ], [ null, true, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ">");
                if (item.icon) {
                    buf.push("<i" + jade.cls([ "rheader-nav-item-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                }
                if (item.hover) {
                    buf.push('<span class="rheader-nav-item-front"><span class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</span></span><span class="rheader-nav-item-back"><span class="rheader-nav-item-hover">' + jade.escape(null == (jade_interp = item.hover) ? "" : jade_interp) + "</span></span>");
                } else {
                    buf.push('<span class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span>");
                }
                buf.push("</a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                if (item.modifiers && item.modifiers.indexOf("account") !== -1 && around) {
                    buf.push('<li class="rheader-nav-item around"><a' + jade.attr("href", around.href, true, false) + jade.attr("title", around.text, true, false) + jade.attr("target", around.target, true, false) + ' class="rheader-button rheader-button-around">');
                    if (around.icon) {
                        buf.push("<i" + jade.cls([ "rheader-button-icon", "icon-" + around.icon + "" ], [ null, true ]) + '></i><span class="rheader-button-text">' + jade.escape(null == (jade_interp = around.text) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</a></li>");
                }
                buf.push("<li" + jade.cls([ "rheader-nav-item", item.modifiers, item.current ? "current" : null ], [ null, true, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ">");
                if (item.icon) {
                    buf.push("<i" + jade.cls([ "rheader-nav-item-icon", "icon-" + item.icon + "" ], [ null, true ]) + "></i>");
                }
                if (item.hover) {
                    buf.push('<span class="rheader-nav-item-front"><span class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</span></span><span class="rheader-nav-item-back"><span class="rheader-nav-item-hover">' + jade.escape(null == (jade_interp = item.hover) ? "" : jade_interp) + "</span></span>");
                } else {
                    buf.push('<span class="rheader-nav-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span>");
                }
                buf.push("</a></li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};

// search-field.jade compiled template
templatizer["search-field"] = function tmpl_search_field(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// search-field.jade:button compiled template
templatizer["search-field"]["button"] = function tmpl_search_field_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// search-field.jade:search-field compiled template
templatizer["search-field"]["search-field"] = function tmpl_search_field_search_field(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = JSON.parse(JSON.stringify(data.modifiers || []));
    if (data.around) {
        modifiers.push("with-around");
    }
    buf.push("<form" + jade.attr("action", data.action, true, false) + jade.attr("method", data.method ? data.method : "get", true, false) + ' autocomplete="off"' + jade.cls([ "search-field", modifiers ], [ null, true ]) + "><input" + jade.attr("id", data.input.id, true, false) + ' type="text" name="search"' + jade.attr("placeholder", data.input.placeholder, true, false) + jade.attr("title", data.input.placeholder, true, false) + jade.attr("value", data.input.value, true, false) + ' class="search-field-input"/><button type="submit"' + jade.attr("title", data.submit.title, true, false) + ' class="search-field-submit">');
    if (data.submit.icon) {
        buf.push("<span>" + jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp) + '</span><i aria-hidden="true" class="icon icon-search-v2"></i>');
    } else {
        buf.push(jade.escape(null == (jade_interp = data.submit.text) ? "" : jade_interp));
    }
    buf.push("</button>");
    if (data.around) {
        var around = JSON.parse(JSON.stringify(data.around));
        around.modifiers = [ "marker", "around" ];
        buf.push(templatizer["search-field"]["button"](around));
    }
    buf.push("</form>");
    return buf.join("");
};

// search-modal.jade compiled template
templatizer["search-modal"] = function tmpl_search_modal(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// search-modal.jade:button compiled template
templatizer["search-modal"]["button"] = function tmpl_search_modal_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// search-modal.jade:search-modal compiled template
templatizer["search-modal"]["search-modal"] = function tmpl_search_modal_search_modal(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="search-modal"><div class="search-modal-background"></div><div class="search-modal-content"><div class="search-modal-header"><input type="text" name="search-filters" placeholder="Rechercher un filtre..." class="js-input-search-modal"/></div><div id="js-popup-refinementlist" class="search-modal-list"></div><div class="search-modal-footer">');
    buf.push(templatizer["search-modal"]["button"]({
        text: "Valider",
        modifiers: [ "secondary", "action", "js-confirm-search-modal" ]
    }));
    buf.push("</div></div></div>");
    return buf.join("");
};

// search-push.jade compiled template
templatizer["search-push"] = function tmpl_search_push(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// search-push.jade:button compiled template
templatizer["search-push"]["button"] = function tmpl_search_push_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// search-push.jade:search-push compiled template
templatizer["search-push"]["search-push"] = function tmpl_search_push_search_push(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="search-push"><h2 class="search-push-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
    var button = JSON.parse(JSON.stringify(data.button));
    button.modifiers = [ "action" ];
    button.attributes = {
        "data-action": "open-search",
        "aria-controls": "rheader-search"
    };
    buf.push(templatizer["search-push"]["button"](button));
    buf.push("</div>");
    return buf.join("");
};

// search-results-list.jade compiled template
templatizer["search-results-list"] = function tmpl_search_results_list(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// search-results-list.jade:button compiled template
templatizer["search-results-list"]["button"] = function tmpl_search_results_list_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// search-results-list.jade:search-results-list compiled template
templatizer["search-results-list"]["search-results-list"] = function tmpl_search_results_list_search_results_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="search-results-list">');
    if (data.title) {
        buf.push("<h1>" + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h1>");
    } else if (data.page) {
        buf.push('<div class="search-results-list-page"><span>' + jade.escape(null == (jade_interp = data.page) ? "" : jade_interp) + "</span></div>");
    }
    if (data.items && data.items.length) {
        buf.push('<ul class="search-results-list-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push("<li" + jade.cls([ "search-results-list-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + ">" + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</a>");
                    if (item.anchors && item.anchors.length) {
                        buf.push('<ul class="search-results-list-anchors">');
                        (function() {
                            var $$obj = item.anchors;
                            if ("number" == typeof $$obj.length) {
                                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                    var anchor = $$obj[$index];
                                    buf.push('<li class="search-results-list-anchor"><a' + jade.attr("href", anchor.href, true, false) + ">" + jade.escape(null == (jade_interp = anchor.text) ? "" : jade_interp) + "</a></li>");
                                }
                            } else {
                                var $$l = 0;
                                for (var $index in $$obj) {
                                    $$l++;
                                    var anchor = $$obj[$index];
                                    buf.push('<li class="search-results-list-anchor"><a' + jade.attr("href", anchor.href, true, false) + ">" + jade.escape(null == (jade_interp = anchor.text) ? "" : jade_interp) + "</a></li>");
                                }
                            }
                        }).call(this);
                        buf.push("</ul>");
                    }
                    if (item.text) {
                        buf.push('<div class="search-results-list-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push("<li" + jade.cls([ "search-results-list-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + ">" + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</a>");
                    if (item.anchors && item.anchors.length) {
                        buf.push('<ul class="search-results-list-anchors">');
                        (function() {
                            var $$obj = item.anchors;
                            if ("number" == typeof $$obj.length) {
                                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                    var anchor = $$obj[$index];
                                    buf.push('<li class="search-results-list-anchor"><a' + jade.attr("href", anchor.href, true, false) + ">" + jade.escape(null == (jade_interp = anchor.text) ? "" : jade_interp) + "</a></li>");
                                }
                            } else {
                                var $$l = 0;
                                for (var $index in $$obj) {
                                    $$l++;
                                    var anchor = $$obj[$index];
                                    buf.push('<li class="search-results-list-anchor"><a' + jade.attr("href", anchor.href, true, false) + ">" + jade.escape(null == (jade_interp = anchor.text) ? "" : jade_interp) + "</a></li>");
                                }
                            }
                        }).call(this);
                        buf.push("</ul>");
                    }
                    if (item.text) {
                        buf.push('<div class="search-results-list-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div>");
                    }
                    buf.push("</li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
        if (data.more) {
            buf.push('<div class="search-results-list-more">');
            var more = JSON.parse(JSON.stringify(data.more));
            more.modifiers = [ "wide" ];
            more.attributes = {
                "data-page": more.page
            };
            buf.push(templatizer["search-results-list"]["button"](more));
            buf.push("</div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};

// content.jade compiled template
templatizer["content"] = function tmpl_content(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, current_item, data) {
        buf.push(templatizer["content"]["sections-panel-content"](data));
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "current_item" in locals_for_with ? locals_for_with.current_item : typeof current_item !== "undefined" ? current_item : undefined, "data" in locals_for_with ? locals_for_with.data : typeof data !== "undefined" ? data : undefined);
    return buf.join("");
};

// content.jade:button compiled template
templatizer["content"]["button"] = function tmpl_content_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// content.jade:block-aside compiled template
templatizer["content"]["block-aside"] = function tmpl_content_block_aside(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-aside", data.modifiers ], [ null, true ]) + ">");
    if (data.title) {
        buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-aside-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<div class="block-aside-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// content.jade:block-aside-links compiled template
templatizer["content"]["block-aside-links"] = function tmpl_content_block_aside_links(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    modifiers.push("block-aside-links");
    buf.push(templatizer["content"]["block-aside"].call({
        block: function(buf) {
            buf.push('<ul class="block-aside-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
    }, {
        title: data.title,
        modifiers: modifiers
    }));
    return buf.join("");
};


// content.jade:button compiled template
templatizer["content"]["button"] = function tmpl_content_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// content.jade:buttons compiled template
templatizer["content"]["buttons"] = function tmpl_content_buttons(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-buttons", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        var title_tag = data.title_tag || "h2";
        buf.push("<" + title_tag + ' class="buttons-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + title_tag + ">");
    }
    buf.push("<ul" + jade.cls([ "buttons-items", data.activeCenter ], [ null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["content"]["button"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["content"]["button"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};


// content.jade:links compiled template
templatizer["content"]["links"] = function tmpl_content_links(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-links", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        var title_tag = data.title_tag || "h2";
        buf.push("<" + title_tag + ' class="links-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + title_tag + ">");
    }
    buf.push('<ul class="links-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                if (item.target && item.target === "_blank" || item.filetype || item.filesize) {
                    buf.push('<span class="links-item-attributes">');
                    if (item.target && item.target === "_blank") {
                        buf.push('<span class="links-item-target">' + jade.escape(null == (jade_interp = item.target_text || "nouvelle fenêtre") ? "" : jade_interp) + "</span>");
                    }
                    if (item.filetype) {
                        buf.push('<span class="links-item-filetype">' + jade.escape(null == (jade_interp = item.filetype) ? "" : jade_interp) + "</span>");
                    }
                    if (item.filesize) {
                        buf.push('<span class="links-item-filesize">' + jade.escape(null == (jade_interp = item.filesize) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</span>");
                }
                buf.push("</a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                if (item.target && item.target === "_blank" || item.filetype || item.filesize) {
                    buf.push('<span class="links-item-attributes">');
                    if (item.target && item.target === "_blank") {
                        buf.push('<span class="links-item-target">' + jade.escape(null == (jade_interp = item.target_text || "nouvelle fenêtre") ? "" : jade_interp) + "</span>");
                    }
                    if (item.filetype) {
                        buf.push('<span class="links-item-filetype">' + jade.escape(null == (jade_interp = item.filetype) ? "" : jade_interp) + "</span>");
                    }
                    if (item.filesize) {
                        buf.push('<span class="links-item-filesize">' + jade.escape(null == (jade_interp = item.filesize) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</span>");
                }
                buf.push("</a></li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};


// content.jade:sections-panel compiled template
templatizer["content"]["sections-panel"] = function tmpl_content_sections_panel(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var has_current_item = false;
    var has_content = typeof data.content !== "undefined";
    (function() {
        var $$obj = data.nav.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                if (item.current === true) {
                    current_item = item;
                    has_current_item = true;
                }
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                if (item.current === true) {
                    current_item = item;
                    has_current_item = true;
                }
            }
        }
    }).call(this);
    buf.push("<div" + jade.cls([ "sections-panel", has_content ? "has-content" : "" ], [ null, true ]) + ">");
    if (data.nav) {
        var nav_classes = [];
        if (has_current_item) {
            nav_classes.push("has-current-item");
        }
        if (has_content) {
            nav_classes.push("closed");
        }
        buf.push("<div" + jade.cls([ "sections-panel-nav", nav_classes ], [ null, true ]) + ">");
        if (data.nav.items && data.nav.items.length) {
            buf.push('<ul class="sections-panel-nav-items">');
            (function() {
                var $$obj = data.nav.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="sections-panel-nav-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("data-subnav-section", item.slug, true, false) + jade.attr("data-background", item.background, true, false) + jade.attr("data-page-title", item.pageTitle, true, false) + jade.attr("aria-expanded", item.current ? "true" : "false", true, false) + jade.attr("aria-controls", "subnav-" + item.slug + "", true, false) + jade.attr("aria-owns", "subnav-" + item.slug + "", true, false) + ' role="button"' + jade.cls([ item.current ? "current" : "" ], [ true ]) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="sections-panel-nav-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("data-subnav-section", item.slug, true, false) + jade.attr("data-background", item.background, true, false) + jade.attr("data-page-title", item.pageTitle, true, false) + jade.attr("aria-expanded", item.current ? "true" : "false", true, false) + jade.attr("aria-controls", "subnav-" + item.slug + "", true, false) + jade.attr("aria-owns", "subnav-" + item.slug + "", true, false) + ' role="button"' + jade.cls([ item.current ? "current" : "" ], [ true ]) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
        if (data.nav.more) {
            var more = JSON.parse(JSON.stringify(data.nav.more));
            more.modifiers = [ "action", "secondary", "small", "sections-panel-nav-more" ];
            buf.push(templatizer["content"]["button"](more));
        }
        buf.push('</div><div id="sections-panel-subnav"' + jade.cls([ "sections-panel-subnav", has_current_item ? "has-current-item" : "" ], [ null, true ]) + "><div" + jade.attr("data-background", data.default.background, true, false) + ' class="sections-panel-subnav-default">');
        if (data.default.links) {
            buf.push(templatizer["content"]["block-aside-links"](data.default.links));
        }
        if (data.default.buttons) {
            buf.push(templatizer["content"]["buttons"](data.default.buttons));
        }
        buf.push("</div>");
        (function() {
            var $$obj = data.nav.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push("<div" + jade.attr("id", "subnav-" + item.slug + "", true, false) + jade.attr("data-nav-item", item.slug, true, false) + jade.cls([ "sections-panel-subnav-section", item.current ? "current" : "" ], [ null, true ]) + '><h2 class="sections-panel-subnav-title hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</h2>");
                    if (item.subnav && item.subnav.items && item.subnav.items.length) {
                        if (item.subnav.accessibility_text) {
                            buf.push('<p class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.subnav.accessibility_text) ? "" : jade_interp) + "</p>");
                        }
                        if (item.subnav.text) {
                            buf.push('<p class="sections-panel-intro">' + jade.escape(null == (jade_interp = item.subnav.text) ? "" : jade_interp) + "</p>");
                        }
                        buf.push('<ul class="sections-panel-subnav-items">');
                        (function() {
                            var $$obj = item.subnav.items;
                            if ("number" == typeof $$obj.length) {
                                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            } else {
                                var $$l = 0;
                                for (var $index in $$obj) {
                                    $$l++;
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            }
                        }).call(this);
                        buf.push("</ul>");
                    }
                    buf.push("</div>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push("<div" + jade.attr("id", "subnav-" + item.slug + "", true, false) + jade.attr("data-nav-item", item.slug, true, false) + jade.cls([ "sections-panel-subnav-section", item.current ? "current" : "" ], [ null, true ]) + '><h2 class="sections-panel-subnav-title hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</h2>");
                    if (item.subnav && item.subnav.items && item.subnav.items.length) {
                        if (item.subnav.accessibility_text) {
                            buf.push('<p class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.subnav.accessibility_text) ? "" : jade_interp) + "</p>");
                        }
                        if (item.subnav.text) {
                            buf.push('<p class="sections-panel-intro">' + jade.escape(null == (jade_interp = item.subnav.text) ? "" : jade_interp) + "</p>");
                        }
                        buf.push('<ul class="sections-panel-subnav-items">');
                        (function() {
                            var $$obj = item.subnav.items;
                            if ("number" == typeof $$obj.length) {
                                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            } else {
                                var $$l = 0;
                                for (var $index in $$obj) {
                                    $$l++;
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            }
                        }).call(this);
                        buf.push("</ul>");
                    }
                    buf.push("</div>");
                }
            }
        }).call(this);
        buf.push("<a" + jade.attr("href", data.base, true, false) + ' role="button" class="sections-panel-back sections-panel-subnav-back"><span class="accessibility_label"></span></a></div>');
    }
    buf.push('<div id="sections-panel-content" class="sections-panel-content"><div class="sections-panel-content-wrapper">');
    if (has_content) {
        buf.push(templatizer["content"]["sections-panel-content"](data.content));
    }
    buf.push("</div><a" + jade.attr("href", current_item ? current_item.href : "", true, false) + ' role="button" class="sections-panel-back sections-panel-content-back"><span class="accessibility_label"></span></a></div></div>');
    return buf.join("");
};


// content.jade:sections-panel-content compiled template
templatizer["content"]["sections-panel-content"] = function tmpl_content_sections_panel_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.title) {
        buf.push('<h3 class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    if (data.accessibility_text) {
        buf.push('<p class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.accessibility_text) ? "" : jade_interp) + "</p>");
    }
    if (data.intro) {
        buf.push('<p class="sections-panel-intro">' + jade.escape(null == (jade_interp = data.intro) ? "" : jade_interp) + "</p>");
    }
    if (data.items && data.items.length) {
        buf.push('<ul class="sections-panel-content-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="sections-panel-content-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + '><div class="sections-panel-content-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '</div><div class="sections-panel-content-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="sections-panel-content-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + '><div class="sections-panel-content-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '</div><div class="sections-panel-content-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    if (data.buttons && data.buttons.items && data.buttons.items.length) {
        var buttons = JSON.parse(JSON.stringify(data.buttons));
        buttons.title_tag = "h3";
        buf.push(templatizer["content"]["buttons"](buttons));
    }
    if (data.more_links && data.more_links.items && data.more_links.items.length) {
        var more_links = JSON.parse(JSON.stringify(data.more_links));
        more_links.title_tag = "h3";
        buf.push(templatizer["content"]["links"](more_links));
    }
    return buf.join("");
};

// sections-panel.jade compiled template
templatizer["sections-panel"] = function tmpl_sections_panel(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, current_item) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "current_item" in locals_for_with ? locals_for_with.current_item : typeof current_item !== "undefined" ? current_item : undefined);
    return buf.join("");
};

// sections-panel.jade:button compiled template
templatizer["sections-panel"]["button"] = function tmpl_sections_panel_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// sections-panel.jade:block-aside compiled template
templatizer["sections-panel"]["block-aside"] = function tmpl_sections_panel_block_aside(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "block-aside", data.modifiers ], [ null, true ]) + ">");
    if (data.title) {
        buf.push("<h3" + jade.attr("id", data.title_id, true, false) + ' class="block-aside-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    buf.push('<div class="block-aside-content">');
    if (data.block) {
        buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
    }
    if (block) {
        block && block(buf);
    }
    buf.push("</div></div>");
    return buf.join("");
};


// sections-panel.jade:block-aside-links compiled template
templatizer["sections-panel"]["block-aside-links"] = function tmpl_sections_panel_block_aside_links(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var modifiers = data.modifiers || [];
    modifiers.push("block-aside-links");
    buf.push(templatizer["sections-panel"]["block-aside"].call({
        block: function(buf) {
            buf.push('<ul class="block-aside-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "block-aside-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
    }, {
        title: data.title,
        modifiers: modifiers
    }));
    return buf.join("");
};


// sections-panel.jade:button compiled template
templatizer["sections-panel"]["button"] = function tmpl_sections_panel_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// sections-panel.jade:buttons compiled template
templatizer["sections-panel"]["buttons"] = function tmpl_sections_panel_buttons(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-buttons", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        var title_tag = data.title_tag || "h2";
        buf.push("<" + title_tag + ' class="buttons-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + title_tag + ">");
    }
    buf.push("<ul" + jade.cls([ "buttons-items", data.activeCenter ], [ null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["sections-panel"]["button"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li>");
                buf.push(templatizer["sections-panel"]["button"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};


// sections-panel.jade:links compiled template
templatizer["sections-panel"]["links"] = function tmpl_sections_panel_links(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "component", "component-links", data.modifiers ], [ null, null, true ]) + ">");
    if (data.title) {
        var title_tag = data.title_tag || "h2";
        buf.push("<" + title_tag + ' class="links-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</" + title_tag + ">");
    }
    buf.push('<ul class="links-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                if (item.target && item.target === "_blank" || item.filetype || item.filesize) {
                    buf.push('<span class="links-item-attributes">');
                    if (item.target && item.target === "_blank") {
                        buf.push('<span class="links-item-target">' + jade.escape(null == (jade_interp = item.target_text || "nouvelle fenêtre") ? "" : jade_interp) + "</span>");
                    }
                    if (item.filetype) {
                        buf.push('<span class="links-item-filetype">' + jade.escape(null == (jade_interp = item.filetype) ? "" : jade_interp) + "</span>");
                    }
                    if (item.filesize) {
                        buf.push('<span class="links-item-filesize">' + jade.escape(null == (jade_interp = item.filesize) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</span>");
                }
                buf.push("</a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                if (item.target && item.target === "_blank" || item.filetype || item.filesize) {
                    buf.push('<span class="links-item-attributes">');
                    if (item.target && item.target === "_blank") {
                        buf.push('<span class="links-item-target">' + jade.escape(null == (jade_interp = item.target_text || "nouvelle fenêtre") ? "" : jade_interp) + "</span>");
                    }
                    if (item.filetype) {
                        buf.push('<span class="links-item-filetype">' + jade.escape(null == (jade_interp = item.filetype) ? "" : jade_interp) + "</span>");
                    }
                    if (item.filesize) {
                        buf.push('<span class="links-item-filesize">' + jade.escape(null == (jade_interp = item.filesize) ? "" : jade_interp) + "</span>");
                    }
                    buf.push("</span>");
                }
                buf.push("</a></li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};


// sections-panel.jade:sections-panel compiled template
templatizer["sections-panel"]["sections-panel"] = function tmpl_sections_panel_sections_panel(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var has_current_item = false;
    var has_content = typeof data.content !== "undefined";
    (function() {
        var $$obj = data.nav.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                if (item.current === true) {
                    current_item = item;
                    has_current_item = true;
                }
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                if (item.current === true) {
                    current_item = item;
                    has_current_item = true;
                }
            }
        }
    }).call(this);
    buf.push("<div" + jade.cls([ "sections-panel", has_content ? "has-content" : "" ], [ null, true ]) + ">");
    if (data.nav) {
        var nav_classes = [];
        if (has_current_item) {
            nav_classes.push("has-current-item");
        }
        if (has_content) {
            nav_classes.push("closed");
        }
        buf.push("<div" + jade.cls([ "sections-panel-nav", nav_classes ], [ null, true ]) + ">");
        if (data.nav.items && data.nav.items.length) {
            buf.push('<ul class="sections-panel-nav-items">');
            (function() {
                var $$obj = data.nav.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="sections-panel-nav-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("data-subnav-section", item.slug, true, false) + jade.attr("data-background", item.background, true, false) + jade.attr("data-page-title", item.pageTitle, true, false) + jade.attr("aria-expanded", item.current ? "true" : "false", true, false) + jade.attr("aria-controls", "subnav-" + item.slug + "", true, false) + jade.attr("aria-owns", "subnav-" + item.slug + "", true, false) + ' role="button"' + jade.cls([ item.current ? "current" : "" ], [ true ]) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="sections-panel-nav-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("data-subnav-section", item.slug, true, false) + jade.attr("data-background", item.background, true, false) + jade.attr("data-page-title", item.pageTitle, true, false) + jade.attr("aria-expanded", item.current ? "true" : "false", true, false) + jade.attr("aria-controls", "subnav-" + item.slug + "", true, false) + jade.attr("aria-owns", "subnav-" + item.slug + "", true, false) + ' role="button"' + jade.cls([ item.current ? "current" : "" ], [ true ]) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
        if (data.nav.more) {
            var more = JSON.parse(JSON.stringify(data.nav.more));
            more.modifiers = [ "action", "secondary", "small", "sections-panel-nav-more" ];
            buf.push(templatizer["sections-panel"]["button"](more));
        }
        buf.push('</div><div id="sections-panel-subnav"' + jade.cls([ "sections-panel-subnav", has_current_item ? "has-current-item" : "" ], [ null, true ]) + "><div" + jade.attr("data-background", data.default.background, true, false) + ' class="sections-panel-subnav-default">');
        if (data.default.links) {
            buf.push(templatizer["sections-panel"]["block-aside-links"](data.default.links));
        }
        if (data.default.buttons) {
            buf.push(templatizer["sections-panel"]["buttons"](data.default.buttons));
        }
        buf.push("</div>");
        (function() {
            var $$obj = data.nav.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push("<div" + jade.attr("id", "subnav-" + item.slug + "", true, false) + jade.attr("data-nav-item", item.slug, true, false) + jade.cls([ "sections-panel-subnav-section", item.current ? "current" : "" ], [ null, true ]) + '><h2 class="sections-panel-subnav-title hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</h2>");
                    if (item.subnav && item.subnav.items && item.subnav.items.length) {
                        if (item.subnav.accessibility_text) {
                            buf.push('<p class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.subnav.accessibility_text) ? "" : jade_interp) + "</p>");
                        }
                        if (item.subnav.text) {
                            buf.push('<p class="sections-panel-intro">' + jade.escape(null == (jade_interp = item.subnav.text) ? "" : jade_interp) + "</p>");
                        }
                        buf.push('<ul class="sections-panel-subnav-items">');
                        (function() {
                            var $$obj = item.subnav.items;
                            if ("number" == typeof $$obj.length) {
                                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            } else {
                                var $$l = 0;
                                for (var $index in $$obj) {
                                    $$l++;
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            }
                        }).call(this);
                        buf.push("</ul>");
                    }
                    buf.push("</div>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push("<div" + jade.attr("id", "subnav-" + item.slug + "", true, false) + jade.attr("data-nav-item", item.slug, true, false) + jade.cls([ "sections-panel-subnav-section", item.current ? "current" : "" ], [ null, true ]) + '><h2 class="sections-panel-subnav-title hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</h2>");
                    if (item.subnav && item.subnav.items && item.subnav.items.length) {
                        if (item.subnav.accessibility_text) {
                            buf.push('<p class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.subnav.accessibility_text) ? "" : jade_interp) + "</p>");
                        }
                        if (item.subnav.text) {
                            buf.push('<p class="sections-panel-intro">' + jade.escape(null == (jade_interp = item.subnav.text) ? "" : jade_interp) + "</p>");
                        }
                        buf.push('<ul class="sections-panel-subnav-items">');
                        (function() {
                            var $$obj = item.subnav.items;
                            if ("number" == typeof $$obj.length) {
                                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            } else {
                                var $$l = 0;
                                for (var $index in $$obj) {
                                    $$l++;
                                    var subitem = $$obj[$index];
                                    buf.push('<li class="sections-panel-subnav-item"><a' + jade.attr("href", subitem.href, true, false) + jade.attr("onclick", subitem.onclick, true, false) + jade.attr("data-background", subitem.background, true, false) + jade.attr("data-json", subitem.json, true, false) + jade.attr("data-page-title", subitem.pageTitle, true, false) + jade.attr("aria-expanded", subitem.current ? "true" : "false", true, false) + ' aria-controls="sections-panel-content" aria-owns="sections-panel-content" role="button"' + jade.cls([ subitem.current ? "current" : "" ], [ true ]) + '><div class="sections-panel-subnav-item-title">' + jade.escape(null == (jade_interp = subitem.title) ? "" : jade_interp) + '</div><div class="sections-panel-subnav-item-text">' + jade.escape(null == (jade_interp = subitem.text) ? "" : jade_interp) + "</div></a></li>");
                                }
                            }
                        }).call(this);
                        buf.push("</ul>");
                    }
                    buf.push("</div>");
                }
            }
        }).call(this);
        buf.push("<a" + jade.attr("href", data.base, true, false) + ' role="button" class="sections-panel-back sections-panel-subnav-back"><span class="accessibility_label"></span></a></div>');
    }
    buf.push('<div id="sections-panel-content" class="sections-panel-content"><div class="sections-panel-content-wrapper">');
    if (has_content) {
        buf.push(templatizer["sections-panel"]["sections-panel-content"](data.content));
    }
    buf.push("</div><a" + jade.attr("href", current_item ? current_item.href : "", true, false) + ' role="button" class="sections-panel-back sections-panel-content-back"><span class="accessibility_label"></span></a></div></div>');
    return buf.join("");
};


// sections-panel.jade:sections-panel-content compiled template
templatizer["sections-panel"]["sections-panel-content"] = function tmpl_sections_panel_sections_panel_content(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    if (data.title) {
        buf.push('<h3 class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h3>");
    }
    if (data.accessibility_text) {
        buf.push('<p class="hidden-accessibly">' + jade.escape(null == (jade_interp = data.accessibility_text) ? "" : jade_interp) + "</p>");
    }
    if (data.intro) {
        buf.push('<p class="sections-panel-intro">' + jade.escape(null == (jade_interp = data.intro) ? "" : jade_interp) + "</p>");
    }
    if (data.items && data.items.length) {
        buf.push('<ul class="sections-panel-content-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="sections-panel-content-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + '><div class="sections-panel-content-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '</div><div class="sections-panel-content-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="sections-panel-content-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + '><div class="sections-panel-content-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '</div><div class="sections-panel-content-item-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    if (data.buttons && data.buttons.items && data.buttons.items.length) {
        var buttons = JSON.parse(JSON.stringify(data.buttons));
        buttons.title_tag = "h3";
        buf.push(templatizer["sections-panel"]["buttons"](buttons));
    }
    if (data.more_links && data.more_links.items && data.more_links.items.length) {
        var more_links = JSON.parse(JSON.stringify(data.more_links));
        more_links.title_tag = "h3";
        buf.push(templatizer["sections-panel"]["links"](more_links));
    }
    return buf.join("");
};

// share.jade compiled template
templatizer["share"] = function tmpl_share(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// share.jade:share compiled template
templatizer["share"]["share"] = function tmpl_share_share(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
    if (data.items && data.items.length) {
        buf.push('<ul class="share-items">');
        (function() {
            var $$obj = data.items;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    buf.push("</div>");
    return buf.join("");
};

// sections-list.jade compiled template
templatizer["sections-list"] = function tmpl_sections_list(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// sections-list.jade:sections-list compiled template
templatizer["sections-list"]["sections-list"] = function tmpl_sections_list_sections_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<ul" + jade.cls([ "sections-list", data.modifiers ], [ null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<li class="sections-list-item"><a' + jade.attr("href", item.href, true, false) + jade.cls([ "sections-list-button", item.modifiers ], [ null, true ]) + '><div class="sections-list-button-wrapper">');
                if (item.title) {
                    buf.push('<strong class="sections-list-button-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</strong>");
                }
                buf.push('<div class="sections-list-button-text">' + (null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<li class="sections-list-item"><a' + jade.attr("href", item.href, true, false) + jade.cls([ "sections-list-button", item.modifiers ], [ null, true ]) + '><div class="sections-list-button-wrapper">');
                if (item.title) {
                    buf.push('<strong class="sections-list-button-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</strong>");
                }
                buf.push('<div class="sections-list-button-text">' + (null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    return buf.join("");
};

// skip-links.jade compiled template
templatizer["skip-links"] = function tmpl_skip_links(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// skip-links.jade:skip-links compiled template
templatizer["skip-links"]["skip-links"] = function tmpl_skip_links_skip_links(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<ul class="skip-links">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li><a" + jade.attr("href", item.href, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li><a" + jade.attr("href", item.href, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    return buf.join("");
};

// table-of-contents.jade compiled template
templatizer["table-of-contents"] = function tmpl_table_of_contents(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// table-of-contents.jade:table-of-contents compiled template
templatizer["table-of-contents"]["table-of-contents"] = function tmpl_table_of_contents_table_of_contents(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="table-of-contents">');
    if (data.nav && data.nav.length) {
        buf.push('<ul class="table-of-contents-nav">');
        (function() {
            var $$obj = data.nav;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    buf.push('<li class="table-of-contents-nav-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + "><strong>" + jade.escape(null == (jade_interp = item.text.slice(0, 3)) ? "" : jade_interp) + "</strong>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var item = $$obj[$index];
                    buf.push('<li class="table-of-contents-nav-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + "><strong>" + jade.escape(null == (jade_interp = item.text.slice(0, 3)) ? "" : jade_interp) + "</strong>" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    if (data.sections) {
        if (data.sections.list && data.sections.list.items && data.sections.list.items.length) {
            buf.push('<div class="table-of-contents-sections"><ul class="table-of-contents-sections-items">');
            (function() {
                var $$obj = data.sections.list.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="table-of-contents-sections-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "<strong>" + jade.escape(null == (jade_interp = item.text.slice(0, 3)) ? "" : jade_interp) + "</strong></a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="table-of-contents-sections-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("onclick", item.onclick, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "<strong>" + jade.escape(null == (jade_interp = item.text.slice(0, 3)) ? "" : jade_interp) + "</strong></a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
            if (data.sections.more) {
                buf.push("<a" + jade.attr("href", data.sections.more.href, true, false) + ' class="table-of-contents-sections-more">' + jade.escape(null == (jade_interp = data.sections.more.text) ? "" : jade_interp) + "</a>");
            }
            buf.push("</div>");
        }
    }
    buf.push("</div>");
    return buf.join("");
};

// tags.jade compiled template
templatizer["tags"] = function tmpl_tags(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// tags.jade:tags compiled template
templatizer["tags"]["tags"] = function tmpl_tags_tags(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<ul class="tags">');
    (function() {
        var $$obj = data;
        if ("number" == typeof $$obj.length) {
            for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                var tag = $$obj[index];
                buf.push("<li>");
                if (tag.href) {
                    buf.push("<a" + jade.attr("href", "" + tag.href + "", true, false) + ' class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</a>");
                } else {
                    buf.push('<span class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</span>");
                }
                if (index < data.length - 1) {
                    buf.push('<span class="tags-separator">—</span>');
                }
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var index in $$obj) {
                $$l++;
                var tag = $$obj[index];
                buf.push("<li>");
                if (tag.href) {
                    buf.push("<a" + jade.attr("href", "" + tag.href + "", true, false) + ' class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</a>");
                } else {
                    buf.push('<span class="tags-item">' + jade.escape(null == (jade_interp = tag.text) ? "" : jade_interp) + "</span>");
                }
                if (index < data.length - 1) {
                    buf.push('<span class="tags-separator">—</span>');
                }
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    return buf.join("");
};

// treize-card.jade compiled template
templatizer["treize-card"] = function tmpl_treize_card(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// treize-card.jade:treize-card compiled template
templatizer["treize-card"]["treize-card"] = function tmpl_treize_card_treize_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.attr("onclick", data.onclick, true, false) + jade.attr("target", data.target, true, false) + jade.cls([ "treize-card", data.modifiers ], [ null, true ]) + '><div class="treize-card-wrapper"><div' + jade.attr("style", data.image && "background-image: url(" + data.image + ");", true, false) + ' class="treize-card-image"></div><div class="treize-card-content"><div class="treize-card-date"><span>' + jade.escape(null == (jade_interp = data.date) ? "" : jade_interp) + '</span></div><div class="treize-card-title">');
    if (data.target === "_blank") {
        buf.push('<span class="icon-link-external"></span>');
    }
    buf.push(jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</div><div class="treize-card-credit"><span>' + jade.escape(null == (jade_interp = data.credit) ? "" : jade_interp) + "</span></div></div></div></a>");
    return buf.join("");
};

// treize-list.jade compiled template
templatizer["treize-list"] = function tmpl_treize_list(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// treize-list.jade:treize-card compiled template
templatizer["treize-list"]["treize-card"] = function tmpl_treize_list_treize_card(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<a" + jade.attr("href", data.href, true, false) + jade.attr("onclick", data.onclick, true, false) + jade.attr("target", data.target, true, false) + jade.cls([ "treize-card", data.modifiers ], [ null, true ]) + '><div class="treize-card-wrapper"><div' + jade.attr("style", data.image && "background-image: url(" + data.image + ");", true, false) + ' class="treize-card-image"></div><div class="treize-card-content"><div class="treize-card-date"><span>' + jade.escape(null == (jade_interp = data.date) ? "" : jade_interp) + '</span></div><div class="treize-card-title">');
    if (data.target === "_blank") {
        buf.push('<span class="icon-link-external"></span>');
    }
    buf.push(jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</div><div class="treize-card-credit"><span>' + jade.escape(null == (jade_interp = data.credit) ? "" : jade_interp) + "</span></div></div></div></a>");
    return buf.join("");
};


// treize-list.jade:treize-list compiled template
templatizer["treize-list"]["treize-list"] = function tmpl_treize_list_treize_list(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="treize-list"><ul' + jade.cls([ data.modifiers ], [ true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push('<li class="treize-list-card-item">');
                buf.push(templatizer["treize-list"]["treize-card"](item));
                buf.push("</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push('<li class="treize-list-card-item">');
                buf.push(templatizer["treize-list"]["treize-card"](item));
                buf.push("</li>");
            }
        }
    }).call(this);
    buf.push("</ul></div>");
    return buf.join("");
};

// video-cover.jade compiled template
templatizer["video-cover"] = function tmpl_video_cover(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON) {}).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined);
    return buf.join("");
};

// video-cover.jade:button compiled template
templatizer["video-cover"]["button"] = function tmpl_video_cover_button(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    var data = JSON.parse(JSON.stringify(data || {}));
    var attributes = data.attributes || {};
    var modifiers = data.modifiers || [];
    if (data.icon) {
        modifiers.push("icon");
    }
    if (data.href) {
        if (attributes.disabled) {
            delete attributes.disabled;
            modifiers.push("disabled");
        }
        buf.push("<a" + jade.attrs(jade.merge([ {
            href: jade.escape(data.href),
            onclick: jade.escape(data.onclick),
            title: jade.escape(data.title),
            target: jade.escape(data.target),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
    } else {
        buf.push("<button" + jade.attrs(jade.merge([ {
            title: jade.escape(data.title),
            "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                return jade_interp[i] ? jade.escape(cls) : cls;
            })))
        }, attributes ]), false) + ">");
        if (modifiers && modifiers.indexOf("marker") !== -1) {
            buf.push('<i aria-hidden="true" class="icon icon-marker"></i>');
        } else if (data.icon) {
            buf.push('<i aria-hidden="true"' + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
        }
        buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></button>");
    }
    return buf.join("");
};


// video-cover.jade:video-cover compiled template
templatizer["video-cover"]["video-cover"] = function tmpl_video_cover_video_cover(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push("<div" + jade.attr("style", data.background && "background-image: url(" + data.background + ")", true, false) + jade.cls([ "video-cover", block || data.block ? "with-block" : "" ], [ null, true ]) + ">");
    if (block) {
        if (data.cookie === false) {
            buf.push(null == (jade_interp = block) ? "" : jade_interp);
        } else {
            if (data.placeholder) {
                buf.push('<div class="video-cover-placeholder">' + (null == (jade_interp = data.placeholder) ? "" : jade_interp) + "</div>");
            }
            buf.push('<script type="text/html" class="video-cover-embed">' + (null == (jade_interp = block) ? "" : jade_interp) + "</script>");
        }
    } else if (data.block) {
        if (data.cookie === false) {
            buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
        } else {
            if (data.placeholder) {
                buf.push('<div class="video-cover-placeholder">' + (null == (jade_interp = data.placeholder) ? "" : jade_interp) + "</div>");
            }
            buf.push('<script type="text/html" class="video-cover-embed">' + (null == (jade_interp = data.block) ? "" : jade_interp) + "</script>");
        }
    } else {
        if (data.button) {
            var button = JSON.parse(JSON.stringify(data.button));
            button.modifiers = [ "action" ];
            buf.push(templatizer["video-cover"]["button"](button));
        }
    }
    buf.push("</div>");
    return buf.join("");
};

// video-home-news.jade compiled template
templatizer["video-home-news"] = function tmpl_video_home_news(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// video-home-news.jade:video-home-news compiled template
templatizer["video-home-news"]["video-home-news"] = function tmpl_video_home_news_video_home_news(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="video-home-news"><ul class="video-home-news-items">');
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "video-home-news-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + ' target="_blank"' + jade.attr("data-url", item.embed_url, true, false) + ' class="video-card"><div' + jade.attr("style", item.image && "background-image: url(" + item.image + ")", true, false) + ' class="video-card-image"><span class="video-card-play icon-play"></span><span class="video-card-duration">' + jade.escape(null == (jade_interp = item.duration) ? "" : jade_interp) + '</span></div><div class="video-card-content">');
                if (item.title) {
                    buf.push('<h3 class="video-card-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</h3>");
                }
                buf.push('<div class="video-card-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "video-home-news-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + ' target="_blank"' + jade.attr("data-url", item.embed_url, true, false) + ' class="video-card"><div' + jade.attr("style", item.image && "background-image: url(" + item.image + ")", true, false) + ' class="video-card-image"><span class="video-card-play icon-play"></span><span class="video-card-duration">' + jade.escape(null == (jade_interp = item.duration) ? "" : jade_interp) + '</span></div><div class="video-card-content">');
                if (item.title) {
                    buf.push('<h3 class="video-card-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + "</h3>");
                }
                buf.push('<div class="video-card-text">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</div></div></a></li>");
            }
        }
    }).call(this);
    buf.push('</ul><div class="video-modal"><div class="video-modal-wrapper"><iframe width="100%" height="100%" scrolling="no" frameborder="no" allowfullscreen="allowfullscreen"></iframe>');
    if (data.placeholder) {
        buf.push('<div class="video-modal-placeholder">' + (null == (jade_interp = data.placeholder) ? "" : jade_interp) + "</div>");
    }
    buf.push('<span class="video-modal-close icon-close"></span></div></div></div>');
    return buf.join("");
};

// video-home.jade compiled template
templatizer["video-home"] = function tmpl_video_home(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// video-home.jade:video-home compiled template
templatizer["video-home"]["video-home"] = function tmpl_video_home_video_home(data) {
    var block = this && this.block, attributes = this && this.attributes || {}, buf = [], jade_interp;
    buf.push('<div class="video-home-modal"><div class="video-home-modal-content"><div class="video-home-modal-header"><span class="video-home-close"></span></div><div class="video-home-modal-body"></div></div></div><div class="video-home-placeholder">' + (null == (jade_interp = data.placeholder) ? "" : jade_interp) + "</div><ul" + jade.cls([ "video-home", data.modifiers ], [ null, true ]) + ">");
    (function() {
        var $$obj = data.items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "video-home-list-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + ' class="video-home-item"><div class="video-home-wrapper"><div class="video-home-embed">' + (null == (jade_interp = item.embed_html) ? "" : jade_interp) + "</div><div" + jade.attr("style", item.image && "background-image: url(" + item.image + ");", true, false) + ' class="video-home-image"><span></span></div><div class="video-home-content"><div class="video-home-title">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</div><div class="video-home-duration">' + jade.escape(null == (jade_interp = item.duration) ? "" : jade_interp) + "</div></div></div></a></li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li" + jade.cls([ "video-home-list-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + ' class="video-home-item"><div class="video-home-wrapper"><div class="video-home-embed">' + (null == (jade_interp = item.embed_html) ? "" : jade_interp) + "</div><div" + jade.attr("style", item.image && "background-image: url(" + item.image + ");", true, false) + ' class="video-home-image"><span></span></div><div class="video-home-content"><div class="video-home-title">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + '</div><div class="video-home-duration">' + jade.escape(null == (jade_interp = item.duration) ? "" : jade_interp) + "</div></div></div></a></li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    return buf.join("");
};


module.exports = templatizer;

},{"@lukekarrys/jade-runtime":1}]},{},[3])(3)
});