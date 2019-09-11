import { BehaviorSubject, Observable } from 'rxjs';
import { rxConfig, updateConfig } from './rxConfig';
import { filter, switchMap } from 'rxjs/operators';
import { IConfig } from '..';

const defaultLang = 'en';

/**
 * @description This behavior subject will start with 'en'
 */
export const rxLang: Observable<IConfig['lang']> = rxConfig.pipe(
  filter(x => !!x),
  switchMap((config: IConfig) => [config.lang ? config.lang : defaultLang])
);
