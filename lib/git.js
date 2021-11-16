'use strict'

const {exec} = require('child_process');
const https = require('https');
const {stdout, stderr} = require('process');

const gitRun = async (command, pathDir) => {
  return await new Promise((resolve) => {
    exec(
      command,
      {cwd: pathDir}, (err, stdout, stderr) => {
        return resolve({err, stdout, stderr});
      }
    );
  });
};

const getGitHubURLSSH = (nameRepo) => {
  return `git@github.com:${nameRepo}.git`;
};

const getGitHubURLHTTPS = (nameRepo) => {
  return `https://github.com/${nameRepo}`;
};

const gitCreateClone = async (nameRepo, pathDir) => {
  if (!nameRepo || !pathDir) return false;

  console.log('git clone', nameRepo);
  const {err, stdout, stderr} = await gitRun(
    `git clone ${getGitHubURLSSH(nameRepo)}`,
    pathDir,
  );
  if (err) {
    console.error(`Ошибка клонирования репозитория ${nameRepo}`);
    console.error(err);
    return false;
  };
  return true;
};

const gitExistRepo = async (nameRepo) => {
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

const gitPush = async (pathRepo) => {
  if (!pathRepo) return false;
  const {err, stdout, stderr} = await gitRun(
    `git push`,
    pathRepo,
  );
  if (err) return false;
  return true;
};

const gitAdd = async (pathRepo, files) => {
  if (!pathRepo) return false;
  const {err, stdout, stderr} = await gitRun(
    `git add "${files.join(' ')}"`,
    pathRepo,
  );
  if (err) return false;
  return true;
};

const gitCommit = async (pathRepo, comment='any commit') => {
  if (!pathRepo) return false;
  const {err, stdout, stderr} = await gitRun(
    `git commit -m "${comment}"`,
    pathRepo,
  );
  if (err) return false;
  return true;
};

const gitRemoteBranchList = async (pathRepo) => {
  if (!pathRepo) return [];
  const {err, stdout, stderr} = await gitRun(
    `git branch -r`,
    pathRepo,
  );
  if ( stdout ) {
    return stdout.split('\n').map(v => v.trim());
  };
  return [];
};

const gitChangeBranch = async (pathRepo, nameBranch) => {
  if (!pathRepo || !nameBranch) return false;
  const listRemoteBranches = await gitRemoteBranchList(pathRepo);
  //console.log(`git ch br: ${pathRepo}; branch name: ${nameBranch}`);
  //console.log(listRemoteBranches);
  if (listRemoteBranches.includes(`origin/${nameBranch}`)) {
    //console.log(`git checkout branch: ${pathRepo}; branch name: ${nameBranch}. find remote`);
    const {err, stdout, stderr} = await gitRun(
      `git checkout -b ${nameBranch} origin/${nameBranch}`,
      pathRepo,
    );
    if (err) {
      console.error(err);
      return false;
    };
    return !!stdout;
  } else {
    //console.log(`git checkout branch: ${pathRepo}; branch name: ${nameBranch}. do not find remote`);
    const resultNewBranch = await gitRun(
      `git checkout -b ${nameBranch}`,
      pathRepo,
    );
    if (resultNewBranch.err) {
      console.error(resultNewBranch.err);
      return false;
    };

    const resultTraceRemote = await gitRun(
      `git push --set-upstream origin ${nameBranch}`,
      pathRepo,
    );
    if (resultTraceRemote.err) {
      console.error(resultTraceRemote.err);
      return false;
    };
    return !!resultTraceRemote.stdout;
  };
};

module.exports = {
  gitRun,
  gitCreateClone,
  gitExistRepo,
  gitRemoteBranchList,
  gitChangeBranch,
  gitAdd,
  gitCommit,
  gitPush,
}
