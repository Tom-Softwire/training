let p1 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        if(Math.random() < 0.5) {
            resolve("success");
        } else {
            reject(new Error("promise rejected"));
        }
    }, 500);
});

let p2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve();
    }, 1000);
}).then(function() {
    if(Math.random() < 0.5) {
        return "success";
    } else {
        throw new Error("error thrown");
    }
});

Promise.all([
    p1.catch((err) => { console.error(`p1 failed: ${err.message}`); return err; }),
    p2.catch((err) => { console.error(`p2 failed: ${err.message}`); return err;})
])
    .then(() => console.log("Done"));
