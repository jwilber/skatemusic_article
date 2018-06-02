function resize() {}

function init() {

var WaffleChart = function() {

  var $_selector,
      $_title,
      $_data,
      $_label,
      $_cellSize,
      $_cellGap,
      $_rows,
      $_columns,
      $_rounded,
      $_keys,
      $_useWidth,
      $_useLegend;

  var defaults = {
    size: 6,
    rows: 50,
    columns: 100,
    rounded: false,
    gap: 2,
    useLegend: false
  };

  function generatedWaffleChart() {

    $_keys = d3v3.keys($_data[0]);

    var obj = {
      selector: $_selector,
      title: $_title,
      data: $_data,
      label: $_label,
      size: $_cellSize,
      gap: $_cellGap,
      rows: $_rows,
      columns: $_columns,
      rounded: $_rounded
    };

    drawWaffleChart(obj);

  }

  function drawWaffleChart(_obj) {

    if (!_obj.size) { _obj.size = defaults.size; }
    if (!_obj.rows) { _obj.rows = defaults.rows; }
    if (!_obj.columns) { _obj.columns = defaults.columns; }
    if (_obj.gap === undefined) { _obj.gap = defaults.gap; }
    if (_obj.rounded === undefined) { _obj.columns = defaults.rounded; }

    var formattedData = [];
    var domain = [];
    var value = $_keys[$_keys.length - 2];
    var total = d3v3.sum(_obj.data, function(d) { return d[value]; });

    if ($_useWidth) {
      var forcedWidth = d3v3.select(_obj.selector).node().getBoundingClientRect().width;
      _obj.columns = Math.floor(forcedWidth / (_obj.size + _obj.gap));
    }

    var squareVal = total / (_obj.rows * _obj.columns);

    _obj.data.forEach(function(d, i) {
      d[value] = +d[value];
      d.units = Math.floor(d[value] / squareVal);
      Array(d.units + 1).join(1).split('').map(function() {
        formattedData.push({
          squareVal: squareVal,
          units: d.units,
          value: d[value],
          groupIndex: i
        });
      });
      domain.push(d[$_keys[0]]);
    });

    var red = "#CE2A23";

    var colorMap = {
      'Indie/Alternative': 0,
      'Classic Rock': 1,
      'Hip Hop': 2, //3th
      'Punk': 3, //4th
      'Metal': 4, //5th
      'Electronic': 5,
      'Jazz/Soul': 6,
      'Other': 7 //1
    };

    var color = d3v3.scale.ordinal()
      // .domain([0, _obj.data.length - 1]) >> changed this
      .domain([0, 1, 2, 3, 4, 5, 6, 7])
      .range(['#ccebc5', '#f2f2f2', '#fbb4ae','#fed9a6','#fddaec','#decbe4', '#f9f9bb','#b3cde3']);

    //if (_obj.label) {
      d3v3.select(_obj.selector)
        .append("div")
        .attr("class", "label")
        .text(_obj.label);
    //}

    // set up title
    var title = d3v3.select($_selector)
      .append("div");

    // add legend
    if ($_useLegend) {
        var legend = d3v3.select('.waffle_legend')
        .append("div")
        .attr("class", "legend");

      var legendItem = legend.selectAll("div")
        .data(_obj.data);

      legendItem.enter()
        .append("div")
        .attr("class", function(d, i) {
          return "legend_item legend_item_" + (i + 1);
        });

      var legendIcon = legendItem.append("div")
        .attr("class", "legend_item_icon")
        .style("background-color", function(d, i) {
            return color(i);
         // }
        });

      if (_obj.rounded) {
        legendIcon.style("border-radius", "100%"); // circles
      }

      legendItem.append("span")
        .attr("class", "legend_item_text")
        .text(function(d) { return d[$_keys[0]]; });
    }

    var width = (_obj.size * _obj.columns) + (_obj.columns * _obj.gap) - _obj.gap;
    var height = (_obj.size * _obj.rows) + (_obj.rows * _obj.gap) - _obj.gap;

    if ($_useWidth) {
      width = d3v3.select(_obj.selector).node().getBoundingClientRect().width;
    }

    var svg = d3v3.selectAll(_obj.selector)
      .append("svg")
      .attr("class", "waffle")
      .attr("width", width)
      .attr("height", height);


    var g = svg.append("g")
      .attr("transform", "translate(0,0)");


    // insert dem items

    var item = g.selectAll(".unit")
      .data(formattedData);

    item.enter()
      .append("rect")
      .attr("class", "unit")
      .attr("width", _obj.size)
      .attr("height", _obj.size)
      .attr("fill", function (d) { return color(d.groupIndex); })
      // .on('mouseover', mouseover)
      .attr("x", function(d, i) {
        var col = Math.floor(i / _obj.rows);
        return (col * (_obj.size)) + (col * _obj.gap);
      })
      .attr("y", function(d, i) {
        var row = i % _obj.rows;
        return (_obj.rows * (_obj.size + _obj.gap)) - ((row * _obj.size) + (row * _obj.gap)) - _obj.size - _obj.gap;
      })
      .append("title")
      .text(function (d, i) {
        return _obj.data[d.groupIndex][$_keys[0]] + ": " + Math.round((d.units / formattedData.length) * 100) + "%";
      })
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // tooltip
    var tooltip = d3.select($_selector).append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

    if (_obj.rounded) {
      item
        .attr("rx", (_obj.size / 2))
        .attr("ry", (_obj.size / 2));
    }

    title.append('g')
      .append("text")
      .attr('class', 'waffle_title')
      .attr("x", (width / 2))
      .attr("y", 0 - (height/11))
      .style('color', 'black')
      .text($_title);

  }



  generatedWaffleChart.selector = function(value){
    if (!arguments.length) { return $_selector; }
    $_selector = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.title = function(value){
    if (!arguments.length) { return $_title; }
    $_title = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.data = function(value){
    if (!arguments.length) { return $_data; }
    $_data = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.useWidth = function(value){
    if (!arguments.length) { return $_useWidth; }
    $_useWidth = value;
    return generatedWaffleChart;
  }

    generatedWaffleChart.useLegend = function(value){
    if (!arguments.length) { return $_useLegend; }
    $_useLegend = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.label = function(value){
    if (!arguments.length) { return $_label; }
    $_label = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.size = function(value){
    if (!arguments.length) { return $_cellSize; }
    $_cellSize = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.gap = function(value){
    if (!arguments.length) { return $_cellGap; }
    $_cellGap = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.rows = function(value){
    if (!arguments.length) { return $_rows; }
    $_rows = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.columns = function(value){
    if (!arguments.length) { return $_columns; }
    $_columns = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.rounded = function(value){
    if (!arguments.length) { return $_rounded; }
    $_rounded = value;
    return generatedWaffleChart;
  }

  return generatedWaffleChart;

};


d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == '411')
        var waffle = new WaffleChart()
          .selector(".waffle_row_1")
          .title('411')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == '917')
        var waffle = new WaffleChart()
          .selector(".waffle_row_13")
          .title('917')
          .data(data)
          .useWidth(false).useLegend(true)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'adidas')
        var waffle = new WaffleChart()
          .selector(".waffle_row_25")
          .title('Adidas')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'aws')
        var waffle = new WaffleChart()
          .selector(".waffle_row_37")
          .title('Alien Workshop')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'almost')
        var waffle = new WaffleChart()
          .selector(".waffle_row_2")
          .title('Almost')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'antihero')
        var waffle = new WaffleChart()
          .selector(".waffle_row_14")
          .title('Anti Hero')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'bacon')
        var waffle = new WaffleChart()
          .selector(".waffle_row_26")
          .title('Bacon')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'baker')
        var waffle = new WaffleChart()
          .selector(".waffle_row_38")
          .title('Baker')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'birdhouse')
        var waffle = new WaffleChart()
          .selector(".waffle_row_3")
          .title('Birdhouse')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'blacklabel')
        var waffle = new WaffleChart()
          .selector(".waffle_row_15")
          .title('Black Label')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'blind')
        var waffle = new WaffleChart()
          .selector(".waffle_row_27")
          .title('Blind')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'bloodwizard')
        var waffle = new WaffleChart()
          .selector(".waffle_row_39")
          .title('Blood Wizard')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'blueprint')
        var waffle = new WaffleChart()
          .selector(".waffle_row_4")
          .title('Blueprint')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'chocolate')
        var waffle = new WaffleChart()
          .selector(".waffle_row_16")
          .title('Chocolate')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'cliche')
        var waffle = new WaffleChart()
          .selector(".waffle_row_28")
          .title('Cliché')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'consolidated')
        var waffle = new WaffleChart()
          .selector(".waffle_row_40")
          .title('Consolidated')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'creature')
        var waffle = new WaffleChart()
          .selector(".waffle_row_5")
          .title('Creature')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'dc')
        var waffle = new WaffleChart()
          .selector(".waffle_row_17")
          .title('DC Shoes')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'deathwish')
        var waffle = new WaffleChart()
          .selector(".waffle_row_29")
          .title('Deathwish')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'dgk')
        var waffle = new WaffleChart()
          .selector(".waffle_row_41")
          .title('D.G.K.')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'dvs')
        var waffle = new WaffleChart()
          .selector(".waffle_row_6")
          .title('DVS Shoes')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'element')
        var waffle = new WaffleChart()
          .selector(".waffle_row_18")
          .title('Element')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'emerica')
        var waffle = new WaffleChart()
          .selector(".waffle_row_30")
          .title('Emerica')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'enjoi')
        var waffle = new WaffleChart()
          .selector(".waffle_row_42")
          .title('Enjoi')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });


