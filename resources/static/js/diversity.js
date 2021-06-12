// Function feeds years into the dropdown from our csv file
function init() {
    var dropdown = d3.select("#selDataset");
    console.log("*** init()");
    d3.csv("/data/GenderComposition.csv").then(function (data) {
        
        var yearList = []
        for (var i = 0; i < data.length; i++) {
            yearList.push(data[i].Year);
        }
        // creating a Set removes dupliates from our list
        var years = [...new Set(yearList)];

        for (var j = 0; j < years.length; j++) {
            years[j] = parseInt(years[j]);
            dropdown.append("option").text(years[j]).property("value");
        }
        getDiversity(yearList[0]);
        getOccupations(yearList[0]);
        getWages(yearList[0]);
        getWageMap(yearList[0]);
    });
};

// function that captures changes in our dropdown
function optionChanged(year) {
    console.log(year);
    getDiversity(year);
    getOccupations(year);
    getWages(year);
    getWageMap(year);
}

// this is our main function to generate our charts based on dropdown selection
function getDiversity(year) {
    console.log("*** getDiversity()");
    // this if verifies if there has been a selection made
    // when initially loading the page it will generate default charts
    console.log(d3.version);
    d3.csv("/data/GenderComposition.csv").then(function (data) {

        var mPop = []
        var fPop = []

        for (var i = 0; i < data.length; i++) {
            if (data[i].Year.toString() === year) {
                if (data[i].Gender === "Male") {
                    mPop.push(data[i]["Total Population"]);
                } else {
                    fPop.push(data[i]["Total Population"]);
                }
            }
        }

        var data1 = [{
            values: [parseInt(mPop), parseInt(fPop)],
            type: "pie",
            labels: ["Male", "Female"],
            automargin: true,
            opacity: 0.7,
            marker: {
                colors: ['rgb(0,0,102)', 'rgb(102,0,51)']
            },
            hoverinfo: "label+percent"

        }];

        var layout = {
            title: year,
        };

        Plotly.newPlot("genderComp", data1, layout);
    });

    // creates bar chart for common jobs using dropdown selection
    d3.csv("/data/Wage_Gender_CommonJobs.csv").then(function (data) {

        var m_avgwage = []
        var f_avgwage = []
        var common_job = []
        var t_avgwage = []
        var m_wagetext = []
        var f_wagetext = []

        for (var i = 0; i < data.length; i++) {

            if (data[i].Year.toString() === year) {
                common_job.push(data[i]["PUMS Occupation"])
                if (data[i].Gender === "Male") {
                    m_avgwage.push(data[i]["Average Wage"]);
                } else {
                    f_avgwage.push(data[i]["Average Wage"]);
                }
            }
        }

        var jobs = [...new Set(common_job)];

        // create variables display wage in chart with format
        for (var j = 0; j < m_avgwage.length; j++) {
            t_avgwage[j] = parseInt(m_avgwage[j]) + parseInt(f_avgwage[j]);
            m_wagetext[j] = "$" + parseFloat(m_avgwage[j]).toFixed(2);
            f_wagetext[j] = "$" + parseFloat(f_avgwage[j]).toFixed(2);
        }

        var trace1 = {
            x: jobs,
            y: m_avgwage,
            type: 'bar',
            name: "Male",
            text: m_wagetext,
            textposition: 'auto',
            marker: {
                color: 'rgb(0,0,102)',
                opacity: 0.7
            }
        };

        var trace2 = {
            x: jobs,
            y: f_avgwage,
            type: 'bar',
            name: "Female",
            text: f_wagetext,
            textposition: 'auto',
            marker: {
                color: 'rgb(102,0,51)',
                opacity: 0.7
            }
        };

        var data1 = [trace1, trace2];

        var layout = {
            title: year,
            barmode: 'group'
        };

        Plotly.newPlot("bubble", data1, layout);
    });
    //generates default charts when site is loaded
    d3.csv("/data/Wage_Race_Ethnicity_CommonJobs.csv").then(function (data) {
        var racelist = [];
        var yearlist = [];
        var joblist = [];
        var wages = []

        for (var j = 0; j < data.length; j++) {
            racelist.push(data[j].Race);
            wages.push(data[j]["Average Wage"]);
            joblist.push(data[j]["PUMS Occupation"]);
            yearlist.push(data[j].Year);
        }

        var arr = [];
        yearlist.forEach(function (v, i) {
            var obj = {};
            obj.year = v;
            obj.job = joblist[i];
            obj.race = racelist[i];
            obj.wage = wages[i];
            arr.push(obj);
        });

        var filtered = arr.filter(function (d) {
            return d.year === year;
        });

        //console.log(filtered);
        var joblabel = [...new Set(joblist)];

        var racelabel = [...new Set(racelist)];

        var anwage = []
        var aianwage = []
        var piwage = []
        var aiwage = []
        var twowage = []
        var otherwage = []
        var asianwage = []
        var blackwage = []
        var whitewage = []

        for (k = 0; k < filtered.length; k++) {
            if (filtered[k].race === racelabel[0]) {
                anwage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[1]) {
                aianwage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[2]) {
                piwage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[3]) {
                aiwage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[4]) {
                twowage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[5]) {
                otherwage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[6]) {
                asianwage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[7]) {
                blackwage.push(filtered[k].wage);
            } else if (filtered[k].race === racelabel[8]) {
                whitewage.push(filtered[k].wage);
            }
        };

        for (var j = 0; j < aianwage.length; j++) {
            anwage[j] = parseFloat(anwage[j]).toFixed(2);
            aianwage[j] = parseFloat(aianwage[j]).toFixed(2);
            piwage[j] = parseFloat(piwage[j]).toFixed(2);
            aiwage[j] = parseFloat(aiwage[j]).toFixed(2);
            twowage[j] = parseFloat(twowage[j]).toFixed(2);
            otherwage[j] = parseFloat(otherwage[j]).toFixed(2);
            asianwage[j] = parseFloat(asianwage[j]).toFixed(2);
            blackwage[j] = parseFloat(blackwage[j]).toFixed(2);
            whitewage[j] = parseFloat(whitewage[j]).toFixed(2);
        }

        var options = {
            series: [
                { name: racelabel[0], data: anwage },
                { name: racelabel[1], data: aianwage },
                { name: racelabel[2], data: piwage },
                { name: racelabel[3], data: aiwage },
                { name: racelabel[4], data: twowage },
                { name: racelabel[5], data: otherwage },
                { name: racelabel[6], data: asianwage },
                { name: racelabel[7], data: blackwage },
                { name: racelabel[8], data: whitewage }
            ],
            colors: ['#4d4d94', '#944d71', '#cd6155', '#5f6a6a', '#9a7d0a', '#117864', '#1a5276', '#5b2c6f'],
            chart: {
                type: 'bar',
                height: 800
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                offsetX: -20,
                style: {
                    fontSize: '8px',
                    colors: ['#fff']
                }
            },
            stroke: {
                show: true,
                colors: ['#17202a']
            },
            tooltip: {
                shared: true,
                intersect: false
            },
            xaxis: {
                categories: joblabel
            },
            title: {
                text: year,
                align: 'center',
                margin: 0,
                offsetX: 0,
                offsetY: 10,
                floating: false,
                style: {
                    fontSize: '16px',
                    fontFamily: undefined,
                    color: '#17202a'
                }
            }


        };

        var chart = new ApexCharts(document.querySelector('#ethnicityJobs'), options);
        chart.render();

    })
}

