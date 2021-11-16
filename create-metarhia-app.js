'use strict'

// create-metarhia-app app003 -ga dmitryfokin -ge metarhia-example-workspace

const fsp = require('fs').promises;
const path = require('path');
const { loadProps } = require('./lib/argv');
const {
  access,
  mkdir,
  rmdir,
  readFileJSON,
  writeFileJSON,
} = require('./lib/fsp');
const {
  gitCreateClone,
  gitExistRepo,
  gitChangeBranch,
  gitAdd,
  gitCommit,
  gitPush,
} = require('./lib/git');

console.log('cwd', process.cwd());
const props = loadProps();

if (props.command === 'help') {
    console.log(`Создание окружения Metarhia для разработки
        create-metarhia-app appName -ga {gitHub accaunt} [-ge {repo example}]
      `
    );
  process.exit(0);
}

const pathDir = path.resolve(process.cwd(), props.appName);
console.log('pathDir', pathDir);
const nameRepoApp = `${props['-ga']}/${props['-ge']}`;
const loadedRepo = [];

const nameBranch = `${props['-ga']}_${props.appName}`;

if (props.err) {
  console.error(props.err);
  process.exit(1);
}

const addCloneRepoRecursion = async(nameRepo, pathDirRepo) => {
  if(loadedRepo.includes(nameRepo)) return;

  loadedRepo.push(nameRepo);

  if(!await gitCreateClone(nameRepo, pathDir)) {
    return;
  };

  await gitChangeBranch(path.resolve(pathDir, pathDirRepo), nameBranch);

  const packageData = await readFileJSON(
    path.resolve(pathDir, pathDirRepo, 'package.json')
  );

  if (!('dependencies' in packageData)) {
    return;
  };

  const keysRepo = Object.keys(packageData.dependencies);

  await Promise.all(keysRepo.map(async(k) => {
    const nameRepoDependencies = `${props['-ga']}/${k}`;
    if (await gitExistRepo(nameRepoDependencies)) {
      const pathRepoDependecies = path.resolve(pathDir, k);
      packageData.dependencies[k] = `${nameRepoDependencies}#${nameBranch}`;
      //packageData.dependencies[k] = `file:${pathRepoDependecies}`;

      if (!loadedRepo.includes(nameRepoDependencies)) {
        await addCloneRepoRecursion(nameRepoDependencies, k);
      };
    };
  }));
  await writeFileJSON(
    path.resolve(pathDir, pathDirRepo, 'package.json'),
    packageData,
  );
  await gitAdd(path.resolve(pathDir, pathDirRepo), ['package.json']);
  await gitCommit(path.resolve(pathDir, pathDirRepo), 'update package.json');
  await gitPush(path.resolve(pathDir, pathDirRepo));
};

const start = async() => {
  if (!await gitExistRepo(nameRepoApp)) {
    console.error(`Ошибка: Не найден репозиторий примера ${nameRepoApp}`);
    process.exit(1);
  };

  if (await access(pathDir)) {
    console.error(`Ошибка: Директория ${pathDir} уже существует.`);
    process.exit(1);
  };

  if (!await mkdir(pathDir)) {
    console.error(`Ошибка: Не получается создать директория ${pathDir}.`);
    process.exit(1);
  };

  await addCloneRepoRecursion(nameRepoApp, props['-ge']);
};

start();

