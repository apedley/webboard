
var phantom = require('phantom');
var fs = require('fs');
var Promise = require('bluebird');


var PageLoader = {
  load: function(req, res, next) {
    // console.log(req.body('url'));
    var url = req.query.url;
    res.writeHead(200, {'Content-Type': 'image/png' });
    phantom.create(function(ph) {
      ph.createPage(function(page) {
        page.open(url, function(status) {
          if (status === "success") {
            var render = Promise.promisify(page.render);

            render('./server/image.png').then(function() {
              var path = __dirname + '/image.png';
              fs.readFile(path, function(err, data) {
                if(err) console.log(err);
                res.write(data, 'binary');
                res.end();
                ph.exit();
              });
            });

          }
        });
      });
    });
  }
};
module.exports = PageLoader; 