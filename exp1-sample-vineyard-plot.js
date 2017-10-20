   
      var vineData;
      var width = 800;
      var height = 550;
      var padding = 50;
      var circleRadius = 3;

      // create svg element and append to div
      var svg = d3.select('#scatterPlot').append('svg')
          .attr('height', height)
          .attr('width', width)
          .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
         }))
      
      // define domain of the data and range of the pixel scale
      var xScale = d3.scaleLinear()
          .domain(d3.extent(vineData, d => d.longitude)) // d3.extent returns the min and max values of attribute 
          .range([padding,width-padding]) //pixel space
      
      var yScale = d3.scaleLinear()
          .domain(d3.extent(vineData, d => d.latitude))
          .range([height-padding, padding])

      var rowScale = d3.scaleLinear()
            .domain(d3.extent(vineData, d => d.row))
            .range([padding, width-padding])
      var vineScale = d3.scaleLinear()
            .domain(d3.extent(vineData, d => d.vine))
            .range([height-padding, padding])
      
      // define the x-axis label using rows and vines
      
      var vineAxis = d3.axisLeft(vineScale)
            .ticks(d3.max(vineData, d => d.vine))
            .tickSizeInner(0)
            .tickPadding(5);

      var rowAxis = d3.axisBottom(rowScale)
            .ticks(d3.max(vineData, d => d.row))
            .tickSize(-height + 2 * padding)
            .tickPadding(5);

      
      // select the svg element and add a g element and append the x  and y axis
      d3.select("svg")
            .append("g")
                  .attr("transform", "translate(0, " + (height - padding) + ")")
                  .call(rowAxis)
      d3.select("svg")
            .append("g")
                  .attr("transform", "translate(" + (padding) + ", 0)")
                  .call(vineAxis)
      // append the labels and title
      d3.select('svg')
            .append("text")
                  .attr('x', width/2)
                  .attr('y', padding/3)
                  .style('text-anchor', 'middle')
                  .style('font-size', '1.5em')
                  .text('Sample Vineyard Plot')

      d3.select('svg')
            .append("text")
                  .attr('x', width/2)
                  .attr('y', height - padding/3)
                  .style('text-anchor', 'middle')
                  .text('Rows')

      d3.select('svg')
            .append("text")
                  .attr('transform', 'rotate(-90)')
                  .attr('x', -height/2)
                  .attr('y', padding/3)
                  .style('text-anchor', 'middle')
                  .text('Vines')

      // select the svg element and any existing circle elements, 
      // then bind the data, and enter the rendering cycle
      d3.select("svg")
            .selectAll("circle")
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
                        var color = this.getAttribute('fill')
                        color == 'yellow' ? color = 'mediumseagreen' : color = 'yellow';
                        d3.select(this)
                              .attr('fill', color)

                  })

      // d3 general update pattern
      // 

      var myButton = d3.select("#myButton");
      myButton.on('click', function(){
            d3.select('svg')
            .selectAll('circle')
                  .attr('fill', 'mediumseagreen')
                  
      })
      var popButton = d3.select("#popButton")
      popButton.on('click', function(){
            vineData.pop();
            d3.select('svg')
            .selectAll('circle')
            .data(vineData)
            .exit()
            .remove()
      })

      