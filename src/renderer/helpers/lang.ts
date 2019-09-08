import { rxLang } from './rxLang';
import { rxWordMap } from './rxWordMap';
import { filter } from 'rxjs/operators';

let currentLang = 'en';
let word_map: { [id: string]: { [id: string]: string } } = {};

/**
 * @description returns a phrase for the variable that was entered with the current language
 */
export const getPhrase = (variable: string) => {
  if (!word_map[currentLang]) {
    return `Lang undefined ${currentLang}`;
  }
  if (!word_map[currentLang][variable]) {
    if (!!word_map.en[variable]) {
      return word_map.en[variable];
    }

    return 'UNDEFINED';
  }

  return word_map[currentLang][variable];
};

rxWordMap.pipe(filter(x => !!x)).subscribe(map => {
  if (!map) {
    return;
  }

  return (word_map = map);
});

rxLang.subscribe(lang => (currentLang = lang));
