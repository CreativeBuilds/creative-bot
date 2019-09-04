import { auth } from './firebase';

import { BehaviorSubject } from 'rxjs';

/**
 * @description an rx object which will contain the firebase user
 */
export const rxUser = new BehaviorSubject<firebase.User | null>(null);

auth.onAuthStateChanged((user: firebase.User | null) => {
  rxUser.next(user);
});
