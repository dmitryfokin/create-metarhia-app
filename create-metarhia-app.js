'use strict'

// create-metarhia-app app003 -ga dmitryfokin -ge metarhia-example-workspace

const { loadProps } = require('./lib/argv');
const {
  access,
  mkdir,
  rmdir,
  readFileJSON,
} = require('./lib/fsp');
const fsp = require('fs').promises;
const path = require('path');
const {gitCreateClone, gitExistRepo} = require('./lib/git');

console.log('cwd', process.cwd());
const props = loadProps();
const pathDir = path.resolve(process.cwd(), props.appName);
console.log('pathDir', pathDir);
const nameRepoApp = `${props['-ga']}/${props['-ge']}`;
const loadedRepo = [];

if (props.err) {
  console.error(props.err);
  process.exit(1);
}

if (props.command === 'help') {
    console.log(`Создание окружения Metarhia для разработки
        create-metarhia-app appName -ga {gitHub accaunt} [-ge {repo example}]
      `
    );
  process.exit(0);
}

const addCloneRepo = async(nameRepo) => {
  if(loadedRepo.includes(nameRepo)) return;

  loadedRepo.push(nameRepo);

  if(!await gitCreateClone(nameRepo, {pathDir})) {
    return;
  };
  // TODO: сделать ветвь
  
  // читаем package.json и зависимости в нем

  const packageData = await readFileJSON(
    path.resolve(pathDir, props['-ge'], 'package.json')
  );
  console.log(packageData.dependencies);
  const keysRepo = Object.keys(packageData.dependencies);
  console.log(keysRepo);

  console.log('1');
  await Promise.all(keysRepo.map(async(k) => {
    const nameRepo = `${props['-ga']}/${k}`;
    if (await gitExistRepo(nameRepo)) {
      console.log('найден репозиторий', nameRepo);
    };
  }));
  console.log('2');

};

console.log('props', props);
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

  await addCloneRepo(nameRepoApp);
/*
  if(!await gitCreateClone(nameRepo, {pathDir})) {
    await rmdir(pathDir);
    process.exit(1);
  };
*/
};

start();
//addCloneRepo(nameRepoApp);

