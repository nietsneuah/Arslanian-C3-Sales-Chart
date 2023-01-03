// import c3 library
import c3 from 'c3';
import d3 from 'd3';



// This calls the loadChart script on FM (loadChart returns json as a string)
window.loadChart = function (json) {
  console.log('loadChart' , json);
  
  // JSON.parse() will convert the string object 'json' to a JSON object that JS can use (looks like {data: [{Array 1}, {Array 2}]}   )
  const obj = JSON.parse(json);
  const data = obj.data;
  console.log('obj', obj);
  console.log('data', data);

// Test mapping
const arclean = data.map(function(n){
  return n["AR cleaning"]
});
console.log('arclean', arclean);

  const chartType = obj.chartType;
  const chartHeight = obj.chartHeight;
  const chartWidth = obj.chartWidth;

  const len  = obj.data.length;
  console.log('len of array', len);

  // construct array of dateLabels
  const dateLables = [];
  for (let i = 0; i < len; i++) {
    dateLables.push({
      key: obj.data[i].zz_dateLabel,
      sortable: false,
      resizable: false
    });
  }
  console.log('arr from loop', dateLables);

  // determine the grouping based on chart type
function grouping (c){
    let result;
    if (chartType === 'bar') {
      result = [
        
        ['AR cleaning', 'AR treatment' ],
        ['Rug sales', 'moth', 'pads' , 'AR misc'],
        ['Steam Clean', 'Scotchgard', 'Deodorize'], 
        ['Carpet', 'Furniture', 'Tile']];
    } else {
      result = '';
    }
    return result;
  };
  console.log('grouping', grouping(chartType));
  
  const options = {
    bindto: '#chart',
    axis: {
      x: {type: 'category'},
      y: {
        // tick: {
        //   format: d3.format("$")
        // }
      },
    },
    size: {
      height: chartHeight,
      width: chartWidth,
    },
    data: {
      //  
      // groups: grouping(chartType),
      
      // groups: [
      //   ['Carpet', 'Furniture', 'Tile'],
      //   ['Steam Clean', 'Scotchgard', 'Deodorize']
      // ],
      
      selection: {
        enabled: true
      },
      tooltip: {
        show: true
      },
      labels: false,
      type: chartType,
      // onmouseover : function(d) {
      //   console.log('yo', d);
      // },
      json: data,
      keys: {
        x: 'zz_dateLabel',
        value: ['AR cleaning',  'AR treatment' , 'Rug sales','moth', 'pads' , 'AR misc'],
    },
    grid:{
      x: {
        show: true
      },
      y:{
        show: true
      }
    },
    
      onclick: function (d){
        console.log('onclick data', d);
        // console.log('new chart type', newType);
        let newchartType = chart.chartType;
        console.log('onclick chart type', newchartType);

        // test function to check type of chart
        // function typeofChart (c){
        //   let result;
        //   if (newType === 'bar') {
        //     result = 'Use a dateLabel in the result';
        //   } else {
        //     result = 'its a ' + newType + ' chart';
        //   }
        //   return result;
        // };
        //   console.log('conditional',typeofChart(newType));
        
        // // is called "deconstruction"
      const {value, name, index, ratio} = (d);
      console.log("Index", index);
      // const month = months[index];
      const dateLabel = dateLables[index].key;
      const newObj = {name, value, dateLabel, ratio};
      console.log("new object", newObj);
      // // Call a FM script (scriptName, @param) in this case passing the data at from onclick event as a new JSON object that is converted to a string (.stringify)
      FileMaker.PerformScript("On Chart Click", JSON.stringify (newObj));
      },

      
  },


  }
  const chart = c3.generate(options);

  window.transformChart = function(type) {
    chart.transform(type);
    let newType = type;
    console.log('transformed chart type', newType);
    if (newType === 'bar') {
      setTimeout(function(){
        chart.groups(grouping(chartType)
        )
      }, 1000);
      const currentChartGroup = grouping(chartType);
      console.log('if new type chart', newType);
      console.log('chartGrouping', currentChartGroup);
      
    } else {
      setTimeout(function(){
        chart.groups([[]])
        
      }, 1000);
      const currentChartGroup = chart.groups([['']]);
      console.log('chartGrouping', currentChartGroup);
    };
  };
  
  window.resizeChart = function(height, width) {
    chart.resize({
      height: height,
      width: width
    })
  };
  
  // Bring in new data to existing chart
  window.loadData = function (json) {
    const obj = JSON.parse(json);
    const data1 = obj.data;
    console.log(data1);
    chart.load({
      json: data1,
      keys: {
        x: 'zz_dateLabel',
        value: ['Carpet', 'Furniture', 'Scotchgard', 'Deodorize', 'Tile', 'Steam Clean'],
        axis: {
          x: {type: 'category'},
          y: {},
        },
      },
    });
  };
  
};