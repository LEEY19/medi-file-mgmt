const fs = require('fs');
const uuidv4 = require('uuid/v4');
const db = require("../models");
const File = db.files;

const upload = (req, res) => {
  File.create({
    id: uuidv4(),
    type: req.file.mimetype,
    name: req.file.originalname,
    data: fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename)
  }).then(file => {
    try {
      fs.writeFileSync(__basedir + '/resources/static/assets/tmp/' + file.name, file.data);
      res.json({msg: 'File uploaded successfully!', file: req.file, id: file.id});
    } catch(err) {
      res.json({err: err});
    }
  })
};

const all = (req, res) => {
  File.findAll({
    order: [ [ 'createdAt', 'DESC' ]]
  }).then(function(files){
    files = files.map((val) => {
      return {id: val.dataValues.id, name: val.dataValues.name}
    });
    res.json({files: files});
  })
  .catch(err => {
    res.json({err: err});
  }) 

}
 
const download = (req, res) => {
  const uploadFolder = __basedir + '/resources/static/assets/tmp/';
  var id = req.params.id;

  File.findOne({
    where: {id: id}
  })
  .then((file) => {
    if(!file) {
      return res.status(400).json({
        message: "File is not found"
      });
    }

    return res.download(uploadFolder + file.name);
  });
}

const deletefile = (req, res) => {
  const uploadFolder = __basedir + '/resources/static/assets/tmp/';
  var id = req.params.id;

  File.findOne({
    where: {id: id}
  })
  .then(async (file) => {
    if(!file) {
      return res.status(400).json({
        message: "File is not found"
      });
    }

    const deleted = await new Promise((resolve, reject) => {
      file.destroy()
      .then(() => {
        resolve(true)
      })
      .catch(err => {
        reject(err)
      })
    })

    if (deleted) {
      fs.unlink(uploadFolder + file.name, function(err) {
        if (err) {
          return res.status(500).json({
            message: "File is not deleted"
          });
        }
        return res.status(200).json({msg: "File deleted!"});
      })
    } else {
      return res.status(500).json({
        message: "File is not deleted"
      });
    }
  });
}
 
module.exports = {
  upload: upload,
  all: all,
  download: download,
  deletefile: deletefile,
}
