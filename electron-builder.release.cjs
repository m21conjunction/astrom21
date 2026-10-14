const { build } = require("./package.json");

module.exports = {
  ...build,
  forceCodeSigning: true,
  mac: {
    ...build.mac,
    notarize: true
  },
  win: {
    ...build.win
  }
};
