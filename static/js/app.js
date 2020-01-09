const url = "samples.json"


function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  };



  function init() {
    data = [{
      x: [0, 50, 100, 150, 200],
      y: ["OTU 500", "OTU 560", "OTU 700", "OTU 800", "OTU 1000"],
      type: "bar",
      orientation: 'h',
      text: 'samples'
     }];
       
     var layout = {
       title: "OTU_IDS"
     };
  
    Plotly.newPlot("bar", data, layout);

    var bubblesample = {
      x: [1,2,3,4,5,6,7,8],
      y: [10,11,12,13,14,15,16,17],
      text: 'samples',
      mode: 'markers',
      marker: {
        size: [40,60,80,100,120,140,160,180],
        opacity: 0.5,
        color: 'blue'
      }
     };
     var data2 = [bubblesample];

     var layout2 = {
      showlegend: false,
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      }
    };

    Plotly.newPlot('bubble', data2, layout2);
    }

  init();


function getbellyButton() { 
    d3.json(url).then(function(data) {
      let result = {};
      let md = {}; 
        console.log(data);
        var data_check = data.samples;
        var data_metadata = data.metadata;
        for (var i = 0; i < data_check.length; i++) {
            var obj = data_check[i];
            // console.log(data.metadata);
            var optionButton = document.createElement("option");
            var pTag = document.createElement("p");
            var sample_id = obj.id;
            optionButton.text = sample_id;
           
            optionButton.value = sample_id;

            // Creating the dictionary of samples
           result[data_check[i].id] = [
             {
             "id": data_check[i].id
            },
            {"otu_ids":data_check[i].otu_ids}
            ,
            {"otu_labels": data_check[i].otu_labels}
            , 
            {"sample_values":data_check[i].sample_values}
           ];

          //  Creating the dictionary for metadata
          md[data_metadata[i].id] = [
            {
            "id": data_metadata[i].id
           },
           {"ethnicity":data_metadata[i].ethnicity}
           ,
           {"gender": data_metadata[i].gender}
           , 
           {"age":data_metadata[i].age}
           ,
           {"location":data_metadata[i].location}
           ,
           {"bbtype":data_metadata[i].bbtype}
           ,
           {"wfreq":data_metadata[i].wfreq}
          ];

          //  Adding ids to the dropdown menu
            document.getElementById("selDataset").appendChild(optionButton);
           // console.log(sample_id);



           
          // Event handler
          document.getElementById("selDataset").addEventListener('change', function() {
            // console.log('You selected: ', this.value);
            document.getElementById("ID").textContent = "id: " + this.value;
            document.getElementById("ethnicity").textContent = "ethnicity: " + md[this.value][1].ethnicity;
            document.getElementById("gender").textContent = "gender: " + md[this.value][2].gender;
            document.getElementById("age").textContent = "age: " + md[this.value][3].age;
            document.getElementById("location").textContent = "location: " + md[this.value][4].location;
            document.getElementById("bbtype").textContent = "bbtype: " + md[this.value][5].bbtype;
            document.getElementById("wfreq").textContent = "wfreq: " + md[this.value][6].wfreq;

            // Logging values of the iteration, these values align with ids selected in the dropdown menu.
            // console.log(md[this.value][1]);
            // console.log(result[this.value]);
            // console.log(result[this.value][2].otu_labels);

            var otu_id = result[this.value][1].otu_ids;
            // console.log(otu_id);
            var otu_label = result[this.value][2].otu_labels;
            // console.log(otu_label);
            var sample_value = result[this.value][3].sample_values;

            // Logging washing frequency
            var washfreq = md[this.value][6].wfreq;
            // console.log(washfreq);

            // Slicing the id array
            var s_otu_id = otu_id.slice(0,10);
            s_otu_id = s_otu_id.map(i => 'OTU ' + i);
            s_otu_id = s_otu_id.reverse();
            // console.log(s_otu_id);

            // Slicing the label array
            var otu_l_s = otu_label.slice(0,10);
            otu_l_s = otu_l_s.reverse();
            // console.log(otu_l_s);

            // Slicing the sample values array
            var sample_v_s = sample_value.slice(0,10);
            sample_v_s = sample_v_s.reverse();
            // console.log(sample_v_s);


            // Creating the horizontal line chart
            var trace = {
              x: sample_v_s,
              y: s_otu_id,
              type: "bar",
              orientation: 'h',
              text: otu_label
             };

             var data = [trace];
               
          
            Plotly.newPlot("bar", data);


            // Creating bubble chart
            var bubbleChartTrace = {
              x: otu_id,
              y: sample_value,
              text: otu_label,
              mode: 'markers',
              marker: {
                size: sample_value,
                opacity: 0.5,
                color: otu_id
              }
             };
             var data2 = [bubbleChartTrace];

             var layout2 = {
              showlegend: false,
              xaxis: {
                title: {
                  text: 'OTU ID'
                }
              }
            };

            Plotly.newPlot('bubble', data2, layout2);

            // var gaugeDiv = document.getElementById("gauge-chart");
 
            // var traceA = {
            //   type: "pie",
            //   showlegend: false,
            //   hole: 0.4,
            //   rotation: 90,
            //   values: [100 / 5, 100 / 5, 100 / 5, 100 / 5, 100 / 5, 100],
            //   text: ["0-1","1-2","2-3"],
            //   direction: "clockwise",
            //   textinfo: "text",
            //   textposition: "inside",
            //   marker: {
            //     colors: ["rgba(255, 0, 0, 0.6)", "rgba(255, 165, 0, 0.6)", "rgba(255, 255, 0, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(154, 205, 50, 0.6)", "white"]
            //   },
            //   labels: ["0-10", "10-50", "50-200", "200-500", "500-2000", ""],
            //   hoverinfo: "label"
            // }


          });
        }
    });
};
getbellyButton();

