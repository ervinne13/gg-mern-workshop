var AwesomeModule = (function() {
    var a = 10;

    function getPrivateA() {
        return a;
    }

    return {
        getPrivateA: getPrivateA
    };
})();

console.log(AwesomeModule.getPrivateA());