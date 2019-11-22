import localforage from 'localforage';
import {
  IUser,
  IOldUser,
  IChatObject,
  ISelectOption,
  ICommand,
  ITimer,
  IEmote,
  IChange,
  IConfig
} from '../../';
import { rxUser } from '../rxUser';
import { first, filter, switchMap, map } from 'rxjs/operators';
import { firestore } from '../firebase';
import { ObservableInput, BehaviorSubject } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
import { sendMessageWithConfig } from '../sendMessageWithConfig';
import { getPhrase } from '../lang';
import { rxCustomVariables } from '../rxCustomVariables';
import {lino as LINO} from '../lino/lino';
import { rxConfig } from '../rxConfig';
import { getSelf } from '../dlive/getSelf';
import moment from 'moment';

/**
 * @description second db try
 */

localforage.config({
  name: 'CreativeBot2',
  version: 1,
  storeName: 'users',
  description: 'Stores the info for users'
});

interface ITestObject {
  test: number;
}

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
    rxUser.pipe(first()).subscribe(authUser => {
      if (!authUser) {
        return
      }
      rxUsers.pipe(first()).subscribe(users => {
        const dupe = { ...users };
        try {
          delete dupe[this.username];
        } catch (err) {
          (()=>null)();
        }
        rxUsers.next(dupe);
        rxDbChanges.next({ name: 'removeUser', data: null });
      });
      localforage
        .removeItem(this.username)
        .then(() =>
          firestore
            .collection('users')
            .doc(authUser.uid)
            .collection('users')
            .doc(this.username)
            .delete()
        )
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
    return insertUserToDB(
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
    return Math.floor(this.lino / 100) / 10;
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
    if(!!this.permissions.length) {
      this.permissions = [];
    }
    try {
      return this.permissions.map(item => item.value);
    } catch(err) {
      this.permissions = [];
      this.save();
      return [];
    }
    
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
        .then(async msgToSend => {
          if(msgToSend.includes('{user}')){
            msgToSend = msgToSend.replace('{user}', message.sender.displayname);
          }
          let user = await getUserById(message.sender.username);
          if(msgToSend.includes('{points}')){
            msgToSend = msgToSend.replace('{points}', user?.points ? `${user?.points}` : '0');
          }
          if(msgToSend.includes('{lino}')){
            let bank = await LINO.query.getAccountBank(message.sender.username);
            msgToSend = msgToSend.replace('{lino}', bank.saving.amount);
          }
          if(msgToSend.includes('{streamer}')){
            const firebaseUser = await rxUser.pipe(first()).toPromise();
            if(!!firebaseUser) {
              const streamerRef = await firestore.collection('configs').doc(firebaseUser.uid).get();
              const streamer = streamerRef.data();
              if(!!streamer) {
                // tslint:disable-next-line: no-unsafe-any
                msgToSend = msgToSend.replace('{streamer}', streamer.streamerDisplayName);
              }
            }
          }
          if(msgToSend.includes('{uptime}')) {
            const config = await rxConfig.pipe(first()).toPromise();
            const toHHMMSS = (secs: string) => {
              const sec_num = parseInt(secs, 10);
              const hours   = Math.floor(sec_num / 3600);
              const minutes = Math.floor(sec_num / 60) % 60;
              const seconds = sec_num % 60;
          
              return [hours,minutes,seconds]
                  .map(v => v < 10 ? "0" + v : v)
                  .filter((v,i) => v !== "00" || i > 0)
                  .join(":");
          }
            if(!!config && config.streamerAuthKey) {
              // tslint:disable-next-line: no-unsafe-any
              const self = await getSelf(config.streamerAuthKey);
              msgToSend = msgToSend.replace('{uptime}', toHHMMSS(`${(Date.now() - Number(self?.livestream?.createdAt))/1000}`));
            }
          }
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
    getUserById(sender.username)
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

// tslint:disable-next-line: completed-docs
export class Emote implements IEmote {
  public id: string;  
  public dliveid: string;
  public url: string;

  constructor(
    id: string,
    dliveid: string,
    url: string
  ) {
    this.id = id;
    this.dliveid = dliveid;
    this.url = url;
  }

  public toJSON() {
    return {
      id: this.id,
      dliveid: this.dliveid,
      url: this.url
    };
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
          .collection('emotes')
          .doc(this.dliveid)
          .set(this.toJSON())
          .catch(null);
      });
  }

  public delete() {
    rxUser.pipe(first()).subscribe(authUser => {
      if (!authUser) {
        return;
      }

      firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('emotes')
        .doc(this.dliveid)
        .delete()
        .catch(null);
    });
  }

}

export const rxUsers = new BehaviorSubject<{ [id: string]: User }>({});

export const rxDbChanges = new BehaviorSubject<IChange | null>(null);

export const insertUserToDB = async (user: User) => {
  rxUsers.pipe(first()).subscribe(users => {
    const dupe = { ...users };
    dupe[user.username] = user;
    rxUsers.next(dupe);
  });
  rxDbChanges.next({ name: 'addUser', data: user });

  return localforage.setItem(user.username, user).catch(null);
};

export const getUserFromDB = async (id: string): Promise<User> => {
  return localforage
    .getItem(id)
    .then(
      (user: IUser) =>
        new User(
          user.id,
          user.displayname,
          user.username,
          user.avatar,
          user.lino,
          user.points,
          user.exp,
          user.role,
          user.roomRole,
          user.isSubscribed
        )
    );
};

export const getUsersFromDB = () => {
  return localforage.keys().then(async (keys: string[]) => {
    const promises = keys.map(getUserFromDB);

    return Promise.all(promises);
  });
};

getUsersFromDB().then(users => {
  rxUsers.next(users.reduce((acc: {[id: string]: User}, user) => {
    acc[user.username] = user;
    return acc;
  }, {}));
}).catch(null);

export const getUserById = async (id: string) => {
  return rxUsers
    .pipe(first())
    .toPromise()
    .then(users => {
      return users[id];
    });
};

export const clearDatabase = async () => {
  return localforage.clear();
};

export const rxUsersArray = new BehaviorSubject<User[]>([]);

rxUsers.subscribe(users => {
  rxUsersArray.next(Object.keys(users).map(key => users[key]));
});
