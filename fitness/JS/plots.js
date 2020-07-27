// Create variables to reference API

var baseurl = "http://rkcrossfit.herokuapp.com/";
var compnames = "/api/v1.0/competitors";
var byyear = "/api/v1.0/competitors/";
var eventscore = "/api/v1.0/score/";
var yeareventlimit = "/api/v1.0/eventyear/";

// Filter names by top 25 scores
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
                    <hr> Event Score: <strong>${d['Event Score']}</strong>
                    <hr> Event Rank: <strong>${d['Event Rank']}</strong>`);
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
                .text("Score")

            }
            makeResponsive();

            // On window resize, resize the chart
            d3.select(window).on('resize',makeResponsive);


            // // Year list
            // var years = [2018,2019];

            // // Push yearchoice into dropdown
            // d3.select("#selYear")
            // .selectAll('option')
            // .data(years)
            // .enter()
            // .append('option')
            // .text(function(d) {
            //     return d;
            // });


            // // Event list
            // var event = [1,2,3,4,5,6];

            // // Push events into dropdown
            // d3.select("#selEvent")
            // .selectAll('option')
            // .data(event)
            // .enter()
            // .append('option')
            // .text(function(d) {
            //     return d;
            // });


            // Filter names variable
            filtervar.on('change', namechange);
            function namechange() {
                var filteredName = d3.select('#selName').property('value');
                // console.log(filteredName);

                // Grab event number
                // var eventchoice = d3.select('#selEvent').property('value');
                // console.log(eventchoice);

                // // Grab yearchoice
                // var yearchoice = d3.select('#selYear').property('value');
                // console.log(yearchoice);

                // Filter data on name,event,year
                var athfil = data.filter(d => d['Competitor Name'] === filteredName);
                console.log(athfil);

                // Load comp_info
                comp_info = "api/v1.0/compinfo/"
                d3.json(baseurl + comp_info + filteredName).then((comp) => {
                    console.log(comp);

                // Loop through comp data
                    Object.values(comp).forEach((value) => {
                        console.log(value.Age);

                        // Return competitor info
                        document.getElementById("age").textContent = "Age:     " + value.Age;
                        document.getElementById("gender").textContent = "Gender:     " + value.Gender;
                        document.getElementById("height").textContent = "Height(in):     " + value['Height(in)'];
                        document.getElementById("weight").textContent = "Weight(lbs):     " + value['Weight(lbs)'];
                        document.getElementById("affiliatename").textContent = "Affiliate Name:     " + value['Affiliate Name'];
                        document.getElementById("status").textContent = "Status:     " + value.Status;
                    })



                // Loop through athlete filter data
                    Object.values(athfil).forEach((value) => {

                        // Return data about each filtered athlete
                        document.getElementById("ID").textContent = "Competitor ID:     " + value['Competitor Id']
                        document.getElementById("name").textContent = "Competitor Name:     " + value['Competitor Name']
                        document.getElementById("judge").textContent = "Judge:  " + value['Event Judge']
                        document.getElementById("rank").textContent = "Rank:    " + value['Event Rank']
                        document.getElementById("score").textContent = "Event Score:    " + value['Event Score']
                        document.getElementById("scoredisplay").textContent = "Event Score Display:     " + value['Event Score Display']
                        document.getElementById("etime").textContent = "Event Time:     " + value['Event Time']
                        document.getElementById("enumber").textContent = "Event Number:     " + value['Event number']
                        document.getElementById("eyear").textContent = "Event Year:     " + value['Event year']
                    });

                });
            }
        });
    }
