'use strict'

const { loadProps } = require('./lib/argv');
const {access} = require('./lib/fsp.js');
const fsp = require('fs').promises;

const props = loadProps();

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

console.log(props);
(async()=>{
  if (access(props.appName)) {
    console.error(`Ошибка: Директория ${props.appName} уже существует.`);
    process.exit(1);
  };

  if (await fsp.mkdir(props.appName)) {
    console.error(`Ошибка: Не получается создать директория ${props.appName} уже существует.`);
    process.exit(1);
  };

  
})();

