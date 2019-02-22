const DEFAULT_RESULT_COINTAINER = "testResult";

function assertEquals(expected, actual, msg = "") {
    var err = new Error();
    var stack = err.stack.split("\n");
    var callInfo = "Call " + stack[2];
    var result = expected === actual;

    addTestResult(result, msg, callInfo);

    if (!result)
        throw new AssertionException(msg);   
}

class AssertionException extends Error {

}

function addTestResult(result, msg, callInfo) {
    var testResult = document.getElementById(DEFAULT_RESULT_COINTAINER);
    testResult.appendChild(createTestResult(result, msg, callInfo));
}

function createTestResult(result, msg, callInfo) {
    var item = document.createElement("div");
    item.className = "assertResult";
    var resultSpan = document.createElement("span");
    item.appendChild(resultSpan);
    var msgElem = document.createElement("span");
    item.appendChild(msgElem);
    if (result) {
        resultSpan.textContent = "Passed";
        resultSpan.className = "passStyle";
        msgElem.textContent = callInfo;
    } else {
        resultSpan.textContent = "Failed";
        resultSpan.className = "failedStyle";
        var msg = msg == null || msg.length == 0 ? callInfo : msg + "| " + callInfo;
        msgElem.textContent = msg;
        
    }
    return item;
}