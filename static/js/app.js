function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var urlmeta = "/metadata/" + sample;
  d3.json(urlmeta).then(function(sample){

    // select div id #
    var sample_metadata = d3.select("#sample-metadata");

    // clear existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);

    
    });
  });
};


// BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);




function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var urlsample = `/samples/${sample}`;
  d3.json(urlsample).then(function(sdata) {

    // @TODO: Build a Bubble Chart using the sample data
    var xVals = sdata.otu_ids;
    var yVals = sdata.sample_values;
    var tVals = sdata.otu_labels;
    var CircSize = sdata.sample_values;
    var marksId = sdata.otu_ids;

    
    var trace1 = {
      x: xVals,
      y: yVals,
      text: tVals,
      mode: 'markers',
      marker: {
        size: CircSize,
        color: marksId,
      }
    };

    var data = [trace1];

    var layout = {
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(urlsample).then(function(data) {
      var pieVals = data.sample_values.slice(0,10);
      var pieLab = data.otu_ids.slice(0, 10);
      var pieHover = data.otu_labels.slice(0, 10);

      var data = [{
        values: pieVals,
        labels: pieLab,
        hovertext: pieHover,
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selectelement = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selectelement
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};


// Initialize the dashboard
init();


////////////////////////////////////////////////////////////////////////////////
// ref: https://plot.ly/python/gauge-charts/#gauge-chart-outline //
//Gauge
// Plotly.d3.json("/wfreq/BB_940", function(error, level){
//   gauge(level);
// })

// function gauge(level) {
//     var degrees = 9 - level,
//     	radius = .5;
//     var radians = degrees * Math.PI / 9;
//     var x = radius * Math.cos(radians);
//     var y = radius * Math.sin(radians);
//     var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
// 		  pathX = String(x),
//      	space = ' ',
// 	 	  pathY = String(y),
//       pathEnd = ' Z';
//     var path = mainPath.concat(pathX,space,pathY,pathEnd);
//     var data = [{ type: 'scatter',
//    		x: [0], y:[0],
//     	marker: {size: 28, color:'850000'},
//     	showlegend: false,
//     	name: 'Wash Frequency',
//     	text: level,
//       // direction: "counter-clockwise",
//     	hoverinfo: 'text+name'},
//   		{ values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
//   		rotation: 90,
//   		text: ['8-9', '7-8', '6-7', '5-6',
//             '4-5', '3-4', '2-3', '1-2', '0-1' ,''],
//   		textinfo: 'text',
//   		textposition:'inside',      
//   		marker: {colors:['#008000','#228d1b','#359a2d','#46a83e','#55b54e','#64c35f','#73d26f','#81e07f','#90ee90','FFFFFF']},
//   		hoverinfo: 'text',
//   		hole: .5,
//   		type: 'pie',
//   		showlegend: false
// 		}];

// 	var layout = {
// 		shapes:[{
// 	    	type: 'path',
//       		path: path,
// 	     	fillcolor: '850000',
// 	     	line: {
// 	        color: '850000'
// 	      }
// 	    }],
// 		title: '<b>Who has been washing their hands a lot?</b> <br> Frequency 0-9',
// 		height: 500,
// 		width: 600,
//     margin: {
//       l: 25, r: 25, b: 25, t: 75
//     },
// 		xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
// 		yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
// 	};
// 	Plotly.plot("gauge", data, layout);
// };


// //Updates
// function optionChanged(sample) {
//   var sampURL = `/samples/${sample}`
//   var metaURL = `/metadata/${sample}`
//   var wfreqURL = `/wfreq/${sample}`

//   // New data 
//   //otu and sample data
//   Plotly.d3.json(sampURL, function(error, newdata) {
//     if (error) return console.warn(error);
//     newOTU(newdata);
//   });

//   //metatable
//   Plotly.d3.json(metaURL, function(error, response) {
//     if (error) return console.warn(error);
//     var newhtmltable = [];
//     for (key in response) {
//     newhtmltable += "<b>" + key + ": " + " </b>"+ response[key] + "<br>";
//     }
//     metatable.innerHTML = newhtmltable
//   })

//   //freq for gauge
//   Plotly.d3.json(wfreqURL), function(error,newfreq) {
//     if (error) return console.warn(error);
//     gauge(newfreq)
//   }
// }

// //restyle
// function newOTU(newdata){
//   Plotly.d3.json("/otu", function(error, otu) {
//     if (error) return console.warn(error);
//     updatePlots(otu, newdata);
//   })
// }

// function updatePlots(otu, newdata) {
//   // OTU
//   var new_otu = [];
//   for (i in newdata.otu_ids) {
//         new_otu.push(otu[i]);
//   }
//   // Pie
//   var newPie = document.getElementById("pie");
//   Plotly.restyle(newPie, "labels", [newdata.otu_ids.slice(0,10)]);
//   Plotly.restyle(newPie, "values", [newdata.sample_values.slice(0,10)]);
//   Plotly.restyle(newPie, "text", [new_otu.slice(0,10)]);
//   // Bub
//   var newBubble = document.getElementById("bubble");
//   Plotly.restyle(newBubble, "x", [newdata.otu_ids]);
//   Plotly.restyle(newBubble, "y", [newdata.sample_values]);
//   Plotly.restyle(newBubble, "text", [new_otu]);
// }








