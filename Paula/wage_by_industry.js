//  Read in average_salary.csv
d3.csv("data/average_salary.csv").then(function (data) {
    console.log(data);
    buildCharts(data)
});

// Build Chart
function buildCharts(data) {

    // Create objects with Industry Group and Average Wage
    var results = d3.nest()
        .key(d => d["IndustryGroup"])
        .rollup(v => d3.mean(v, a => a.AverageWage))
        .entries(data)

    results.sort((a, b) => (a.value > b.value) ? 1 : -1);

    console.log(results);

    // x
    var names = results.map(r => r.key).slice(0, 10);

    // y
    var averageWage = results.map(r => r.value).slice(0, 10);

    console.log(names);

    console.log(averageWage);

    // Bar chart
    var barData = [{
        x: averageWage,
        y: names,
        type: "bar",
        name: '',
        text: names,
        textposition: 'auto',
        
        marker: {
            color: 'rgb(0,0,102)',
            opacity: 0.7
        },
        orientation: "h"
    }]

    var layout = {
        title: 'Average Salary by Industry Group',
            subtitle: 'Botton 10 of a list of 284 Industries'
    };

    
    //Plot
    Plotly.newPlot("bar", barData, layout, { displayModeBar: true });

}



// // Drop down menu
// function init() {
//     var dropDown = d3.selectAll("#selDataset");

//     // Add sample names to a variable
//     d3.csv("data/average_salary.csv").then(function (data) {
//         var years = data.IDYear;

//         d3.forEach((sample) => {
//             dropDown
//                 .append("option")
//                 .text(sample)
//                 .property("value", sample);
//         });

//         var firstSample = years[0];
//         buildCharts(firstSample);
//         buildMetadata(firstSample);

//     });
// }

// function optionChanged(newSample) {
//     buildCharts(newSample);
//     buildMetadata(newSample);
// }

// init();

// // Display the sample Metadata
// function buildMetadata(data) {
//     d3.csv("data/average_salary.csv").then(function (data) {
//         var sampleMeta = data.metadata;
        
//         var results = sampleMeta.filter(sampleObj => sampleObj.id == data)[0];

//         var panelData = d3.select("#sample-metadata");

//         panelData.html("");

//         Object.entries(results).forEach(([key, value]) => {
//             panelData.append("h6").text(`${key} : ${value}`);

//         });
//     });
// }