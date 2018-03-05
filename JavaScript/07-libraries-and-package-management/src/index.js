import sharp from 'sharp';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const roundedCorners = Buffer.from(
    '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>'
);

function roundImageFileFromUserInput() {
    rl.question('Image filename: ', (inputFilename) => {
        sharp(inputFilename)
            .resize(200, 200)
            .overlayWith(roundedCorners, {cutout: true})
            .toFile(`${inputFilename}_rounded.png`)
            .then(() => console.log("Rounded!"))
            .catch((err) => console.error(`Could not round image: ${err.message}`))
            .then(roundImageFileFromUserInput);
    });
}
roundImageFileFromUserInput();
