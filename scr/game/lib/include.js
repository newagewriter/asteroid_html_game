var include = function(includePath) {
    console.log(navigator.userAgent != -1);
    if (navigator.userAgent.indexOf("Electron") == -1) {
        var incp = includePath;
        if (incp.indexOf("js") == -1) {
            incp = incp + ".js";
        }
        return includeScript(incp);
    } else {
        return window.require(includePath);
    }
};

function includeScript(script) {
    var scriptElem = document.createElement("script");
    scriptElem.type = 'text/javascript';
    scriptElem.onload = function() {
        console.log("script loaded");
    };
    scriptElem.src = script;
    document.head.appendChild(scriptElem);
    return {};
}