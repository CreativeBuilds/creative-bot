import * as firebase from 'firebase';
import { BehaviorSubject, config, combineLatest } from 'rxjs';
import {
  filter,
  first,
  mergeMap,
  switchMap,
  map,
  distinctUntilChanged
} from 'rxjs/operators';
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
import { rxGiveaways, setRxGiveaways } from './rxGiveaways';
import { rxUsers, setRxUsers } from './rxUsers';
import { rxQuotes } from './rxQuotes';
import { rxEmotes } from './rxEmotes';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

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
            rxGiveaways.pipe(first()).subscribe(timers => {
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
      delete data.loadedFirebaseConfig;
      if (Object.keys(data).length !== 0) {
        delete data.id;
        rxConfig.pipe(first()).subscribe((config: any) => {
          if (isEqual(config, data) && config.loadedFirebaseConfig)
            return console.log('theyre equal', config, data);
          setRxConfig(Object.assign({}, { loadedFirebaseConfig: true }, data));
        });
      } else {
        // get rxConfig and see what data is set
        rxConfig.pipe(first()).subscribe(config => {
          if (typeof config === 'undefined') return;
          let Config: any = Object.assign({}, config);
          if (typeof Config.isFirebaseUser === 'undefined') {
            Config.isFirebaseUser = user.uid;
          }
          setRxConfig(
            Object.assign({}, { loadedFirebaseConfig: true }, Config)
          );
          configRef.set(Config, { merge: true });
        });
      }
    });
  }
});
export const initLogin = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const firebaseCommands$ = rxFirebaseuser.pipe(
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

export const setFirebaseCommands = commands => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      let ref = firestore
        .collection('users')
        .doc(rxUser.uid)
        .collection('commands');
      firebaseCommands$.pipe(first()).subscribe(firebaseCommands => {
        // Check to see which keys are different (new, which keys are being removed)
        let newArr = differenceWith(
          Object.keys(commands),
          Object.keys(firebaseCommands),
          (val1, val2) => {
            return isEqual(commands[val1], firebaseCommands[val2]);
          }
        );
        let oldArr = differenceWith(
          Object.keys(firebaseCommands),
          Object.keys(commands),
          (val1, val2) => {
            return isEqual(firebaseCommands[val1], commands[val2]);
          }
        );
        let sameArr = [];
        newArr = newArr.reduce((acc, key) => {
          if (!oldArr.includes(key)) {
            acc.push(key);
          } else {
            sameArr.push(key);
          }
          return acc;
        }, []);
        oldArr = oldArr.reduce((acc, key) => {
          if (!sameArr.includes(key)) {
            acc.push(key);
          }
          return acc;
        }, []);
        let batch = firestore.batch();
        let update = false;
        if (newArr.length > 0) {
          // we have items to update!
          newArr.forEach(key => {
            let newCommand = commands[key];
            let docRef = ref.doc(newCommand.name);
            batch.set(docRef, newCommand);
            update = true;
          });
        }
        if (oldArr.length > 0) {
          // we have items to remove!
          oldArr.forEach(key => {
            let deleteCommand = firebaseCommands[key];
            let docRef = ref.doc(deleteCommand.name);
            batch.delete(docRef);
            update = true;
          });
        }
        if (sameArr.length > 0) {
          sameArr.forEach(key => {
            let updateCommand = commands[key];
            let docRef = ref.doc(updateCommand.name);
            batch.set(docRef, updateCommand);
            update = true;
          });
        }
        if (update) {
          batch.commit();
        }
      });
      // ref.set
    });
};

ipcRenderer.on('rxCommands', (event, commands) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      setFirebaseCommands(commands);
    }
  });
});
firebaseCommands$.subscribe(commands => {
  rxCommands.next(commands);
  ipcRenderer.send('setRxCommands', commands);
  setRxCommands(commands);
});

