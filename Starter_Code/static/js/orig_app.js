var OTUmetadata = new Array;
var OTUsamples = new Array;
var OTUdata = new Array;
var topOTUdata = new Array;
var maxBarY = 0;
var maxBubbleY = 0;
var barX;
var barY;
var bubbleX;
var bubbleY;
var barWidth = 400;
var barHeight = 800;
var barMargin = {top: 50, bottom: 50, left: 50, right: 50}
var bubbleWidth = 400;
var bubbleHeight = 800;
var bubbleMargin = {top: 50, bottom: 50, left: 50, right: 50}

function getData() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(
    function(data) {
        OTUmetadata = data['metadata'];
        OTUsamples = data['samples'];
        OTUnames = data['names'];
        console.log(data); 

        var bar = d3.select("#bar").append('svg').attr('id', 'svg1').attr('height', barHeight - barMargin.top - barMargin.bottom).attr('width', barWidth - barMargin.left - barMargin.right)
            .attr('viewBox', [0, 0, barWidth, barHeight]).append('g').attr('id', 'svg1g1').attr('fill', 'royalblue');

        var selDataset = d3.select('#selDataset').selectAll('option').data(OTUnames).enter().append('option');
        selDataset.text(function(d) { return d;}).attr('value', function(d) { return d;});

        var sampleMetaData = d3.select('#sample-metadata');
        sampleMetaData.append('p').attr('id', 'metaId');
        sampleMetaData.append('p').attr('id', 'metaEthnicity');
        sampleMetaData.append('p').attr('id', 'metaGender');
        sampleMetaData.append('p').attr('id', 'metaAge');
        sampleMetaData.append('p').attr('id', 'metaLocation');
        sampleMetaData.append('p').attr('id', 'metaBbtype');
        sampleMetaData.append('p').attr('id', 'metaWfreq');

        var gauge = d3.select('#gauge').append('svg').attr('id', 'svg2').attr('height', bubbleHeight - bubbleMargin.top - bubbleMargin.bottom).attr('width', bubbleWidth - bubbleMargin.left - bubbleMargin.right)
            .attr('viewBox', [0, 0, bubbleWidth, bubbleHeight]).append('g').attr('id', 'svg2g1');
    
        thisOTUid = data['samples'][0]['id'];
        optionChanged(thisOTUid);
    });
};

function xBarAxis(g) {
    g.attr('transform', `translate(0, ${barHeight - barMargin.bottom})`).call(d3.axisBottom(barX).tickFormat(i => topOTUdata[i].name))
    .attr('font-size', '10px');
};

function yBarAxis(g) {
    g.attr('transform', `translate(${barMargin.left}, 0)`).call(d3.axisLeft(barY).ticks(null, topOTUdata.format))
};

function xBubbleAxis(g) {
    g.attr('transform', `translate(0, ${bubbleHeight - bubbleMargin.bottom})`).call(d3.axisBottom(bubbleX).tickFormat(i => OTUdata[i].name))
    .attr('font-size', '10px');
};

function yBubbleAxis(g) {
    g.attr('transform', `translate(${bubbleMargin.left}, 0)`).call(d3.axisLeft(bubbleY).ticks(null, OTUdata.format))
};

function optionChanged(thisOTUid) {
    console.log(thisOTUid);
    var thisMetadata = OTUmetadata.find(item => item.id === Number(thisOTUid));
    d3.select('#metaId').text('id: ' + thisMetadata['id']);
    d3.select('#metaEthnicity').text('ethnicity: ' + thisMetadata['ethnicity']);
    d3.select('#metaGender').text('id: ' + thisMetadata['gender']);
    d3.select('#metaAge').text('id: ' + thisMetadata['age']);
    d3.select('#metaLocation').text('id: ' + thisMetadata['location']);
    d3.select('#metaBbtype').text('id: ' + thisMetadata['bbtype']);
    d3.select('#metaWfreq').text('id: ' + thisMetadata['wfreq']);

    var thisSamples = OTUsamples.find(item => item.id === thisOTUid);
    console.log(thisMetadata);
    console.log(thisSamples);
    OTUdata = [];
    for (i = 0; i < thisSamples['otu_ids'].length; i++) {
        OTUdata.push({"name": 'OTU ' + thisSamples['otu_ids'][i].toString(), "count": thisSamples['sample_values'][i]})
    }
    console.log(OTUdata);

    for (i = 0; i < OTUdata.length; i++) {
        for (j = 0; j < OTUdata.length - i - 1; j++) {
            if (OTUdata[j]['count'] < OTUdata[j + 1]['count']) {
                var temp = OTUdata[j];
                OTUdata[j] = OTUdata[j + 1];
                OTUdata[j + 1] = temp;
            }
        }
    }

    console.log(OTUdata);
    maxBubbleY = OTUdata[0]['count'];

    var g2 = d3.select('#svg2g1');
    g2.remove();
    d3.select('#svg2').append('g').attr('id', 'svg2g1');
    g2 = d3.select('#svg2g1');

    bubbleX = d3.scaleBand().domain(d3.range(OTUdata.length)).range([bubbleMargin.left, bubbleWidth - bubbleMargin.right]).padding(0.1);
    bubbleY = d3.scaleLinear().domain([0, maxBubbleY]).range([bubbleHeight - bubbleMargin.bottom, bubbleMargin.top]);
    g2.selectAll('circle').data(OTUdata).enter().append('circle').attr('cx', function(d) { return Number(d.name.substring(4))})
        .attr('cy', function(d) {return d.count}).attr('r', function(d) { return Math.sqrt(d.count)/Math.PI})
        .attr('fill', 'royalblue');
    g2.append('g').call(xBubbleAxis);
    g2.append('g').call(yBubbleAxis);
    g2.node();

    topOTUdata = [];
    for (i = 0; (i < 10) && (i < OTUdata.length); i++) {
        topOTUdata.push(OTUdata[i])
    }
    console.log(topOTUdata);
    maxBarY = topOTUdata[0]['count'];

    
    var g1 = d3.select("#svg1g1");
    g1.remove();
    d3.select("#svg1").append('g').attr('id', 'svg1g1').attr('fill', 'royalblue');
    g1 = d3.select("#svg1g1");

    barX = d3.scaleBand().domain(d3.range(topOTUdata.length)).range([barMargin.left, barWidth - barMargin.right]).padding(0.1);
    barY = d3.scaleLinear().domain([0, maxBarY]).range([barHeight - barMargin.bottom, barMargin.top]);
    g1.selectAll('rect').data(topOTUdata.sort((a, b) => d3.ascending(a.count, b.count)))
        .join('rect').attr('x', (d, i) => barX(i)).attr('y', (d) => barY(d.count))
        .attr('height', d => barY(0) - barY(d.count))
        .attr('width', barX.bandwidth()).attr("transform", `rotate(90)`);
    g1.append('g').call(xBarAxis);
    g1.append('g').call(yBarAxis);
    g1.node();   
};