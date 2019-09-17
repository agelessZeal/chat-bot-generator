function SingleConvState(e) {
    return this.input = e, this.next = !1, this
}

function ConvState(e, t, i, n) {
    this.form = i, this.wrapper = e, this.current = t, this.answers = {}, this.parameters = n, this.scrollDown = function() {
        $(this.wrapper).closest(".chat-container").length > 0 ? $(this.wrapper).stop().animate({
            scrollTop: $(this.wrapper).find("#messages")[0].scrollHeight
        }, 600) : $(this.wrapper).find(".wrapper-messages").stop().animate({
            scrollTop: $(this.wrapper).find("#messages")[0].scrollHeight
        }, 600)
    }.bind(this)
}! function(e, t) {
    if ("function" == typeof define && define.amd) define(["exports", "module"], t);
    else if ("undefined" != typeof exports && "undefined" != typeof module) t(exports, module);
    else {
        var i = {
            exports: {}
        };
        t(i.exports, i), e.autosize = i.exports
    }
}(this, function(e, t) {
    "use strict";

    function i(e) {
        function t(t) {
            var i = e.style.width;
            e.style.width = "0px", e.offsetWidth, e.style.width = i, e.style.overflowY = t
        }

        function i() {
            var t = e.style.height,
                i = function(e) {
                    for (var t = []; e && e.parentNode && e.parentNode instanceof Element;) e.parentNode.scrollTop && t.push({
                        node: e.parentNode,
                        scrollTop: e.parentNode.scrollTop
                    }), e = e.parentNode;
                    return t
                }(e),
                n = document.documentElement && document.documentElement.scrollTop;
            e.style.height = "auto";
            var s = e.scrollHeight + r;
            return 0 === e.scrollHeight ? void(e.style.height = t) : (e.style.height = s + "px", a = e.clientWidth, i.forEach(function(e) {
                e.node.scrollTop = e.scrollTop
            }), void(n && (document.documentElement.scrollTop = n)))
        }

        function n() {
            i();
            var n = Math.round(parseFloat(e.style.height)),
                r = window.getComputedStyle(e, null),
                a = Math.round(parseFloat(r.height));
            if (a !== n ? "visible" !== r.overflowY && (t("visible"), i(), a = Math.round(parseFloat(window.getComputedStyle(e, null).height))) : "hidden" !== r.overflowY && (t("hidden"), i(), a = Math.round(parseFloat(window.getComputedStyle(e, null).height))), s !== a) {
                s = a;
                var o = p("autosize:resized");
                try {
                    e.dispatchEvent(o)
                } catch (e) {}
            }
        }
        if (e && e.nodeName && "TEXTAREA" === e.nodeName && !o.has(e)) {
            var r = null,
                a = e.clientWidth,
                s = null,
                u = function() {
                    e.clientWidth !== a && n()
                },
                l = function(t) {
                    window.removeEventListener("resize", u, !1), e.removeEventListener("input", n, !1), e.removeEventListener("keyup", n, !1), e.removeEventListener("autosize:destroy", l, !1), e.removeEventListener("autosize:update", n, !1), Object.keys(t).forEach(function(i) {
                        e.style[i] = t[i]
                    }), o.delete(e)
                }.bind(e, {
                    height: e.style.height,
                    resize: e.style.resize,
                    overflowY: e.style.overflowY,
                    overflowX: e.style.overflowX,
                    wordWrap: e.style.wordWrap
                });
            e.addEventListener("autosize:destroy", l, !1), "onpropertychange" in e && "oninput" in e && e.addEventListener("keyup", n, !1), window.addEventListener("resize", u, !1), e.addEventListener("input", n, !1), e.addEventListener("autosize:update", n, !1), e.style.overflowX = "hidden", e.style.wordWrap = "break-word", o.set(e, {
                destroy: l,
                update: n
            }), "vertical" === (d = window.getComputedStyle(e, null)).resize ? e.style.resize = "none" : "both" === d.resize && (e.style.resize = "horizontal"), r = "content-box" === d.boxSizing ? -(parseFloat(d.paddingTop) + parseFloat(d.paddingBottom)) : parseFloat(d.borderTopWidth) + parseFloat(d.borderBottomWidth), isNaN(r) && (r = 0), n()
        }
        var d
    }

    function n(e) {
        var t = o.get(e);
        t && t.destroy()
    }

    function r(e) {
        var t = o.get(e);
        t && t.update()
    }
    var a, s, o = "function" == typeof Map ? new Map : (a = [], s = [], {
            has: function(e) {
                return a.indexOf(e) > -1
            },
            get: function(e) {
                return s[a.indexOf(e)]
            },
            set: function(e, t) {
                -1 === a.indexOf(e) && (a.push(e), s.push(t))
            },
            delete: function(e) {
                var t = a.indexOf(e);
                t > -1 && (a.splice(t, 1), s.splice(t, 1))
            }
        }),
        p = function(e) {
            return new Event(e, {
                bubbles: !0
            })
        };
    try {
        new Event("test")
    } catch (e) {
        p = function(e) {
            var t = document.createEvent("Event");
            return t.initEvent(e, !0, !1), t
        }
    }
    var u = null;
    "undefined" == typeof window || "function" != typeof window.getComputedStyle ? ((u = function(e) {
        return e
    }).destroy = function(e) {
        return e
    }, u.update = function(e) {
        return e
    }) : ((u = function(e, t) {
        return e && Array.prototype.forEach.call(e.length ? e : [e], function(e) {
            return i(e)
        }), e
    }).destroy = function(e) {
        return e && Array.prototype.forEach.call(e.length ? e : [e], n), e
    }, u.update = function(e) {
        return e && Array.prototype.forEach.call(e.length ? e : [e], r), e
    }), t.exports = u
}), SingleConvState.prototype.hasNext = function() {
    return this.next
}, ConvState.prototype.next = function() {
    if (this.current.input.hasOwnProperty("callback") && window[this.current.input.callback](this), this.current.hasNext()) {
        if (this.current = this.current.next, this.current.input.hasOwnProperty("fork") && this.current.input.hasOwnProperty("case")) {
            if (this.answers.hasOwnProperty(this.current.input.fork) && this.answers[this.current.input.fork].value != this.current.input.case) return this.next();
            if (!this.answers.hasOwnProperty(this.current.input.fork)) return this.next()
        }
        return !0
    }
    return !1
}, ConvState.prototype.printQuestion = function() {
    var e = this.current.input.questions,
        t = e[Math.floor(Math.random() * e.length)],
        i = t.match(/\{(.*?)\}(\:(\d)*)?/g);
    for (var n in i)
        if (i.hasOwnProperty(n)) {
            var r = i[n].replace(/\{|\}/g, ""),
                a = r,
                s = !1;
            if (-1 != r.indexOf(":") && (a = a.split(":")[0], s = r.split(":")[1]), !1 !== s) {
                var o = this.answers[a].text.split(" ");
                t = o.length >= s ? t.replace(i[n], o[s]) : t.replace(i[n], this.answers[a].text)
            } else t = t.replace(i[n], this.answers[a].text)
        }
    var p = $('<div class="message to typing"><div class="typing_loader"></div></div>');
    setTimeout(function() {
        $(this.wrapper).find("#messages").append(p), this.scrollDown()
    }.bind(this), 100), setTimeout(function() {
        p.html(t), p.removeClass("typing").addClass("ready"), "select" == this.current.input.type && this.printAnswers(this.current.input.answers, this.current.input.multiple), this.scrollDown(), this.current.input.hasOwnProperty("noAnswer") && (this.next() ? setTimeout(function() {
            this.printQuestion()
        }.bind(this), 500) : this.parameters.eventList.onSubmitForm(this)), $(this.wrapper).find(this.parameters.inputIdHashTagName).focus()
    }.bind(this), 800)
}, ConvState.prototype.printAnswers = function(e, t) {
    if (this.wrapper.find("div.options div.option").remove(), t) {
        for (var i in e)
            if (e.hasOwnProperty(i)) {
                var n = $('<div class="option">' + e[i].text + "</div>").data("answer", e[i]).click(function(e) {
                    var t = this.current.input.selected.indexOf($(e.target).data("answer").value); - 1 == t ? (this.current.input.selected.push($(e.target).data("answer").value), $(e.target).addClass("selected")) : (this.current.input.selected.splice(t, 1), $(e.target).removeClass("selected")), this.wrapper.find(this.parameters.inputIdHashTagName).removeClass("error"), this.wrapper.find(this.parameters.inputIdHashTagName).val(""), this.current.input.selected.length > 0 ? this.wrapper.find("button.submit").addClass("glow") : this.wrapper.find("button.submit").removeClass("glow")
                }.bind(this));
                this.wrapper.find("div.options").append(n), $(window).trigger("dragreset")
            }
    } else
        for (var i in e)
            if (e.hasOwnProperty(i)) {
                n = $('<div class="option">' + e[i].text + "</div>").data("answer", e[i]).click(function(e) {
                    this.current.input.selected = $(e.target).data("answer").value, this.wrapper.find(this.parameters.inputIdHashTagName).removeClass("error"), this.wrapper.find(this.parameters.inputIdHashTagName).val(""), this.answerWith($(e.target).data("answer").text, $(e.target).data("answer")), this.wrapper.find("div.options div.option").remove()
                }.bind(this));
                this.wrapper.find("div.options").append(n), $(window).trigger("dragreset")
            } var r = $(this.wrapper).find("div.options").height();
    $(this.wrapper).find("#messages").css({
        paddingBottom: r
    })
}, ConvState.prototype.answerWith = function(e, t) {
    this.current.input.hasOwnProperty("name") && ("string" == typeof t ? ("tel" == this.current.input.type && (t = t.replace(/\s|\(|\)|-/g, "")), this.answers[this.current.input.name] = {
        text: e,
        value: t
    }) : this.answers[this.current.input.name] = t, "select" != this.current.input.type || this.current.input.multiple ? $(this.current.input.element).val(t).change() : $(this.current.input.element).val(t.value).change()), "password" == this.current.input.type && (e = e.replace(/./g, "*"));
    var i = $('<div class="message from">' + e + "</div>");
    $(this.wrapper).find("div.options div.option").remove();
    var n = $(this.wrapper).find("div.options").height();
    $(this.wrapper).find("#messages").css({
        paddingBottom: n
    }), $(this.wrapper).find(this.parameters.inputIdHashTagName).focus(), t.hasOwnProperty("callback") && window[t.callback](this), setTimeout(function() {
        $(this.wrapper).find("#messages").append(i), this.scrollDown()
    }.bind(this), 300), $(this.form).append(this.current.input.element), this.next() ? setTimeout(function() {
        this.printQuestion()
    }.bind(this), 300) : this.parameters.eventList.onSubmitForm(this)
},
    function(e) {
        e.fn.convform = function(t) {
            var i = e.extend(!0, {}, {
                    placeHolder: "Type Here / Select Option From Above",
                    typeInputUi: "textarea",
                    timeOutFirstQuestion: 1200,
                    buttonClassStyle: "icon2-arrow",
                    eventList: {
                        onSubmitForm: function(e) {
                            return console.log("completed"), e.form.submit(), !0
                        }
                    },
                    formIdName: "convForm",
                    inputIdName: "userInput",
                    loadSpinnerVisible: ""
                }, t),
                n = e(this).find("input, select, textarea").map(function() {
                    var t = {};
                    return e(this).attr("name") && (t.name = e(this).attr("name")), e(this).attr("no-answer") && (t.noAnswer = !0), e(this).attr("required") && (t.required = !0), e(this).attr("type") && (t.type = e(this).attr("type")), t.questions = e(this).attr("conv-question").split("|"), e(this).attr("pattern") && (t.pattern = e(this).attr("pattern")), e(this).attr("callback") && (t.callback = e(this).attr("callback")), e(this).is("select") && (t.type = "select", t.answers = e(this).find("option").map(function() {
                        var t = {};
                        return t.text = e(this).text(), t.value = e(this).val(), e(this).attr("callback") && (t.callback = e(this).attr("callback")), t
                    }).get(), e(this).prop("multiple") ? (t.multiple = !0, t.selected = []) : (t.multiple = !1, t.selected = "")), e(this).parent("div[conv-case]").length && (t.case = e(this).parent("div[conv-case]").attr("conv-case"), t.fork = e(this).parent("div[conv-case]").parent("div[conv-fork]").attr("conv-fork")), t.element = this, e(this).detach(), t
                }).get();
            if (n.length) {
                var r, a = e(this).find("form").hide();
                switch (i.inputIdHashTagName = "#" + i.inputIdName, i.typeInputUi) {
                    case "input":
                        r = e('<form id="' + i.formIdName + '" class="convFormDynamic"><div class="options dragscroll"></div><input id="' + i.inputIdName + '" type="text" placeholder="' + i.placeHolder + '" class="userInputDynamic"></><button type="submit" class="submit"><i class="fa fa-caret-right"></i></button><span class="clear"></span></form>');
                        break;
                    case "textarea":
                        r = e('<form id="' + i.formIdName + '" class="convFormDynamic"><div class="options dragscroll"></div><textarea id="' + i.inputIdName + '" rows="1" placeholder="' + i.placeHolder + '" class="userInputDynamic"></textarea><button type="submit" class="submit"><i class="fa fa-caret-right"></i></button><span class="clear"></span></form>');
                        break;
                    default:
                        return console.log("typeInputUi must be input or textarea"), !1
                }
                e(this).append('<div class="wrapper-messages"><div class="spinLoader ' + i.loadSpinnerVisible + ' "></div><div id="messages"></div></div>'), e(this).append(r);
                var s = new SingleConvState(n[0]),
                    o = new ConvState(this, s, a, i);
                for (var p in n) 0 != p && n.hasOwnProperty(p) && (s.next = new SingleConvState(n[p]), s = s.next);
                return setTimeout(function() {
                    e.when(e("div.spinLoader").addClass("hidden")).done(function() {
                        o.printQuestion()
                    })
                }, i.timeOutFirstQuestion), e(r).find(i.inputIdHashTagName).keypress(function(t) {
                    if (13 == t.which) {
                        var n = e(this).val();
                        if (t.preventDefault(), "select" != o.current.input.type || o.current.input.multiple)
                            if ("select" == o.current.input.type && o.current.input.multiple) {
                                var r;
                                if ("" != n.trim())(r = o.current.input.answers.filter(function(e) {
                                    return -1 != e.text.toLowerCase().indexOf(n.toLowerCase())
                                })).length ? -1 == o.current.input.selected.indexOf(r[0].value) ? (o.current.input.selected.push(r[0].value), o.wrapper.find(i.inputIdHashTagName).val("")) : o.wrapper.find(i.inputIdHashTagName).val("") : o.wrapper.find(i.inputIdHashTagName).addClass("error");
                                else o.current.input.selected.length && e(this).parent("form").submit()
                            } else "" == n.trim() || o.wrapper.find(i.inputIdHashTagName).hasClass("error") ? e(o.wrapper).find(i.inputIdHashTagName).focus() : e(this).parent("form").submit();
                        else if (o.current.input.required) o.wrapper.find("#userInputBot").addClass("error");
                        else(r = o.current.input.answers.filter(function(e) {
                                return -1 != e.text.toLowerCase().indexOf(n.toLowerCase())
                            })).length ? (o.current.input.selected = r[0], e(this).parent("form").submit()) : o.wrapper.find(i.inputIdHashTagName).addClass("error")
                    }
                    autosize.update(e(o.wrapper).find(i.inputIdHashTagName))
                }).on("input", function(t) {
                    if ("select" == o.current.input.type) {
                        var n = e(this).val(),
                            r = o.current.input.answers.filter(function(e) {
                                return -1 != e.text.toLowerCase().indexOf(n.toLowerCase())
                            });
                        r.length ? (o.wrapper.find(i.inputIdHashTagName).removeClass("error"), o.printAnswers(r, o.current.input.multiple)) : o.wrapper.find(i.inputIdHashTagName).addClass("error")
                    } else if (o.current.input.hasOwnProperty("pattern")) {
                        new RegExp(o.current.input.pattern, "i").test(e(this).val()) ? o.wrapper.find(i.inputIdHashTagName).removeClass("error") : o.wrapper.find(i.inputIdHashTagName).addClass("error")
                    }
                }), e(r).find("button.submit").click(function(t) {
                    var n = e(o.wrapper).find(i.inputIdHashTagName).val();
                    if (t.preventDefault(), "select" != o.current.input.type || o.current.input.multiple)
                        if ("select" == o.current.input.type && o.current.input.multiple) {
                            if (o.current.input.required) return !1;
                            "" != n.trim() && n != i.placeHolder ? (r = o.current.input.answers.filter(function(e) {
                                return -1 != e.text.toLowerCase().indexOf(n.toLowerCase())
                            })).length ? -1 == o.current.input.selected.indexOf(r[0].value) ? (o.current.input.selected.push(r[0].value), o.wrapper.find(i.inputIdHashTagName).val("")) : o.wrapper.find(i.inputIdHashTagName).val("") : o.wrapper.find(i.inputIdHashTagName).addClass("error") : o.current.input.selected.length && (e(this).removeClass("glow"), e(this).parent("form").submit())
                        } else "" == n.trim() || o.wrapper.find(i.inputIdHashTagName).hasClass("error") ? e(o.wrapper).find(i.inputIdHashTagName).focus() : e(this).parent("form").submit();
                    else {
                        if (o.current.input.required) return !1;
                        var r;
                        n == i.placeHolder && (n = ""), (r = o.current.input.answers.filter(function(e) {
                            return -1 != e.text.toLowerCase().indexOf(n.toLowerCase())
                        })).length ? (o.current.input.selected = r[0], e(this).parent("form").submit()) : o.wrapper.find(i.inputIdHashTagName).addClass("error")
                    }
                    autosize.update(e(o.wrapper).find(i.inputIdHashTagName))
                }), e(r).submit(function(t) {
                    t.preventDefault();
                    var n = e(this).find(i.inputIdHashTagName).val();
                    e(this).find(i.inputIdHashTagName).val(""), "select" == o.current.input.type ? o.current.input.multiple ? o.answerWith(o.current.input.selected.join(", "), o.current.input.selected) : o.answerWith(o.current.input.selected.text, o.current.input.selected) : o.answerWith(n, n)
                }), "function" == typeof autosize && ($textarea = e(o.wrapper).find(i.inputIdHashTagName), autosize($textarea)), o
            }
            return !1
        }
    }(jQuery), $(function() {
    var e = $(".conv-form-wrapper").convform();
    console.log(e)
});
var rollbackTo = !1,
    originalState = !1;