function getOccupations(year) {
    console.log("*** getOccupations()");
    d3.csv("/data/Occupations_by_Share.csv").then((importedData) => {

        // Setting a variable for the metadata and samples portions of the json.

        let occupations = {};
        let totalPop = 0;

        for (let i = 0; i < importedData.length; i++) {
            if (importedData[i].Year == year) {
                if (!(importedData[i]["Major Occupation Group"] in occupations)) {
                    occupations[importedData[i]["Major Occupation Group"]] = {};
                    occupations[importedData[i]["Major Occupation Group"]["Detailed Occupation"]] = parseInt(importedData[i]["Total Population"]);
                } else {
                    occupations[importedData[i]["Major Occupation Group"]][[importedData[i]["Detailed Occupation"]]] = parseInt(importedData[i]["Total Population"]);
                }

                totalPop += parseInt(importedData[i]["Total Population"]);
            }
        }

        //console.log(occupations);
        //console.log(totalPop);

        var treeData = [
            { name: `Total Population: ${totalPop}`, children: [] }
        ];

        //console.log(Object.keys(occupations));

        let k = 0;

        for (let key in occupations) {
            if (key != "undefined") {
                treeData[0]["children"].push({ name: key, children: [] });
                for (let dKey in occupations[key]) {
                    treeData[0]["children"][k]["children"].push({ name: dKey, value: ((occupations[key][dKey])) });
                }
                k++;
            }
        }
        //console.log(treeData);

        anychart.onDocumentReady(function () {
            var treeChart = d3.select("#occupations");
            treeChart.html("");
            var tree = anychart.data.tree(treeData, "as-tree");
            var chart = anychart.treeMap(tree);
            chart.title(`${year}`);
            chart.hintDepth(1);
            chart.hintOpacity(0.5);
            chart.hovered().fill("red", 0.4);
            chart.selected().fill("silver", 0.6);
            chart.selected().hatchFill("backward-diagonal", "silver", 2, 20);
            chart.normal().stroke("yellow");
            chart.hovered().stroke("gray", 2);
            chart.selected().stroke("gray", 2);

            // enable HTML in the chart tooltips
            chart.tooltip().useHtml(false);
            // configure the chart tooltips
            chart.tooltip().format(function () {
                var value = ((this.value) / totalPop) * 100;
                var percent = value.toFixed(2) + "%";
                return percent;
            });
            chart.tooltip().background().fill("black");
            chart.container("occupations");
            chart.draw();
        });
    });
}

