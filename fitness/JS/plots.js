// Create variables to reference API

var baseurl = "https://rkcrossfit.herokuapp.com/";
var compnames = "/api/v1.0/competitors";
var byyear = "/api/v1.0/competitors/";
var eventscore = "/api/v1.0/score/";
var yeareventlimit = "/api/v1.0/eventyear/";
var averages = "api/v1.0/averages/comp/";

// Function to format numbers
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// Filter names by top scores
var lowEnd = 1;

// Store highend input variable from html
var highEnd = d3.select('#limit');

highEnd.on('change', limitchange);
    function limitchange() {
        
        // Log number change
        var highEndnum = d3.select('#limit').property('value');
        console.log(highEndnum);

        // Number list for filtering
        var numlist = [];
        for (var i= lowEnd; i <= highEndnum; i++) {
            numlist.push(i);
        }
        // console.log(numlist);
        // console.log(numlist.length);


        // Call to API
        d3.json(baseurl + eventscore + numlist.length).then((data) => {
            // console.log(data);
        
        
            // Create filter variable
            var filtervar = d3.select('#selName');
            var filtered = d3.select("#selName").property('value');
            // console.log(filtered);
        
        
            // Sort names
            var filteredNames = data.map(d => d['Competitor Name']);
            unnames = filteredNames.sort();
            // console.log(unnames);

            // Clear html and push in new values upon change
            d3.select('#selName').html("");
        
            // Push names into dropdown
            d3.select("#selName")
            .selectAll('option')
            .data(unnames)
            .enter()
            .append('option')
            .text(function(d) {
                return d;
            });


            // Create scatter chart for number of athletes chosen
            function makeResponsive() {
                var svgArea = d3.select("body").select("svg");
                if (!svgArea.empty()) {
                svgArea.remove();
                }
                // Define SVG area dimensions
                var svgWidth = 1000;
                var svgHeight = 750;

                // Define chart's margins as an object
                var cM = {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 75
                };

                // Define dimensions of the chart area
                var cW = svgWidth - cM.left -cM.right;
                var cH = svgHeight - cM.top - cM.bottom;

                // Border colors and width
                var border=5;
                var bordercolor='cadetblue';

                // Select where chart goes and append to it, also set the dimensions
                var svg = d3
                    .select("#scatternames")
                    .append("svg")
                    .attr("height", svgHeight)
                    .attr("width", svgWidth)
                    .attr("border", border);


                // Append g to svg
                var chartGroup = svg.append("g")
                    .attr("transform", `translate(${cM.left}, ${cM.top})`);

                var borderPath = svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", svgHeight)
                .attr("width", svgWidth)
                .style("stroke", bordercolor)
                .style("fill", "none")
                .style("stroke-width", border);

                // Map what I want to plot
                var eventscorebyname = data.map(d => d['Event Score']);
                var eventrankbyname = data.map(d => d['Event Rank']);

                // Set axes scales
                var xScale = d3.scaleLinear()
                .domain([d3.min(eventrankbyname),d3.max(eventrankbyname)])
                .range([0, cW]);
            
                var yScale = d3.scaleLinear()
                .domain([d3.min(eventscorebyname),d3.max(eventscorebyname)])
                .range([cH,0])

                // Create axes
                var bottomAxis = d3.axisBottom(xScale);
                var leftAxis = d3.axisLeft(yScale);

                // Append axes to chartGroup and svg/g
                chartGroup.append("g")
                .call(leftAxis);
            
                chartGroup.append("g")
                .attr("transform", `translate(0, ${cH})`)
                .call(bottomAxis);

                // Add data to chart
                var circlesGroup = chartGroup.selectAll("circle")
                .data(data).enter()
                .append("circle")
                .attr("cx", d => xScale(d['Event Rank']))
                .attr("cy", d => yScale(d['Event Score']))
                .attr("r", 10)
                .attr("fill", "red")
                .attr("opacity", ".3")

                // Create tooltip
                var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([-20, 0])
                .html(function(d) {
                return (`Competitor name: <strong>${d['Competitor Name']}</strong>
                    <hr> Event Score: <strong>${formatNumber(d['Event Score'])}</strong>
                    <hr> Event Rank: <strong>${formatNumber(d['Event Rank'])}</strong>`);
                });          

                // Create the tooltip in chartgroup
                chartGroup.call(toolTip);


                // Add text to chart on hover
                circlesGroup.on("mouseover", function(d) {
                    toolTip.show(d,this);
                })
                // Hide on mouseout
                .on("mouseout", function(d) {
                    toolTip.hide(d,this);
                })

                // Axes labels
                var labelGroup = chartGroup.append("text")
                .attr("transform", `translate(${cW / 2}, ${cH + 20})`)
                .classed("axis-text", true)
                .attr("x", 0)
                .attr("y",20)
                .text("Rank")
            
                chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y",0 - 78)
                .attr("x", 0 - (cH/2))
                .attr("dy","1em")
                .classed("axis-text", true)
                .text("Score");

            }
            makeResponsive();

            // On window resize, resize the chart
            d3.select(window).on('resize',makeResponsive);


            // Filter names variable
            filtervar.on('change', namechange);
            function namechange() {


                // Reset html
                d3.select('tbody').html("");


                var filteredName = d3.select('#selName').property('value');
                // console.log(filteredName);

                // Table body variable
                var tablebody = d3.select('tbody');
                var newrow = tablebody.append('tr');


                // Filter data on name
                var athfil = data.filter(d => d['Competitor Name'] === filteredName);
                // console.log(athfil);

                
                // Add data to table
                athfil.forEach((d) => {
                    console.log(d);
                
                    Object.entries(d).forEach(([key,value]) => {
                        // console.log(key,value);
                        var dadd = newrow.append('td');
                        dadd.text(value);
                    });
                });

                
                // Load comp_info
                comp_info = "api/v1.0/compinfo/"
                d3.json(baseurl + comp_info + filteredName).then((comp) => {
                    // console.log(comp);

                // Key to delete
                for (var i = 0; i < comp.length; i++) {
                    delete comp[i]['First Name'];
                    delete comp[i]['Last Name'];
                    delete comp[i]['Competitor Id'];
                    delete comp[i]['Competitor Name']; 
                }
                      
                comp.slice(1).forEach((c) => {

                    // Add data to table
                    Object.entries(c).forEach(([key,value]) => {
                        // console.log(key,value);
                        var dadd = newrow.append('td');
                        dadd.text(value);
                    });
                });



                // Call for top averages
                d3.json(baseurl + averages + filteredName).then((avg) => {

                    // Filter averages list by the name selected
                    var avgfil = avg.filter(d => d['Competitor Name'] === filteredName);
                    console.log(avgfil);

                    // Delete unwanted data
                    for (var i = 0; i < avg.length; i++) {
                        delete avg[i]['Competitor Name']; 
                    }


                    avgfil.forEach((val) => {
                        Object.entries(val).forEach(([key,value]) => {
                            // console.log(key,value);
                            var dadd = newrow.append('td');
                            dadd.text(formatNumber(value.toFixed(0)));
                        });
                    });

                });

            });
        }
    });
}