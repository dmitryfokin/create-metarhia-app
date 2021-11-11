const {rejects} = require('assert/strict');
const {exec} = require('child_process');
const {resolve} = require('dns');
const https = require('https');

const getGitHubURLSSH = (nameRepo) => {
  return `git@github.com:${nameRepo}.git`;
};

const getGitHubURLHTTPS = (nameRepo) => {
  return `https://github.com/${nameRepo}`;
};

const gitCreateClone = async (nameRepo, {pathDir}) => {
  console.log('pathApp git clone', pathDir);
  return await new Promise((resolve, reject) => {
    exec(
      `git clone ${getGitHubURLSSH(nameRepo)}`,
      {cwd: pathDir}, (err) => {
        if (err) {
          console.error(`Ошибка клонирования репозитория ${nameRepo}`);
          console.error(err);
          return resolve(false);
        };
        return resolve(true);
    });
  });
}

const gitExistRepo = async(nameRepo) => {
  if (!nameRepo) return false;
  return await new Promise((resolve) => {
    https.get(
      getGitHubURLHTTPS(nameRepo),
      (response) => {
        return resolve( 
          response.statusCode === 200
          ? true
          : false
        )
      }
    ).on('error', (e) => resolve(false))
  });
};

module.exports = {
  gitCreateClone,
  gitExistRepo,
}

