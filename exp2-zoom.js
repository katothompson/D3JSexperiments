var vineData;
var width = 600;
var height = 470;
var padding = 60;
var circleRadius = 3;

// create svg element and append to div with id scatterPlot
var svg = d3.select('#scatterPlot').append('svg')
      .attr('height', height)
      .attr('width', width)
      .style('background', 'lightgrey')
      .call(d3.zoom().on("zoom", zoomFunction))

// create container element and append to svg. This will hold the zoomable scatter plot.
var zoomableContainer = svg.append('g')

// Zoom Function
function zoomFunction ()
      {     // transform the zoomable container which contains the circles
            zoomableContainer.attr("transform", d3.event.transform);   
            // transform the row axis
            var newRowScale = d3.event.transform.rescaleX(rowScale);
            var newVineScale = d3.event.transform.rescaleY(vineScale);
            rows.call(rowAxis.scale(newRowScale));
            vines.call(vineAxis.scale(newVineScale));
      }
// define domain of the data and range of the pixel scale
var xScale = d3.scaleLinear()
      .domain(d3.extent(vineData, d => d.longitude)) // d3.extent returns the min and max values of attribute 
      .range([padding,width-padding]) //pixel space

var yScale = d3.scaleLinear()
      .domain(d3.extent(vineData, d => d.latitude))
      .range([padding, height-padding]) //normally need to reverse this, but mock data has nums reversed, so its ok as is.

// Axis labels are based on the number of rows and number of vines, not the longitude and latitude.
// So, define the row and vine scales for the axis labels
var rowScale = d3.scaleLinear()
      .domain(d3.extent(vineData, d => d.row))
      .range([padding, width-padding])

var vineScale = d3.scaleLinear()
      .domain(d3.extent(vineData, d => d.vine))
      .range([height-padding, padding])

// The number of ticks needs to match the number of vines and number of rows.
var vineTickValues = createVineTickValues();
var rowTickValues = createRowTickValues();
var formatAxis = d3.format('.0f');

function createVineTickValues () {
      let values = [];
      let vineTickTotal = d3.max(vineData, d => d.vine);
      for (let i = 1; i<= vineTickTotal; i++) { values.push(i); }
      console.log(values)
      return values;
}
function createRowTickValues () {
      let values = [];
      let rowTickTotal = d3.max(vineData, d => d.row);
      for (let i = 1; i<= rowTickTotal; i++) { values.push(i); }
      return values;
}

// define the axis labels using row and vine scales
var vineAxis = d3.axisLeft(vineScale)
.tickValues(vineTickValues)
.tickSizeInner(0)
.tickPadding(5)
.tickFormat(formatAxis);

var rowAxis = d3.axisBottom(rowScale)
.tickValues(rowTickValues)
.tickSize(0)
.tickPadding(5)
.tickFormat(formatAxis);

// select the svg element and add a g element and append the x  and y axis
var rows = svg.append("g")
      .attr("transform", "translate(0, " + (height - padding) + ")")
      .call(rowAxis)
var vines = svg.append("g")
      .attr("transform", "translate(" + (padding) + ", 0)")
      .call(vineAxis)

// append the labels and title
svg.append("text")
      .attr('x', width/2)
      .attr('y', padding/3)
      .style('text-anchor', 'middle')
      .style('font-size', '1.5em')
      .text('Sample Vineyard Plot')

svg.append("text")
      .attr('x', width/2)
      .attr('y', height - padding/3)
      .style('text-anchor', 'middle')
      .text('Rows')

svg.append("text")
      .attr('transform', 'rotate(-90)')
      .attr('x', -height/2)
      .attr('y', padding/3)
      .style('text-anchor', 'middle')
      .text('Vines')


// select the svg element and any existing circle elements, 
      // then bind the data, and enter the rendering cycle
      zoomableContainer.selectAll("circle")
      .data(vineData)
      .enter()
      // for any data objects that do not have corresponding circle elements,
      // append a circle element.
      .append("circle")
            .attr("r", circleRadius)
            .attr("cx", d => xScale(d.longitude))
            .attr("cy", d => yScale(d.latitude))
            .attr('fill', 'mediumseagreen')
            .on('click', function(datum, index) {
                  // this is the <circle> that was clicked.
                  console.log(datum, index)
                  d3.select('#vineInfo').text(JSON.stringify(datum))
                  var color = this.getAttribute('fill')
                  color == 'yellow' ? color = 'mediumseagreen' : color = 'yellow';
                  d3.select(this)
                        .attr('fill', color)

            })



                  