function storeState(e) {
    rollbackTo = e.current, console.log("storeState called: ", rollbackTo)
}

function rollback(e) {
    console.log("rollback called: ", rollbackTo, originalState), console.log("answers at the time of user input: ", e.answers), 0 != rollbackTo && (0 == originalState && (originalState = e.current.next, console.log("stored original state")), e.current.next = rollbackTo, console.log("changed current.next to rollbackTo"))
}

function restore(e) {
    0 != originalState && (e.current.next = originalState, console.log("changed current.next to originalState"))
}

function setCookie(e, t, i) {
    var n = new Date;
    n.setTime(n.getTime() + 24 * i * 60 * 60 * 1e3);
    var r = "expires=" + n.toGMTString();
    document.cookie = e + "=" + t + "; " + r + "; path=/"
}

function getCookie(e) {
    for (var t = e + "=", i = document.cookie.split(";"), n = 0; n < i.length; n++) {
        for (var r = i[n];
             " " == r.charAt(0);) r = r.substring(1);
        if (0 == r.indexOf(t)) return r.substring(t.length, r.length)
    }
    return ""
}

function popUpUtilDeviceDetect(e) {
    e = e || {};
    var t, i = /iPhone/i,
        n = /iPod/i,
        r = /iPad/i,
        a = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
        s = /Android/i,
        o = /IEMobile/i,
        p = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
        u = /BlackBerry/i,
        l = /BB10/i,
        d = /Opera Mini/i,
        c = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
        h = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
        f = function(e, t) {
            return e.test(t)
        },
        m = function(e) {
            var t = e || navigator.userAgent;
            return this.apple = {
                phone: f(i, t),
                ipod: f(n, t),
                tablet: f(r, t),
                device: f(i, t) || f(n, t) || f(r, t)
            }, this.android = {
                phone: f(a, t),
                tablet: !f(a, t) && f(s, t),
                device: f(a, t) || f(s, t)
            }, this.windows = {
                phone: f(o, t),
                tablet: f(p, t),
                device: f(o, t) || f(p, t)
            }, this.other = {
                blackberry: f(u, t),
                blackberry10: f(l, t),
                opera: f(d, t),
                firefox: f(c, t),
                device: f(u, t) || f(l, t) || f(d, t) || f(c, t)
            }, this.seven_inch = f(h, t), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, "undefined" == typeof window ? this : void 0
        };
    return e.isMobile = ((t = new m).Class = m, t), e.isMobile
}
$("#my_form").submit(function(e) {
    e.preventDefault();
    var t = $(this).attr("action"),
        i = $(this).serialize();
    $.post(t, i, function(e) {
        $("#server-results").html(e)
    })
}), jQuery(document).ready(function(e) {
    ("minimized" == getCookie("chat-window") || popUpUtilDeviceDetect().phone || popUpUtilDeviceDetect().tablet) && e(".chat-window-wrapper").addClass("click-minimized"), e(document).on("click", ".js-window-btn-minimize", function(t) {
        if (e(".chat-window-ctrl .js-window-btn-minimize").hasClass("active")) return !1;
        e(".chat-window-ctrl .js-window-btn-minimize").addClass("active"), e(".js-window-btn-maximize").removeClass("active"), e(".chat-window-wrapper").addClass(" minimized"), "minimized" == getCookie("chat-window") && e(".chat-window-wrapper").addClass("click-minimized"), setCookie("chat-window", "minimized", 1)
    }), e(document).on("click", ".js-window-btn-maximize", function(t) {
        return !e(".chat-window-ctrl .js-window-btn-maximize").hasClass("active") && ((void 0 === t.isTrigger || !e(".chat-window-wrapper").hasClass("click-minimized")) && (e(".chat-window-wrapper").removeClass(" minimized").removeClass("click-minimized"), void e(".js-window-btn-minimize").removeClass("active")))
    })
});
