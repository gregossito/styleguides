var jade = require('@lukekarrys/jade-runtime');

var templatizer = {};

templatizer["_template"] = {};
templatizer["accordion"] = {};
templatizer["buttons"] = {};
templatizer["faq"] = {};
templatizer["form"] = {};
templatizer["gallery"] = {};
templatizer["html"] = {};
templatizer["image"] = {};
templatizer["jecoute"] = {};
templatizer["links"] = {};
templatizer["news-push"] = {};
templatizer["place"] = {};
templatizer["postit"] = {};
templatizer["sharelines"] = {};
templatizer["table"] = {};
templatizer["text"] = {};
templatizer["verbatim"] = {};
templatizer["video"] = {};

// _layout.jade compiled template
templatizer["_layout"] = function tmpl__layout(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(yield) {
        buf.push('<!DOCTYPE html><html lang="fr" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><title>Component</title><link href="../../stylesheets/paris.css" type="text/css" rel="stylesheet"><link href="../../stylesheets/lsg.css" type="text/css" rel="stylesheet"><link href="../../stylesheets/prism.css" type="text/css" rel="stylesheet"><script src="../../javascript/modernizr.custom.js"></script><script src="../../javascript/jquery-2.1.4.min.js"></script></head><body><div class="lsg-wrapper">' + (null == (jade_interp = yield) ? "" : jade_interp) + '</div><script>var Paris = window.Paris || {};\nParis.i18n = Paris.i18n || {};\n\nParis.i18n.locales = {\n  "fr": {\n    "share": {\n      "facebook": "Partager sur Facebook",\n      "twitter": "Partager sur Twitter",\n      "mail": "Partager par email"\n    },\n    "favorites": {\n      "add": "ajouter aux favoris",\n      "remove": "enlever des favoris"\n    },\n    "search_results": {\n      "search": "Recherche",\n      "title": {\n        "one": "Un résultat",\n        "plural": "{0} résultats"\n      },\n      "page": "Page {0}",\n      "no_result": "Désolé, votre recherche ne correspond à aucun de nos contenus.",\n      "more": "Afficher plus de résultats",\n      "facets": {\n        "onglet": "Catégories",\n        "groupe_politique": "Groupe politique",\n        "secteur": "Arrondissement"\n      }\n    },\n    "list_persons": {\n      "no_result": "Personne ne correspond à votre recherche."\n    },\n    "person_block": {\n      "button_view": "Voir la fiche"\n    },\n    "pagination": {\n      "label": "Pagination des résultats",\n      "prev": "Page précédente",\n      "next": "Page suivante",\n      "link_title": "Aller à la page ${page}"\n    },\n    "jecoute": {\n      "error": {\n        "policy": "Veuillez accepter la charte.",\n        "file_size": "Le poids total des pièces jointes est trop élevé."\n      }\n    },\n    "alerts": {\n      "subscribe": "Je m’abonne à l’alerte pour recevoir toutes les informations sur ce sujet",\n      "unsubscribe": "Je me désabonne de l’alerte sur ce sujet"\n    },\n    "postit": {\n      "default_title": "Informations complémentaires"\n    },\n    "active": "actif",\n    "inactive": "inactif",\n    "new_window": "nouvelle fenêtre"\n  }\n};\n</script><script>var Paris = window.Paris || {};\n\nParis.config = {\n  "algolia": {\n    // The Algolia application ID\n    "id": "QGS0I5WCQR",\n\n    // This API key should be created on Algolia, and have `search` permission on all the indexes below\n    "api_key": "219f93ef781ffa09cdb6803f702cf6f1",\n\n    // You can add any Algolia index here, to be able to use it in the quick-access module and search-results template\n    "indexes": {\n      "global": "recette_ParisFront",\n      "persons": "recette_Elus"\n    },\n\n    "url": {\n      "api_popular_searches": "http://r7.paris-fr-api.lestudio.mx/AlgoliaStats/getMostSearchedKeywords"\n    }\n  },\n  "cookies": {\n    "email": {\n      "name": "email"\n    },\n    "cnil": {\n      "name": "cookies",\n      "value": "accepted",\n      // `expires` can be a Number which will be interpreted as days from time of creation or a Date instance\n      "expires": 395 // 13 months\n    },\n    "parisconnect": {\n      "name": "pcuid"\n    },\n    "publicdata": {\n      "name": "publicdata"\n    }\n  },\n  "captcha": {\n    "key": "6Lf2DQoTAAAAAKmk3wEFCZuK3FqG00SlQM3o6Yvp"\n  }\n};\n</script><script src="../../javascript/beautify-html.js"></script><script src="../../javascript/prism.js"></script><script src="../../javascript/lsg.js"></script><script src="../../javascript/paris.js"></script></body></html>');
    }).call(this, "yield" in locals_for_with ? locals_for_with.yield : typeof yield !== "undefined" ? yield : undefined);
    return buf.join("");
};

