import { rxConfig } from './rxConfig';
import { rxUser } from './rxUser';
import { filter, first } from 'rxjs/operators';
import ua from 'universal-analytics';
import { BehaviorSubject } from 'rxjs';
/**
 * @description simple analytics tracking setup
 */

const rxUa = new BehaviorSubject<null | ua.Visitor>(null);

rxUser.pipe(filter(x => !!x)).subscribe(user => {
  if(!user) {
    return;
  }
  rxUa.next(ua('UA-52091260-9', user?.uid, {strictCidFormat: false}));
})

export const getUA = async () => {
  return rxUa.pipe(filter(x => !!x), first()).toPromise();
}

export const pageview = async (page: string) => {
  return getUA()
      .then(visitor => {
        if (!visitor) {
          return;
        }
        return visitor.pageview(page).send();
      })
      .catch(null);
};



export const sendEvent = async (category: string, action: string, label: string = '', value: number = 0) => {
  return getUA()
      .then(visitor => {
        if (!visitor) {
          return;
        }
        return visitor.event(category, action, label, value);
      })
      .catch(null);
}