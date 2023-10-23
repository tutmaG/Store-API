const path = require('path');
const fs = require('fs');

const notFound = (req, res) => {
  fs.readFile(path.join(__dirname, '../public/404.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).send('404 Not Found'); 
    } else {
      res.status(404).send(data);
    }
  });
};



module.exports = notFound;