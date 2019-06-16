import * as firebase from 'firebase';
import { BehaviorSubject, config, combineLatest } from 'rxjs';
import { filter, first, mergeMap, switchMap, map, tap } from 'rxjs/operators';
import {
  isEmpty,
  isEqual,
  difference,
  cloneDeep,
  differenceWith
} from 'lodash';
import { rxConfig, setRxConfig } from './rxConfig';

import { docData, collectionData } from 'rxfire/firestore';
import { rxCommands, setRxCommands } from './rxCommands';
import { rxTimers, setRxTimers } from './rxTimers';
import { rxUsers, setRxUsers } from './rxUsers';

const Window: any = window;

var firebaseConfig = {
  apiKey: 'AIzaSyDj5vSvQHyxvm8vQMJUlEM6I9ouQpC_r0U',
  authDomain: 'creativebuildsio.firebaseapp.com',
  databaseURL: 'https://creativebuildsio.firebaseio.com',
  projectId: 'creativebuildsio',
  storageBucket: 'creativebuildsio.appspot.com',
  messagingSenderId: '821207665817',
  appId: '1:821207665817:web:b8774a46ca7bd2db'
};
firebase.initializeApp(firebaseConfig);

export const perf = firebase.performance();

export const signUp = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const rxFirebaseuser = new BehaviorSubject({});

export const firestore = firebase.firestore();

let configListener = null;

firebase.auth().onAuthStateChanged(user => {
  rxFirebaseuser.next(user);
  if (!user) {
    // User signed out!;
    if (configListener) configListener.unsubscribe();
    rxConfig.pipe(first()).subscribe(config => {
      if (typeof config === 'undefined') return;
      let Config: any = Object.assign({}, config);
      delete Config.refreshToken;
      delete Config.isFirebaseUser;
      rxConfig.next(Config);
    });
  } else {
    // Get config information from firebase (if information doesnt exist, check to see if information exists in rxConfig)
    let configRef = firestore.collection('configs').doc(user.uid);
    let userRef = firestore.collection('users').doc(user.uid);

    let listeners = [];
    listeners.push(
      docData(userRef).subscribe((userData: any) => {
        if (Object.keys(userData).length !== 0) {
          // setup has already been done, over ride all local commands
        } else {
          // Setup has to be done, init writing to firestore
          userRef.set({ uid: user.uid }).then(() => {
            rxCommands.pipe(first()).subscribe(commands => {
              let collectionRef = firestore
                .collection('users')
                .doc(user.uid)
                .collection('commands');
              Object.keys(commands).forEach(commandName => {
                let commandObj = commands[commandName];
                collectionRef.doc(commandName).set(commandObj);
              });
            });
            rxTimers.pipe(first()).subscribe(timers => {
              let collectionRef = firestore
                .collection('users')
                .doc(user.uid)
                .collection('timers');
              Object.keys(timers).forEach(timerName => {
                let timerObj = timers[timerName];
                collectionRef.doc(timerName).set(timerObj);
              });
            });
          });
        }
      })
    );

    configListener = docData(configRef).subscribe((data: any) => {
      if (Object.keys(data).length !== 0) {
        delete data.id;
        rxConfig.pipe(first()).subscribe(config => {
          if (isEqual(config, data)) return;
          setRxConfig(data);
        });
      } else {
        // get rxConfig and see what data is set
        rxConfig.pipe(first()).subscribe(config => {
          if (typeof config === 'undefined') return;
          let Config: any = Object.assign({}, config);
          if (typeof Config.isFirebaseUser === 'undefined') {
            Config.isFirebaseUser = user.uid;
            setRxConfig(Config);
          }
          configRef.set(Config, { merge: true });
        });
      }
    });
  }
});
export const initLogin = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

