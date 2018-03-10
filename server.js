const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/Z/, '');     //  /\..+/, '' delete the dot and everything after

  var log = `${now}: ${req.method} ${req.url}`
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  console.log(`${now}: ${req.method} ${req.url}`);
  next();
});

// app.use((req, res, next) =>{
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname+'/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageMetaTitle: 'HeavyPage',
    pageMessage: 'This is so cool and simple, yet I guess we need to find out how to get this injected data to become dynamic.',
    pageTitle: 'Brand New Heavy Page!',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page!',
  });
});

app.get('/bad', (req, res) => {
  //throw new Error('Could not respond to that request! http 404');
  res.send({
    errorMessage: 'Unable to handle request.'
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