function getWages(year) {
    console.log("*** getWages()");
    d3.csv("data/average_salary.csv").then(function (data) {
        //console.log(data);
        // Create objects with Industry Group and Average Wage
        var results = d3.nest()
            .key(d => d["IndustryGroup"])
            .rollup(v => d3.mean(v, a => a.AverageWage))
            .entries(data)

        results.sort((a, b) => (a.value > b.value) ? 1 : -1);

        //console.log(results);

        // x
        var names = results.map(r => r.key).slice(0, 10);

        // y
        var averageWage = results.map(r => r.value).slice(0, 10);

        //console.log(names);

        //console.log(averageWage);

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
            title: year,
        };

        //Plot
        Plotly.newPlot("salaryIndustry", barData, layout, { displayModeBar: true });

    });
}

function getWageMapOld(year) {
    console.log("*** getWageMap()");
    // Creating map object
    var myMap = L.map("salaryMap", {
        center: [34.0522, -118.2437],
        zoom: 8
    });

    // Adding tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    // Load in geojson data
    var geoData = "data/wage_by_location.csv";

    var geojson = "data/2019_PUMA.geoJson";;
    console.log(geoData);

    // Grab data with d3
    d3.json(geoData).then(function (data) {
        
        console.log(data);
        d3.csv(geoData, function (locData) {
            console.log(locData);
            
            const locDataMap = new Map();

            for (let i = 0; i < locData.length; i++) {
                const element = locData[i];
                //console.log(element);
                const pumaId = element.IDPUMA;
                const avgWage = Math.round(element.AverageWage);
                locDataMap.set(pumaId, avgWage);
            }
            console.log(data.features);
            for (let j = 0; j < data.features.length; j++) {
                const element = data.features[j];
                if (j < 5) { console.log(element) }
                element.properties.AVGWAGE = locDataMap.get(element.properties.AFFGEOID10);
            }
            console.log(data);

            // Create a new choropleth layer
            geojson = L.choropleth(data, {

                // Define what  property in the features to use
                valueProperty: "AVGWAGE",

                // Set color scale
                scale: ["#ffffb2", "#b10026"],

                // Number of breaks in step range
                steps: 10,

                // q for quartile, e for equidistant, k for k-means
                mode: "q",
                style: {
                    // Border color
                    color: "#fff",
                    weight: 1,
                    fillOpacity: 0.8
                },

                // Binding a pop-up to each layer
                onEachFeature: function (feature, layer) {
                    layer.bindPopup("Name: " + feature.properties.NAME10 + "<br>Average Wage:<br>" +
                        "$" + feature.properties.AVGWAGE);
                }

            }).addTo(myMap);

            // Set up the legend
            var legend = L.control({ position: "bottomleft" });
            legend.onAdd = function () {
                var div = L.DomUtil.create("div", "info legend");
                var limits = geojson.options.limits;
                console.log(limits);
                var colors = geojson.options.colors;
                var labels = [];

                // Add min & max
                var legendInfo = "<h1>Average Wage</h1>" +
                    "<div class=\"labels\">" +
                    "<div class=\"min\">" + limits[0] + "</div>" +
                    "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                    "</div>";

                div.innerHTML = legendInfo;

                limits.forEach(function (limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                });

                div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                return div;
            };

            // Adding legend to the map
            legend.addTo(myMap);

        }).catch(function(error) {
            console.log(error);
          });
    }).catch(function(error) {
        console.log(error);
    });
    
}

