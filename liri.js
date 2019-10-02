require("dotenv").config();

//Import the node-spotify-api NPM package
var Spotify = require("node-spotify-api");

//Import the API keys
var keys = require("./keys.js");

//Import the Axios npm package
var axios = require("axios");

//Import the Moment npm package
var moment = require("moment");

//Import the FS (file system) package for reading/writing
var fs = require("fs");

//Initialize the spotify API 
var spotify = new Spotify(keys.spotify);

// Take in the command line arguments (i.e. action will be spotify-this-song and parameter will be the song name)
var action = process.argv[2];
var parameter = process.argv[3];

// var parameter = process.argv[2];
function liriCases() {

    switch (action) {

        case 'concert-this':
            bandsInTown(parameter);
            break;

        case 'spotify-this-song':
            spotSong(parameter);
            break;

        case 'movie-this':
            movieInfo(parameter);
            break;

        case 'do-what-it-says':
            getTxt(parameter);
            break;
    }
};

// ---------------Functions

// #1 Spotify 
function spotSong(parameter) {

    searchTrack = parameter;

    spotify.search({
        type: 'track',
        query: searchTrack,
        limit: 1,
    }, function (error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {
            console.log("\n---------------------------------------------------\n");
            console.log(JSON.stringify("Artist: " + data.tracks.items[0].album.artists[0].name, null, 2));
            console.log(JSON.stringify("Song Name: " + data.tracks.items[0].name, null, 2));
            console.log(JSON.stringify("Preview Link: " + data.tracks.items[0].preview_url, null, 2))
            console.log(JSON.stringify("Album: " + data.tracks.items[0].album.name, null, 2))
            console.log("\n---------------------------------------------------\n");

        }
    });
};

//#2 Movies with OMDb API
function movieInfo(parameter) {

    var movieName;
    if (parameter === undefined) {
        movieName = "Mr. Nobody";
    } else {
        movieName = parameter;
    };

    // Run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line helps debug against the actual URL.
    console.log(queryUrl);

    var movieName = "";

    axios.get(queryUrl).then(
        function movieInfo(parameter) {
            console.log("\n--------------------------------\n");
            console.log("Movie Title: " + parameter.data.Title);
            console.log("Release Year: " + parameter.data.Year);
            console.log("IMDB Rating: " + parameter.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + parameter.data.Ratings[1].Value);
            console.log("Produced in: " + parameter.data.Country);
            console.log("Language: " + parameter.data.Language);
            console.log("Plot: " + parameter.data.Plot);
            console.log("Actors: " + parameter.data.Actors)
            console.log("\n--------------------------------\n");
        })
        .catch(function (error) {
            if (error.parameter) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.parameter.data);
                console.log("---------------Status---------------");
                console.log(error.parameter.status);
                console.log("---------------Status---------------");
                console.log(error.parameter.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

};

//#3 Bands in Town
function bandsInTown(parameter) {

    var artist = parameter;

    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    console.log(queryUrl);

    axios.get(queryUrl).then(
        function bandsInTown(parameter) {

            //Create variables to format date correctly using substring
            var oldDate = parameter.data[0].datetime;
            var month = oldDate.substring(5, 7);
            var year = oldDate.substring(0, 4);
            var day = oldDate.substring(8, 10);
            var formattedDate = month + "/" + day + "/" + year


            console.log("\n--------------------------------\n");
            console.log("Name of Venue: " + parameter.data[0].venue.name);
            console.log("Venue Location: " + parameter.data[0].venue.city);
            console.log("Date of Event: " + formattedDate);
            console.log("\n--------------------------------\n");
        });
}

//Do What It Says (using fs)

function getTxt(parameter) {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        //split the strings in the random.txt file by the comma
        var randomTextFile = data.split(",");


        var backStreet = randomTextFile[1];
        spotSong(backStreet);
    });

}






liriCases();

