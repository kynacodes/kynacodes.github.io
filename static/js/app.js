
d3.json("/static/js/samples.json").then(function (data) {
    var names = data.names;
    var metadata = {};
    var samples = {};
    var topTen = {};
    
    
    // Use D3 to populate the dropdown menu.
    var options = d3.select('#selDataset').selectAll("option")
        .data(names)
        .enter()
        .append("option");

    options.text(data => { return data; })
        .attr("value", data => { return data; });

    data.metadata.forEach(entry => {
        metadata[entry.id] = entry;
    });

    data.samples.forEach(sample => {
        let limitedSamples = [];
        let allSamples = [];
        sample.otu_ids.forEach((entry, index) => {
            sampleDict = {
                otu_id: entry,
                otu_label: sample.otu_labels[index],
                sampleValue: sample.sample_values[index]
            };
            limitedSamples.push(sampleDict);
            allSamples.push(sampleDict);
        });
        samples[sample.id] = allSamples;

        limitedSamples.sort((a, b) => {
            return b.sampleValue - a.sampleValue;
        });

        topTen[sample.id] = limitedSamples.slice(0, 10).reverse();
       
    });

    var trace1 = {
        x: topTen[names[0]].map(entry => entry.sampleValue),
        y: topTen[names[0]].map(entry => 'OTU ' + entry.otu_id),
        text: topTen[names[0]].map(entry => entry.otu_label),
        type: "bar",
        orientation: 'h'
    }

    var initialBarData = [trace1];
    
    Plotly.newPlot("bar", initialBarData);

    var trace2 = {
        x: samples[names[0]].map(entry => entry.otu_id),
        y: samples[names[0]].map(entry => entry.sampleValue),
        text: samples[names[0]].map(entry => entry.otu_label),
        type: "bubble",
        mode: 'markers', 
        marker: {
            size: samples[names[0]].map(entry => entry.sampleValue),
            color: samples[names[0]].map(entry => entry.otu_id)
        }
    }

    var initialBubbleData = [trace2];

    Plotly.newPlot("bubble", initialBubbleData);

    d3.select("#sample-metadata").append(metadata[names[0]]);
});