var fs = require('fs');
var path = require('path');

var imageDir = './eye-images';

////////////////////////////////////////
////////////////////////////////////////
var intensities = require('./emotion-intensities.json');
var images = fs.readdirSync(imageDir);

var emotions = {};
for (var emotion in intensities) {
    console.log('Found intensity', intensities[emotion], 'for', emotion);

    getOrInsertEmotion(emotion).intensity = intensities[emotion];
}

for (var i in images) {
    var file = images[i];
    var emotionName = file.substring(0, file.length - 4);
    var base64EncodedImage = getImage(file);

    if (base64EncodedImage) {
        console.log('Found image for', emotionName);
        getOrInsertEmotion(emotionName).image = base64EncodedImage;
    } else {
        console.log('Skipped image for', emotionName);
    }
}

writeEmotions();
////////////////////////////////////////
////////////////////////////////////////

function getOrInsertEmotion(name) {
    if (!emotions[name]) {
        emotions[name] = {
            name: name,
        };
    }

    return emotions[name];
}

function getImage(file) {
    var filepath = path.join(imageDir, file);
    if (file.endsWith('.png')) {
        return 'data:image/png;base64,' + base64_encode(filepath);
    } else {
    }
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

function writeEmotions() {
    var fileName = 'emotions.json';
    var data = JSON.stringify(Object.values(emotions, null, 4));

    fs.writeFile('emotions.json', data, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
