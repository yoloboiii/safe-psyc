var fs = require('fs');
var path = require('path');

var imageDir = './eye-images';
fs.readdir( imageDir, function( err, files ) {
    if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
    }

    var questions = [];
    files.forEach( function( file, index ) {
        var filepath = path.join(imageDir, file);
        if (file.endsWith('.png')) {
            console.log('DOING', filepath);
            var emotionObject = asEmotion(filepath, file);
            console.log('  ', emotionObject);
            questions.push(emotionObject);
        } else {
            console.log('SKIPPED', filepath);
        }
    });

    fs.writeFile('emotions.json', JSON.stringify(questions, null, 4), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
});

var idCounter = 0;
function asEmotion(filepath, filename) {
    var base64 = base64_encode(filepath);
    return {
        id: idCounter++,
        image: 'data:image/png;base64,' + base64,
        name: filename.substring(0, filename.length - 4),
    };
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
