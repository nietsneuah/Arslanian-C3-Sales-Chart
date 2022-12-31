// import c3 library
import c3 from 'c3';

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// This calls the loadChart script on FM (loadChart returns json as a string)
window.loadChart = function (json) {
  console.log('loadChart' , json);
  
  // JSON.parse() will convert the string object 'json' to a JSON object that JS can use (looks like {data: [{Array 1}, {Array 2}]}   )
  const obj = JSON.parse(json);
  const data = obj.data;
  console.log('obj', obj);
  console.log('data', data);

  const chartType = obj.chartType;
  const chartHeight = obj.chartHeight;
  const chartWidth = obj.chartWidth;

  const len  = obj.data.length;
  console.log('len of array', len);

  // construct array of dateLabels
  const dateLables = [];
  for (let i = 0; i < len; i++) {
    dateLables.push({
      key: obj.data[i].dateLabel,
      sortable: true,
      resizable: true
    });
  }
  console.log('arr from loop', dateLables);

  // determine the grouping based on chart type
function grouping (c){
    let result;
    if (chartType === 'bar') {
      result = [
        ['Rug sales'],
        ['AR cleaning','moth', 'AR misc', 'AR treatment', 'pads'],
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
      y: {},
    },
    size: {
      height: chartHeight,
      width: chartWidth,
    },
    data: {
      groups: grouping(chartType),
      
      // groups: [
      //   ['Rug sales'],
      //   ['AR cleaning','moth', 'AR misc', 'AR treatment', 'pads'],
      //   ['Carpet', 'Furniture', 'Scotchgard', 'Deodorize', 'Tile']
      // ],
      labels: false,
      type: chartType,
      json: data,
      keys: {
        x: 'dateLabel',
        value: ['AR cleaning','AR treatment', 'AR misc', 'moth', 'pads', 'Rug sales'],
    },
    // pie: {
    //   label:{
    //     format: function (value, ratio, id) {
    //       return d3.format('$')(value);
    //     }
    //   }
    // },
      onclick: function (d){
        console.log('onclick data', d);
        console.log('chart type', chartType);

        // test function to check type of chart
        function typeofChart (c){
          let result;
          if (chartType === 'bar') {
            result = 'Use a dateLabel in the result';
          } else {
            result = 'its a ' + chartType + ' chart';
          }
          return result;
        };
          console.log('conditional',typeofChart(chartType));
        
        // // is called "deconstruction"
      const {value, name, index} = (d);
      console.log("Index", index);
      // const month = months[index];
      const dataLabel = dateLables[index].key;
      const newObj = {name, value, dataLabel};
      console.log("new object", newObj);
      // // Call a FM script (scriptName, @param) in this case passing the data at from onclick event as a new JSON object that is converted to a string (.stringify)
      FileMaker.PerformScript("On Chart Click", JSON.stringify (newObj));
      },

      
  },


  }
  const chart = c3.generate(options);

  window.transformChart = function(type) {
    chart.transform(type);
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
          x: 'dateLabel',
          value: ['Carpet', 'Furniture', 'Scotchgard', 'Deodorize', 'Tile', 'Steam Clean'],
          axis: {
            x: {type: 'category'},
            y: {},
          },
      },
    });
  
  };
};