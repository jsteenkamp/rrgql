define(['moment', 'chroma'], function(moment, chroma) {
  // Note: doing this return many colors resulting in many dynamic styles
  // chroma.scale(['yellow', 'red']).domain([1, 15])(value).alpha(0.4).css();
  var colors = chroma.scale(['yellow', 'red']).colors(16).map(function(color){
    return chroma(color).alpha(0.4).css();
  });

  return {
    date: function(value) {
      return moment(value).format('dd-mmm-yyyy');
    },
    color: function(value) {
      // use int of value (between 0-15) to get corresponding color
      var idx = parseInt(value);
      if (idx < 0) return colors[0];
      if (idx > 15) return colors[15];
      return colors[idx];
    }
  };
});