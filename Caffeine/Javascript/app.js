//Create variables to connect to API

var baseurl ="https://caffeineproject.herokuapp.com/api/v1.0"
var caffdrinkreg = "/drinklist/caffeine"
var drinkspluscaffeine = "/drinkspluscaffeine"
var supps = "/supplements"
var food = "/food"
var gum = "/gum"

d3.json(baseurl+drinkspluscaffeine).then((data) => {

    console.log(data);





});