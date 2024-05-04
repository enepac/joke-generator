const express = require('express');
const app = express();
const https = require('https');
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const options = {
    hostname: 'icanhazdadjoke.com',
    port: 443,
    path: '/',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };

  const request = https.request(options, (response) => {
    response.setEncoding('utf8');
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const joke = JSON.parse(data);
      res.render('joke', { joke: joke.joke });
    });
  });

  request.on('error', (error) => {
    console.error(`Error: ${error.message}`);
    res.status(500).send('An error occurred while fetching the joke');
  });

  request.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
