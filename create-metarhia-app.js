'use strict'

// create-metarhia-app app003 -ga dmitryfokin -ge metarhia-example-workspace

const { loadProps } = require('./lib/argv');
const {
  access,
  mkdir,
  rmdir,
  readFileJSON,
  writeFileJSON,
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

const nameBranch = `${props['-ga']}_${props.appName}`;

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

const addCloneRepoRecursion = async(nameRepo, pathDirRepo) => {
  if(loadedRepo.includes(nameRepo)) return;

  loadedRepo.push(nameRepo);

  if(!await gitCreateClone(nameRepo, {pathDir})) {
    return;
  };
  // TODO: сделать ветвь
  // проверяем есть ли ветвь во внешнем репозитории

  // если есть во нешнем ветвь читаем ее и переходим на нее

  // если внешней ветви нет - создаем локально и пушим во внешний репозиторий
  // переходим на ветвь

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
      packageData.dependencies[k] = `${nameRepoDependencies}#${nameBranch}`;

      if (!loadedRepo.includes(nameRepoDependencies)) {
        await addCloneRepoRecursion(nameRepoDependencies, k);
      };
    };
  }));
  await writeFileJSON(
    path.resolve(pathDir, pathDirRepo, 'package.json'),
    packageData,
  );
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

