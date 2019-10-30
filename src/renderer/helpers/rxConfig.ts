import { BehaviorSubject } from 'rxjs';
import { rxUser } from './rxUser';
import { filter, first, switchMap, map } from 'rxjs/operators';
import { firestore } from './firebase';
import { doc } from 'rxfire/firestore';
import { IConfig } from '..';

const defaultConfig = {
  authKey: null,
  commandPrefix: '!',
  lang: 'en',
  appearance: 'dark'
};

/**
 * @descirption Inits a users new config with the base config
 */
export const createBaseConfig = async () => {
  rxUser
    .pipe(
      filter(x => !!x),
      first()
    )
    .subscribe((user: firebase.User) =>
      firestore
        .collection('configs')
        .doc(user.uid)
        .set(defaultConfig, { merge: true })
    );
};

/**
 * @description returns the settings object for the user once logged in
 */
export const rxConfig = rxUser.pipe(
  filter(x => !!x),
  switchMap((user: firebase.User) =>
    doc(firestore.collection('configs').doc(user.uid))
  ),
  map((config: firebase.firestore.DocumentSnapshot) => {
    if (!!config.data()) {
      return config.data();
    } else {
      createBaseConfig().catch(err => null);

      return null;
    }
  })
);

/**
 * @description updates a users config to firestore
 */
export const updateConfig = async (config: Partial<IConfig>) => {
  return rxUser
    .pipe(
      filter(x => !!x),
      first()
    )
    .subscribe(
      async (user: firebase.User): Promise<void> => {
        return firestore
          .collection('configs')
          .doc(user.uid)
          .set(config, { merge: true });
      }
    );
};
