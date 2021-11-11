'use strict'

const gitLib = require('../lib/git');

const gitURL = async() => {
  const arrMsg = [];

  if (!gitLib.gitExistRepo('dmitryfokin/webdev')) {
    arrMsg.push('не найден репозиторий ');
  };


  if (gitLib.gitExistRepo('dmitryfokin/wwebdev')) {
    arrMsg.push('найден несуществующий репозиторий');
  };

  if (gitLib.gitExistRepo('')) {
    arrMsg.push('найден пустой репозиторий');
  };

  if (gitLib.gitExistRepo(undefined)) {
    arrMsg.push('найден undefined репозиторий');
  };

  if (gitLib.gitExistRepo(null)) {
    arrMsg.push('найден null репозиторий');
  };

  return arrMsg;
};

(async()=>{
  const arrMsg = [];
  arrMsg.concat(...await gitURL());

  if (arrMsg.length > 0) {
    console.log(arrMsg.join('\n'));
  };

})();

