const fs = require('fs');
const crypto = require('crypto');

class BitMap {
    constructor() {
        this.onBits = [];
    }
    get(index) {
        return !!this.onBits[index];
    }
    setTrue(index) {
        this.onBits[index] = true;
    }
}

class BloomFilter {
    constructor(sizeOfHash, numHashes) {
        this.sizeOfHash = sizeOfHash;
        this.numHashes = numHashes;
        this.bitMap = new BitMap();
    }
    registerWords(dictionary) {
        dictionary.forEach((word) => {
            const hashesOfWord = this.hashesOf(word);
            hashesOfWord.forEach((hashOfWord) => {
                this.bitMap.setTrue(hashOfWord);
            });
        });
    }
    hashesOf(string) {
        const hashSourceString = crypto.createHash('sha1').update(string).digest('base64');
        const getBitAtPositionInHash = (position) => {
            const characterIndexInHash = Math.floor(position / 8);
            const bitIndexInCharacter = position % 8;
            const character = hashSourceString.charCodeAt(characterIndexInHash);
            return (character & (Math.pow(2, bitIndexInCharacter))) === 0 ? 0 : 1;
        };
        const hashes = [];
        for (let hashNum = 0; hashNum < this.numHashes; hashNum ++) {
            let hash = 0;
            for (let bitNum = 0; bitNum < this.sizeOfHash; bitNum ++) {
                const bitExtractionIndex = hashNum * this.sizeOfHash + bitNum;
                hash += getBitAtPositionInHash(bitExtractionIndex) * Math.pow(2, bitNum);
            }
            hashes[hashNum] = hash;
        }
        return hashes;
    }

    accepts(word) {
        return this.hashesOf(word).every(hashOfWord => this.bitMap.get(hashOfWord));
    }
}

function randomWordOfLength(length) {
    let word = "";
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        word += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return word;
}

function generateRandomDictionary(referenceDictionary) {
    const randomDictionary = new Set();
    referenceDictionary.forEach((existingWord) => {
        randomDictionary.add(randomWordOfLength(existingWord.length));
    });
    return randomDictionary;
}

function scoreBloomFilter(bloomFilter, dictionary, testWords) {
    let lookups = 0.0;
    let falsePositives = 0.0;
    testWords.forEach((testWord) => {
        if (bloomFilter.accepts(testWord)) {
            if (!dictionary.has(testWord)) {
                falsePositives ++;
            }
        }
        lookups ++;
    });
    return 1 - falsePositives / lookups;
}

console.log('Initialising reference dictionary...');
const dictionary = new Set(fs.readFileSync('./wordlist.txt').toString().split("\n"));
console.log(`Reference dictionary initialised with ${dictionary.length} words.`);

console.log('Initialising random dictionary...');
const randomDictionary = generateRandomDictionary(dictionary);
console.log('Random dictionary initialised.');

const acceptableScore = 0.999; // 99.9%
let bestHashLength;
let bestNumHashes;
let bestTime = undefined;
let lastHashLengthPassedWithOneHash = false;
for (let hashLength = 30; hashLength <= 64 && !lastHashLengthPassedWithOneHash; hashLength ++) {
    for(let numHashes = 1; numHashes <= 5; numHashes ++) {
        console.log(`Testing bloom filter with parameters ${hashLength}, ${numHashes}...`);

        // initialise bloom filter with parameters
        const bloomFilter = new BloomFilter(hashLength, numHashes);
        bloomFilter.registerWords(dictionary);

        // benchmark the filter
        let score = 0;
        let totalTime = 0;
        let numPasses = 0;
        for (let i = 0; i < 10; i ++) {
            const startTime = new Date().getTime();
            score = scoreBloomFilter(bloomFilter, dictionary, randomDictionary);
            totalTime += new Date().getTime() - startTime;
            numPasses ++;
        }
        const time = totalTime / numPasses;

        console.log(`Score: ${score.toFixed(3)}`);

        // test whether the filter produced an acceptable score
        if (score >= acceptableScore) {
            // test whether the filter is the fastest so far to pass the score threshold
            if (bestTime === undefined || time < bestTime) {
                bestTime = time;
                bestHashLength = hashLength;
                bestNumHashes = numHashes;

                console.log(`New fastest: ${hashLength}, ${numHashes} with time ${time}`);
            }
            if (numHashes === 1) {
                // longer hashes will only increase the time
                lastHashLengthPassedWithOneHash = true;
            }
            break; // more hashes will only increase the time
        }
    }
}
console.log(`Fastest bloom filter with score at least ${acceptableScore} has parameters ${bestHashLength}, ${bestNumHashes}`);