const firebaseCommands$ = rxFirebaseuser.pipe(
  filter(x => !isEmpty(x)),
  mergeMap((user: any) => {
    return collectionData(
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('commands')
    ).pipe(
      map(arr =>
        arr.reduce((acc, command: any) => {
          acc[command.name] = command;
          return acc;
        }, {})
      )
    );
  })
);
const firebaseTimers$ = rxFirebaseuser.pipe(
  filter(x => !isEmpty(x)),
  mergeMap((user: any) => {
    return collectionData(
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('timers')
    ).pipe(
      map(arr =>
        arr.reduce((acc, timer: any) => {
          acc[timer.name] = timer;
          return acc;
        }, {})
      )
    );
  })
);
const firebaseUsers$ = rxFirebaseuser.pipe(
  filter(x => !isEmpty(x)),
  mergeMap((user: any) => {
    return collectionData(
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('users')
    ).pipe(
      map(arr =>
        arr.reduce((acc, user: any) => {
          acc[user.blockchainUsername] = user;
          return acc;
        }, {})
      )
    );
  })
);

/* On Boot get all firestore data and load local data, wait for both to load */
const oldTimers$ = new BehaviorSubject(null);
const oldFirebaseTimers$ = new BehaviorSubject(null);
let firstRunFirebaseTimers = true;

combineLatest(
  firebaseTimers$,
  rxTimers,
  rxFirebaseuser.pipe(
    filter(x => !isEmpty(x)),
    first()
  ),
  (firebaseTimers: any, timers: any, rxUser: any) => {
    let newTimers = cloneDeep(timers);
    let newFirebaseTimers = cloneDeep(firebaseTimers);
    /* Once both data slots load as empty objects compare what needs to be updated */
    /* First check with deepEqual for firebaseTimers and timers to see which needs to update */
    let findDifference = (firebaseTimers, timers) => {
      let onlyExistOnLocal = difference(
        Object.keys(timers),
        Object.keys(firebaseTimers)
      );
      let onlyExistOnDB = difference(
        Object.keys(firebaseTimers),
        Object.keys(timers)
      );
      return { onlyExistOnDB, onlyExistOnLocal };
    };
    let { onlyExistOnDB, onlyExistOnLocal } = findDifference(
      firebaseTimers,
      timers
    );
    // This is the first run through so there is no old data to compare against
    /* When the user starts up they may have out dated on either firestore or their client
       ASSUME firestore has latest data
       DONT assume firestore has latest data if its not latest run, default to client having latest information
     */
    if (onlyExistOnDB.length > 0) {
      /* These users only exist on the database, write them to the app IF its the first run, else remove them */
      if (firstRunFirebaseTimers) {
        let setUsers = Object.assign(
          {},
          onlyExistOnDB.reduce((acc, curr) => {
            acc[curr] = firebaseTimers[curr];
            return acc;
          }, {})
        );
        setRxUsers(setUsers);
      } else {
        /* ITS NOT THE FIRST RUN, USER WANTS THESE USERS DELETED */
        let batch = firestore.batch();
        onlyExistOnDB.forEach(key => {
          let Command = firebaseTimers[key];
          if (!Command.name) return;
          delete newFirebaseTimers[key];
          let ref = firestore
            .collection('users')
            .doc(rxUser.uid)
            .collection('timers')
            .doc(Command.name);
          batch.delete(ref);
        });
        batch.commit();
      }
    } else if (onlyExistOnLocal.length > 0) {
      /* These commands only exist  */
      // IF THESE USERS ONLY EXIST LOCALLY AND ITS NOT THE FIRST RUN REMOVE THEM
      if (firstRunFirebaseTimers) {
        /* ITS THE FIRST RUN SEND THEM TO THE DATABASE FOR BACKUP */
        let batch = firestore.batch();
        onlyExistOnLocal.forEach(key => {
          let Command = timers[key];
          if (!Command.name) return;
          let ref = firestore
            .collection('users')
            .doc(rxUser.uid)
            .collection('timers')
            .doc(Command.name);
          batch.set(ref, Command);
        });
        batch.commit();
      } else {
        /* ITS NOT THE FIRST RUN, DELETE THE USERS LOCALLY AND THEN RERUN FUNCTION */

        onlyExistOnLocal.forEach(key => {
          delete newTimers[key];
        });
        setRxUsers(newTimers);
      }
    } else if (!firstRunFirebaseTimers) {
      /* All user object are even between local and firestore now check to see if they've updated their value */
      // Trust that the client has the latest info and set it to firestore
      combineLatest(
        oldFirebaseTimers$.pipe(first()),
        oldTimers$.pipe(first()),
        (oldFirebaseTimers, oldTimers) => {
          if (!oldFirebaseTimers || !oldTimers) return;
          /* COMPARE THE OLD WITH THE NEW OBJECTS TO SEE WHICH ONE HAD CHANGED VALUES */
          // dif1 should only have length IF firebase has changed
          let dif1 = differenceWith(
            Object.keys(firebaseTimers),
            Object.keys(oldFirebaseTimers),
            (val1: string, val2: string) => {
              return isEqual(firebaseTimers[val1], oldFirebaseTimers[val2]);
            }
          );
          // dif2 should only have length IF local has changed
          let dif2 = differenceWith(
            Object.keys(timers),
            Object.keys(oldTimers),
            (val1: string, val2: string) =>
              isEqual(timers[val1], oldTimers[val2])
          );
          if (dif1.length > 0) {
            dif1.forEach(key => {
              // Check to see if user data already exists locally
              if (!isEqual(newTimers[key], firebaseTimers[key]))
                newTimers[key] = firebaseTimers[key];
            });
            setRxUsers(newTimers);
          } else if (dif2.length > 0) {
            let batch = firestore.batch();
            let update = false;
            dif2.forEach(key => {
              // check to see if key doesnt already exist in firestore
              if (!isEqual(firebaseTimers[key], newTimers[key])) {
                let ref = firestore
                  .collection('users')
                  .doc(rxUser.uid)
                  .collection('timers')
                  .doc(key);
                batch.set(ref, newTimers[key]);
                update = true;
              }
            });
            if (update) batch.commit();
          }
        }
      )
        .pipe(first())
        .subscribe();
    }

    oldFirebaseTimers$.next(newFirebaseTimers);
    oldTimers$.next(newTimers);
    firstRunFirebaseTimers = false;
  }
).subscribe(e => {});

