/**
 * The user object that we will get from Table.mapToClass()
 */
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
}
