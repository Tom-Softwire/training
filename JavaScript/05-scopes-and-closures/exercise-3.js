function countDown(time) {
    function countDownNumber(i) {
        setTimeout(
            () => console.log(i || "Lift-off!"),
            (time - i) * 1000
        );
        if (i > 0) {
            countDownNumber(i - 1);
        }
    }
    countDownNumber(time);
}
countDown(3);
