// ES5
function countDown() {
    for (var i = 3; i >= 0; i--) {
        setTimeout(
            (function(i) {
                return function () {
                    console.log(i || "Lift-off!");
                }
            })(i),
            (3 - i) * 1000
        );
    }
}
countDown();

// ES6
function countDown2() {
    for (let i = 3; i >= 0; i--) {
        setTimeout(
            () => console.log(i || "Lift-off!"),
            (3 - i) * 1000
        );
    }
}
countDown2();
