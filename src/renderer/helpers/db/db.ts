import Dexie from 'dexie';
// tslint:disable-next-line: no-import-side-effect
import 'dexie-observable';
import { BehaviorSubject } from 'rxjs';
import { IDatabaseChange } from 'dexie-observable/api';
import { IUser, ICommand, IChatObject, IConfig, IMe } from '@/renderer';
import { firestore } from '../firebase';
import { rxUser } from '../rxUser';
import { first, filter, tap, withLatestFrom } from 'rxjs/operators';
import { rxConfig } from '../rxConfig';
import { sendMessage } from '../dlive/sendMessage';
import { rxMe } from '../rxMe';
import { sendMessageWithConfig } from '../sendMessageWithConfig';
import { getPhrase } from '../lang';

/**
 * @desciption This is all the users who have been edited since the last save to firestore
 *
 * @docs https://www.npmjs.com/package/dexie
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

  constructor(
    id: string,
    displayname: string,
    username: string,
    avatar: string,
    lino: number,
    points: number,
    exp: number,
    role: string
  ) {
    this.id = id;
    this.displayname = displayname;
    this.username = username;
    this.avatar = avatar;
    this.lino = lino;
    this.points = points;
    this.exp = exp;
    this.role = role;
  }

  /**
   * @description add points to a user then auto save it to the local db
   */
  public async addPoints(amount: number) {
    this.points += amount;

    return this.save();
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
    return db.users.update(
      this.username,
      new User(
        this.id,
        this.displayname,
        this.username,
        this.avatar,
        this.lino,
        this.points,
        this.exp,
        this.role
      )
    );
  }

  /**
   * @description converts the lino from an int state to how it looks on dlive
   */
  public getLino() {
    return Math.floor(this.lino / 10000) * 10;
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

  constructor(
    id: string,
    name: string,
    permissions: any[] = [],
    reply: string = '',
    cost: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
    this.reply = reply;
    this.cost = cost;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      permissions: this.permissions,
      reply: this.reply,
      cost: this.cost
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
      return reply;
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
            message.role
          );
        if (mUser.points > this.cost) {
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

/**
 * @description converts all users in the local database to be User objects when they are returned by any query
 */
db.users.mapToClass(User);

export { db };
