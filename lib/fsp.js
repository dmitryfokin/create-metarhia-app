const fsp = require('fs').promises;
const path = require('path');

const access = async (fileName) => {
  try {
    await fsp.access(
      path.resolve(__dirname, fileName), 
      constants.R_OK | constants.W_OK,
    );
    return true;
  } catch {
    return false;
  }
};

const mkdir = async(dirName) => {
  try {
    await fsp.mkdir(
      path.resolve(__dirname, dirName),
      constants.R_OK | constants.W_OK,
    );
    return true;
  } catch {
    return false;
  }

};

module.exports = {
  access,
  mkdir,
}

