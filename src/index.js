// import c3 library
import c3 from 'c3';

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
      labels: true,
      type: chartType,
      json: data,
      keys: {
        x: 'dateLabel',
        value: ['cleaning', 'misc', 'moth','pads'],
    },
      onclick: function (d){
        console.log('onclick data', d);
        // // is called "deconstruction"
      const {value, name} = (d);
      // // console.log("Index", index);
      // const month = months[index];
      const newObj = {name, value};
      console.log("new object", newObj);
      // // Call a FM script (scriptName, @param) in this case passing the data at from onclick event as a new JSON object that is converted to a string (.stringify)
      FileMaker.PerformScript("On Chart Click 1", JSON.stringify (newObj));
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
    const data = obj.data;
    console.log(data);
    chart.load({
      json: data,
        keys: {
          x: 'dateLabel',
          value: ['Location sales'],
          // axis: {
          //   x: {type: 'category'},
          //   y: {},
          // },
      },
    });
  
  };
};