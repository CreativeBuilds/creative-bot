import Dexie from 'dexie';
// tslint:disable-next-line: no-import-side-effect
import 'dexie-observable';
import { BehaviorSubject, ObservableInput } from 'rxjs';
import { IDatabaseChange } from 'dexie-observable/api';
import {
  IUser,
  ICommand,
  IChatObject,
  IConfig,
  IMe,
  ITimer,
  ICustomVariable,
  ISelectOption,
  IOldUser
} from '@/renderer';
import { firestore } from '../firebase';
import { rxUser } from '../rxUser';
import {
  first,
  filter,
  tap,
  withLatestFrom,
  map,
  switchMap,
  distinctUntilChanged
} from 'rxjs/operators';
import { sendMessageWithConfig } from '../sendMessageWithConfig';
import { getPhrase } from '../lang';
import { rxCustomVariables } from '../rxCustomVariables';
import { collectionData } from 'rxfire/firestore';

/**
 * @desciption This is all the users who have been edited since the last save to firestore
 *
 */
export const editedUsers: { [id: string]: boolean } = {};

/**
 * @description a BehaviorSubject that will emit IDatabseChanges when they occur in the db
 */
export const rxDbChanges = new BehaviorSubject<IDatabaseChange[]>([]);

/**
 * @description Creates a custom version of dexie that ties the class object to the IUser properties
 */
// tslint:disable-next-line: completed-docs
class MyDatabase extends Dexie {
  public users: Dexie.Table<User, string>;

  constructor() {
    super('CreativeBot');
    this.version(1).stores({
      users: '++id,displayname,username,avatar,lino,points,exp,role'
    });

    this.users = this.table('users');
    this.open().catch(e => console.error(e));
  }
}

/**
 * @description creates the database
 */
console.log('THIS SHOULD GET MADE');
export const db = new MyDatabase();

console.log('DB GETTING LOADED');

export const clearDatabase = async () => {
  return db.tables.forEach(table => {
    table.clear();
  });
};

/**
 * @description when something in the database changes, push it to rxDbChanges
 */
db.on('changes', changes => {
  // tslint:disable-next-line: no-console
  console.log('changes', changes);
  rxDbChanges.next(changes);
});

/**
 * @description Returns a user object that has mmultiple functions on it for updating variables like points
 */
// tslint:disable-next-line: completed-docs
export class User implements IUser {
  public id: string;
  public displayname: string;
  public username: string;
  public avatar: string;
  public lino: number;
  public points: number;
  public exp: number;
  public role: string;
  public roomRole: string;
  public isSubscribed: boolean;

  constructor(
    id: string,
    displayname: string,
    username: string,
    avatar: string,
    lino: number,
    points: number,
    exp: number,
    role: string,
    roomRole: string,
    isSubscribed: boolean
  ) {
    this.id = id;
    this.displayname = displayname;
    this.username = username;
    this.avatar = avatar;
    this.lino = lino;
    this.points = points;
    this.exp = exp;
    this.role = role;
    this.roomRole = roomRole;
    this.isSubscribed = isSubscribed;
  }

  /**
   * @description add points to a user then auto save it to the local db
   */
  public async addPoints(input: number | string) {
    var amount;
    if (typeof input === 'string') {
      amount = parseInt(input);
    } else {
      amount = input;
    }
    console.log('amount', amount, typeof amount);
    if (typeof amount !== 'number' || isNaN(amount)) {
      return this.save();
    }
    this.points += amount;

    return this.save();
  }