export const firebaseTimers$ = rxFirebaseuser.pipe(
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

export const setFirebaseTimers = timers => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      let ref = firestore
        .collection('users')
        .doc(rxUser.uid)
        .collection('timers');
      firebaseTimers$.pipe(first()).subscribe(firebaseTimers => {
        // Check to see which keys are different (new, which keys are being removed)
        let newArr = differenceWith(
          Object.keys(timers),
          Object.keys(firebaseTimers),
          (val1, val2) => {
            return isEqual(timers[val1], firebaseTimers[val2]);
          }
        );
        let oldArr = differenceWith(
          Object.keys(firebaseTimers),
          Object.keys(timers),
          (val1, val2) => {
            return isEqual(firebaseTimers[val1], timers[val2]);
          }
        );
        let sameArr = [];
        newArr = newArr.reduce((acc, key) => {
          if (!oldArr.includes(key)) {
            acc.push(key);
          } else {
            sameArr.push(key);
          }
          return acc;
        }, []);
        oldArr = oldArr.reduce((acc, key) => {
          if (!sameArr.includes(key)) {
            acc.push(key);
          }
          return acc;
        }, []);
        let batch = firestore.batch();
        let update = false;
        if (newArr.length > 0) {
          // we have items to update!
          newArr.forEach(key => {
            let newCommand = timers[key];
            let docRef = ref.doc(newCommand.name);
            batch.set(docRef, newCommand);
            update = true;
          });
        }
        if (oldArr.length > 0) {
          // we have items to remove!
          oldArr.forEach(key => {
            let deleteCommand = firebaseTimers[key];
            let docRef = ref.doc(deleteCommand.name);
            batch.delete(docRef);
            update = true;
          });
        }
        if (sameArr.length > 0) {
          sameArr.forEach(key => {
            let updateCommand = timers[key];
            let docRef = ref.doc(updateCommand.name);
            batch.set(docRef, updateCommand);
            update = true;
          });
        }
        if (update) {
          batch.commit();
        }
      });
      // ref.set
    });
};

ipcRenderer.on('rxTimers', (event, timers) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      setFirebaseTimers(timers);
    }
  });
});
firebaseTimers$.subscribe(timers => {
  rxTimers.next(timers);
  ipcRenderer.send('setRxTimers', timers);
  setRxTimers(timers);
});

export const firebaseGiveaways$ = rxFirebaseuser.pipe(
  filter(x => !isEmpty(x)),
  mergeMap((user: any) => {
    return collectionData(
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('giveaways')
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

export const setFirebaseGiveaways = giveaways => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      let ref = firestore
        .collection('users')
        .doc(rxUser.uid)
        .collection('giveaways');
      firebaseGiveaways$.pipe(first()).subscribe(firebasegiveaways => {
        // Check to see which keys are different (new, which keys are being removed)
        let newArr = differenceWith(
          Object.keys(giveaways),
          Object.keys(firebasegiveaways),
          (val1, val2) => {
            return isEqual(giveaways[val1], firebasegiveaways[val2]);
          }
        );
        let oldArr = differenceWith(
          Object.keys(firebasegiveaways),
          Object.keys(giveaways),
          (val1, val2) => {
            return isEqual(firebasegiveaways[val1], giveaways[val2]);
          }
        );
        let sameArr = [];
        newArr = newArr.reduce((acc, key) => {
          if (!oldArr.includes(key)) {
            acc.push(key);
          } else {
            sameArr.push(key);
          }
          return acc;
        }, []);
        oldArr = oldArr.reduce((acc, key) => {
          if (!sameArr.includes(key)) {
            acc.push(key);
          }
          return acc;
        }, []);
        let batch = firestore.batch();
        let update = false;
        if (newArr.length > 0) {
          // we have items to update!
          newArr.forEach(key => {
            let newGiveaways = giveaways[key];
            let docRef = ref.doc(newGiveaways.name);
            batch.set(docRef, newGiveaways);
            update = true;
          });
        }
        if (oldArr.length > 0) {
          // we have items to remove!
          oldArr.forEach(key => {
            let deleteGiveaway = firebasegiveaways[key];
            let docRef = ref.doc(deleteGiveaway.name);
            batch.delete(docRef);
            update = true;
          });
        }
        if (sameArr.length > 0) {
          sameArr.forEach(key => {
            let updateGiveaway = giveaways[key];
            let docRef = ref.doc(updateGiveaway.name);
            batch.set(docRef, updateGiveaway);
            update = true;
          });
        }
        if (update) {
          batch.commit();
        }
      });
      // ref.set
    });
};

ipcRenderer.on('rxGiveaways', (event, giveaways) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      setFirebaseGiveaways(giveaways);
    }
  });
});
firebaseGiveaways$.subscribe(giveaways => {
  rxGiveaways.next(giveaways);
  ipcRenderer.send('setRxGiveaways', giveaways);
  setRxGiveaways(giveaways);
});

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

