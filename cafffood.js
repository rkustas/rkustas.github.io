//Create variables to connect to API

var baseurl ="https://caffeineproject.herokuapp.com/api/v1.0"
var caffdrinkreg = "/drinklist/caffeine"
var drinkspluscaffeine = "/drinkspluscaffeine"
var supps = "/supplements"
var food = "/food"
var gum = "/gum"

d3.json(baseurl+food).then((foodcaff) => {
    // Log the data
    // console.log(foodcaff);


    //  Create a variable for the filter
    var filtered = d3.select("#foodcaff");

    // Sort and assign filtered data to a variable
    sfoodcaff = foodcaff.sort(function(a,b) {
        return b['Caffeine per MG'] - a['Caffeine per MG'];
    });
    // console.log(sfoodcaff);

    // Map unique serving size values
    var foodservvalues = foodcaff.map(food => food['Serving Size']);
    // console.log(foodservvalues);
    var uniqueservvalues = foodservvalues.filter(function(item, pos) {
        return foodservvalues.indexOf(item) == pos;
    });
    // console.log(uniqueservvalues);

    //  Slice top 5
    var filteredtopn = Array.prototype.slice.call(uniqueservvalues,0,5);
    // console.log(filteredtopn);

    // Push first 5 unique serving size values into dropdown
    d3.select("#foodcaff")
        .selectAll('option')
        .data(filteredtopn)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        });



    // Average per serving size
    var result = sfoodcaff.filter(function(item) {
        return filteredtopn.indexOf(item['Serving Size']) !== -1;
    });
    // console.log(result);


    // Looping through the array and getting the average for each serving size
    function average(arr) {
        var sums = {}, counts = {}, results = [], name;
        for (var i = 0; i < arr.length; i++) {
            name = arr[i]['Serving Size'];
            if (!(name in sums)) {
                sums[name] = 0;
                counts[name] = 0;
            }
            sums[name] += arr[i]['Caffeine per MG'];
            counts[name]++;
        }

        for(name in sums) {
            results.push({ name: name, value: Math.round(sums[name] / counts[name]) })
        }
        return results;
    }

    var avgperserv = average(result);
    console.log(avgperserv);
    var values = []
    for (var i = 0; i < avgperserv.length; i++)
        values.push(avgperserv[i].value);

    // console.log(values);
    

    // Default pie chart
    var data = [{
        values: values,
        labels: filteredtopn,
        type: 'pie',
        marker: {
            colors: ['rgb(56, 75, 126)', 'rgb(18, 36, 37)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 'rgb(6, 4, 4)']
        }
        }];
        
        var layout = {
        title:"<b>Caffeine in Foods</b>",
        height:400,
        width:500
        };
        
        Plotly.newPlot('piechartfood', data, layout);

    // Filter the data on a change
        filtered.on("change", function() {
        var selection = d3.select("#foodcaff").property("value");
        

        // Assign filtered data to a variable
        var filteredfood = sfoodcaff.filter(food => food['Serving Size'] === selection);
        // console.log(filteredfood);

        // Map unique serving size
        var uniqueservfiltered = filteredfood.map(food => food['Caffeine per MG']);
        // console.log(uniqueservfiltered);

        // average food object
        const avgfood = uniqueservfiltered => uniqueservfiltered.reduce((a,b) => a +b, 0) / uniqueservfiltered.length
        var averagefood = avgfood(uniqueservfiltered);
        var roundedavgfood = Math.round(averagefood);

        // Push average into a tag
        d3.select("#avgmgfood")
        .selectAll('div')
        .text(roundedavgfood + " mg")

    });
});

