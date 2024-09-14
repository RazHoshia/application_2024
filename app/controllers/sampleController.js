// app/controllers/sampleController.js
const path = require('path');

exports.home = (req, res) => {
  // Send the HTML file located in the public directory
  res.sendFile(path.join(__dirname, '../../public/index.html'));
};
