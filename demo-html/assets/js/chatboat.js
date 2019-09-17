<script type = "text/javascript" >
var initClientChatBot = function (client_url, page, autoLoad) {
    if ((typeof jQuery == 'undefined')) {
        jQCheck(function () {
            initClientChatBot(client_url, page)
        }, 6);
        return !1
    }
    console.log('jQ ready');
    var tempUrl = client_url;
    if (page && page != null) {
        uiSetter(null, !0, client_url)
    } else {
        var tt = '';
        $.get(client_url, function (html) {
            tt = html;
            var tempTt = $(tt);
            for (var i = 0; i < tempTt.length; i++) {
                if (tempTt[i].nodeName == 'SECTION' && tempTt[i].className == 'chat-outer-wrapper' && tempTt[i].id == 'demo') {
                    console.log($(tt)[i]);
                    tt = $(tt)[i];
                    break
                }
            }
            uiSetter(tt, !1, client_url)
        })
    }
    if (autoLoad) {
        setTimeout(function () {
            $('.chat-window-wrapper').removeClass('minimized');
            $('.js-window-btn-minimize').removeClass('active');
        }, 1000 * autoLoad);
    }
};
var jQCheck = function (callback, tries) {
    if ((typeof jQuery == 'undefined')) {
        if (tries > 0) {
            console.log(tries);
            setTimeout(function () {
                jQCheck(callback, tries - 1)
            }, 5)
        } else {
            console.log('jQuery required to load chat bot so hot loading');
            resourceInjector(document, 'script', 'https://www.bots.ekwa.com/js/jquery-1.12.3.min.js', null, callback)
        }
    } else {
        callback()
    }
}
var uiSetter = function (html, page, link) {
    var cssResources = ["https://www.bots.ekwa.com/css/styles.css"];
    var jsResources = ["https://www.bots.ekwa.com/js/scripts.js"];
    var tempHtml = html;
    var tempURl = link.match(/^(?:https?:)?(?:\/\/)?([^\/\?]+)/)[0];
    var tempFilename = link.match(/(?:.+\/)(.+?)(\..+)?$/)[1];
    var bubbleImge = tempURl + '/img/' + tempFilename + '.png'
    if (page) {
        tempHtml = '<a target="_blank" href="' + link + '"><div class="chat-bubble-btn-wrapper chatprompt"><img src="' + bubbleImge + '" alt="Chat Bubble"></div></a>';
        $('body').append(tempHtml);
        resourceInjector(document, 'link', cssResources[0])
    } else {
        tempHtml = '<div class="chat-bubble-btn-wrapper chatprompt js-window-btn-maximize"><img src="' + bubbleImge + '" alt="Chat Bubble"></div>' + '<div class="chat-window-wrapper minimized chat-outer-wrapper">' + ' <div class="chat-window-ctrl">' + ' <div class="chat-ctrl-btn js-window-btn-minimize active"><i class="fa fa-minus-square"></i></div>' + ' </div>' + ' <div class="chat-container"> </div>' + '</div>';
        for (var i = 0; i < cssResources.length; i++) {
            resourceInjector(document, 'link', cssResources[i])
        }
        $('body').append(tempHtml);
        $('.chat-container').append(html);
        for (var i = 0; i < jsResources.length; i++) {
            resourceInjector(document, 'script', jsResources[i])
        }
    }
}
var resourceInjector = function (documentObj, element, link, traget, callback) {
    var tempElem = documentObj.createElement(element);
    if (callback) {
        tempElem.onload = function () {
            callback()
        }
    }
    if (element == 'script') {
        tempElem.async = !0;
        tempElem.src = link
    }
    if (element == 'link') {
        tempElem.href = link;
        tempElem.rel = 'stylesheet'
    }
    if (traget) {
        var tempTraget = documentObj.getElementsByTagName(traget)[0];
        tempTraget.parentNode.insertBefore(tempElem)
    } else {
        documentObj.body.appendChild(tempElem)
    }
}
initClientChatBot("https://www.bots.ekwa.com/Ext-2035.html", null, 10);
</script>
