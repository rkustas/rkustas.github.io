// Create variables to reference API

var baseurl = "http://rkcrossfit.herokuapp.com/"
var compnames = "/api/v1.0/competitors"
var byyear = "/api/v1.0/competitors/"
var eventscore = "/api/v1.0/score/"
var yeareventlimit = "/api/v1.0/eventyear/"

d3.json(baseurl + compnames).then((data) => {
    console.log(data);




});