export const setFirebaseUsers = users => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      let ref = firestore
        .collection('users')
        .doc(rxUser.uid)
        .collection('users');
      firebaseUsers$.pipe(first()).subscribe(firebaseUsers => {
        // Check to see which keys are different (new, which keys are being removed)
        let newArr = differenceWith(
          Object.keys(users),
          Object.keys(firebaseUsers),
          (val1, val2) => {
            return isEqual(users[val1], firebaseUsers[val2]);
          }
        );
        let oldArr = differenceWith(
          Object.keys(firebaseUsers),
          Object.keys(users),
          (val1, val2) => {
            return isEqual(firebaseUsers[val1], users[val2]);
          }
        );
        let sameArr = [];
        newArr = newArr.reduce((acc, key) => {
          if (!oldArr.includes(key)) {
            acc.push(key);
          } else {
            sameArr.push(key);
          }
          return acc;
        }, []);
        oldArr = oldArr.reduce((acc, key) => {
          if (!sameArr.includes(key)) {
            acc.push(key);
          }
          return acc;
        }, []);
        let batch = firestore.batch();
        let update = false;
        if (newArr.length > 0) {
          // we have items to update!
          newArr.forEach(key => {
            let newGiveaways = users[key];
            let docRef = ref.doc(newGiveaways.blockchainUsername);
            batch.set(docRef, newGiveaways);
            update = true;
          });
        }
        if (oldArr.length > 0) {
          // we have items to remove!
          oldArr.forEach(key => {
            let deleteGiveaway = firebaseUsers[key];
            let docRef = ref.doc(deleteGiveaway.blockchainUsername);
            batch.delete(docRef);
            update = true;
          });
        }
        if (sameArr.length > 0) {
          sameArr.forEach(key => {
            let updateGiveaway = users[key];
            let docRef = ref.doc(updateGiveaway.blockchainUsername);
            batch.set(docRef, updateGiveaway);
            update = true;
          });
        }
        if (update) {
          batch.commit();
        }
      });
      // ref.set
    });
};

ipcRenderer.on('rxUsers', (event, users) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      setFirebaseUsers(users);
    }
  });
});
firebaseUsers$.subscribe(users => {
  rxUsers.next(users);
  ipcRenderer.send('setRxUsers', users);
});

const firebaseQuotes$ = rxFirebaseuser.pipe(
  filter(x => !isEmpty(x)),
  mergeMap((user: any) => {
    return collectionData(
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('quotes')
    ).pipe(
      map(arr =>
        arr.reduce((acc, quote: any) => {
          acc[quote.quoteId] = quote;
          return acc;
        }, {})
      )
    );
  })
);

