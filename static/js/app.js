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

// d3.select("#selDataset");

var selectioninput = `/wfreq/<sample>`;
d3.json(selectioninput).then(function(level) {

// // Enter a speed between 0 and 180
// var level = 4;
  // Trig to calc meter point
  var degrees = 9 - level,
      radius = .5;
  var radians = degrees * Math.PI / 9;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 38, color:'850000'},
      showlegend: false,
      name: 'Wash-Freqcy',
      text: level,
      hoverinfo: 'text+name'},
  { values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6',
          '4-5', '3-4', '2-3', '1-2', '0-1' ,''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgb(33, 188, 148)','rgb(114, 208, 148)','rgba(14, 127, 0, .5)', 'rgb(166, 188, 148)', 'rgba(110, 154, 22, .5)',
                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'FFFFFF']},
  labels: ['8-9', '7-8', '6-7', '5-6',
          '4-5', '3-4', '2-3', '1-2', '0-1' ,''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
  }];

  var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
          color: '850000'
      }
      }],
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week', 
  Speed: 0-9,
  height: 450,
  width: 450,
  xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);


//end below 
//Updating...

});

/////////

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


