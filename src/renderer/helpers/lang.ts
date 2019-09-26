import { rxLang } from './rxLang';
import { rxWordMap } from './rxWordMap';
import { filter } from 'rxjs/operators';

let currentLang = 'en';
let word_map: { [id: string]: { [id: string]: string } } = {};

/**
 * @description returns a phrase for the variable that was entered with the current language
 */
export const getPhrase = (variable: string, ...args: any) => {
  if (!word_map[currentLang]) {
    return `Lang undefined ${currentLang}`;
  }
  let currentStr;
  if (!word_map[currentLang][variable]) {
    if (!!word_map.en[variable]) {
      currentStr = word_map.en[variable];
    } else {
      return 'UNDEFINED';
    }
  } else {
    currentStr = word_map[currentLang][variable];
  }

  const arrayOfStrs: string[] = currentStr.split('ARG');

  return arrayOfStrs.reduce((acc, value, index) => {
    // tslint:disable-next-line: no-unsafe-any
    return `${acc}${value}${args[index] ? args[index] : ''}`;
  }, '');
};

rxWordMap.pipe(filter(x => !!x)).subscribe(map => {
  if (!map) {
    return;
  }

  return (word_map = map);
});

rxLang.subscribe(lang => (currentLang = lang));
