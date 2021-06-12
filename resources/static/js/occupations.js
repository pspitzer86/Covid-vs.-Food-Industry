function occupations(yearChange) {
    d3.csv("./Data/Occupations_by_Share.csv").then((importedData) => {

        // Setting a variable for the metadata and samples portions of the json.

        occupations = {};
        let first = true;
        let currMajor = "";
        let totalPop = 0;

        for (let i = 0; i < importedData.length; i++) {
            if (importedData[i].Year == yearChange) {
                if (!(importedData[i]["Major Occupation Group"] in occupations)) {
                    occupations[importedData[i]["Major Occupation Group"]] = {};
                    occupations[importedData[i]["Major Occupation Group"]["Detailed Occupation"]] = parseInt(importedData[i]["Total Population"]);
                } else {
                    occupations[importedData[i]["Major Occupation Group"]][[importedData[i]["Detailed Occupation"]]] = parseInt(importedData[i]["Total Population"]);
                }

                totalPop += parseInt(importedData[i]["Total Population"]);
            }
        }

        console.log(occupations);
        console.log(totalPop);
        
        var treeData = [
            { name: `Total Population: ${totalPop}`, children: [] }
        ];

        console.log(Object.keys(occupations));

        k = 0;

        for (let key in occupations) {

            if (key != "undefined") {

                treeData[0]["children"].push({ name: key, children: [] });

                for (let dKey in occupations[key]) {

                    treeData[0]["children"][k]["children"].push({ name: dKey, value: ((occupations[key][dKey])) });


                }

                k++;

            }

        }
        console.log(treeData);

        anychart.onDocumentReady(function () {

            var treeChart = d3.select("#interactive");

            treeChart.html("");

            var tree = anychart.data.tree(treeData, "as-tree");

            var chart = anychart.treeMap(tree);

            chart.title(`Occupations by Share in the Food/Service Industry ${yearChange}`);

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

            chart.container("interactive");

            chart.draw();

        });

    });
}