function getWageMap(year) {
    var wageMap = L.map('salaryMap').setView([37.8, -96], 4);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/light-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(wageMap);


	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (wageMap) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>PUMA Average Wage</h4>' +  (props ?
			'<b>' + props.name + '</b><br />' + props.AVGWAGE + ' people / mi<sup>2</sup>'
			: 'Hover over a state');
	};

	info.addTo(wageMap);


	// get color depending on population avg wage value
	function getColor(d) {
		return d > 100000 ? '#800026' :
				d > 50000  ? '#BD0026' :
				d > 20000  ? '#E31A1C' :
				d > 10000  ? '#FC4E2A' :
				d > 5000   ? '#FD8D3C' :
				d > 2000   ? '#FEB24C' :
				d > 10   ? '#FED976' :
							'#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.AVGWAGE)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		wageMap.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

    var geoData = "data/wage_by_location.csv";

    var geojsonData = "data/2019_PUMA.geoJson";;

    // ********************************************
    d3.json(geojsonData).then(function (data) {
        
        console.log(data);
        d3.csv(geoData, function (locData) {
            console.log(locData);
            
            const locDataMap = new Map();

            for (let i = 0; i < locData.length; i++) {
                const element = locData[i];
                //console.log(element);
                const pumaId = element.IDPUMA;
                const avgWage = Math.round(element.AverageWage);
                locDataMap.set(pumaId, avgWage);
            }
            console.log(data.features);
            for (let j = 0; j < data.features.length; j++) {
                const element = data.features[j];
                if (j < 5) { console.log(element) }
                element.properties.AVGWAGE = locDataMap.get(element.properties.AFFGEOID10);
            }
            console.log(data);
            geojson = L.geoJson(data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(wageMap);
        
            wageMap.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
            // Create a new choropleth layer
            // geojson = L.choropleth(data, {

            //     // Define what  property in the features to use
            //     valueProperty: "AVGWAGE",

            //     // Set color scale
            //     scale: ["#ffffb2", "#b10026"],

            //     // Number of breaks in step range
            //     steps: 10,

            //     // q for quartile, e for equidistant, k for k-means
            //     mode: "q",
            //     style: {
            //         // Border color
            //         color: "#fff",
            //         weight: 1,
            //         fillOpacity: 0.8
            //     },

            //     // Binding a pop-up to each layer
            //     onEachFeature: function (feature, layer) {
            //         layer.bindPopup("Name: " + feature.properties.NAME10 + "<br>Average Wage:<br>" +
            //             "$" + feature.properties.AVGWAGE);
            //     }

            // }).addTo(myMap);

            // Set up the legend
            console.log(geojson);
            console.log(geojson.options);
            
            var legend = L.control({ position: "bottomleft" });
            legend.onAdd = function () {
                var div = L.DomUtil.create("div", "info legend");
                var limits = geojson.options.limits;
                console.log(limits);
                var colors = geojson.options.colors;
                var labels = [];

                // Add min & max
                var legendInfo = "<h1>Average Wage</h1>" +
                    "<div class=\"labels\">" +
                    "<div class=\"min\">" + limits[0] + "</div>" +
                    "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                    "</div>";

                div.innerHTML = legendInfo;

                limits.forEach(function (limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                });

                div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                return div;
            };

            // Adding legend to the wageMap
            legend.addTo(wageMap);

        }).catch(function(error) {
            console.log(error);
          });
    }).catch(function(error) {
        console.log(error);
    });
    // ********************************************
	
}

init();