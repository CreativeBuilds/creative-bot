import Dexie from 'dexie';
// tslint:disable-next-line: no-import-side-effect
import 'dexie-observable';
import { BehaviorSubject } from 'rxjs';
import { IDatabaseChange } from 'dexie-observable/api';
import {
  IUser,
  ICommand,
  IChatObject,
  IConfig,
  IMe,
  ITimer,
  ICustomVariable
} from '@/renderer';
import { firestore } from '../firebase';
import { rxUser } from '../rxUser';
import { first, filter, tap, withLatestFrom } from 'rxjs/operators';
import { rxConfig } from '../rxConfig';
import { sendMessage } from '../dlive/sendMessage';
import { rxMe } from '../rxMe';
import { sendMessageWithConfig } from '../sendMessageWithConfig';
import { getPhrase } from '../lang';
import { rxCustomVariables } from '../rxCustomVariables';
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
  }
}

/**
 * @description creates the database
 */
const db = new MyDatabase();

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
        return;
      }
      db.users.delete(this.username).catch(null);
      firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('users')
        .doc(this.username)
        .delete()
        .catch(null);
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
    this.lino = Math.floor(amount * 1000);
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
  public getPermissionLevel() {
    if (this.roomRole === 'Owner') {
      return 4;
    } else if (this.roomRole === 'Moderator') {
      return 3;
    } else if (this.role === 'Bot') {
      return 4;
    } else if (this.isSubscribed) {
      return 2;
    } else if (this.exp > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  public getPermissionString() {
    const level = this.getPermissionLevel();

    return level === 1
      ? 'Regular'
      : level === 2
      ? 'Subscriber'
      : level === 3
      ? 'Moderator'
      : level === 4
      ? 'Bot / Owner'
      : 'Member';
  }
}

/**
 * @description is the Command class for all commands
 */
// tslint:disable-next-line: completed-docs
export class Command implements ICommand {
  public id: string;
  public name: string;
  public permissions: any[];
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
                return run(message).then((replacement: any) => {
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

export { db };