export const setFirebaseQuotes = quotes => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      let ref = firestore
        .collection('users')
        .doc(rxUser.uid)
        .collection('quotes');
      firebaseQuotes$.pipe(first()).subscribe(firebaseQuotes => {
        // Check to see which keys are different (new, which keys are being removed)
        let newArr = differenceWith(
          Object.keys(quotes),
          Object.keys(firebaseQuotes),
          (val1, val2) => {
            return isEqual(quotes[val1], firebaseQuotes[val2]);
          }
        );
        let oldArr = differenceWith(
          Object.keys(firebaseQuotes),
          Object.keys(quotes),
          (val1, val2) => {
            return isEqual(firebaseQuotes[val1], quotes[val2]);
          }
        );
        let sameArr = [];
        newArr = newArr.reduce((acc, key) => {
          if (!oldArr.includes(key)) {
            acc.push(key);
          } else {
            sameArr.push(key);
          }
          return acc;
        }, []);
        oldArr = oldArr.reduce((acc, key) => {
          if (!sameArr.includes(key)) {
            acc.push(key);
          }
          return acc;
        }, []);
        let batch = firestore.batch();
        let update = false;
        if (newArr.length > 0) {
          // we have items to update!
          newArr.forEach(key => {
            let newGiveaways = quotes[key];
            let docRef = ref.doc(newGiveaways.quoteId);
            batch.set(docRef, newGiveaways);
            update = true;
          });
        }
        if (oldArr.length > 0) {
          // we have items to remove!
          oldArr.forEach(key => {
            let deleteGiveaway = firebaseQuotes[key];
            let docRef = ref.doc(deleteGiveaway.quoteId);
            batch.delete(docRef);
            update = true;
          });
        }
        if (sameArr.length > 0) {
          sameArr.forEach(key => {
            let updateGiveaway = quotes[key];
            let docRef = ref.doc(updateGiveaway.qouteId);
            batch.set(docRef, updateGiveaway);
            update = true;
          });
        }
        if (update) {
          batch.commit();
        }
      });
      // ref.set
    });
};

ipcRenderer.on('rxQuotes', (event, quotes) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      setFirebaseQuotes(quotes);
    }
  });
});
firebaseQuotes$.subscribe(quotes => {
  rxQuotes.next(quotes);
  ipcRenderer.send('setRxQuotes', quotes);
});

const firebaseEmotes$ = rxFirebaseuser.pipe(
  filter(x => !isEmpty(x)),
  mergeMap((user: any) => {
    return collectionData(
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('emotes')
    ).pipe(
      map(arr =>
        arr.reduce((acc, emotes: any) => {
          acc[emotes.id] = emotes;
          return acc;
        }, {})
      )
    );
  })
);

export const setFirebaseEmotes = emotes => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      let ref = firestore
        .collection('users')
        .doc(rxUser.uid)
        .collection('emotes');
      firebaseEmotes$.pipe(first()).subscribe(firebaseEmotes => {
        // Check to see which keys are different (new, which keys are being removed)
        let newArr = differenceWith(
          Object.keys(emotes),
          Object.keys(firebaseEmotes),
          (val1, val2) => {
            return isEqual(emotes[val1], firebaseEmotes[val2]);
          }
        );
        let oldArr = differenceWith(
          Object.keys(firebaseEmotes),
          Object.keys(emotes),
          (val1, val2) => {
            return isEqual(firebaseEmotes[val1], emotes[val2]);
          }
        );
        let sameArr = [];
        newArr = newArr.reduce((acc, key) => {
          if (!oldArr.includes(key)) {
            acc.push(key);
          } else {
            sameArr.push(key);
          }
          return acc;
        }, []);
        oldArr = oldArr.reduce((acc, key) => {
          if (!sameArr.includes(key)) {
            acc.push(key);
          }
          return acc;
        }, []);
        let batch = firestore.batch();
        let update = false;
        if (newArr.length > 0) {
          // we have items to update!
          newArr.forEach(key => {
            let newGiveaways = emotes[key];
            let docRef = ref.doc(newGiveaways.id);
            batch.set(docRef, newGiveaways);
            update = true;
          });
        }
        if (oldArr.length > 0) {
          // we have items to remove!
          oldArr.forEach(key => {
            let deleteGiveaway = firebaseEmotes[key];
            let docRef = ref.doc(deleteGiveaway.id);
            batch.delete(docRef);
            update = true;
          });
        }
        if (sameArr.length > 0) {
          sameArr.forEach(key => {
            let updateGiveaway = emotes[key];
            let docRef = ref.doc(updateGiveaway.id);
            batch.set(docRef, updateGiveaway);
            update = true;
          });
        }
        if (update) {
          batch.commit();
        }
      });
      // ref.set
    });
};

ipcRenderer.on('rxEmotes', (event, emotes) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      setFirebaseEmotes(emotes);
    }
  });
});
firebaseEmotes$.subscribe(emotes => {
  rxEmotes.next(emotes);
  ipcRenderer.send('setRxEmotes', emotes);
});

export { firebase };
Window.firebase = firebase;
