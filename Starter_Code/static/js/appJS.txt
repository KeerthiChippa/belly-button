var OTUmetadata = new Array;
var OTUsamples = new Array;
var OTUdata = new Array;
var topOTUdata = new Array;
var maxBarX = 0;
var maxBubbleX = 0;
var barX;
var barY;
var bubbleX;
var bubbleY;
var barWidth = 400;
var barHeight = 600;
var barMargin = {top: 50, bottom: 50, left: 50, right: 50}
var bubbleWidth = 2000;
var bubbleHeight = 600;
var bubbleMargin = {top: 50, bottom: 50, left: 50, right: 50}

function getData() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(
    function(data) {
        OTUmetadata = data['metadata'];
        OTUsamples = data['samples'];
        OTUnames = data['names'];
        console.log(data); 

        var bar = d3.select("#bar").append('svg').attr('id', 'svg1').attr('height', barHeight - barMargin.top - barMargin.bottom)
            .attr('width', barWidth - barMargin.left - barMargin.right)
            .attr('viewBox', [0, 0, barWidth, barHeight]).append('g').attr('id', 'svg1g1').attr('fill', 'royalblue')
            .attr("transform", "translate(" + barMargin.left + ", " + barMargin.top + ")");

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

        var bubble = d3.select('#bubble').append('svg').attr('id', 'svg2').attr('height', bubbleHeight - bubbleMargin.top - bubbleMargin.bottom)
            .attr('width', bubbleWidth - bubbleMargin.left - bubbleMargin.right)
            .attr('viewBox', [0, 0, bubbleWidth, bubbleHeight]).append('g').attr('id', 'svg2g1')
            .attr("transform", "translate(" + bubbleMargin.left + ", " + bubbleMargin.top + ")");

        thisOTUid = data['samples'][0]['id'];
        optionChanged(thisOTUid);
    });
};

function xBarAxis(g) {
    g.attr('transform', `translate(0, ${barHeight - barMargin.bottom})`).call(d3.axisBottom(barX)
        .ticks(null, topOTUdata.format));
};

function yBarAxis(g) {
    g.attr('transform', `translate(${barMargin.left}, 0)`).call(d3.axisLeft(barY).ticks(null, OTUdata.format));
};

function xBubbleAxis(g) {
    var bubbleAdjust = bubbleHeight - bubbleMargin.bottom - bubbleMargin.top;
    g.attr("transform", "translate(0," + bubbleAdjust + ")").call(d3.axisBottom(bubbleX)).attr('font-size', '10px');
};

function yBubbleAxis(g) {
    g.attr("transform", "translate(" + bubbleMargin.left + ", 0)").call(d3.axisLeft(bubbleY).ticks(null, OTUdata.format)).attr('font-size', '10px');
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

    maxBubbleX = 0;
    for (i = 0; i < OTUdata.length; i++) {
        for (j = 0; j < OTUdata.length - i - 1; j++) {
            if (OTUdata[j]['count'] < OTUdata[j + 1]['count']) {
                var temp = OTUdata[j];
                OTUdata[j] = OTUdata[j + 1];
                OTUdata[j + 1] = temp;
            }
        }
        thisNumber = Number(OTUdata[OTUdata.length - i - 1].name.substring(4));
        if (thisNumber > maxBubbleX) {
            maxBubbleX = thisNumber;
        }
    }

    console.log(OTUdata);
    maxBubbleY = OTUdata[0]['count'];
    console.log(maxBubbleX);
    console.log(maxBubbleY);

    var g2 = d3.select('#svg2g1');
    g2.remove();
    d3.select('#svg2').append('g').attr('id', 'svg2g1');
    g2 = d3.select('#svg2g1');

    bubbleX = d3.scaleLinear().domain([0, maxBubbleX]).range([bubbleMargin.left, bubbleWidth - bubbleMargin.left - bubbleMargin.right]);    
    bubbleY = d3.scaleLinear().domain([0, maxBubbleY]).range([bubbleHeight - bubbleMargin.bottom - bubbleMargin.top, bubbleMargin.bottom]);
    bubbleC = d3.scaleLinear().domain([0, maxBubbleY]).range(d3.schemeSet2);
    console.log(bubbleX);

    g2.append('text').attr('x', bubbleWidth / 2).attr('y', bubbleHeight - bubbleMargin.bottom / 2).attr('text-anchor', 'middle').text('OTU ID');
    g2.append('g').call(xBubbleAxis);
    g2.append('g').call(yBubbleAxis);
    g2.selectAll('dot').data(OTUdata).enter().append('circle')
        .attr('cx', function(d) { return bubbleX(Number(d.name.substring(4)));})
        .attr('cy', function(d) {return bubbleY(d.count);}).attr('r', function(d) { return 50*d.count/maxBubbleY;})
        .style('fill', function(d) { return bubbleC(d.count);});
    g2.node();

    topOTUdata = [];
    for (i = 0; (i < 10) && (i < OTUdata.length); i++) {
        topOTUdata.push(OTUdata[i])
    }
    console.log(topOTUdata)
    maxBarX = topOTUdata[0]['count'];
    console.log(maxBarX)

    
    var g1 = d3.select("#svg1g1");
    g1.remove();
 
    barX = d3.scaleLinear().domain([0, maxBarX]).range([barMargin.left, barWidth - barMargin.right]);    
    barY = d3.scaleBand().domain(topOTUdata.map(function(d) {return d.name;})).range([barMargin.top, barHeight - barMargin.bottom]).padding(0.1);

    d3.select("#svg1").append('g').attr('id', 'svg1g1').attr('fill', 'royalblue')
        .attr("transform", "translate(" + barMargin.left + ", " + barMargin.top + ")");

    g1 = d3.select("#svg1g1");

    g1.selectAll('rect').data(topOTUdata.sort((a, b) => d3.ascending(a.count, b.count)))
        .join('rect').attr('x',barX(0)).attr('y', function(d) { return barY(d.name);})        
        .attr('height', barY.bandwidth())        
        .attr('width',  function(d) { return barX(d.count);});
    g1.append('g').call(xBarAxis);
    g1.append('g').call(yBarAxis);
    g1.node();   
};