// components.jade compiled template
templatizer["components"] = function tmpl_components(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math, button, modifiers, share, slug, title, uuid) {
        jade_mixins["accordion"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            uuid = Math.random().toString(36).substr(2, 5);
            buf.push('<div role="tablist" aria-multiselectable="true" class="component component-accordion">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var index in $$obj) {
                        $$l++;
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                }
            }).call(this);
            buf.push("</div>");
        };
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
        jade_mixins["buttons"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-buttons">');
            if (data.title) {
                buf.push('<h2 class="buttons-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
            }
            buf.push('<ul class="buttons-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li>");
                        jade_mixins["button"](item);
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li>");
                        jade_mixins["button"](item);
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul></div>");
        };
        jade_mixins["accordion"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            uuid = Math.random().toString(36).substr(2, 5);
            buf.push('<div role="tablist" aria-multiselectable="true" class="component component-accordion">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var index in $$obj) {
                        $$l++;
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                }
            }).call(this);
            buf.push("</div>");
        };
        jade_mixins["faq"] = jade_interp = function(opts) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["accordion"](opts);
        };
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
        jade_mixins["form-title"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<h2>" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</h2>");
        };
        jade_mixins["form-text"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("value", data.value, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field"/>');
        };
        jade_mixins["form-email"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-tel"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-url"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-hidden"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("value", data.value, true, false) + ' class="form-field"/>');
        };
        jade_mixins["form-select"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><select" + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">');
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
        };
        jade_mixins["form-textarea"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><textarea" + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("maxlength", data.maxlength, true, false) + jade.attr("rows", data.rows, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">' + jade.escape(null == (jade_interp = data.value) ? "" : jade_interp) + "</textarea>");
        };
        jade_mixins["form-checkbox"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div>");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                }
            }).call(this);
        };
        jade_mixins["form-radio"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-checkbox"].call({
                block: function() {
                    buf.push("// same code as the checkbox, except input type");
                }
            }, data);
        };
        jade_mixins["form-cgu"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div>");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                }
            }).call(this);
        };
        jade_mixins["form-matrix"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
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
        };
        jade_mixins["form-captcha"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="g-recaptcha"></div>');
        };
        jade_mixins["form-buttons"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        button = JSON.parse(JSON.stringify(item || []));
                        button.modifiers = button.modifiers || [];
                        if (item.attributes && item.attributes.type === "submit") {
                            button.modifiers.push("action");
                        }
                        jade_mixins["button"](button);
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        button = JSON.parse(JSON.stringify(item || []));
                        button.modifiers = button.modifiers || [];
                        if (item.attributes && item.attributes.type === "submit") {
                            button.modifiers.push("action");
                        }
                        jade_mixins["button"](button);
                    }
                }
            }).call(this);
        };
        jade_mixins["form"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.attr("data-thanks", data.thanks, true, false) + ' class="component component-form"><form' + jade.attr("action", data.action, true, false) + jade.attr("method", data.method || "POST", true, false) + ">");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        item = JSON.parse(JSON.stringify(item || []));
                        item.modifiers = item.modifiers || [];
                        item.modifiers.push("form-item-" + item.type);
                        if ([ "email", "tel", "url" ].indexOf(item.type) !== -1) {
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
                        jade_mixins["form-" + item.type](item);
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
                        if ([ "email", "tel", "url" ].indexOf(item.type) !== -1) {
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
                        jade_mixins["form-" + item.type](item);
                        if (item.help) {
                            buf.push('<p class="form-item-help">' + jade.escape(null == (jade_interp = item.help) ? "" : jade_interp) + "</p>");
                        }
                        buf.push("</div>");
                    }
                }
            }).call(this);
            buf.push("</form></div>");
        };
        jade_mixins["gallery"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-gallery"><div class="gallery-wrapper">');
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
        };
        jade_mixins["html"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-html"><div class="html-wrapper">');
            if (data.cookie === false) {
                if (block) {
                    block && block();
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
        };
        jade_mixins["image"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "component", "component-image", data.modifiers ], [ null, null, true ]) + ">");
            title = [ data.title ];
            if (data.credit) {
                title.push("(" + data.credit + ")");
            }
            title = title.join(" ");
            if (data.srcset) {
                buf.push("<img" + jade.attr("src", data.src, true, false) + jade.attr("srcset", data.srcset.join(", "), true, false) + ' sizes="(min-width: 1160px) 770px, 100vw"' + jade.attr("alt", data.alt, true, false) + jade.attr("title", title, true, false) + "/>");
            } else {
                buf.push("<img" + jade.attr("src", data.src, true, false) + jade.attr("alt", data.alt, true, false) + jade.attr("title", title, true, false) + "/>");
            }
            buf.push("</div>");
        };
        jade_mixins["jecoute"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.attr("data-thanks", data.thanks, true, false) + ' class="component component-jecoute"><div class="jecoute-title"><h2>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h2></div><div class="jecoute-content"><p class="jecoute-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p><form" + jade.attrs(jade.merge([ {
                method: "post",
                "class": "jecoute-form"
            }, data.form ]), false) + ">");
            var textarea = JSON.parse(JSON.stringify(data.textarea));
            delete textarea.value;
            buf.push("<textarea" + jade.attrs(jade.merge([ {
                name: "message",
                required: true,
                "aria-required": "true"
            }, textarea ]), false) + ">" + jade.escape(null == (jade_interp = data.textarea.value) ? "" : jade_interp) + "</textarea><input" + jade.attrs(jade.merge([ {
                type: "email",
                name: "email",
                required: true,
                "aria-required": "true"
            }, data.email ]), false) + "/>");
            if (data.upload) {
                var upload = JSON.parse(JSON.stringify(data.upload));
                buf.push('<div class="jecoute-upload"><label type="button" class="button secondary icon"><i' + jade.cls([ "icon", "icon-" + upload.button.icon + "" ], [ null, true ]) + '></i><span class="button-text">' + jade.escape(null == (jade_interp = upload.button.text) ? "" : jade_interp) + '</span><input type="file" name="files" formenctype="multipart/form-data" multiple="multiple"/></label><p><em>' + jade.escape((jade_interp = upload.title) == null ? "" : jade_interp) + ' :&nbsp;</em><span class="upload-size">' + jade.escape((jade_interp = upload.size) == null ? "" : jade_interp) + ",&nbsp;</span><a" + jade.attr("href", upload.link.href, true, false) + jade.attr("target", upload.link.target, true, false) + ">" + jade.escape(null == (jade_interp = upload.link.text) ? "" : jade_interp) + '</a></p><output><ul class="output-items"></ul></output></div>');
            }
            if (data.policy) {
                var policy = JSON.parse(JSON.stringify(data.policy));
                buf.push('<p class="jecoute-policy"><label><input type="checkbox" name="policy" required="required"/><span><em>' + jade.escape(null == (jade_interp = policy.text) ? "" : jade_interp) + "</em><a" + jade.attr("href", policy.link.href, true, false) + jade.attr("target", policy.link.target, true, false) + ">" + jade.escape(null == (jade_interp = policy.link.text) ? "" : jade_interp) + "</a></span></label></p>");
            }
            buf.push('<button type="submit"' + jade.attr("title", data.button_title, true, false) + ' class="button secondary action">' + jade.escape(null == (jade_interp = data.button) ? "" : jade_interp) + '</button></form><p class="jecoute-message"></p></div></div>');
        };
        jade_mixins["links"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-links">');
            if (data.title) {
                buf.push("<h2>" + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
            }
            buf.push('<ul class="links-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
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
                        buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
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
        };
        jade_mixins["news-push"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-news-push"><div class="news-push-wrapper"><div class="news-push-after"></div>');
            title = [ data.title ];
            if (data.image.credit) {
                title.push("(" + data.image.credit + ")");
            }
            buf.push("<a" + jade.attr("href", data.href, true, false) + ' class="news-push-image"><img' + jade.attr("src", data.image.src, true, false) + ' alt=""' + jade.attr("title", title.join(" "), true, false) + '/></a><div class="news-push-content"><h2 class="news-push-title"><span>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</span></h2><p class="news-push-content-text"><a' + jade.attr("href", data.href, true, false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</a>" + jade.escape(null == (jade_interp = " ") ? "" : jade_interp) + "<a" + jade.attr("href", data.href, true, false) + ' class="next">' + jade.escape(null == (jade_interp = data.follow) ? "" : jade_interp) + "</a></p></div></div>");
            if (data.link && data.link.href && data.link.text) {
                buf.push("<a" + jade.attr("href", data.link.href, true, false) + ' class="news-push-link"><span>' + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</span></a>");
            }
            buf.push("</div>");
        };
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
        jade_mixins["place"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-place"><div class="place-content">');
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
                button = JSON.parse(JSON.stringify(data.button));
                button.modifiers = [ "marker" ];
                jade_mixins["button"](button);
            }
            buf.push("</div>");
        };
        jade_mixins["postit"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "component", "component-postit", data ? data.modifiers : [] ], [ null, null, true ]) + ">");
            if (data.title) {
                buf.push('<h2 id="postit" class="anchor">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
            }
            if (block) {
                block && block();
            } else if (data.block) {
                buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
            } else {
                buf.push("<p>postit</p>");
            }
            buf.push("</div>");
        };
        jade_mixins["share"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
            if (data.items && data.items.length) {
                buf.push('<ul class="share-items">');
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    }
                }).call(this);
                buf.push("</ul>");
            }
            buf.push("</div>");
        };
        jade_mixins["sharelines"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-sharelines"><h2 class="sharelines-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h2><ul class="sharelines-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="sharelines-item">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        share = JSON.parse(JSON.stringify(item.share));
                        share.modifiers = [ "circles" ];
                        jade_mixins["share"](share);
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="sharelines-item">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        share = JSON.parse(JSON.stringify(item.share));
                        share.modifiers = [ "circles" ];
                        jade_mixins["share"](share);
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul></div>");
        };
        jade_mixins["table"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-table"><table' + jade.attr("summary", data.summary, true, false) + ">");
            if (data.caption) {
                buf.push("<caption>" + jade.escape(null == (jade_interp = data.caption) ? "" : jade_interp) + "</caption>");
            }
            if (block) {
                block && block();
            } else if (data.block) {
                buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
            }
            buf.push("</table></div>");
        };
        jade_mixins["text"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "component", "component-text", data ? data.modifiers : [] ], [ null, null, true ]) + ">");
            if (block) {
                block && block();
            } else if (data.block) {
                buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
            } else {
                buf.push("<p>text</p>");
            }
            buf.push("</div>");
        };
        jade_mixins["share"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
            if (data.items && data.items.length) {
                buf.push('<ul class="share-items">');
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    }
                }).call(this);
                buf.push("</ul>");
            }
            buf.push("</div>");
        };
        jade_mixins["verbatim"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<blockquote class="component component-verbatim"><p class="verbatim-text">' + jade.escape(null == (jade_interp = data.quote) ? "" : jade_interp) + '</p><footer><div class="verbatim-separate"></div><cite><div class="verbatim-author">' + jade.escape(null == (jade_interp = data.author) ? "" : jade_interp) + ',</div><div class="verbatim-function">' + jade.escape(null == (jade_interp = data.function) ? "" : jade_interp) + "</div></cite>");
            share = JSON.parse(JSON.stringify(data.share));
            share.modifiers = [ "circles" ];
            jade_mixins["share"](share);
            buf.push("</footer></blockquote>");
        };
        jade_mixins["video"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-video"><div class="video-wrapper">');
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
        };
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined, "button" in locals_for_with ? locals_for_with.button : typeof button !== "undefined" ? button : undefined, "modifiers" in locals_for_with ? locals_for_with.modifiers : typeof modifiers !== "undefined" ? modifiers : undefined, "share" in locals_for_with ? locals_for_with.share : typeof share !== "undefined" ? share : undefined, "slug" in locals_for_with ? locals_for_with.slug : typeof slug !== "undefined" ? slug : undefined, "title" in locals_for_with ? locals_for_with.title : typeof title !== "undefined" ? title : undefined, "uuid" in locals_for_with ? locals_for_with.uuid : typeof uuid !== "undefined" ? uuid : undefined);
    return buf.join("");
};

