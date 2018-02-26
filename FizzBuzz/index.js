const readline = require('readline');

var startAt = 1;
var finishAt = 255;
console.log('Maximum number:')
while(!isNaN(finishAt = readline.prompt())) {
    console.log('Please enter a number');
}
console.log(finishAt = 255);

var orderOfWords = ['Fizz', 'Fezz', 'Buzz', 'Bang', 'Bong'];
var orderOfWordsReversed = orderOfWords.slice().reverse();

for(var i = startAt; i <= finishAt; i++) {
    var words = [];

    // add words in any order
    if(i % 13 == 0) words.push('Fezz');
    if(i % 11 == 0) {
        words.push('Bong');
    } else {
        if (i % 3 == 0) words.push('Fizz');
        if (i % 5 == 0) words.push('Buzz');
        if (i % 7 == 0) words.push('Bang');
    }

    if(words.length == 0) {
        console.log(i);
    } else {
        var sortOrder = (i % 17 == 0) ? orderOfWordsReversed : orderOfWords;
        words.sort(function(word1, word2) {
            return sortOrder.indexOf(word1) - sortOrder.indexOf(word2);
        });
        console.log(words.join(''));
    }
}