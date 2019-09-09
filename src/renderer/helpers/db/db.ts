import Dexie from 'dexie';
// tslint:disable-next-line: no-import-side-effect
import 'dexie-observable';
import { BehaviorSubject } from 'rxjs';
import { IDatabaseChange } from 'dexie-observable/api';

/**
 * @desciption This is all the users who have been edited since the last save to firestore
 *
 * @docs https://www.npmjs.com/package/dexie
 */
const editedUsers: string[] = [];

/**
 * @description a BehaviorSubject that will emit IDatabseChanges when they occur in the db
 */
export const rxDbChanges = new BehaviorSubject<IDatabaseChange[]>([]);

/**
 * @description Creates a custom version of dexie that ties the class object to the IUser properties
 */
// tslint:disable-next-line: completed-docs
class MyDatabase extends Dexie {
  public users: Dexie.Table<IUser, string>;

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
 * @description Returns a user object that has mmultiple functions on it for updating variables like points
 */
// tslint:disable-next-line: completed-docs
class User implements IUser {
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

  public async addPoints(amount: number) {
    this.points += amount;

    return this.save();
  }

  public async save() {
    return db.users.update(
      this.id,
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
}

db.users.mapToClass(User);
db.on('changes', changes => {
  rxDbChanges.next(changes);
});
