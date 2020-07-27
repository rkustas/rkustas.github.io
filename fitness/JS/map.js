d3.csv("/fitness/CSVs/Affiliate_info.csv").then(function(datamap) {
    console.log(datamap);
    console.log(datamap[0].Longitude);

    // Convert text to numeric on some field
    datamap.forEach(function(data) {
        data.Affiliate_id = +data.Affiliate_id;
        data.Latitude = +data.Latitude;
        data.Longitude = +data.Longitude;
        data.Zip = +data.Zip;
        data.Phone = data.Phone.replace(/[()]/g, '');
        data.Phone = data.Phone.replace(/[-]/g, '');
        data.Phone = +data.Phone.replace(/[ ]/g, '');
    });

    // Add longitude and latitude to lists
    var long = [];
    var lat = [];
   datamap.forEach(function(data) {
       eachlong = data.Longitude;
       eachlat = data.Latitude;
       long.push(eachlong);
       lat.push(eachlat);
   });

    // console.log(long);
    // console.log(lat);

    // Combine lists
    var combarray = [];
    long.forEach((a, i) => {
        combarray.push([lat[i],a]);
    });
    // console.log(combarray);

    // Loop combarray to verify format
    for (var i = 0; i <= combarray.length; i++) {
        // console.log(combarray[i][0]);
    }
    
    // Loop datamap to add each combarray value to object
    datamap.forEach((a,i) => {
        a.Location = combarray[i];
    });
    console.log(datamap);

    // Create map

    var mymap = L.map('map',{
        center: [datamap[0].Location[0],datamap[0].Location[1]],
        zoom: 5
    });

    // Adding tilelayer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: API_KEY
    }).addTo(mymap);

    // Create popups for each lat,long combo
    for (var i = 0; i < datamap.length; i++) {
        L.circle(datamap[i].Location, {
          fillOpacity: 0.75,
          color: "red",
          fillColor: "white",
          // Setting our circle's radius equal to the output of our markerSize function
          // This will make our marker's size proportionate to its population
          radius: 20
        }).bindPopup("<strong>"+ datamap[i].Affiliate_name + "</strong>" + "<hr> Address: "+datamap[i].Address+"<hr> City: "+datamap[i].City+"<hr> State: "+datamap[i].State+"<hr> Longitude: " + datamap[i].Location[1] +"<hr> Latitude: " + datamap[i].Location[0] + "<hr> <a href='"+ datamap[i].Website + "'>Website</a>").addTo(mymap);
    }


}).catch(function(error) {
    console.log(error);
})