var csv      = require('csv'),
    fs       = require('fs'),
    express  = require('express'),
    app      = express(),
    webPath  = './web/',
    port     = process.argv[2] || 3000,
    dataPath = process.argv[3] || './data/login-long.csv';

if (!fs.existsSync(dataPath)) {
    console.log('Failed to find data at ' + dataPath);
    process.exit(1);
}

var locations = [];

var parser = csv.parse({ delimiter: ',' }, function (err, lines) {
    console.log(lines.length + ' locations.');

    lines.forEach(function (line) {
        locations.push({
            geometry: {
                type: 'Point',
                coordinates: [ line[7], line[8] ]
            },
            properties: {
                clusterCaption: line[1],
                balloonContent: line[0] + '<br>' + line[2]
            }
        });
    });
});

fs.createReadStream(dataPath).pipe(parser).pipe({
    on: function() {},

    once: function() {},

    emit: function() {},

    end: function() {
        app
            .use(express.static(webPath))
            .get('/data/:size', function (req, res) {
                res.send({
                    type: 'FeatureCollection',
                    features: locations.slice(-1 * req.params['size'])
                });
            })
            .listen(port, function() {
                console.log('Mapper started at localhost:' + port);
            });
    }});