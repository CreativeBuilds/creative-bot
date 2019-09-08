declare module '@trendmicro/react-sidenav';
declare module 'request';

declare interface IConfig {
  authKey: null | string;
  streamerAuthKey: null | string;
  commandPrefix: string;
  lang: string;
  chatProfileShadows?: IChatColors;
  selectedSender?: IOption;
}

declare interface IEvent {
  data: { [id: string]: any };
  name: string;
}

declare interface IRXEvent {
  payload: {
    message?: string;
    data?: { [id: string]: any };
  };
  type: string;
}

declare interface IMe {
  displayname: string;
  username: string;
}

declare interface ISender {
  avatar: string;
  badges: {}[];
  displayname: string;
  id: string;
  partnerStatus: string;
  username: string;
  __typename: string;
}

declare interface IChatObject {
  type: string;
  id: string;
  content?: string;
  createdAt: string;
  role: string;
  roomRole: string;
  sender: ISender;
  subscribing?: boolean;
  __typename: string;
}

declare interface IChatColors {
  owner: string;
  bot: string;
  staff: string;
  viewer: string;
  moderator: string;
}

declare interface IOption {
  label: string;
  value: string;
}
