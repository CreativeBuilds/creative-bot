import {
  ICreateChange,
  IUpdateChange,
  IDeleteChange
} from 'dexie-observable/api';

export interface IConfig {
  authKey: null | string;
  streamerAuthKey: null | string;
  commandPrefix: string;
  lang: string;
  appearance: string;
  chatProfileShadows?: IChatColors;
  selectedSender?: IOption;
  pointsTimer?: number;
  points?: number;
  donationSettings?: {
    lemons?: number;
    icecream?: number;
    diamond?: number;
    ninja?: number;
    ninjet?: number;
  };
  tts_Amplitude?: number;
  tts_Pitch?: number;
  tts_Speed?: number;
  hasTTSDonations?: boolean;
  allowedTTSDonations?: ISelectOption<
    'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET'
  >[];
  hasTTSDonationMessages?: boolean;
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

export interface IGiftObject extends IChatObject {
  gift: 'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET';
  amount: string;
  message?: string;
  expireDuration: number;
  recentCount: number;
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
  roomRole: string;
  isSubscribed: boolean;
}

export interface ICommand {
  id: string;
  name: string;
  permissions: any[];
  reply: string;
  cost: number;
  enabled: boolean;
}

export interface ITimer {
  name: string;
  seconds: number;
  reply: string;
  enabled: boolean;
  messages: number;
}

export interface ICustomVariable {
  name: string;
  replyString: string;
  isEval: boolean | null;
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

export interface ISelectOption<T = string> {
  label: string;
  value: T;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// export interface IUpdateChangeCustom extends IUpdateChange {
//   obj: IUser;
//   oldObj: IUser;
// }

// export interface IDeleteChangeCustom extends IDeleteChange {
//   obj: IUser;
// }

// export type IDatabaseChange =
//   | ICreateChange
//   | IUpdateChangeCustom
//   | IDeleteChangeCustom;
