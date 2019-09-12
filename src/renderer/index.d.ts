export interface IConfig {
  authKey: null | string;
  streamerAuthKey: null | string;
  commandPrefix: string;
  lang: string;
  chatProfileShadows?: IChatColors;
  selectedSender?: IOption;
}

export interface IEvent {
  data: { [id: string]: any };
  name: string;
}

export interface IRXEvent {
  payload: {
    message?: string;
    data?: { [id: string]: any };
  };
  type: string;
}

export interface IMe {
  displayname: string;
  username: string;
}

export interface ISender {
  avatar: string;
  badges: {}[];
  displayname: string;
  id: string;
  partnerStatus: string;
  username: string;
  __typename: string;
}

export interface IChatObject {
  type: string;
  id: string;
  content?: string;
  createdAt: string;
  role: string;
  roomRole: string;
  sender: ISender;
  subscribing?: boolean;
  __typename: string;
  ids?: string[];
  deleted?: boolean;
}

export interface IChatColors {
  owner: string;
  bot: string;
  staff: string;
  viewer: string;
  moderator: string;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IUser {
  id: string;
  displayname: string;
  username: string;
  avatar: string;
  lino: number;
  points: number;
  exp: number;
  role: string;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IListRenderer {
  index: number;
  key: string;
  style: React.CSSProperties;
}

export interface IOldUser extends IUser {
  dliveUsername?: string;
  linoUsername?: string;
  blockchainUsername?: string;
}