// Gum json
d3.json(baseurl+gum).then((gumcaff) => {
    // console.log(gumcaff);

    // Create varible for the gum flavor filter
    var filterdgum = d3.select("#gumcaff");


    // Map unique gum flavors
    var gumflavors = gumcaff.map(gum => gum['Flavor']);
    var uniquegumflavors = gumflavors.filter(function(item, pos) {
        return gumflavors.indexOf(item) == pos;
    });
    // console.log(uniquegumflavors);

    // Push in unique gum flavors to dropdown selection
    d3.select("#gumcaff")
    .selectAll('option')
    .data(uniquegumflavors)
    .enter()
    .append('option')
    .text(function(d) {
        return d;
    });


    // Mapping variables for gum scatter plot
    var caffperpiece = gumcaff.map(gum => gum['Caffeine per piece']);
    var priceperpack = gumcaff.map(gum => gum['Price Per Pack']);
    var gumname = gumcaff.map(gum => gum['Gum Name']);

    // Scatter plot gum
    var scattergum = {
        x:priceperpack,
        y:caffperpiece,
        mode:'markers',
        type:'scatter',
        name:'Intersection',
        text: gumname,
        marker: {size:10,color: 'red'}
    };

    var datascattergum = [scattergum];
    var layoutscattergum = {
        xaxis: {
            range: [0,Math.max.apply(Math,priceperpack)],
            title:"Dollars"
        
        },
        yaxis:{
            range: [0,Math.max.apply(Math,caffperpiece)],
            title:"MG"
        },
        title: '<b>Caff Per Piece vs. Price Per Pack</b>',
        height: 400,
        width: 500,
        automargin:true
    };

    Plotly.newPlot('scattergum', datascattergum,layoutscattergum)

        // Filter the data on a change
        filterdgum.on("change", function() {
            var selectiongum = d3.select("#gumcaff").property("value");
            
    
            // Assign filtered data to a variable
            var gums = gumcaff.filter(gum => gum['Flavor'] === selectiongum);
            // console.log(gums);
    
            // Map caffeine per piece per gum flavor
            var uniquegum = gums.map(gum => gum['Caffeine per piece']);
            // console.log(uniquegum);

            // Map price per pack per gum flavor
            var uniqueprice = gums.map(gum => gum['Price Per Pack']);
            // console.log(uniqueprice);

            // Map product names
            var gumnames = gums.map(gum => gum['Gum Name']);
            // console.log(gumnames);
    
            // average gum object
            const avggum = uniquegum => uniquegum.reduce((a,b) => a +b, 0) / uniquegum.length
            var averagegum = avggum(uniquegum);
            var roundedavggum = Math.round(averagegum);
    
            // Push average into a tag
            d3.select("#avgmggum")
            .selectAll('div')
            .text(roundedavggum + " mg")

            // Clear prod name list with each filter
            d3.select("#prod").html("");


            // Push product name into filter
            d3.select("#prod")
            .selectAll('li')
            .data(gumnames)
            .enter()
            .append('li')
            .text(function(d) {
                return d;
            });

            // Display count per flavor 
            var cntgum = gums.map(gum => gum['Flavor'])
            d3.select("#gums")
            .selectAll('div')
            .text(cntgum.length);

            // Average price per flavor
            var averageprice = avggum(uniqueprice).toFixed(2);
            // console.log(averageprice);

            // Push average price into a tag
            d3.select("#price")
            .selectAll('div')
            .text("$"+ averageprice);

        });

});


// Supplements
d3.json(baseurl+supps).then((suppscaff) => {
    // Log the data
    console.log(suppscaff);

    // Create filter variable
    var filtersuppnserv = d3.select("#filter-btn")

    // Map filters
    var caffsource = suppscaff.map(suppcaff => suppcaff['Caffeine Source']);
    var suppserving = suppscaff.map(suppcaff => suppcaff['Serving Size']);
    var caffeinecont = suppscaff.map(suppcaff => suppcaff['Caffeine per serving(Mg)'])
    console.log(caffeinecont);

    // Unique filters
    var uniquecaffsource = caffsource.filter(function(item, pos) {
        return caffsource.indexOf(item) == pos;
    });
    var uniquesuppserving = suppserving.filter(function(item,pos) {
        return suppserving.indexOf(item) == pos;
    })
    console.log(uniquecaffsource);
    console.log(uniquesuppserving);

    // Push data into dropdowns
    d3.select("#caffsource")
    .selectAll('option')
    .data(uniquecaffsource)
    .enter()
    .append('option')
    .text(function(d) {
        return d;
    });

    d3.select("#suppserv")
    .selectAll('option')
    .data(uniquesuppserving)
    .enter()
    .append('option')
    .text(function(d) {
        return d;
    });

    // Histogram
    var histog = {
        x: caffeinecont,
        type: 'histogram',
        opacity: .5
    };

    var histodata = [histog];

    var histlayout = {
        title: '<b>Caffeine Per MG</b>',
        bargap: .10,
        bargroupgap: .2,
        xaxis: {title:"Caffeine(MG)"},
        yaxis: {title:"Count"}
    };
    

    Plotly.newPlot('hist',histodata,histlayout)

    filtersuppnserv.on("click", updateCells);
        function updateCells() {

            // Caffeine selection
            var caffselection = d3.select("#caffsource").property("value");
            console.log(caffselection);

            // Serving size selection
            var servselection = d3.select("#suppserv").property("value");
            console.log(servselection);

            // Filter dataset on two variables
            var filteredsupp = suppscaff.filter(suppcaff => suppcaff['Caffeine Source'] === caffselection).filter(suppcaff => suppcaff['Serving Size'] === servselection);
            console.log(filteredsupp);

            // Map caffeine content
            var caffperservmg = filteredsupp.map(suppcaff => suppcaff['Caffeine per serving(Mg)']);

            // Average caffeine content
            const avgcaffperserv = caffperservmg => caffperservmg.reduce((a,b) => a +b, 0) / caffperservmg.length
            var averagecaffperserving = avgcaffperserv(caffperservmg);
            var roundedavgcaffperserv = Math.round(averagecaffperserving);

            // Push average into a tag
            d3.select("#avgsel")
                .selectAll('div')
                .text(`${roundedavgcaffperserv} mg`);
            
            // Remove any elements before pushing in new ones
            d3.select("#listitems").html("");

            // Push supplements to a list
            d3.select("#listitems")
                .selectAll('li')
                .data(filteredsupp)
                .enter()
                .append('li')
                .text(function(d) {
                    return d.Supplement;
                })

        }
});
