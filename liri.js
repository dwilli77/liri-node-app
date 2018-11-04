require("dotenv").config();

var moment = require('moment');
moment().format();

var fs = require('fs');

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var request = require('request');

let firstArg = process.argv[2];
let secondArg = process.argv[3];

// builds up secondInput if more than one word it typed
for(let i = 4; i < process.argv.length; i++){
    secondArg += " " + process.argv[i];
}
// checks what action the user is attempting and calls the necessary function

function checkAction(action,item){
    switch (action) {
        case 'concert-this':
            concertThis(item);
            break;
        case 'spotify-this-song':
            spotifyThisSong(item);
            break;
        case 'movie-this':
            movieThis(item);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("\nLIRI: 'I don't understand your request'");
    };
}

function concertThis(value){
    request("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp", (error,response,body)=>{
        if(!error && response.statusCode === 200){
            console.log('\nUpcoming Tour Dates:');
            console.log('\n--------------------------');
            if(JSON.parse(body).length === 0){
                console.log("\n--none--");
                console.log('\n--------------------------');
            }else {
                for(let i = 0; i<JSON.parse(body).length; i++){
                    let venue = JSON.parse(body)[i].venue.name;
                    let city = JSON.parse(body)[i].venue.city;
                    let region = JSON.parse(body)[i].venue.region;
                    let country = JSON.parse(body)[i].venue.country;
                    let date = moment(JSON.parse(body)[i].datetime).format("MMM Do, YYYY");
                    console.log(`\n${venue} - ${city}, ${region}, ${country} : ${date}`);
                };
                console.log('\n--------------------------');
             };
        };
    });
}

function spotifyThisSong(song){
    console.log('\nSong Information');
    console.log('\n--------------------------');
    if (song){//song is provided by the user
        spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
            if (err) {
            return console.log('\nError occurred: ' + err);
            }else{
                if(data.tracks.items[0].artists){
                    console.log("\nArtist: " +data.tracks.items[0].artists[0].name);
                    console.log("\nTrack: " + data.tracks.items[0].name);
                    console.log("\nPreview Link: " + data.tracks.items[0].preview_url);
                    console.log("\nAlbum: " + data.tracks.items[0].album.name);
                    console.log('\n--------------------------');
                }else{
                    console.log('\n--Unable to find song--');
                    console.log('\n--------------------------');
                };
            };
        });
    }else{//no song is provided by the user
        spotify.search({type: 'track', query: 'The Sign Ace of Base', limit: 1 }, function(err,data){
            if (err){
                return console.log('\nError occurred: ' + err);
            }else{
                console.log("\nArtist: " +data.tracks.items[0].artists[0].name);
                console.log("\nTrack: " + data.tracks.items[0].name);
                console.log("\nPreview Link: " + data.tracks.items[0].preview_url);
                console.log("\nAlbum: " + data.tracks.items[0].album.name);
                console.log('\n--------------------------');
            };
        });
    };
}

function movieThis(movie){
    if(!movie){
        movie = "mr nobody"
    }
    request('http://www.omdbapi.com/?t=' + movie + '&plot=full&tomatoes=tru&apikey=trilogy', (error,response,body)=>{
        if(!error && response.statusCode === 200){
            console.log('\nMovie Info');
            console.log('\n--------------------------');
            if (JSON.parse(body).Title){
                console.log('\nTitle: ' + JSON.parse(body).Title);
                console.log('\nYear: ' + JSON.parse(body).Year);
                console.log('\nIMDB Rating: ' + JSON.parse(body).imdbRating);
                console.log('\nCountry: ' + JSON.parse(body).Country);
                console.log('\nLanguage(s): ' + JSON.parse(body).Language);
                console.log('\nPlot: '+ JSON.parse(body).Plot);
                console.log('\nActors: '+ JSON.parse(body).Actors);
            }else{
                console.log('\n--Movie not found--');
            }
            console.log('\n--------------------------')
        };
    });
}

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(",");
        checkAction(dataArr[0], dataArr[1]);
      });
}

checkAction(firstArg, secondArg);