// /* On Boot get all firestore data and load local data, wait for both to load */
const oldCommands$ = new BehaviorSubject(null);
const oldFirebaseCommands$ = new BehaviorSubject(null);
let firstRunFirebaseCommands = true;

combineLatest(
  firebaseCommands$,
  rxCommands,
  rxFirebaseuser.pipe(
    filter(x => !isEmpty(x)),
    first()
  ),
  (firebaseCommands: any, commands: any, rxUser: any) => {
    let newCommands = cloneDeep(commands);
    let newFirebaseCommands = cloneDeep(firebaseCommands);
    /* Once both data slots load as empty objects compare what needs to be updated */
    /* First check with deepEqual for firebaseCommands and commands to see which needs to update */
    let findDifference = (firebaseCommands, commands) => {
      let onlyExistOnLocal = difference(
        Object.keys(commands),
        Object.keys(firebaseCommands)
      );
      let onlyExistOnDB = difference(
        Object.keys(firebaseCommands),
        Object.keys(commands)
      );
      return { onlyExistOnDB, onlyExistOnLocal };
    };
    let { onlyExistOnDB, onlyExistOnLocal } = findDifference(
      firebaseCommands,
      commands
    );
    // This is the first run through so there is no old data to compare against
    /* When the user starts up they may have out dated on either firestore or their client
       ASSUME firestore has latest data
       DONT assume firestore has latest data if its not latest run, default to client having latest information
     */
    if (onlyExistOnDB.length > 0) {
      /* These users only exist on the database, write them to the app IF its the first run, else remove them */
      if (firstRunFirebaseCommands) {
        let setUsers = Object.assign(
          {},
          onlyExistOnDB.reduce((acc, curr) => {
            acc[curr] = firebaseCommands[curr];
            return acc;
          }, {})
        );
        setRxUsers(setUsers);
      } else {
        /* ITS NOT THE FIRST RUN, USER WANTS THESE USERS DELETED */
        let batch = firestore.batch();
        onlyExistOnDB.forEach(key => {
          let Command = firebaseCommands[key];
          if (!Command.name) return;
          delete newFirebaseCommands[key];
          let ref = firestore
            .collection('users')
            .doc(rxUser.uid)
            .collection('commands')
            .doc(Command.name);
          batch.delete(ref);
        });
        batch.commit();
      }
    } else if (onlyExistOnLocal.length > 0) {
      /* These commands only exist  */
      // IF THESE USERS ONLY EXIST LOCALLY AND ITS NOT THE FIRST RUN REMOVE THEM
      if (firstRunFirebaseCommands) {
        /* ITS THE FIRST RUN SEND THEM TO THE DATABASE FOR BACKUP */
        let batch = firestore.batch();
        onlyExistOnLocal.forEach(key => {
          let Command = commands[key];
          if (!Command.name) return;
          let ref = firestore
            .collection('users')
            .doc(rxUser.uid)
            .collection('commands')
            .doc(Command.name);
          batch.set(ref, Command);
        });
        batch.commit();
      } else {
        /* ITS NOT THE FIRST RUN, DELETE THE USERS LOCALLY AND THEN RERUN FUNCTION */

        onlyExistOnLocal.forEach(key => {
          delete newCommands[key];
        });
        setRxUsers(newCommands);
      }
    } else if (!firstRunFirebaseCommands) {
      /* All user object are even between local and firestore now check to see if they've updated their value */
      // Trust that the client has the latest info and set it to firestore
      combineLatest(
        oldFirebaseCommands$.pipe(first()),
        oldCommands$.pipe(first()),
        (oldFirebaseUsers, oldUsers) => {
          if (!oldFirebaseUsers || !oldUsers) return;
          /* COMPARE THE OLD WITH THE NEW OBJECTS TO SEE WHICH ONE HAD CHANGED VALUES */
          // dif1 should only have length IF firebase has changed
          let dif1 = differenceWith(
            Object.keys(firebaseCommands),
            Object.keys(oldFirebaseUsers),
            (val1: string, val2: string) => {
              return isEqual(firebaseCommands[val1], oldFirebaseUsers[val2]);
            }
          );
          // dif2 should only have length IF local has changed
          let dif2 = differenceWith(
            Object.keys(commands),
            Object.keys(oldUsers),
            (val1: string, val2: string) =>
              isEqual(commands[val1], oldUsers[val2])
          );
          if (dif1.length > 0) {
            dif1.forEach(key => {
              // Check to see if user data already exists locally
              if (!isEqual(newCommands[key], firebaseCommands[key]))
                newCommands[key] = firebaseCommands[key];
            });
            setRxUsers(newCommands);
          } else if (dif2.length > 0) {
            let batch = firestore.batch();
            let update = false;
            dif2.forEach(key => {
              // check to see if key doesnt already exist in firestore
              if (!isEqual(firebaseCommands[key], newCommands[key])) {
                let ref = firestore
                  .collection('users')
                  .doc(rxUser.uid)
                  .collection('commands')
                  .doc(key);
                batch.set(ref, newCommands[key]);
                update = true;
              }
            });
            if (update) batch.commit();
          }
        }
      )
        .pipe(first())
        .subscribe();
    }

    oldFirebaseCommands$.next(newFirebaseCommands);
    oldCommands$.next(newCommands);
    firstRunFirebaseCommands = false;
  }
).subscribe(e => {});

