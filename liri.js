require("dotenv").config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var request = require('request');

let action = process.argv[2];
let secondInput = process.argv[3];

for(let i = 4; i < process.argv.length; i++){
    secondInput += " " + process.argv[i];
}

switch (action) {
    case 'concert-this':
        concertThis();
        break;
    case 'spotify-this-song':
        spotifyThisSong();
        break;
    case 'movie-this':
        movieThis();
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        console.log("LIRI: 'I don't understand your request'");
};

function concertThis(){
    request("https://rest.bandsintown.com/artists/" + secondInput + "/events?app_id=codingbootcamp", (error,response,body)=>{
        if(!error && response.statusCode === 200){
            console.log('Upcoming Tour Dates:');
            for(let i = 0; i<JSON.parse(body).length; i++){
                let venue = JSON.parse(body)[i].venue.name;
                let city = JSON.parse(body)[i].venue.city;
                let region = JSON.parse(body)[i].venue.region;
                let country = JSON.parse(body)[i].venue.country;
                let date = JSON.parse(body)[i].datetime;
                //need to add moment js here to format date
                console.log(`${venue} - ${city}, ${region}, ${country} : ${date}`);
            }
            if(JSON.parse(body).length === 0){
                console.log("--none--");
            };
        };
    });
}

function spotifyThisSong(){
    console.log('Song Information');
    console.log('--------------------------');
    spotify.search({ type: 'track', query: secondInput, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }else{
            if(data.tracks.items){
                console.log("Artist: " +data.tracks.items[0].artists[0].name);
                console.log("Track: " + data.tracks.items[0].name);
                console.log("Preview Link: " + data.tracks.items[0].preview_url);
                console.log("Album: " + data.tracks.items[0].album.name);
            }else{
                console.log('--Unable to find song--');
            };
        };
    });
}