// accordion/accordion.jade compiled template
templatizer["accordion"]["accordion"] = function tmpl_accordion_accordion(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// accordion/index.jade compiled template
templatizer["accordion"]["index"] = function tmpl_accordion_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math, defaults, slug, uuid, with_slugs) {
        jade_mixins["accordion"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            uuid = Math.random().toString(36).substr(2, 5);
            buf.push('<div role="tablist" aria-multiselectable="true" class="component component-accordion">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var index in $$obj) {
                        $$l++;
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                }
            }).call(this);
            buf.push("</div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div style="max-width: 600px" class="lsg-component">');
        jade_mixins["accordion"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include accordion\n\n+accordion(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Définir les slugs manuellement</h2><p>Par défaut, le composant génère des slugs uniques pour chaque item de chaque instance. Il est en revanche possible de définir manuellement ces slugs si besoin.</p><div style="max-width: 600px" class="lsg-component">');
        jade_mixins["accordion"](with_slugs);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include accordion\n\n+accordion(" + jade.escape((jade_interp = JSON.stringify(with_slugs, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "slug" in locals_for_with ? locals_for_with.slug : typeof slug !== "undefined" ? slug : undefined, "uuid" in locals_for_with ? locals_for_with.uuid : typeof uuid !== "undefined" ? uuid : undefined, "with_slugs" in locals_for_with ? locals_for_with.with_slugs : typeof with_slugs !== "undefined" ? with_slugs : undefined);
    return buf.join("");
};

// buttons/buttons.jade compiled template
templatizer["buttons"]["buttons"] = function tmpl_buttons_buttons(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(modifiers) {
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
    }).call(this, "modifiers" in locals_for_with ? locals_for_with.modifiers : typeof modifiers !== "undefined" ? modifiers : undefined);
    return buf.join("");
};

// buttons/index.jade compiled template
templatizer["buttons"]["index"] = function tmpl_buttons_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, modifiers, single_button) {
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
        jade_mixins["buttons"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-buttons">');
            if (data.title) {
                buf.push('<h2 class="buttons-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
            }
            buf.push('<ul class="buttons-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li>");
                        jade_mixins["button"](item);
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push("<li>");
                        jade_mixins["button"](item);
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul></div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["buttons"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include buttons\n\n+buttons(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Bouton seul</h2><p>Pour obtenir un bouton seul, il suffit de ne pas indiquer de titre, et de ne passer qu\'un seul élément dans le tableau <code>items</code>.</p><div class="lsg-component">');
        jade_mixins["buttons"](single_button);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include buttons\n\n+buttons(" + jade.escape((jade_interp = JSON.stringify(single_button, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "modifiers" in locals_for_with ? locals_for_with.modifiers : typeof modifiers !== "undefined" ? modifiers : undefined, "single_button" in locals_for_with ? locals_for_with.single_button : typeof single_button !== "undefined" ? single_button : undefined);
    return buf.join("");
};

// faq/faq.jade compiled template
templatizer["faq"]["faq"] = function tmpl_faq_faq(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(Math, slug, uuid) {
        jade_mixins["accordion"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            uuid = Math.random().toString(36).substr(2, 5);
            buf.push('<div role="tablist" aria-multiselectable="true" class="component component-accordion">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var index in $$obj) {
                        $$l++;
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                }
            }).call(this);
            buf.push("</div>");
        };
    }).call(this, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined, "slug" in locals_for_with ? locals_for_with.slug : typeof slug !== "undefined" ? slug : undefined, "uuid" in locals_for_with ? locals_for_with.uuid : typeof uuid !== "undefined" ? uuid : undefined);
    return buf.join("");
};

// faq/index.jade compiled template
templatizer["faq"]["index"] = function tmpl_faq_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math, defaults, slug, uuid) {
        jade_mixins["accordion"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            uuid = Math.random().toString(36).substr(2, 5);
            buf.push('<div role="tablist" aria-multiselectable="true" class="component component-accordion">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var index in $$obj) {
                        $$l++;
                        var item = $$obj[index];
                        slug = item.slug || uuid + "-" + index;
                        buf.push('<div class="accordion-item panel"><div role="tab"' + jade.attr("id", "h-" + slug + "", true, false) + "><a" + jade.attr("href", "#" + slug + "", true, false) + jade.attr("aria-controls", "#" + slug + "", true, false) + ' class="accordion-item-title">' + jade.escape(null == (jade_interp = item.title) ? "" : jade_interp) + '<span class="icon icon-arrow-top"></span></a></div><div role="tabpanel"' + jade.attr("aria-labelledby", "h-" + slug + "", true, false) + jade.attr("id", "" + slug + "", true, false) + ' class="accordion-item-content"><div class="accordion-content-wrapper">' + (null == (jade_interp = item.content) ? "" : jade_interp) + "</div></div></div>");
                    }
                }
            }).call(this);
            buf.push("</div>");
        };
        jade_mixins["faq"] = jade_interp = function(opts) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["accordion"](opts);
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<div class="lsg-component">');
        jade_mixins["faq"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include faq\n\n+faq(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "slug" in locals_for_with ? locals_for_with.slug : typeof slug !== "undefined" ? slug : undefined, "uuid" in locals_for_with ? locals_for_with.uuid : typeof uuid !== "undefined" ? uuid : undefined);
    return buf.join("");
};

