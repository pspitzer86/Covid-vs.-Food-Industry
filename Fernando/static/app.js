// function feeds years into the dropdown from our csv file
function innit(){
    var dropdown = d3.select("#selDataset");

    d3.csv("/data/GenderComposition.csv").then(function (data) {
        var yearList =[]
        for (var i=0; i < data.length; i++) {
            yearList.push(data[i].Year);
        }
        // creating a Set removes dupliates from our list
        var years = [...new Set(yearList)];

        for (var j=0; j < years.length; j++) {
            years[j] = parseInt(years[j]);
            dropdown.append("option").text(years[j]).property("value")
        };
        getChart(data);
    });
};

// function that captures changes in our dropdown
function optionChanged(id) {
    getChart(id);
};

// this is our main function to generate our charts based on dropdown selection
function getChart(id) {
    
    // this if verifies if there has been a selection made
    // when initially loading the page it will generate default charts
    // this if was added later in the process and in order to avoid modifying
    // much of the code that was already made, I decided to add this if and basically
    // duplicate the code to generate the "default" charts
    if (typeof id == "string") { 
        
        // creating pie chart for dropdown selection
        d3.csv("/data/GenderComposition.csv").then(function(data) {
        
            var mPop=[]
            var fPop=[]
                      
            for (var i=0; i < data.length; i++) {
                if (data[i].Year.toString() === id) {    
                    if (data[i].Gender === "Male") {
                        mPop.push(data[i]["Total Population"]); 
                    } else {
                        fPop.push(data[i]["Total Population"]);
                    }   
                }
            }
                                    
            var data = [{
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
                title: id + " Workforce Composition: Gender",
            };

            Plotly.newPlot("gauge", data, layout);
        });

        // creates bar chart for common jobs using dropdown selection
        d3.csv("/data/Wage_Gender_CommonJobs.csv").then(function(data) {
        
            var m_avgwage=[]
            var f_avgwage=[]
            var common_job=[]
            var t_avgwage=[]
            var m_wagetext=[]
            var f_wagetext=[]

            for (var i=0; i < data.length; i++) {
                            
                if (data[i].Year.toString() === id) {
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
            for (var j=0; j<m_avgwage.length; j++){
                t_avgwage[j]= parseInt(m_avgwage[j]) + parseInt(f_avgwage[j]);
                m_wagetext[j] = "$"+parseFloat(m_avgwage[j]).toFixed(2);
                f_wagetext[j] = "$"+parseFloat(f_avgwage[j]).toFixed(2);
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

            var data = [trace1, trace2];

            var layout = {
                title: id + " Wages by Gender: Most Common Occupations",
                barmode: 'group'
            };

            Plotly.newPlot("bar", data, layout);
        });

        d3.csv("/data/Wage_Race_Ethnicity_CommonJobs.csv").then(function(data) {
            var racelist = [];
            var yearlist = [];
            var joblist = [];
            var wages = []
            console.log(id);
            for (var j=0; j<data.length;j++){
                racelist.push(data[j].Race);
                wages.push(data[j]["Average Wage"]);
                joblist.push(data[j]["PUMS Occupation"]);
                yearlist.push(data[j].Year);
            }
            
            arr = [];
            yearlist.forEach(function (v, i){
                var obj = {};
                obj.year = v;
                obj.job = joblist[i];
                obj.race = racelist[i];
                obj.wage = wages[i];
                arr.push(obj);
            });
            var filtered = arr.filter(function(d){
                return d.year === id;
            });

            console.log(filtered);
            var joblabel = [...new Set(joblist)];
            console.log(joblabel);

            var racelabel = [...new Set(racelist)];
            console.log(racelabel);

            anwage = []
            aianwage = []
            piwage = []
            aiwage = []
            twowage = []
            otherwage = []
            asianwage = []
            blackwage =[]
            whitewage = []

            for (k=0; k<filtered.length; k++){
                if (filtered[k].race === racelabel[0]){
                    anwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[1]){
                    aianwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[2]){
                    piwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[3]){
                    aiwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[4]){
                    twowage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[5]){
                    otherwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[6]){
                    asianwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[7]){
                    blackwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[8]){
                    whitewage.push(filtered[k].wage);
                }
            };

            for (var j=0; j<aianwage.length; j++){
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
                    {name: racelabel[0], data: anwage},
                    {name: racelabel[1], data: aianwage},
                    {name: racelabel[2], data: piwage},
                    {name: racelabel[3], data: aiwage},
                    {name: racelabel[4], data: twowage},
                    {name: racelabel[5], data: otherwage},
                    {name: racelabel[6], data: asianwage},
                    {name: racelabel[7], data: blackwage},
                    {name: racelabel[8], data: whitewage}
                ],
                colors: ['#4d4d94', '#944d71','#cd6155', '#5f6a6a','#9a7d0a','#117864','#1a5276','#5b2c6f'],
                chart: {
                    type: 'bar',
                    height: 800
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels:{
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
                    text: id + " Wage by Race across Common Jobs",
                    align: 'center',
                    margin: 0,
                    offsetX: 0,
                    offsetY: 10,
                    floating: false,
                    style: {
                      fontSize:  '16px',
                      fontFamily:  undefined,
                      color:  '#17202a'
                    }
                }
            };
            var chart = new ApexCharts(document.querySelector('#bubble'), options);
            chart.render();
        });
    // generates default charts when site is loaded
    } else {
        d3.csv("/data/GenderComposition.csv").then(function(data) {
        
            var yearList =[]
            var mPop=[]
            var fPop=[]
            var tPop=[]
            var mPer=[]
            var fPer=[]

            for (var i=0; i < data.length; i++) {
                yearList.push(data[i].Year);
                
                if (data[i].Gender === "Male") {
                    mPop.push(data[i]["Total Population"]); 
                } else {
                    fPop.push(data[i]["Total Population"]);
                }
            }
            
            // generates percentages to display in chart
            for (var j=0; j<mPop.length; j++){
                tPop[j]= parseInt(mPop[j]) + parseInt(fPop[j]);
                mPer[j] = parseFloat((parseInt(mPop[j])/parseInt(tPop[j]))*100).toFixed(1)+"%";
                fPer[j] = parseFloat((parseInt(fPop[j])/parseInt(tPop[j]))*100).toFixed(1)+"%";
            }
            var years = [...new Set(yearList)];
        
            var trace1 = {
                x: years,
                y: mPop,
                type: 'bar',
                name: "Male",
                text: mPer.map(String),
                textposition: 'auto',
                marker: {
                    color: 'rgb(0,0,102)',
                    opacity: 0.7
                }
            };

            var trace2 = {
                x: years,
                y: fPop,
                type: 'bar',
                name: "Female",
                text: fPer.map(String),
                textposition: 'auto',
                marker: {
                    color: 'rgb(102,0,51)',
                    opacity: 0.7
                }
            };

            var data = [trace1, trace2];

            var layout = {
                title: "Workforce Composition: Gender",
                barmode: 'group'
            };

            Plotly.newPlot("gauge", data, layout);
        });

        d3.csv("/data/Wage_Gender_CommonJobs.csv").then(function(data) {
        
            var m_avgwage=[]
            var f_avgwage=[]
            var common_job=[]
            var t_avgwage=[]
            var m_wagetext=[]
            var f_wagetext=[]
            
            for (var i=0; i < data.length; i++) {
                            
                if (parseInt(data[i].Year) === 2019) {
                    common_job.push(data[i]["PUMS Occupation"])            
                    if (data[i].Gender === "Male") {
                        m_avgwage.push(data[i]["Average Wage"]);
                    } else {
                        f_avgwage.push(data[i]["Average Wage"]);
                    }
                } 
            }
            
            var jobs = [...new Set(common_job)];
            
            for (var j=0; j<m_avgwage.length; j++){
                t_avgwage[j]= parseInt(m_avgwage[j]) + parseInt(f_avgwage[j]);
                m_wagetext[j] = "$"+parseFloat(m_avgwage[j]).toFixed(2);
                f_wagetext[j] = "$"+parseFloat(f_avgwage[j]).toFixed(2);
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

            var data = [trace1, trace2];

            var layout = {
                title: "2019 Wages by Gender: Most Common Occupations",
                barmode: 'group'
            };

            Plotly.newPlot("bar", data, layout);
        });

        d3.csv("/data/Wage_Race_Ethnicity_CommonJobs.csv").then(function(data) {
            var racelist = [];
            var yearlist = [];
            var joblist = [];
            var wages = []
            
            for (var j=0; j<data.length;j++){
                racelist.push(data[j].Race);
                wages.push(data[j]["Average Wage"]);
                joblist.push(data[j]["PUMS Occupation"]);
                yearlist.push(data[j].Year);
            }
            
            arr = [];
            yearlist.forEach(function (v, i){
                var obj = {};
                obj.year = v;
                obj.job = joblist[i];
                obj.race = racelist[i];
                obj.wage = wages[i];
                arr.push(obj);
            });
    
            var filtered = arr.filter(function(d){
                    return d.year === "2019";
                });
    
            console.log(filtered);
            var joblabel = [...new Set(joblist)];

            var racelabel = [...new Set(racelist)];

            anwage = []
            aianwage = []
            piwage = []
            aiwage = []
            twowage = []
            otherwage = []
            asianwage = []
            blackwage =[]
            whitewage = []

            for (k=0; k<filtered.length; k++){
                if (filtered[k].race === racelabel[0]){
                    anwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[1]){
                    aianwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[2]){
                    piwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[3]){
                    aiwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[4]){
                    twowage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[5]){
                    otherwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[6]){
                    asianwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[7]){
                    blackwage.push(filtered[k].wage);
                } else if (filtered[k].race === racelabel[8]){
                    whitewage.push(filtered[k].wage);
                }
            };
            
            for (var j=0; j<aianwage.length; j++){
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
                    {name: racelabel[0], data: anwage},
                    {name: racelabel[1], data: aianwage},
                    {name: racelabel[2], data: piwage},
                    {name: racelabel[3], data: aiwage},
                    {name: racelabel[4], data: twowage},
                    {name: racelabel[5], data: otherwage},
                    {name: racelabel[6], data: asianwage},
                    {name: racelabel[7], data: blackwage},
                    {name: racelabel[8], data: whitewage}
                ],
                colors: ['#4d4d94', '#944d71','#cd6155', '#5f6a6a','#9a7d0a','#117864','#1a5276','#5b2c6f'],
                chart: {
                    type: 'bar',
                    height: 800
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels:{
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
                    text: "2019 Wage by Race across Common Jobs",
                    align: 'center',
                    margin: 0,
                    offsetX: 0,
                    offsetY: 10,
                    floating: false,
                    style: {
                      fontSize:  '16px',
                      fontFamily:  undefined,
                      color:  '#17202a'
                    }
                }


            };
            
            var chart = new ApexCharts(document.querySelector('#bubble'), options);
            chart.render();

        })
    }

};

innit();