d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'flip')
        var waffle = new WaffleChart()
          .selector(".waffle_row_7")
          .title('Flip')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'foundation')
        var waffle = new WaffleChart()
          .selector(".waffle_row_19")
          .title('Foundation')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'girl')
        var waffle = new WaffleChart()
          .selector(".waffle_row_31")
          .title('Girl')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'habitat')
        var waffle = new WaffleChart()
          .selector(".waffle_row_43")
          .title('Habitat')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'krooked')
        var waffle = new WaffleChart()
          .selector(".waffle_row_8")
          .title('Krooked')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'lakai')
        var waffle = new WaffleChart()
          .selector(".waffle_row_20")
          .title('Lakai')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'lurkville')
        var waffle = new WaffleChart()
          .selector(".waffle_row_33")
          .title('Lurkville')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'osiris')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_44")
          .title('Osiris Shoes')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });


d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'planb')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_21")
          .title('Plan B')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'polar')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_33")
          .title('Polar')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'pyramidcountry')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_45")
          .title('Pyramid Country')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'sk8mafia')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_10")
          .title('SK8MAFIA')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'pig')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_9")
          .title('Pig Wheels')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'slave')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_22")
          .title('$LAVE')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'stereo')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_34")
          .title('Stereo')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'supreme')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_46")
          .title('Supreme')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'thrasher')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_11")
          .title('Thrasher')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'toymachine')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_23")
          .title('Toy Machine')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'transworld')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_35")
          .title('Transworld')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'vans')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_47")
          .title('Vans')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'volcom')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_12")
          .title('Volcom')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'vox')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_24")
          .title('Vox Footwear')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'zero')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_36")
          .title('Zero')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });

d3v3.csv("assets/waffle.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var data = data.filter(d => d.company == 'zooyork')
        var waffle = new WaffleChart() 
          .selector(".waffle_row_48")
          .title('Zoo York')
          .data(data)
          .useWidth(false).useLegend(false)
          .size(5)
          .gap(0)
          .rows(20)
          .columns(50)
          .rounded(false)();
      }
    });


d3v3.select('.waffle_main_title')
  .append('g')
      .append("text")
      .attr("x", window.innerWidth /2)
      .attr("y", 0 - (window.innerHeight/11))
      .style('color', 'black')
      .style('font-size', '50px')
      .style('text-align', 'center')
      .text("Genre Distributions by Company");



}

export default { init, resize };
