exports.upload = function(req, res){
  var fs = require('fs');
  var mediaPath = "/home/bebyry/upload/";
  var media = req.files.media;
  fs.rename(media.path, mediaPath + 'media.png' , function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send(200);
    }
  });
};
