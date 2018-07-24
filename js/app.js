'use strict'

Vue.prototype.$http = axios
var basisUrl = 'http://192.168.1.179/api/QSnPt9eT7zn2DyASfXnFuzVXXeARZSPLPaL8eIMT'

var app = new Vue({
  el: '#app',
  data: {
    bulb: 1,
    state: {
      on: true,
      color: {
        x: 0,
        y: 0
      },
      hex: '#AAAAAA'
  //    color: 14988
    },
    lights: {
      placeholder: {
        name: 'Lights'
      }
    }
  },

  mounted: function () {
    this.retrieveHueJSON()
  },
  methods: {
    changeColor: function (event) {
      // this.
    },
    changeOnOff: function (event) {

    },

    hexToRGB: function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
},

    updateBulb: function (event) {

      event.preventDefault();

        var vm = this;

        // console.log(vm.state.color);

        var rgb = this.hexToRGB(vm.state.hex);



        this.rgbToXy(rgb.r, rgb.g, rgb.b, function(x,y) {
          vm.state.color.y = parseFloat(y.toFixed(4));
          vm.state.color.x = parseFloat(x.toFixed(4));
        });

// console.log(vm.state.color.x);
// console.log(vm.state.color.y);
var color_arr = [vm.state.color.x, vm.state.color.y];

console.log(color_arr);

        var id = this.bulb;

      this.$http.put(basisUrl + '/lights/' + id + '/state', {
      on: vm.state.on,
      xy: color_arr,
    //  colormode: 'xy'

      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    },

    toggleBulb: function (event) {
      this.bulb = event.target.dataset.lamp;




  }
  ,
    retrieveHueJSON: function (callback) {
      var vm = this
      this.$http.get(basisUrl + '/lights')
        .then(function (response) {
          vm.lights = response.data
        })
        .catch(function (error) {
          alert(error)
        })
        .then(function (response) {
          if (typeof callback === 'function') {
            callback(response)
          }
        })


    },
    rgbToXy: function (red, green, blue, callback) {
      var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
      var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
      var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

      var x = X / (X + Y + Z);
      var y = Y / (X + Y + Z);

      callback(x, y);
    },

    xyToRgb: function ( x, y, bri = 1, callback) {
      callback(x, y, bri)
    }
    // visualizeResponse: function () {
    //   var vm = this
    //
    // }
  }

})
