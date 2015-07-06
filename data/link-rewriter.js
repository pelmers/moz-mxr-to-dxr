var tag = "moz-mxr-to-dxr";

self.port.on(tag, function(url) {
    var anchors = document.getElementsByTagName("a");
    for (var i = 0; i < anchors.length; i++) {
        if (anchors[i].href)
            anchors[i].href = anchors[i].href.replace("mxr.mozilla.org", url);
    }
});
