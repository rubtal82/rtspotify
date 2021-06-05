require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', function (req, res) {
  res.render('index')
})


app.get('/artist-search', function (req, res) {

  var artist = req.query['artist']

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      res.render('artist-search', { artist: data.body.artists.items })
      // ----> 'ACA HACEMOS LO QUE QUEREMOS CON LO QUE RECIBIMOS DE LA RUTA'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', function (req, res) {
  var id = req.params['id']
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      res.render('albums', { album: data.body.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.get('/vermusicas/:id', function (req, res) {

  var musica = req.params['id']
  spotifyApi
    .getAlbumTracks(musica)
    .then(data => {
      res.render('vermusicas', { musica:data.body.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));