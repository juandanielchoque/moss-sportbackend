const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'ds4brsken',
  api_key: '982218272298226',
  api_secret: 'MjSgNytE8obrcrdHfHnS1RS2Aas'
});

module.exports = cloudinary;