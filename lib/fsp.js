const fs = require('fs');
const path = require('path');

const access = async (fileName) => {
  return fs.existsSync(fileName);
};

const mkdir = async(pathDir) => {
  let isMakeDir = true;
  await fs.promises.mkdir(
    pathDir,
    (err) => {
      if (err) {
        isMakeDir = false;
      };
    }
  );
  return isMakeDir;
};

const rmdir = async(pathDir) => {
  let isDeletedDir = true;
  fs.rmdir(pathDir, err => {
    if(err) {
      isDeletedDir = false;
    };
  });
  return isDeletedDir;
};  

const readFileJSON = async(fileName) => {
  return await JSON.parse(await fs.promises.readFile(fileName));
};

const writeFileJSON = async(fileName, data) => {
  let isWrite = true;
  fs.promises.writeFile(
    fileName,
    JSON.stringify(data, null, 2),
    (err) => {
      if(err) {
        console.error(err);
        isWrite = false
      };
    }
  );

  return isWrite; 
};

module.exports = {
  access,
  mkdir,
  rmdir,
  readFileJSON,
  writeFileJSON,
}

