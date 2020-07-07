//Create variables to connect to API

var baseurl ="https://caffeineproject.herokuapp.com/api/v1.0"
var caffdrinkreg = "/drinklist/caffeine"
var drinkspluscaffeine = "/drinkspluscaffeine"
var supps = "/supplements"
var food = "/food"
var gum = "/gum"

d3.json(baseurl+drinkspluscaffeine).then((caffeinedata) => {
    // Log the data
    // console.log(caffeinedata);

    //  Create a variable for the filter
    var filtered = d3.select("#caffeinestr");

    // Map unique caffeine strength values
    var caffstrvalues = caffeinedata.map(caff => caff['Caffeine Strength']);
    var uniquecafstrvalues = caffstrvalues.filter(function(item, pos) {
        return caffstrvalues.indexOf(item) == pos;
    });
    // console.log(uniquecafstrvalues);

    // Map variables
    var mgoz = caffeinedata.map(caff => caff['MG per oz']);
    var floz = caffeinedata.map(caff => caff['Fluid OZ']);
    var totcaff = caffeinedata.map(caff => caff['Caffeine Strength']);
    var drinknames = caffeinedata.map(caff => caff['Drink Name']);


    // Push data into the caffeine strength dropdown menu
    d3.select("#caffeinestr")
        .selectAll('option')
        .data(uniquecafstrvalues)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        });



    // Scatter plot
    var scatter = {
        x:mgoz,
        y:floz,
        mode:'markers',
        type:'scatter',
        name:'Intersection',
        text: drinknames,
        marker: {size:10}
    };

    var datascatter = [scatter];
    var layoutscatter = {
        xaxis: {
            range: [0,150],
            title:"MG Per Ounce"
        
        },
        yaxis:{
            range: [0,30],
            title:"Total Fluid Ounces"
        },
        title: '<b>Caffeine vs. Fluid Ounces</b>',
        height: 400,
        width: 500
    };

    Plotly.newPlot('scattercaff', datascatter,layoutscatter)
    
    // Pie chart

    //  Unique counts of caffeine strength
    var counts = {};
    for (var i=0; i < caffstrvalues.length; i++) {
        counts[caffstrvalues[i]] = 1+ (counts[caffstrvalues[i]] || 0);
    };
    // console.log(counts);


    var piedata = [{
        values:counts,
        labels:caffstrvalues,
        type: 'pie'
    }];

    var pielayout = {
        height: 400,
        width: 500,
        title: "<b>Caffeine Strength</b>"
    };


    Plotly.newPlot('piechart',piedata,pielayout)

    // Bar plot MG per oz and caffeine strength

    // Create your trace.
        var trace = {
        x: ['10 Hour Energy','5 Hour Energy','4C Energy Rush','Advocare Slim','Avitae Caffeinated Water'],
        y: [100,250,500,750,1000],
        type: "bar",
        opacity: .5,
        text: "Caffeine",
        marker: {
            color:"red"
        }
    };

    // Create the data array for our plot
    var data = [trace];

    // Define the plot layout
    var layout = {
        title: {text:"<b>MG per OZ and Drinks by Top Volume</b>",standoff:20},
        xaxis: { title: "Drinks",automargin:true},
        yaxis: { title: "MG per OZ"},
        autosize:true
    };

    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("barplotcaffeine", data, layout)


    // Filter the data on a button click
    filtered.on("change", function() {
        var selection = d3.select("#caffeinestr").property("value");
        // console.log(selection);
        // console.log(caffeinedata);

        // Assign filtered data to a variable
        var filteredcafdrink = caffeinedata.filter(caff => caff['Caffeine Strength'] === selection);
        // console.log(filteredcafdrink);
        
        // Isolate caffeine content
        var caffcont = filteredcafdrink.map(caff => caff['Caffeine Content']);
        // console.log(caffcont);

        // Display maximum caff content
        var maxcaff = Math.max.apply(Math,caffcont);
        // console.log(maxcaff);
        
        d3.select("#maximumcaff")
            .selectAll('div')
            .text(maxcaff + " mg");

        // Display minimum caffeine content
        var mincaff = Math.min.apply(Math,caffcont);
        
        d3.select("#minimumcaff")
            .selectAll('div')
            .text(mincaff + " mg")

        // Display count of drinks per caffeine content
        var cntcafstr = filteredcafdrink.map(caff => caff['Caffeine Strength'])
        d3.select("#drinks")
            .selectAll('div')
            .text(cntcafstr.length + " drinks");


        // Display avg caffeine content

        const avgcaff = caffcont => caffcont.reduce((a,b) => a +b, 0) / caffcont.length
        var averagecaff = avgcaff(caffcont)
        var roundedavgcaff = Math.round(averagecaff)

        d3.select("#averagecaff")
            .selectAll('div')
            .text(roundedavgcaff + " mg")

        // Create a variable for the top x filter
        var topnfilter = d3.select("#topn");

        // Push the top x into the dropdown
        arr = [5,10,15];
        d3.select("#topn")
            .selectAll('option')
            .data(arr)
            .enter()
            .append('option')
            .text(function(d) {
                return d;
            });



        topnfilter.on("change", updateChart);
            function updateChart() {

            // What you selected
            var topselection = d3.select("#topn").property('value');
            // console.log(topselection);
            
            // Sort and assign filtered data to a variable
            sfilcaf = filteredcafdrink.sort(function(a,b) {
                return b['Fluid OZ'] - a['Fluid OZ'];
            });
            // console.log(sfilcaf);

            //  Slice data according to selection
            var filteredtopn = Array.prototype.slice.call(sfilcaf,0,topselection);
            // console.log(filteredtopn);


            // Drink name and fluid oz for plot
            var drinkname = filteredtopn.map(caff => caff['Drink Name']);
            var mgperoz = filteredtopn.map(caff => caff['MG per oz']);
            var caffcontentrating = filteredtopn.map(caff => caff['Caffeine Content']);

            // Bar plot MG per oz and caffeine strength

              // Create your trace.
                var trace = {
                    x: drinkname,
                    y: mgperoz,
                    type: "bar",
                    opacity: .5,
                    text: caffcontentrating,
                    marker: {
                        color: 'red'
                    }
                };

                // Create the data array for our plot
                var data = [trace];

                // Define the plot layout
                var layout = {
                    title: {text:"<b>MG per OZ and Drinks by Top Volume</b>",standoff:20},
                    xaxis: { title: "Drinks",automargin:true },
                    yaxis: { title: "MG per OZ",automargin:true},
                    autosize:true
                };

                // Plot the chart to a div tag
                Plotly.newPlot("barplotcaffeine", data, layout)


            }
    })

    



});