'use strict'

const loadProps = () => {
  if (process.argv.length < 3) {
    return {err: 'Не достаточно параметров'};
  };

  if (process.argv[2].trim() === '--help') {
    return {command: 'help'};
  };

  const [,,appName, ...props ] = process.argv;
  const propsLength = props.length;

  console.log(appName);

  if (!appName) {
    return {err: 'Не найдено имя приложения'};
  };

  if (appName === '.') {
    return {err: 'Bмя приложения не может быть точкой. Оно служит для определения ветви git'};
  };

  const paramsInit = {
    appName,
    "-ga": "",
    "-ge": "example",
  };

  const paramsInitKeys = Object.keys(paramsInit);

  const errs = [];
  for (let i = 0; i < propsLength; i+=2) {
    const key = props[i];
    if ( i+1 >= propsLength ) {
      errs.push('Не корректные параметры');
    }
    if ( !paramsInitKeys.includes(key) ){
      errs.push(`Неизвестный параметр ${key}`);
    }
    paramsInit[key] = props[i+1];
  };
  
  if (paramsInit['-ga'] === '' ) errs.push('не задан параметр -ga');

  if (errs.length > 0) return { err: errs.join('\n') };

  return {paramsInit};
}

module.exports = { loadProps }

