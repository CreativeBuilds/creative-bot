import Dexie from 'dexie';
// tslint:disable-next-line: no-import-side-effect
import 'dexie-observable';
import { BehaviorSubject } from 'rxjs';
import { IDatabaseChange } from 'dexie-observable/api';
import { IUser } from '@/renderer';
import { firestore } from '../firebase';
import { rxUser } from '../rxUser';
import { first } from 'rxjs/operators';

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
 * @description converts all users in the local database to be User objects when they are returned by any query
 */
db.users.mapToClass(User);

export { db };
