var prefs = require("sdk/simple-prefs"),
    pageMod = require("sdk/page-mod"),
    data = require("sdk/self").data,
    { Hotkey } = require("sdk/hotkeys"), hotkey,
    tabs = require("sdk/tabs"),
    mxrUrl = "mxr.mozilla.org",
    prodUrl = "dxr.mozilla.org",
    stageUrl = "dxr.allizom.org",
    tag = "moz-mxr-to-dxr";

// Return the url to the dxr server based on the pref of whether to use staging.
function dxrUrl() {
    return (prefs.prefs["useStaging"])?stageUrl:prodUrl;
}

// The hotkey toggles the page between MXR and DXR.
function loadHotkey() {
    if (hotkey)
        hotkey.destroy();
    hotkey = Hotkey({combo: prefs.prefs['hotkey'], onPress: function() {
        if (tabs.activeTab.url.indexOf(mxrUrl) !== -1) {
            tabs.activeTab.url = tabs.activeTab.url.replace(mxrUrl, dxrUrl());
        } else if (tabs.activeTab.url.indexOf(dxrUrl()) !== -1) {
            // Workaround pending fix of bug 1178103:
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1178103
            if (tabs.activeTab.url.endsWith("/"))
                tabs.activeTab.url = tabs.activeTab.url.replace(dxrUrl(), mxrUrl).slice(0, -1);
            else
                tabs.activeTab.url = tabs.activeTab.url.replace(dxrUrl(), mxrUrl);
        }
    }});
}

// If the rewrite anchors option is ticked, then we point all MXR links to DXR.
pageMod.PageMod({
    include: "*",
    contentScriptFile: data.url("link-rewriter.js"),
    onAttach: function(worker) {
        if (prefs.prefs['rewriteAnchors'])
            worker.port.emit(tag, dxrUrl());
    }
});


loadHotkey();
// Update the hotkey when we change the preference.
prefs.on('hotkey', loadHotkey);
