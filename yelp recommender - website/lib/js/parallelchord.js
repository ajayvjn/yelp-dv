var factor = 0.75;
  var height = 480 * factor;
  var width = 640 * 2 * factor;
  var yelpcoord;
function showParallelcoord() {
  paraCoordElem = document.getElementById('yelpPC');
  paraCoordElem.style.width = width + 'px';
  paraCoordElem.style.height = height + 'px';

  if (window.jQuery)
  $(document).ready(function () {
    //Download on button click
    downloadButton = document.getElementById("downloadImage");
    if (downloadButton)
      downloadButton.onclick = downloadScreenshot;

    var triggerElem = $("#prlplotTrigger")
    if (triggerElem[0] != null)
      triggerElem.click(function () { fetchAttributes(null, null); });
    else
      fetchAttributes(null, null);
  });
else
  fetchAttributes(null, null);
}

var paracoordOnTrigger = function () {
  d3.csv('data/attributes.csv', function (data) {
    renderParaCoord(data);
  });
};

var renderParaCoord = function (data) {
  if (!yelpcoord)
    yelpcoord = d3.parcoords()("#yelpPC");

  objectKeys = Object.keys(data[0]);
  primaryAttr = objectKeys[0];

  //Create the Scale we will use for the Axis
  var axisScale = d3.scale.linear()
    .domain([1, -1])
    .range([0, height - 35]);

  //Axis for name column
  var axisScaleName = d3.scale.ordinal()
    .range([0, height - 35]);

  // linear color scale
  var colorScale = d3.scale.linear()
    .domain([-1, 1])
    .range(["red", "lime"])
    .interpolate(d3.interpolateLab);

  yelpcoord
    .width(width)
    .height(height)
    .dimensions(
    {
      [objectKeys[objectKeys.length - 1]]:
      {
        title: "Restaurants",
        orient: 'left',
        type: 'string',
        tickPadding: 5,
        innerTickSize: 10,
        index: 0
      },
      [objectKeys[objectKeys.length - 2]]: {
        title: "Average",
        type: 'number',
        index: 1,
        yscale: axisScale
      },
      [objectKeys[0]]: {
        type: 'number',
        yscale: axisScale
      },
      [objectKeys[1]]: {
        type: 'number',
        yscale: axisScale
      },
      [objectKeys[2]]: {
        type: 'number',
        yscale: axisScale
      },
      [objectKeys[3]]: {
        type: 'number',
        yscale: axisScale
      },
      [objectKeys[4]]: {
        type: 'number',
        yscale: axisScale
      }
    })
    .data(data)
    .color(function (d) { return colorScale(d[objectKeys[objectKeys.length - 2]]); })
    .animationTime(1000)
    .data(data)
    .alpha(.6)
    .alphaOnBrushed(0.33)
    .mode("queue")
    .rate(1)
    .render()
    .margin({ top: 25, left: 90, right: 0, bottom: 10 })
    .reorderable()
    .brushMode("1D-axes-multi")
    .brushedColor(
    //"navy"
    "#48A4FF"
    );

  yelpcoord.svg.selectAll("text")
    .style("font", "9px sans-serif");

  yelpcoord.svg.selectAll("text.label")
    .attr("transform", "translate(0,-10)")
    .style("font", "12px sans-serif")
    .style("font-weight", "bold");
};


//Download the attribute comparision image
function downloadScreenshot() {

  var callback = function (canvas) {
    // Download the image
    var download = document.createElement("a");
    download.href = canvas.toDataURL("image/png");
    download.download = "parallel-coordinate.png";
    download.click();
  };
  yelpcoord.mergeParcoords(callback);
}

var fetchAttributes = function (businessid, radius) {

  if (businessid == null) {
    businessid = "Sq596PqWNj7J0s-YAQmrQA";
    console.warn('Using sample biz_id = ' + businessid);
  }

  if (radius == null) {
    radius = 1;
    console.warn('Using sample radius =' + radius);
  }

  if (window.jQuery)
    $.ajax({
      type: "GET",
      url: /*baseurl*/ 'http://localhost:5000' + "/getdata/attributes/" + businessid + "/radius/" + radius,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        renderParaCoord(response);
      },
      error: function (xhr, textStatus, errorMessage) {
        console.log(errorMessage);
        paracoordOnTrigger();
      }
    });
  else {
    console.warn("Switching to local");
    paracoordOnTrigger();
  }
}