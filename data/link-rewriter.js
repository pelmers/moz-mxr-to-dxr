var tag = "moz-mxr-to-dxr";

self.port.on(tag, function(url) {
    var anchors = document.getElementsByTagName("a");
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].href = anchors[i].href.replace("mxr.mozilla.org", url);
        // Workaround pending fix of bug 1178103:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1178103
        if (anchors[i].href.endsWith("/")) {
            anchors[i].href = anchors[i].href.slice(0, -1);
        }
    }
});