  /**
   * @description remove the user from the database
   * @warning with the listener may reset the user
   */
  public delete() {
    console.log('deleting user');
    rxUser.pipe(first()).subscribe(authUser => {
      if (!authUser) {
        return console.log('NO AUTH USER');
      }
      console.log('this username', this.username);
      db.users
        .delete(this.username)
        .then(() => {
          return firestore
            .collection('users')
            .doc(authUser.uid)
            .collection('users')
            .doc(this.username)
            .delete();
        })
        .then(() => {
          rxUsers.pipe(first()).subscribe(users => {
            const USERS = { ...users };
            delete USERS[this.username];
            console.log('pushing to rxUsers', USERS, USERS[this.username]);
            rxUsers.next(USERS);
          });
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  /**
   * @description convert the user object to a json format
   *
   * @note if you add any variables to the class object, you have to add them to this function as well if
   * you want them saved in the db
   */
  public toJSON() {
    return {
      id: this.id,
      displayname: this.displayname,
      username: this.username,
      avatar: this.avatar,
      lino: this.lino,
      points: this.points,
      exp: this.exp,
      role: this.role
    };
  }

  /**
   * @description saves to the local db (does not instantly fire to firestore, but it will be cached for the 1 hour update window)
   */
  public async save() {
    console.log('SAVING USER', this);
    return db.users.put(
      new User(
        this.id,
        this.displayname,
        this.username,
        this.avatar,
        this.lino,
        this.points,
        this.exp,
        this.role,
        this.roomRole,
        this.isSubscribed
      )
    );
  }

  /**
   * @description updates the amount of lino saved for the user
   */
  public async setLino(lino: number | string, shouldSave: boolean = true) {
    let amount;
    if (typeof lino === 'string') {
      amount = Number(lino);
    } else {
      amount = lino;
    }
    this.lino = Math.floor(amount * 100) * 10;
    if (shouldSave) {
      return this.save();
    } else {
      return Promise.resolve(amount);
    }
  }

  /**
   * @description converts the lino from an int state to how it looks on dlive
   */
  public getLino() {
    if (this.displayname === 'Benjimen') {
      console.log(this.lino, 'LINO REEE');
    }
    return Math.floor(this.lino / 10000) * 10;
  }

  /**
   * @description returns the permission level of the user 0 for viewer 1 for dedicated watcher 2 for sub 3 for mod 4 for owner/bot account
   */
  public getPermissionLevel(): Array<0 | 1 | 2 | 3 | 4> {
    const roles: Array<0 | 1 | 2 | 3 | 4> = [];

    if (this.roomRole === 'Owner') {
      roles.push(4);
    }
    if (this.roomRole === 'Moderator') {
      roles.push(3);
    }
    if (this.role === 'Bot') {
      roles.push(4);
    }
    if (this.isSubscribed) {
      roles.push(2);
    }
    if (this.exp > 0) {
      roles.push(1);
    }
    roles.push(0);

    return roles;
  }

  public getPermissionStrings() {
    const roles = this.getPermissionLevel();

    return roles.reduce(
      (
        acc: Array<
          'Regular' | 'Subscriber' | 'Moderator' | 'Bot / Owner' | 'Member'
        >,
        level
      ) => {
        acc.push(
          level === 1
            ? 'Regular'
            : level === 2
            ? 'Subscriber'
            : level === 3
            ? 'Moderator'
            : level === 4
            ? 'Bot / Owner'
            : 'Member'
        );

        return acc;
      },
      []
    );
  }
}

/**
 * @description is the Command class for all commands
 */
// tslint:disable-next-line: completed-docs
export class Command implements ICommand {
  public id: string;
  public name: string;
  public permissions: ISelectOption<0 | 1 | 2 | 3 | 4>[];
  public reply: string;
  public cost: number;
  public enabled: boolean;

  constructor(
    id: string,
    name: string,
    permissions: any[] = [],
    reply: string = '',
    cost: number = 0,
    enabled: boolean = true
  ) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
    this.reply = reply;
    this.cost = cost;
    this.enabled = enabled;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      permissions: this.permissions,
      reply: this.reply,
      cost: this.cost,
      enabled: this.enabled
    };
  }

  public enable() {
    this.enabled = true;
    this.save();
  }

  public disable() {
    this.enabled = false;
    this.save();
  }

  public getPermissionLevels() {
    return this.permissions.map(item => item.value);
  }

  /**
   * @description saves the command to firestore
   */
  public save() {
    rxUser
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe(user => {
        if (!user) {
          return;
        }

        firestore
          .collection('users')
          .doc(user.uid)
          .collection('commands')
          .doc(this.id)
          .set(this.toJSON())
          .catch(null);
      });
  }
  /**
   * @description runs the command by getting the config and sending the reply after parsing
   */
  public async run({
    commandName,
    variables,
    message
  }: {
    commandName: string;
    variables: string[];
    message: IChatObject;
  }) {
    rxUsers.pipe(first()).subscribe(users => {
      let user = users[message.sender.username];
      if (!user) {
        user = new User(
          message.sender.id,
          message.sender.displayname,
          message.sender.username,
          message.sender.avatar,
          0,
          0,
          0,
          message.role,
          message.roomRole,
          !!message.subscribing
        );
        user.save();
      }

      let level = user.getPermissionLevel();

      const canPass = (): boolean => {
        let permLevels = this.getPermissionLevels();

        return permLevels.reduce((acc: false | true, item) => {
          if (user.getPermissionLevel().includes(4) || acc === true) {
            return true;
          }
          return user.getPermissionLevel().includes(item);
        }, false);
      };

      if (!canPass() && this.getPermissionLevels().length > 0) {
        // console.log(
        //   'can pass',
        //   canPass(),
        //   this.getPermissionLevels(),
        //   user.getPermissionLevel(),
        //   user.displayname.toUpperCase()
        // );
        sendMessageWithConfig(
          `@${message.sender.displayname} you do not have permission to run this command!`
        );

        return;
      }

      const getParsedMessage = async ({
        message: mMessage,
        reply
      }: {
        message: IChatObject;
        reply: string;
      }): Promise<string> => {
        return rxCustomVariables
          .pipe(first())
          .toPromise()
          .then(async custom_variables => {
            const replace = async (i = 0): Promise<string> => {
              const keys = Object.keys(custom_variables);

              return new Promise(res => {
                if (i === keys.length) {
                  // tslint:disable-next-line: no-void-expression
                  return res(reply);
                }
                const key = keys[i];
                const str = `{${key}}`;
                const run = custom_variables[key].run;
                if (new RegExp(str, 'gi').test(reply) && run) {
                  return run(message, user).then((replacement: any) => {
                    // tslint:disable-next-line: no-parameter-reassignment no-unsafe-any
                    reply = reply.replace(new RegExp(str, 'gi'), replacement);

                    // tslint:disable-next-line: no-void-expression
                    return res(replace(i + 1));
                  });
                } else {
                  // tslint:disable-next-line: no-void-expression
                  return res(replace(i + 1));
                }
              });
            };

            return replace(0);
          });
      };

      const parsedMessage = getParsedMessage({
        message,
        reply: this.reply
      }).catch(null);
      parsedMessage
        .then(msgToSend => {
          sendMessageWithConfig(msgToSend);
        })
        .catch(null);
    });
  }

  /**
   * @description checks to see if a message triggers this command
   */
  public checkAndRun(message: IChatObject) {
    if (!message.content) {
      return false;
    }

    const name = `!${this.name.toLowerCase()}`;
    if (!message.content.startsWith(name)) {
      return false;
    }

    const variables = message.content.split(' ');
    const commandName = variables.shift();

    const sender = message.sender;
    db.users
      .get(sender.username)
      .then(user => {
        const mUser =
          user ||
          new User(
            sender.username,
            sender.displayname,
            sender.username,
            sender.avatar,
            0,
            0,
            0,
            message.role,
            message.roomRole,
            !!message.subscribing
          );
        if (this.cost === 0) {
          return this.run({
            commandName: commandName ? commandName : '',
            variables,
            message
          }).catch(null);
        }
        if (mUser.points >= this.cost) {
          mUser
            .addPoints(-this.cost)
            .then(() => {
              this.run({
                commandName: commandName ? commandName : '',
                variables,
                message
              }).catch(null);
            })
            .catch(null);
        } else {
          sendMessageWithConfig(getPhrase('command_error_cost'));
        }
      })
      .catch(null);
  }

  public delete() {
    rxUser.pipe(first()).subscribe(authUser => {
      if (!authUser) {
        return;
      }

      firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('commands')
        .doc(this.name)
        .delete()
        .catch(null);
    });
  }
}

// tslint:disable-next-line: completed-docs
export class Timer implements ITimer {
  public name: string;
  public reply: string;
  public enabled: boolean;
  public seconds: number;
  public messages: number;

  constructor(
    name: string,
    reply: string = '',
    enabled: boolean = true,
    seconds: number = 60,
    messages: number = 0
  ) {
    this.name = name;
    this.reply = reply;
    this.enabled = enabled;
    this.seconds = seconds;
    this.messages = messages;
  }

  public toJSON() {
    return {
      id: this.name,
      name: this.name,
      reply: this.reply,
      enabled: this.enabled,
      seconds: this.seconds,
      messages: this.messages
    };
  }

  public enable() {
    this.enabled = true;
    this.save();
  }

  public disable() {
    this.enabled = false;
    this.save();
  }

  /**
   * @description saves the command to firestore
   */
  public save() {
    console.log('saving timer', this);
    rxUser
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe(user => {
        if (!user) {
          return;
        }
        console.log(this.name, this.toJSON());
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('timers')
          .doc(this.name)
          .set(this.toJSON())
          .catch(null);
      });
  }
  /**
   * @description runs the command by getting the config and sending the reply after parsing
   */
  public async run() {
    console.log('running timer');
    sendMessageWithConfig(this.reply);
  }

  public delete() {
    rxUser.pipe(first()).subscribe(authUser => {
      if (!authUser) {
        return;
      }

      firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('timers')
        .doc(this.name)
        .delete()
        .catch(null);
    });
  }
}

/**
 * @description converts all users in the local database to be User objects when they are returned by any query
 */
db.users.mapToClass(User);

/**
 * @description returns an array of User (class) objects directly from firestore
 * @warning DO NOT SUBSCRIBE TO THIS IN COMPONENTS
 */
export const rxFireUsers = rxUser.pipe(
  filter(x => !!x),
  /**
   * @description this switchmap takes the current user id and returns a firestore reference using that uid
   * to get the firestore users.
   *
   * @note Everything down the line will update if a user in the firestore database updates
   */
  switchMap(
    (user): ObservableInput<any> => {
      if (!user) {
        return [];
      }

      const firestoreReference = firestore
        .collection('users')
        .doc(user.uid)
        .collection('users');

      return collectionData(firestoreReference);
    }
  ),
  map((users: IOldUser[]): User[] => {
    /**
     * @description maps over all the database users and converts them to the new class based users
     */
    return users.map((oldUser: IOldUser) => {
      const user: IUser = {
        id: oldUser.username
          ? oldUser.username
          : oldUser.blockchainUsername
          ? oldUser.blockchainUsername
          : '',
        displayname: oldUser.displayname
          ? oldUser.displayname
          : oldUser.dliveUsername
          ? oldUser.dliveUsername
          : '',
        username: oldUser.username
          ? oldUser.username
          : oldUser.blockchainUsername
          ? oldUser.blockchainUsername
          : '',
        avatar: oldUser.avatar ? oldUser.avatar : '',
        lino: oldUser.lino ? oldUser.lino : 0,
        points: oldUser.points ? oldUser.points : 0,
        exp: oldUser.exp ? oldUser.exp : 0,
        role: oldUser.role,
        roomRole: oldUser.roomRole || 'Member',
        isSubscribed: oldUser.isSubscribed || false
      };

      return new User(
        user.id,
        user.displayname,
        user.username,
        user.avatar,
        user.lino,
        user.points,
        user.exp,
        user.role,
        user.roomRole || 'Member',
        user.isSubscribed || false
      );
    });
  })
);

/**
 * @description this is the userMap (local variable to store all users)
 */
const userMap = new BehaviorSubject<{ [id: string]: User } | null>(null);

/**
 * @description Get all the current users in the local database
 * and convert them to User class objects.
 */
export let getCurrentLocal = () => {
  db.users
    .toArray()
    .then(users => {
      /**
       * @description userMap.next sends the map of users from the local database to userMap
       * for a start value
       *
       * @note this only happens once and then will no longer update the BehaviorSubject when the
       * database updates
       */
      userMap.next(
        users.reduce((acc: { [id: string]: User }, curr) => {
          acc[curr.username] = curr;

          return acc;
        }, {})
      );
    })
    .catch(null);
};
setInterval(() => {
  getCurrentLocal();
}, 1000 * 60 * 60);
getCurrentLocal();
/**
 * @description gets all the users in a map format.
 * If you want all the users this is what you should subscribe to, or you can use rxUsersArray
 */
export const rxUsers = new BehaviorSubject<{ [id: string]: User }>({});

rxDbChanges
  .pipe(
    switchMap(() => {
      return userMap;
    })
  )
  .pipe(
    filter(x => !!x),
    first(),
    switchMap(() => {
      return rxDbChanges.pipe(first());
    })
  )
  .pipe(
    map((changeArr: IDatabaseChange[]) => {
      return changeArr.reduce((acc: IDatabaseChange[], curr) => {
        if (curr.table === 'users') {
          acc.push(curr);
        }

        return acc;
      }, []);
    })
  )
  .pipe(
    tap(users => console.log('db changed 1', users)),
    withLatestFrom(userMap),
    tap(users => console.log('user map updated 2')),
    map(([changeArr, UserMap]) => {
      const cloneUserMap: { [id: string]: User } = { ...UserMap };
      if (!UserMap) {
        userMap.next({});

        return {};
      }
      changeArr.forEach(change => {
        console.log('change', change);
        if (change.type === 3) {
          // tslint:disable-next-line: prefer-object-spread no-unsafe-any
          const curUser: Partial<IUser> = Object.assign({ oldObj: {} }, change)
            .oldObj;

          if (!curUser.username) {
            return;
          }

          // The user is being deleted
          delete cloneUserMap[curUser.username];
        } else {
          // tslint:disable-next-line: prefer-object-spread no-unsafe-any
          const curUser: IUser = Object.assign({ obj: {} }, change).obj;
          if (!curUser || !curUser.username) {
            return console.log('NO CURRENT USER');
          }

          cloneUserMap[curUser.username] = new User(
            curUser.id,
            curUser.displayname,
            curUser.username,
            curUser.avatar,
            curUser.lino,
            curUser.points,
            curUser.exp,
            curUser.role,
            curUser.roomRole,
            curUser.isSubscribed
          );
        }
      });
      console.log('pushing update to userMap');
      userMap.next(cloneUserMap);

      return UserMap;
    })
  )
  .subscribe(usermap => rxUsers.next(usermap));
// .pipe(distinctUntilChanged())

export const getUserById = async (id: string) => {
  return rxUsers
    .pipe(
      first(),
      filter(x => !!x),
      map(users => {
        return !!users[id] ? users[id] : null;
      })
    )
    .toPromise();
};

/**
 * @description same thing as rxUsers but formats it into an array of User class objects
 */
export const rxUsersArray = rxUsers.pipe(
  map((mUserMap: { [username: string]: User }): User[] => {
    const userArray: User[] = [];
    Object.keys(mUserMap).forEach(username => {
      userArray.push(mUserMap[username]);
    });

    return userArray;
  })
);
