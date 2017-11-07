module.exports = {
  colors: [
    '#d32f2f', //red
    '#689f38', //green
    '#1565c0', //blue
    '#00bfa5', //teal
    '#5e35b1', //purple
    '#3949ab', //indigo
    '#c2185b', //pink
    '#00acc1', //cyan
    '#f57c00', //orange
  ],
  getRandom: function() {
    let totalColors = this.colors.length;
    return this.colors[Math.floor(Math.random() * totalColors) + 0  ];
  }
}