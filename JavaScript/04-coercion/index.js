const a = {
    value: 2,
    valueOf() {
        return this.value++;
    }
};

if (a == 2 && a == 3) {
    console.log('How on earth did you get here?');
}

const b = {
    value: 2,
    valueOf() {
        return this.value++;
    }
};

if (b.valueOf() === 2 && b.valueOf() === 3) {
    console.log('How on earth did you get here?');
}