// _template/component.jade compiled template
templatizer["_template"]["component"] = function tmpl__template_component(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// _template/index.jade compiled template
templatizer["_template"]["index"] = function tmpl__template_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults) {
        jade_mixins["component"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<p>Mon composant</p>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["component"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include component\n\n+component(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined);
    return buf.join("");
};

// form/form.jade compiled template
templatizer["form"]["form"] = function tmpl_form_form(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math, button, modifiers) {
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
        jade_mixins["form-title"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<h2>" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</h2>");
        };
        jade_mixins["form-text"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("value", data.value, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field"/>');
        };
        jade_mixins["form-email"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-tel"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-url"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-hidden"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("value", data.value, true, false) + ' class="form-field"/>');
        };
        jade_mixins["form-select"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><select" + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">');
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
        };
        jade_mixins["form-textarea"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><textarea" + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("maxlength", data.maxlength, true, false) + jade.attr("rows", data.rows, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">' + jade.escape(null == (jade_interp = data.value) ? "" : jade_interp) + "</textarea>");
        };
        jade_mixins["form-checkbox"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div>");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                }
            }).call(this);
        };
        jade_mixins["form-radio"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-checkbox"].call({
                block: function() {
                    buf.push("// same code as the checkbox, except input type");
                }
            }, data);
        };
        jade_mixins["form-cgu"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div>");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                }
            }).call(this);
        };
        jade_mixins["form-matrix"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
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
        };
        jade_mixins["form-captcha"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="g-recaptcha"></div>');
        };
        jade_mixins["form-buttons"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        button = JSON.parse(JSON.stringify(item || []));
                        button.modifiers = button.modifiers || [];
                        if (item.attributes && item.attributes.type === "submit") {
                            button.modifiers.push("action");
                        }
                        jade_mixins["button"](button);
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        button = JSON.parse(JSON.stringify(item || []));
                        button.modifiers = button.modifiers || [];
                        if (item.attributes && item.attributes.type === "submit") {
                            button.modifiers.push("action");
                        }
                        jade_mixins["button"](button);
                    }
                }
            }).call(this);
        };
        jade_mixins["form"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.attr("data-thanks", data.thanks, true, false) + ' class="component component-form"><form' + jade.attr("action", data.action, true, false) + jade.attr("method", data.method || "POST", true, false) + ">");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        item = JSON.parse(JSON.stringify(item || []));
                        item.modifiers = item.modifiers || [];
                        item.modifiers.push("form-item-" + item.type);
                        if ([ "email", "tel", "url" ].indexOf(item.type) !== -1) {
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
                        jade_mixins["form-" + item.type](item);
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
                        if ([ "email", "tel", "url" ].indexOf(item.type) !== -1) {
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
                        jade_mixins["form-" + item.type](item);
                        if (item.help) {
                            buf.push('<p class="form-item-help">' + jade.escape(null == (jade_interp = item.help) ? "" : jade_interp) + "</p>");
                        }
                        buf.push("</div>");
                    }
                }
            }).call(this);
            buf.push("</form></div>");
        };
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined, "button" in locals_for_with ? locals_for_with.button : typeof button !== "undefined" ? button : undefined, "modifiers" in locals_for_with ? locals_for_with.modifiers : typeof modifiers !== "undefined" ? modifiers : undefined);
    return buf.join("");
};

