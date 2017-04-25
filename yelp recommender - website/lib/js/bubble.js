function showBubbleChart() {
    $("#bubblechart").html("");
    var height = 400;
    var width = 600;
    var margin = 60;
    var data =[];
    var sel_b_name ="";

    d3.json("data/bubble_data.json", function(d) {
        for(var i in d){
            var item = d[i];

            if(i==0){
                sel_b_name= item['business_name'][0]['item'];
            }
            var pol_dict = {
                1: "Poor",
                2: "Fair",
                3:  "Good",
                4: "Excellent"
            }

            var avg_polarity = item['avg_polarity'] * 1000;
            var avg_stars = item['avg_stars'];
            var count = item['count'];
            var business_names_arr = item['business_name'];

            var primary_business = 0;
            var business_str ="";
            var item_name = item['_id']['item'];
            business_str+= "<b>Item Name: </b>"+item_name+ "  "+"<br/>";

            business_str+= "<b>Polarity: </b>"+item['avg_polarity']+ "  "+"<br/>";
            for(var j in business_names_arr){
                business_str += "  <b> Businesses "+(parseInt(j)+parseInt(1))+":"+ " </b>"+business_names_arr[j]['item']+ " "+"<br/>";
                if(business_names_arr[j]['item'] == sel_b_name){
                    primary_business = 1;
                }
            }


            data.push({
                x:avg_stars,
                y:avg_polarity,
                c: item_name,
                size: count ,
                business_text : business_str,
                business_primary : primary_business


            })




        }
        var labelX = 'Average Stars';
        var labelY = 'Polarity';
        var svg = d3.select('.bubblechart')
            .append('svg')
            .attr('class', 'bubblechart')
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

        var x = d3.scale.linear()
            .domain([d3.min(data, function (d) { return d.x; }), d3.max(data, function (d) { return d.x; })])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([d3.min(data, function (d) { return d.y; }), d3.max(data, function (d) { return d.y; })])
            .range([height, 0]);

        var scale = d3.scale.sqrt()
            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
            .range([4, 40]);

        var opacity = d3.scale.sqrt()
            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
            .range([1, .5]);

        var color = d3.scale.category20();



        var xAxis = d3.svg.axis().scale(x);
        var yAxis = d3.svg.axis().scale(y).orient("left");
        var tooltipdiv_bubble = d3.select("body").append("tooltipdiv_bubble")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("g")
            .attr("class", "y axis-bubble")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 20)
            .attr("y", -margin)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(labelY);
        // x axis and label
        svg.append("g")
            .attr("class", "x axis-bubble")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width + 20)
            .attr("y", margin - 10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(labelX);

        var circle = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("g")
            .attr("class","circle-g");

        circle.insert("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("opacity", function (d) { return opacity(d.size); })
            .attr("r", function (d) { return scale(d.size); })
            .style("fill", function (d) { return color(d.c); })
            .attr("data-legend",function(d) { return d.c})


            .on('mouseover', function (d, i) {
                fade(d.c, .1);
                tooltipdiv_bubble
                    .transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltipdiv_bubble
                    .html(d.business_text)
                    .style("left", (d3.event.pageX+35) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

            })
            .on('mouseout', function (d, i) {
                fadeOut();
            })
            .transition()
            .delay(function (d, i) { return x(d.x) - y(d.y); })
            .duration(500)
            .attr("cx", function (d) { return x(d.x); })
            .attr("cy", function (d) { return y(d.y); })
            .ease("bounce");




        function fade(c, opacity) {
            svg.selectAll("circle")
                .filter(function (d) {
                    return d.c != c;
                })
                .transition()
                .style("opacity", opacity)

            svg.selectAll("circle")
                .filter(function (d) {
                    return d.c == c;
                })
                .transition()
                .style("stroke", function(d) {
                    if(d.business_primary == 1){
                        return "red";
                    }
                    return "blue";

                }).style("stroke-dasharray", function(d) {
                return d.business_primary == 1? (("10,3")) : (0,0);
                 });


            tooltipdiv_bubble.transition()
                .duration(200)
                .style("opacity", 0);

        }

        function fadeOut() {
            svg.selectAll("circle")
                .transition()
                .style("opacity", function (d) { opacity(d.size); })
                .style("stroke", "")
                .style("stroke-dasharray","");
            tooltipdiv_bubble.transition()
                .duration(200)
                .style("opacity", 0);

        }
        legend = svg.append("g")
            .attr("class","legend")
            .attr("transform","translate(480,-2)")
            .style("font-size","10px")
            .call(d3.legend)


    });
}