/* On Boot get all firestore data and load local data, wait for both to load */
const oldUsers$ = new BehaviorSubject(null);
const oldFirebaseUsers$ = new BehaviorSubject(null);
let firstRunFirebaseUser = true;

combineLatest(
  firebaseUsers$,
  rxUsers,
  rxFirebaseuser.pipe(
    filter(x => !isEmpty(x)),
    first()
  ),
  (firebaseUsers: any, users: any, rxUser: any) => {
    let newUsers = cloneDeep(users);
    let newFirebaseUsers = cloneDeep(firebaseUsers);
    /* Once both data slots load as empty objects compare what needs to be updated */
    /* First check with deepEqual for firebaseUsers and users to see which needs to update */
    let findDifference = (firebaseUsers, users) => {
      let onlyExistOnLocal = difference(
        Object.keys(users),
        Object.keys(firebaseUsers)
      );
      let onlyExistOnDB = difference(
        Object.keys(firebaseUsers),
        Object.keys(users)
      );
      return { onlyExistOnDB, onlyExistOnLocal };
    };
    let { onlyExistOnDB, onlyExistOnLocal } = findDifference(
      firebaseUsers,
      users
    );
    // This is the first run through so there is no old data to compare against
    /* When the user starts up they may have out dated on either firestore or their client
       ASSUME firestore has latest data
       DONT assume firestore has latest data if its not latest run, default to client having latest information
     */
    if (onlyExistOnDB.length > 0) {
      /* These users only exist on the database, write them to the app IF its the first run, else remove them */
      if (firstRunFirebaseUser) {
        let setUsers = Object.assign(
          {},
          onlyExistOnDB.reduce((acc, curr) => {
            acc[curr] = firebaseUsers[curr];
            return acc;
          }, {})
        );
        setRxUsers(setUsers);
      } else {
        /* ITS NOT THE FIRST RUN, USER WANTS THESE USERS DELETED */
        let batch = firestore.batch();
        onlyExistOnDB.forEach(key => {
          let User = firebaseUsers[key];
          if (!User.blockchainUsername) return;
          delete newFirebaseUsers[key];
          let ref = firestore
            .collection('users')
            .doc(rxUser.uid)
            .collection('users')
            .doc(User.blockchainUsername);
          batch.delete(ref);
        });
        batch.commit();
      }
    } else if (onlyExistOnLocal.length > 0) {
      /* These commands only exist  */
      // IF THESE USERS ONLY EXIST LOCALLY AND ITS NOT THE FIRST RUN REMOVE THEM
      if (firstRunFirebaseUser) {
        /* ITS THE FIRST RUN SEND THEM TO THE DATABASE FOR BACKUP */
        let batch = firestore.batch();
        onlyExistOnLocal.forEach(key => {
          let User = users[key];
          if (!User.blockchainUsername) return;
          let ref = firestore
            .collection('users')
            .doc(rxUser.uid)
            .collection('users')
            .doc(User.blockchainUsername);
          batch.set(ref, User);
        });
        batch.commit();
      } else {
        /* ITS NOT THE FIRST RUN, DELETE THE USERS LOCALLY AND THEN RERUN FUNCTION */

        onlyExistOnLocal.forEach(key => {
          delete newUsers[key];
        });
        setRxUsers(newUsers);
      }
    } else if (!firstRunFirebaseUser) {
      /* All user object are even between local and firestore now check to see if they've updated their value */
      // Trust that the client has the latest info and set it to firestore
      combineLatest(
        oldFirebaseUsers$.pipe(first()),
        oldUsers$.pipe(first()),
        (oldFirebaseUsers, oldUsers) => {
          if (!oldFirebaseUsers || !oldUsers) return;
          /* COMPARE THE OLD WITH THE NEW OBJECTS TO SEE WHICH ONE HAD CHANGED VALUES */
          // dif1 should only have length IF firebase has changed
          let dif1 = differenceWith(
            Object.keys(firebaseUsers),
            Object.keys(oldFirebaseUsers),
            (val1: string, val2: string) => {
              return isEqual(firebaseUsers[val1], oldFirebaseUsers[val2]);
            }
          );
          // dif2 should only have length IF local has changed
          let dif2 = differenceWith(
            Object.keys(users),
            Object.keys(oldUsers),
            (val1: string, val2: string) => isEqual(users[val1], oldUsers[val2])
          );
          if (dif1.length > 0) {
            dif1.forEach(key => {
              // Check to see if user data already exists locally
              if (!isEqual(newUsers[key], firebaseUsers[key]))
                newUsers[key] = firebaseUsers[key];
            });
            setRxUsers(newUsers);
          } else if (dif2.length > 0) {
            let batch = firestore.batch();
            let update = false;
            dif2.forEach(key => {
              // check to see if key doesnt already exist in firestore
              if (!isEqual(firebaseUsers[key], newUsers[key])) {
                let ref = firestore
                  .collection('users')
                  .doc(rxUser.uid)
                  .collection('users')
                  .doc(key);
                batch.set(ref, newUsers[key]);
                update = true;
              }
            });
            if (update) batch.commit();
          }
        }
      )
        .pipe(first())
        .subscribe();
    }

    oldFirebaseUsers$.next(newFirebaseUsers);
    oldUsers$.next(newUsers);
    firstRunFirebaseUser = false;
  }
).subscribe(e => {});

export { firebase };
Window.firebase = firebase;
