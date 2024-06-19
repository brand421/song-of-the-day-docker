require("dotenv").config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
const axios = require("axios").default;
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());

const port = process.env.PORT;
const wordnikApi = process.env.WORDNIK_API!;

app.get("/", (req, res) => {
  let today = new Date().toISOString().substring(0, 10);
  axios
    .get(
      // Need to use this to get the word of the day and it's definition
      "https://api.wordnik.com/v4/words.json/wordOfTheDay?date=" +
        today +
        "&api_key=" +
        wordnikApi
    )
    .then((response: { data: { word: any; definitions: { text: any }[] } }) => {
      const word = response.data.word;
      const wordDefinition = response.data.definitions[0].text;
      console.log(word);
      let spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET
      });
      spotifyApi
        .clientCredentialsGrant() // Using below function to create access token, query Spotify API, and return song data
        .then(function (data: { body: { [x: string]: string } }) {
          const accessToken = data.body[""];
          spotifyApi.setAccessToken(data.body["access_token"]);

          return spotifyApi.searchTracks(word, { limit: 1 });
        })
        .then(function (data: any) {
          var uriTrack = data.body["tracks"]["items"][0]["name"];
          var uriArtist = data.body["tracks"]["items"][0]["artists"][0]["name"];
          var uriCover =
            data.body["tracks"]["items"][0]["album"]["images"][0]["url"];
          var uriAlbum = data.body["tracks"]["items"][0]["album"]["name"];
          var uriLink = data.body["tracks"]["items"][0]["uri"];

          res.json({
            songName: uriTrack,
            songArtist: uriArtist,
            songAlbum: uriCover,
            albumName: uriAlbum,
            songLink: uriLink,
            word: word,
            definition: wordDefinition
          });
          console.log(uriAlbum);
        });
    })
    .catch((err: any) => {
      console.log(err);
    });
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