// form/index.jade compiled template
templatizer["form"]["index"] = function tmpl_form_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, Math, button, defaults, full, modifiers) {
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
        jade_mixins["form-title"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<h2>" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</h2>");
        };
        jade_mixins["form-text"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("value", data.value, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field"/>');
        };
        jade_mixins["form-email"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-tel"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-url"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-text"](data);
        };
        jade_mixins["form-hidden"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<input" + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("value", data.value, true, false) + ' class="form-field"/>');
        };
        jade_mixins["form-select"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><select" + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">');
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
        };
        jade_mixins["form-textarea"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<label" + jade.attr("for", data.id, true, false) + ' class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</label><textarea" + jade.attr("name", data.name, true, false) + jade.attr("id", data.id, true, false) + jade.attr("placeholder", data.placeholder, true, false) + jade.attr("maxlength", data.maxlength, true, false) + jade.attr("rows", data.rows, true, false) + jade.attr("required", data.required, true, false) + ' class="form-field">' + jade.escape(null == (jade_interp = data.value) ? "" : jade_interp) + "</textarea>");
        };
        jade_mixins["form-checkbox"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div>");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                }
            }).call(this);
        };
        jade_mixins["form-radio"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            jade_mixins["form-checkbox"].call({
                block: function() {
                    buf.push("// same code as the checkbox, except input type");
                }
            }, data);
        };
        jade_mixins["form-cgu"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="form-item-label">' + jade.escape(null == (jade_interp = data.label) ? "" : jade_interp) + "</div>");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<div><label><input type="hidden"' + jade.attr("name", data.name, true, false) + ' value="" class="form-field"/><input' + jade.attr("type", data.type, true, false) + jade.attr("name", data.name, true, false) + jade.attr("value", item.value, true, false) + jade.attr("checked", item.checked, true, false) + ' class="form-field"/>' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</label></div>");
                    }
                }
            }).call(this);
        };
        jade_mixins["form-matrix"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
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
        };
        jade_mixins["form-captcha"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="g-recaptcha"></div>');
        };
        jade_mixins["form-buttons"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        button = JSON.parse(JSON.stringify(item || []));
                        button.modifiers = button.modifiers || [];
                        if (item.attributes && item.attributes.type === "submit") {
                            button.modifiers.push("action");
                        }
                        jade_mixins["button"](button);
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        button = JSON.parse(JSON.stringify(item || []));
                        button.modifiers = button.modifiers || [];
                        if (item.attributes && item.attributes.type === "submit") {
                            button.modifiers.push("action");
                        }
                        jade_mixins["button"](button);
                    }
                }
            }).call(this);
        };
        jade_mixins["form"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.attr("data-thanks", data.thanks, true, false) + ' class="component component-form"><form' + jade.attr("action", data.action, true, false) + jade.attr("method", data.method || "POST", true, false) + ">");
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        item = JSON.parse(JSON.stringify(item || []));
                        item.modifiers = item.modifiers || [];
                        item.modifiers.push("form-item-" + item.type);
                        if ([ "email", "tel", "url" ].indexOf(item.type) !== -1) {
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
                        jade_mixins["form-" + item.type](item);
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
                        if ([ "email", "tel", "url" ].indexOf(item.type) !== -1) {
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
                        jade_mixins["form-" + item.type](item);
                        if (item.help) {
                            buf.push('<p class="form-item-help">' + jade.escape(null == (jade_interp = item.help) ? "" : jade_interp) + "</p>");
                        }
                        buf.push("</div>");
                    }
                }
            }).call(this);
            buf.push("</form></div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["form"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include form\n\n+form(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Complet</h2><div class="lsg-component">');
        jade_mixins["form"](full);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include form\n\n+form(" + jade.escape((jade_interp = JSON.stringify(full, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "Math" in locals_for_with ? locals_for_with.Math : typeof Math !== "undefined" ? Math : undefined, "button" in locals_for_with ? locals_for_with.button : typeof button !== "undefined" ? button : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "full" in locals_for_with ? locals_for_with.full : typeof full !== "undefined" ? full : undefined, "modifiers" in locals_for_with ? locals_for_with.modifiers : typeof modifiers !== "undefined" ? modifiers : undefined);
    return buf.join("");
};

// gallery/gallery.jade compiled template
templatizer["gallery"]["gallery"] = function tmpl_gallery_gallery(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// gallery/index.jade compiled template
templatizer["gallery"]["index"] = function tmpl_gallery_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, with_captions) {
        jade_mixins["gallery"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-gallery"><div class="gallery-wrapper">');
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
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["gallery"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include component\n\n+gallery(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Avec légendes et crédit</h2><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["gallery"](with_captions);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include component\n\n+gallery(" + jade.escape((jade_interp = JSON.stringify(with_captions, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "with_captions" in locals_for_with ? locals_for_with.with_captions : typeof with_captions !== "undefined" ? with_captions : undefined);
    return buf.join("");
};

// image/image.jade compiled template
templatizer["image"]["image"] = function tmpl_image_image(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// image/index.jade compiled template
templatizer["image"]["index"] = function tmpl_image_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, full_height, left, right, title, vertical_image) {
        jade_mixins["image"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "component", "component-image", data.modifiers ], [ null, null, true ]) + ">");
            title = [ data.title ];
            if (data.credit) {
                title.push("(" + data.credit + ")");
            }
            title = title.join(" ");
            if (data.srcset) {
                buf.push("<img" + jade.attr("src", data.src, true, false) + jade.attr("srcset", data.srcset.join(", "), true, false) + ' sizes="(min-width: 1160px) 770px, 100vw"' + jade.attr("alt", data.alt, true, false) + jade.attr("title", title, true, false) + "/>");
            } else {
                buf.push("<img" + jade.attr("src", data.src, true, false) + jade.attr("alt", data.alt, true, false) + jade.attr("title", title, true, false) + "/>");
            }
            buf.push("</div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push("<h2>Formats d'image</h2><p>Chaque image doit être redimensionnée automatiquement aux formats suivants :</p><ul><li><strong>Petit</strong> avec une largeur max de 400px</li><li><strong>Moyen</strong> avec une largeur max de 600px</li><li><strong>Grand</strong> avec une largeur max de 800px</li></ul><h2>Standard (image responsive)</h2><p>La taille d'image moyenne est passée par défaut dans l'attribut <code>src</code>.</p><p>L'attribut <code>srcset</code> contient un tableau des tailles disponibles, en suivant le format de la <a href=\"http://responsiveimages.org/\" target=\"_blank\">spécification</a> (URL de l'image, espace, largeur en pixels avec l'unité <code>w</code> pour <em>width</em>).</p><p>Les valeurs de <code>title</code> et <code>credit</code> seront concaténées dans l'attribut <code>title</code> de l'élément <code>img</code>.</p><div style=\"max-width: 770px\" class=\"lsg-component\">");
        jade_mixins["image"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include image\n\n+image(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Image verticale</h2><p>Les images sont limitées à 540px de haut, pour éviter que les images au format vertical prennent une hauteur trop importante.</p><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["image"](vertical_image);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include image\n\n+image(" + jade.escape((jade_interp = JSON.stringify(vertical_image, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Image verticale non-contrainte</h2><p>Il est possible de lever la limite de 540px de hauteur en ajoutant le <em>modifier</em> <code>full-height</code>. C\'est notamment utile pour les infographies verticales.</p><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["image"](full_height);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include image\n\n+image(" + jade.escape((jade_interp = JSON.stringify(full_height, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Image flottant à gauche</h2><p>En ajoutant le <em>modifier</em> <code>left</code>, l\'image flotte à gauche et est habillée par le texte qui la suit.</p><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["image"](left);
        buf.push("<p>Ceci est un paragraphe de remplissage. Nullam quis risus eget urna mollis ornare vel eu leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla.</p></div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include image\n\n+image(" + jade.escape((jade_interp = JSON.stringify(left, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Image flottant à droite</h2><p>En ajoutant le <em>modifier</em> <code>right</code>, l\'image flotte à droite et est habillée par le texte qui la suit.</p><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["image"](right);
        buf.push("<p>Ceci est un paragraphe de remplissage. Nullam quis risus eget urna mollis ornare vel eu leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla.</p></div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include image\n\n+image(" + jade.escape((jade_interp = JSON.stringify(right, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "full_height" in locals_for_with ? locals_for_with.full_height : typeof full_height !== "undefined" ? full_height : undefined, "left" in locals_for_with ? locals_for_with.left : typeof left !== "undefined" ? left : undefined, "right" in locals_for_with ? locals_for_with.right : typeof right !== "undefined" ? right : undefined, "title" in locals_for_with ? locals_for_with.title : typeof title !== "undefined" ? title : undefined, "vertical_image" in locals_for_with ? locals_for_with.vertical_image : typeof vertical_image !== "undefined" ? vertical_image : undefined);
    return buf.join("");
};

// html/html.jade compiled template
templatizer["html"]["html"] = function tmpl_html_html(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// html/index.jade compiled template
templatizer["html"]["index"] = function tmpl_html_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, without_cookie) {
        jade_mixins["html"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-html"><div class="html-wrapper">');
            if (data.cookie === false) {
                if (block) {
                    block && block();
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
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<p>Ce composant accepte un bloc (ou un paramètre <code>block</code>) contenant un code HTML. Il adapte automatiquement la taille de ses enfants directs pour qu\'ils ne dépassent pas la largeur de la colonne.</p><h2>Standard</h2><div style="max-width: 500px" class="lsg-component">');
        jade_mixins["html"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include html\n\n+html(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Sans prendre en compte le cookie</h2><div style="max-width: 500px" class="lsg-component">');
        jade_mixins["html"](without_cookie);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include html\n\n+html(" + jade.escape((jade_interp = JSON.stringify(without_cookie, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "without_cookie" in locals_for_with ? locals_for_with.without_cookie : typeof without_cookie !== "undefined" ? without_cookie : undefined);
    return buf.join("");
};

// jecoute/index.jade compiled template
templatizer["jecoute"]["index"] = function tmpl_jecoute_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, values, with_files) {
        jade_mixins["jecoute"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.attr("data-thanks", data.thanks, true, false) + ' class="component component-jecoute"><div class="jecoute-title"><h2>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h2></div><div class="jecoute-content"><p class="jecoute-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</p><form" + jade.attrs(jade.merge([ {
                method: "post",
                "class": "jecoute-form"
            }, data.form ]), false) + ">");
            var textarea = JSON.parse(JSON.stringify(data.textarea));
            delete textarea.value;
            buf.push("<textarea" + jade.attrs(jade.merge([ {
                name: "message",
                required: true,
                "aria-required": "true"
            }, textarea ]), false) + ">" + jade.escape(null == (jade_interp = data.textarea.value) ? "" : jade_interp) + "</textarea><input" + jade.attrs(jade.merge([ {
                type: "email",
                name: "email",
                required: true,
                "aria-required": "true"
            }, data.email ]), false) + "/>");
            if (data.upload) {
                var upload = JSON.parse(JSON.stringify(data.upload));
                buf.push('<div class="jecoute-upload"><label type="button" class="button secondary icon"><i' + jade.cls([ "icon", "icon-" + upload.button.icon + "" ], [ null, true ]) + '></i><span class="button-text">' + jade.escape(null == (jade_interp = upload.button.text) ? "" : jade_interp) + '</span><input type="file" name="files" formenctype="multipart/form-data" multiple="multiple"/></label><p><em>' + jade.escape((jade_interp = upload.title) == null ? "" : jade_interp) + ' :&nbsp;</em><span class="upload-size">' + jade.escape((jade_interp = upload.size) == null ? "" : jade_interp) + ",&nbsp;</span><a" + jade.attr("href", upload.link.href, true, false) + jade.attr("target", upload.link.target, true, false) + ">" + jade.escape(null == (jade_interp = upload.link.text) ? "" : jade_interp) + '</a></p><output><ul class="output-items"></ul></output></div>');
            }
            if (data.policy) {
                var policy = JSON.parse(JSON.stringify(data.policy));
                buf.push('<p class="jecoute-policy"><label><input type="checkbox" name="policy" required="required"/><span><em>' + jade.escape(null == (jade_interp = policy.text) ? "" : jade_interp) + "</em><a" + jade.attr("href", policy.link.href, true, false) + jade.attr("target", policy.link.target, true, false) + ">" + jade.escape(null == (jade_interp = policy.link.text) ? "" : jade_interp) + "</a></span></label></p>");
            }
            buf.push('<button type="submit"' + jade.attr("title", data.button_title, true, false) + ' class="button secondary action">' + jade.escape(null == (jade_interp = data.button) ? "" : jade_interp) + '</button></form><p class="jecoute-message"></p></div></div>');
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["jecoute"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include jecoute\n\n+jecoute(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Champs pré-remplis</h2><div class="lsg-component">');
        jade_mixins["jecoute"](values);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include jecoute\n\n+jecoute(" + jade.escape((jade_interp = JSON.stringify(values, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Avec ajout de fichiers</h2><div class="lsg-component">');
        jade_mixins["jecoute"](with_files);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include jecoute\n\n+jecoute(" + jade.escape((jade_interp = JSON.stringify(with_files, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "values" in locals_for_with ? locals_for_with.values : typeof values !== "undefined" ? values : undefined, "with_files" in locals_for_with ? locals_for_with.with_files : typeof with_files !== "undefined" ? with_files : undefined);
    return buf.join("");
};

// jecoute/jecoute.jade compiled template
templatizer["jecoute"]["jecoute"] = function tmpl_jecoute_jecoute(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// news-push/index.jade compiled template
templatizer["news-push"]["index"] = function tmpl_news_push_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, title, without_link) {
        jade_mixins["news-push"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-news-push"><div class="news-push-wrapper"><div class="news-push-after"></div>');
            title = [ data.title ];
            if (data.image.credit) {
                title.push("(" + data.image.credit + ")");
            }
            buf.push("<a" + jade.attr("href", data.href, true, false) + ' class="news-push-image"><img' + jade.attr("src", data.image.src, true, false) + ' alt=""' + jade.attr("title", title.join(" "), true, false) + '/></a><div class="news-push-content"><h2 class="news-push-title"><span>' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</span></h2><p class="news-push-content-text"><a' + jade.attr("href", data.href, true, false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</a>" + jade.escape(null == (jade_interp = " ") ? "" : jade_interp) + "<a" + jade.attr("href", data.href, true, false) + ' class="next">' + jade.escape(null == (jade_interp = data.follow) ? "" : jade_interp) + "</a></p></div></div>");
            if (data.link && data.link.href && data.link.text) {
                buf.push("<a" + jade.attr("href", data.link.href, true, false) + ' class="news-push-link"><span>' + jade.escape(null == (jade_interp = data.link.text) ? "" : jade_interp) + "</span></a>");
            }
            buf.push("</div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div style="padding:50px" class="lsg-component">');
        jade_mixins["news-push"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include news-push\n\n+news-push(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Sans lien supplémentaire</h2><div style="padding:50px" class="lsg-component">');
        jade_mixins["news-push"](without_link);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include news-push\n\n+news-push(" + jade.escape((jade_interp = JSON.stringify(without_link, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "title" in locals_for_with ? locals_for_with.title : typeof title !== "undefined" ? title : undefined, "without_link" in locals_for_with ? locals_for_with.without_link : typeof without_link !== "undefined" ? without_link : undefined);
    return buf.join("");
};

// news-push/news-push.jade compiled template
templatizer["news-push"]["news-push"] = function tmpl_news_push_news_push(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// links/index.jade compiled template
templatizer["links"]["index"] = function tmpl_links_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, without_title) {
        jade_mixins["links"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-links">');
            if (data.title) {
                buf.push("<h2>" + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
            }
            buf.push('<ul class="links-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
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
                        buf.push("<li" + jade.cls([ "links-item", item.modifiers ], [ null, true ]) + "><a" + jade.attr("href", item.href, true, false) + jade.attr("target", item.target, true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
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
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["links"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include links\n\n+links(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Sans titre</h2><div class="lsg-component">');
        jade_mixins["links"](without_title);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include links\n\n+links(" + jade.escape((jade_interp = JSON.stringify(without_title, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "without_title" in locals_for_with ? locals_for_with.without_title : typeof without_title !== "undefined" ? without_title : undefined);
    return buf.join("");
};

// links/links.jade compiled template
templatizer["links"]["links"] = function tmpl_links_links(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// place/index.jade compiled template
templatizer["place"]["index"] = function tmpl_place_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, button, defaults, long_address, modifiers, multiple_items, without_button) {
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
        jade_mixins["place"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-place"><div class="place-content">');
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
                button = JSON.parse(JSON.stringify(data.button));
                button.modifiers = [ "marker" ];
                jade_mixins["button"](button);
            }
            buf.push("</div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["place"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include place\n\n+place(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Avec plusieurs items</h2><div class="lsg-component">');
        jade_mixins["place"](multiple_items);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include place\n\n+place(" + jade.escape((jade_interp = JSON.stringify(multiple_items, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Sans bouton</h2><div class="lsg-component">');
        jade_mixins["place"](without_button);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include place\n\n+place(" + jade.escape((jade_interp = JSON.stringify(without_button, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Adresse sur plusieurs lignes</h2><div class="lsg-component">');
        jade_mixins["place"](long_address);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include place\n\n+place(" + jade.escape((jade_interp = JSON.stringify(long_address, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "button" in locals_for_with ? locals_for_with.button : typeof button !== "undefined" ? button : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "long_address" in locals_for_with ? locals_for_with.long_address : typeof long_address !== "undefined" ? long_address : undefined, "modifiers" in locals_for_with ? locals_for_with.modifiers : typeof modifiers !== "undefined" ? modifiers : undefined, "multiple_items" in locals_for_with ? locals_for_with.multiple_items : typeof multiple_items !== "undefined" ? multiple_items : undefined, "without_button" in locals_for_with ? locals_for_with.without_button : typeof without_button !== "undefined" ? without_button : undefined);
    return buf.join("");
};

// place/place.jade compiled template
templatizer["place"]["place"] = function tmpl_place_place(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(modifiers) {
        jade_mixins["button"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            modifiers = data.modifiers || [];
            attributes = data.attributes || [];
            if (data.href) {
                if (data.icon) {
                    modifiers.push("icon");
                }
                buf.push("<a" + jade.attrs(jade.merge([ {
                    href: jade.escape(data.href),
                    title: jade.escape(data.title),
                    target: jade.escape(data.target),
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">");
                if (modifiers && modifiers.indexOf("marker") !== -1) {
                    buf.push('<i class="icon icon-marker"></i>');
                } else if (data.icon) {
                    buf.push("<i" + jade.cls([ "icon", "icon-" + data.icon + "" ], [ null, true ]) + "></i>");
                }
                buf.push('<span class="button-text">' + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</span></a>");
            } else {
                buf.push("<button" + jade.attrs(jade.merge([ {
                    "class": (jade_interp = [ null, true ], jade.joinClasses([ "button", modifiers ].map(jade.joinClasses).map(function(cls, i) {
                        return jade_interp[i] ? jade.escape(cls) : cls;
                    })))
                }, attributes ]), false) + ">" + jade.escape(null == (jade_interp = data.text) ? "" : jade_interp) + "</button>");
            }
        };
    }).call(this, "modifiers" in locals_for_with ? locals_for_with.modifiers : typeof modifiers !== "undefined" ? modifiers : undefined);
    return buf.join("");
};

// postit/index.jade compiled template
templatizer["postit"]["index"] = function tmpl_postit_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, with_block) {
        jade_mixins["postit"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "component", "component-postit", data ? data.modifiers : [] ], [ null, null, true ]) + ">");
            if (data.title) {
                buf.push('<h2 id="postit" class="anchor">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + "</h2>");
            }
            if (block) {
                block && block();
            } else if (data.block) {
                buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
            } else {
                buf.push("<p>postit</p>");
            }
            buf.push("</div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<p>Ce composant accepte un bloc (ou un paramètre <code>block</code>) contenant du code HTML.</p><h2>Standard</h2><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["postit"](with_block);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include postit\n\n+postit(" + jade.escape((jade_interp = JSON.stringify(with_block, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>En passant sous forme de bloc</h2><div style="max-width: 770px" class="lsg-component">');
        jade_mixins["postit"].call({
            block: function() {
                buf.push("<h2>Informations complémentaires</h2><p>Prélèvement factures émises en novembre et décembre 2014<br/>Pour les familles qui n’ont pas été prélevées au mois de novembre, une modification du calendrier des prélèvements a été effectuée :<br/>Le  12 décembre au lieu du 17 novembre<br/>Le 29 décembre au lieu du 17décembre</p><p>Pour les familles qui avaient envoyé un chèque à la régie facil’familles en règlement de cette facture celui-ci sera retourné.</p><h3>Paiement par CESU</h3><p>Les CESU peuvent être utilisés pour payer des avis des sommes à payer du<a href=\"#\">Trésor Public</a></p><p>Facil'familles n'est pas autorisé à encaisser des avoirs sans facture attestant d'un service fait, générant une dette de l'usager.</p><p>Contestations sur factures DFPE concernant la période pré-FF :</p><p>Les dossiers des usagers concernés doivent être dirigés vers l’équipe FF via le formulaire.</p><p>Comment faire apposer le cachet de la Ville De Paris sur une attestation CESU ?</p><p>Auprès du directeur du CDL pour les Centres De Loisirs ou du directeur d’école pour les goûters et l’étude surveillée.</p><h3>Paiement de factures en plusieurs fois</h3><p>Il est possible de payer une facture en plusieurs fois par chèque ou en numéraire à condition d’effectuer les paiements avant la date limite indiquée. Il est  possible en complément d’un paiement émis par un tiers (parents, famille, assistante sociale…), de payer une facture  avec des chèques de CE à l’ordre de Facil’Familles couvrant en partie ou en totalité le montant de la facture.</p><h3>L’avoir reportable</h3><p>L’avoir reportable sur les factures suivantes passe de 100 à 400 €, ce qui permet de régler la majorité des cas par avoir de manière simple. En cas d’erreur sur la facture, la famille peut donc payer, et un avoir sera appliqué sur les factures suivantes. L'avis des sommes à payer en erreur ne doit pas être payé.</p><h3>Demande de numéro d’agrément</h3><p>L'usager peut le demander au directeur du Centre De Loisirs ou à la Circonscription des Affaires scolaires dont dépend le Centre De Loisirs</p><p>Les chèques envoyés avec du retard à Facil’Familles sont retournés à l’expéditeur avec une partie qui est découpée.</p><p>La bande en bas du chèque (avec des numéros) est découpée afin que personne ne puisse encaisser le chèque par erreur ou de manière malveillante (si le courrier était intercepté par exemple).</p><h3>Appel d’un directeur d’école</h3><p>Lui indiquer qu'il dispose d'un téléphone dédié uniquement pour les directeurs d’écoles(01 71 27 16 57) ou une adresse mail à : cfacil.facilfamilles@paris.fr</p><h3>Appel d’une régie d’établissement</h3><p>Les régies d’arrondissements ont un numéro de téléphone dédié le 01 71 27 14 43. (ne pas communiquer aux usagers)</p><p>Directeurs de centres de loisirs :Peuvent transmettre des signalements via l’adresse mail : facturation.facilfamilles@paris.fr, adresse qu’ils ne doivent absolument pas communiquer aux familles.</p><p>N°SIRET de la Ville : 217 500 016 000 19</p>");
            }
        }, {});
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include postit\n\n+postit({})");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "with_block" in locals_for_with ? locals_for_with.with_block : typeof with_block !== "undefined" ? with_block : undefined);
    return buf.join("");
};

// postit/postit.jade compiled template
templatizer["postit"]["postit"] = function tmpl_postit_postit(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// table/index.jade compiled template
templatizer["table"]["index"] = function tmpl_table_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, lots_of_cols) {
        jade_mixins["table"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-table"><table' + jade.attr("summary", data.summary, true, false) + ">");
            if (data.caption) {
                buf.push("<caption>" + jade.escape(null == (jade_interp = data.caption) ? "" : jade_interp) + "</caption>");
            }
            if (block) {
                block && block();
            } else if (data.block) {
                buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
            }
            buf.push("</table></div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div style="width: 770px" class="lsg-component">');
        jade_mixins["table"].call({
            block: function() {
                buf.push('<tbody><tr><th class="emphasis">Combien de personnes à loger ?</th><th>Logement A</th><th>Logement B</th><th>Logement C</th><th>Logement D</th></tr><tr><td class="emphasis">1 personne</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td></tr><tr><td class="emphasis">2 personnes sans personne à charge / jeunes ménages exclus</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td></tr><tr><td class="emphasis">3 personnes ou 1 personne seule avec 1 personne à charge ou jeune ménage*</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td></tr><tr><td class="emphasis">4 personnes ou 1 personne seule avec 2 personnes à charge</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td></tr><tr><td class="emphasis">5 personnes ou 1 personne seule avec 3 personnes à charge</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td></tr><tr><td class="emphasis">6 personnes ou 1 personne seule avec 4 personnes à charge</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td></tr><tr class="info"><td class="emphasis">par personne supplémentaire</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td><td>12 662 €</td></tr></tbody><tfoot><tr><td colspan="5">* jeune ménage = couple marié, concubins ou pacsés, sans personne à charge, dont la somme des âges des deux conjoints est inférieure ou égale à 55 ans.</td></tr></tfoot>');
            }
        }, defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include table\n\n+table(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n  // passer en block le contenu du tableau : tbody etc.\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Nombreuses colonnes</h2><div style="width: 770px" class="lsg-component">');
        jade_mixins["table"](lots_of_cols);
        buf.push("</div>");
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "lots_of_cols" in locals_for_with ? locals_for_with.lots_of_cols : typeof lots_of_cols !== "undefined" ? lots_of_cols : undefined);
    return buf.join("");
};

// table/table.jade compiled template
templatizer["table"]["table"] = function tmpl_table_table(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// text/index.jade compiled template
templatizer["text"]["index"] = function tmpl_text_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, with_block) {
        jade_mixins["text"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "component", "component-text", data ? data.modifiers : [] ], [ null, null, true ]) + ">");
            if (block) {
                block && block();
            } else if (data.block) {
                buf.push(null == (jade_interp = data.block) ? "" : jade_interp);
            } else {
                buf.push("<p>text</p>");
            }
            buf.push("</div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<p>Ce composant accepte un bloc (ou un paramètre <code>block</code>) contenant du code HTML.</p><h2>Standard</h2><div style="max-width: 700px" class="lsg-component">');
        jade_mixins["text"](with_block);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include text\n\n+text(" + jade.escape((jade_interp = JSON.stringify(with_block, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>En passant sous forme de bloc</h2><div style="max-width: 700px" class="lsg-component">');
        jade_mixins["text"].call({
            block: function() {
                buf.push('<h2>Titre de niveau 2</h2><p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent&nbsp;<a href="#">lien d\'exemple</a> vel libero magna. Morbi viverra quam orci, ultrices dapibus sem aliquam ut</p><ul><li>Élément de liste</li><li>Élément de liste</li><li>Élément de liste long. Nullam quis risus eget urna mollis ornare vel eu leo. Lorem ipsum&nbsp;<a href="#">lien d\'exemple</a> dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla.</li></ul>');
            }
        });
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include text\ninclude ../../modules/button/button\n\n+text\n  h2 Titre de niveau 2\n  p\n    | Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent&nbsp;\n    a(href='#') lien d'exemple\n    |  vel libero magna. Morbi viverra quam orci, ultrices dapibus sem aliquam ut\n  ul\n    li Élément de liste\n    li Élément de liste\n    li\n      | Élément de liste long. Nullam quis risus eget urna mollis ornare vel eu leo. Lorem ipsum&nbsp;\n      a(href='#') lien d'exemple\n      |  dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla.");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "with_block" in locals_for_with ? locals_for_with.with_block : typeof with_block !== "undefined" ? with_block : undefined);
    return buf.join("");
};

// text/text.jade compiled template
templatizer["text"]["text"] = function tmpl_text_text(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};

// sharelines/index.jade compiled template
templatizer["sharelines"]["index"] = function tmpl_sharelines_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, share) {
        jade_mixins["share"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
            if (data.items && data.items.length) {
                buf.push('<ul class="share-items">');
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    }
                }).call(this);
                buf.push("</ul>");
            }
            buf.push("</div>");
        };
        jade_mixins["sharelines"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-sharelines"><h2 class="sharelines-title">' + jade.escape(null == (jade_interp = data.title) ? "" : jade_interp) + '</h2><ul class="sharelines-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="sharelines-item">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        share = JSON.parse(JSON.stringify(item.share));
                        share.modifiers = [ "circles" ];
                        jade_mixins["share"](share);
                        buf.push("</li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="sharelines-item">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp));
                        share = JSON.parse(JSON.stringify(item.share));
                        share.modifiers = [ "circles" ];
                        jade_mixins["share"](share);
                        buf.push("</li>");
                    }
                }
            }).call(this);
            buf.push("</ul></div>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["sharelines"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include sharelines\n\n+sharelines(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<p>Pour plus d\'information sur les URL de partage, voir le module&nbsp;<a href="../../modules/share">share</a>.</p>');
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "share" in locals_for_with ? locals_for_with.share : typeof share !== "undefined" ? share : undefined);
    return buf.join("");
};

// sharelines/sharelines.jade compiled template
templatizer["sharelines"]["sharelines"] = function tmpl_sharelines_sharelines(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    jade_mixins["share"] = jade_interp = function(data) {
        var block = this && this.block, attributes = this && this.attributes || {};
        buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
        if (data.items && data.items.length) {
            buf.push('<ul class="share-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
        buf.push("</div>");
    };
    return buf.join("");
};

// verbatim/index.jade compiled template
templatizer["verbatim"]["index"] = function tmpl_verbatim_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, share) {
        jade_mixins["share"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
            if (data.items && data.items.length) {
                buf.push('<ul class="share-items">');
                (function() {
                    var $$obj = data.items;
                    if ("number" == typeof $$obj.length) {
                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var item = $$obj[$index];
                            buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                        }
                    }
                }).call(this);
                buf.push("</ul>");
            }
            buf.push("</div>");
        };
        jade_mixins["verbatim"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<blockquote class="component component-verbatim"><p class="verbatim-text">' + jade.escape(null == (jade_interp = data.quote) ? "" : jade_interp) + '</p><footer><div class="verbatim-separate"></div><cite><div class="verbatim-author">' + jade.escape(null == (jade_interp = data.author) ? "" : jade_interp) + ',</div><div class="verbatim-function">' + jade.escape(null == (jade_interp = data.function) ? "" : jade_interp) + "</div></cite>");
            share = JSON.parse(JSON.stringify(data.share));
            share.modifiers = [ "circles" ];
            jade_mixins["share"](share);
            buf.push("</footer></blockquote>");
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<h2>Standard</h2><div class="lsg-component">');
        jade_mixins["verbatim"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include verbatim\n\n+verbatim(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<p>Pour plus d\'information sur les URL de partage, voir le module&nbsp;<a href="../../modules/share">share</a>.</p>');
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "share" in locals_for_with ? locals_for_with.share : typeof share !== "undefined" ? share : undefined);
    return buf.join("");
};

// verbatim/verbatim.jade compiled template
templatizer["verbatim"]["verbatim"] = function tmpl_verbatim_verbatim(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    jade_mixins["share"] = jade_interp = function(data) {
        var block = this && this.block, attributes = this && this.attributes || {};
        buf.push("<div" + jade.cls([ "share", data.modifiers ], [ null, true ]) + ">");
        if (data.items && data.items.length) {
            buf.push('<ul class="share-items">');
            (function() {
                var $$obj = data.items;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var item = $$obj[$index];
                        buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        var item = $$obj[$index];
                        buf.push('<li class="share-item"><a' + jade.attr("href", item.href, true, false) + jade.attr("title", item.title, true, false) + ' target="_blank"><i aria-hidden="true"' + jade.cls([ "share-icon", "icon-" + item.icon + "" ], [ null, true ]) + '></i><span class="hidden-accessibly">' + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</span></a></li>");
                    }
                }
            }).call(this);
            buf.push("</ul>");
        }
        buf.push("</div>");
    };
    return buf.join("");
};

// video/index.jade compiled template
templatizer["video"]["index"] = function tmpl_video_index(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(JSON, defaults, without_cookie) {
        jade_mixins["video"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<div class="component component-video"><div class="video-wrapper">');
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
        };
        jade_mixins["code"] = jade_interp = function(data) {
            var block = this && this.block, attributes = this && this.attributes || {};
            buf.push('<pre class="prism"><code class="language-jade">');
            block && block();
            buf.push("</code></pre>");
        };
        buf.push('<p>Ce composant accepte un bloc (ou un paramètre <code>block</code>) contenant un code HTML d\'embed de vidéo. Il adapte automatiquement la taille de l\'<code>iframe</code> en conservant un ratio 16/9.</p><h2>Standard</h2><div style="max-width: 500px" class="lsg-component">');
        jade_mixins["video"](defaults);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include video\n\n+video(" + jade.escape((jade_interp = JSON.stringify(defaults, null, 2)) == null ? "" : jade_interp) + ")\n");
            }
        }, {
            language: "jade"
        });
        buf.push('<h2>Sans prendre en compte le cookie</h2><div style="max-width: 500px" class="lsg-component">');
        jade_mixins["video"](without_cookie);
        buf.push("</div>");
        jade_mixins["code"].call({
            block: function() {
                buf.push("include video\n\n+video(" + jade.escape((jade_interp = JSON.stringify(without_cookie, null, 2)) == null ? "" : jade_interp) + ")");
            }
        }, {
            language: "jade"
        });
    }).call(this, "JSON" in locals_for_with ? locals_for_with.JSON : typeof JSON !== "undefined" ? JSON : undefined, "defaults" in locals_for_with ? locals_for_with.defaults : typeof defaults !== "undefined" ? defaults : undefined, "without_cookie" in locals_for_with ? locals_for_with.without_cookie : typeof without_cookie !== "undefined" ? without_cookie : undefined);
    return buf.join("");
};

// video/video.jade compiled template
templatizer["video"]["video"] = function tmpl_video_video(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    return buf.join("");
};


module.exports = templatizer;
