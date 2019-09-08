declare module '@trendmicro/react-sidenav';

declare interface IConfig {
  authKey: null | string;
  streamerAuthKey: null | string;
  commandPrefix: string;
  lang: string;
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
