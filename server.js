//server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
var months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];
var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html This allows access to the public file which is contains the static css to load the page;
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html //sends over the html for the page __directpath gives path to this server, + the rest of path to get to html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint... // this serves the url + /api/hello. modify this
app.get("/api/:date?", function(req, res, next) {
  var input = req.params.date;
  var regex = /[^0-9-]+/g;
  var test = "test";
  if (!input) {
    var date = new Date();
    input = Math.round(date.getTime());
    test =
      days[date.getDay()] +
      ", " +
      date.getDate() +
      " " +
      months[date.getMonth()] +
      " " +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      " GMT";
  } else if (regex.test(input)) {
    res.json({
      error: "Invalid Date"
    });
  } else {
    var dash = /[^-]+/gi;
    var dateArray = input.match(dash);
    if (dateArray.length == 1) {
      var date = new Date(parseInt(input));
      test =
        days[date.getDay()] +
        ", " +
        date.getDate() +
        " " +
        months[date.getMonth()] +
        " " +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds() +
        " GMT";
      res.json({
        unix: dateArray[0],
        utc: test
      });
    }
    if (dateArray.length == 3) {
      var newDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      if (
        newDate.getFullYear() != dateArray[0] ||
        newDate.getMonth() != dateArray[1] - 1 ||
        newDate.getDate() != dateArray[2]
      ) {
        // check isnt working
        res.json({
          error: "Invalid Date"
        });
      }
      test =
        days[newDate.getDay()] +
        ", " +
        newDate.getDate() +
        " " +
        months[newDate.getMonth()] +
        " " +
        newDate.getFullYear() +
        " " +
        newDate.getHours() +
        ":" +
        newDate.getMinutes() +
        ":" +
        newDate.getSeconds() +
        " GMT";
      input = newDate.getTime();
    } else {
      res.json({
        error: "Invalid Date"
      });
    }
  }

  res.json({
    unix: input,
    utc: test
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});