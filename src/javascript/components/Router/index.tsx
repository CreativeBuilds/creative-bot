import * as React from 'react';
import { useState, Component } from 'react';

import { theme, ThemeContext } from '../../helpers';

import { Route } from './Route';
import { Chat } from '../Chat';
import { UsersPage } from '../Users';
import { Menu } from '../Menu';
//import { Popup } from '../Popup';
import { Popup } from '../Generics/Popup';
import { CommandsPage } from '../Commands';
import { firebaseUsers$, setRxUser } from '../../helpers/rxUsers';
import { firebaseCommands$ } from '../../helpers/rxCommands';
import { firebaseConfig$ } from '../../helpers/rxConfig';
import { ConfigPage } from '../Config';
import { firebaseTimers$ } from '../../helpers/rxTimers';
import { TimersPage } from '../Timers';
import { GiveawaysPage } from '../Giveaways';
import { firebaseGiveaways$ } from '../../helpers/rxGiveaways';
import { firebaseEmotes$ } from '../../helpers/rxEmotes';
import { firebaseQuotes$ } from '../../helpers/rxQuotes';
import { QuotesPage } from '../Quotes';
import { rxLists } from '../../helpers/rxLists';
import { ListsPage } from '../Lists';
import { first, filter } from 'rxjs/operators';

import { isEmpty } from 'lodash';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const RouteContext: any = React.createContext({ currentUrl: '/' });

const styles: any = require('./Route.scss');

class RouterWrapper extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  state = {
    users: {},
    messages: [],
    popups: [],
    hasGradiant: false,
    commands: {},
    giveaways: {},
    timers: {},
    config: {},
    emotes: {},
    quotes: {},
    lists: {},
    livestream: { watchingCount: 0 },
    noX: false
  };
  componentDidMount() {
    firebaseUsers$.subscribe(Users => {
      this.setState({ users: Users });
    });
    firebaseCommands$.subscribe(Commands => {
      this.setState({ commands: Commands });
    });
    firebaseTimers$.subscribe(Timers => {
      this.setState({ timers: Timers });
    });
    firebaseGiveaways$.subscribe(Giveaways => {
      this.setState({ giveaways: Giveaways });
    });
    firebaseEmotes$.subscribe(Emotes => {
      this.setState({ emotes: Emotes });
    });
    firebaseQuotes$.subscribe(Quotes => {
      this.setState({ quotes: Quotes });
    });
    rxLists.subscribe(Lists => {
      this.setState({ lists: Lists });
    });
    // ipcRenderer.on('updatedUser', (event, { user }) => {
    //   let users = Object.assign({}, this.state.users);
    //   users[user.username] = user;
    // });
    ipcRenderer.on('updateUser', (event, user) => {
      setRxUser(user);
    });
    ipcRenderer.on('removedMessage', (event, { id, streamer }) => {
      let arr = [...this.state.messages];
      let newArr = arr.reduce((acc, item) => {
        if (item.id !== id) acc.push(item);
        return acc;
      }, []);
      this.setState({
        messages: newArr
      });
    });
    let soundIsRunning = false;
    let newSound = (message, config) => {
      if (soundIsRunning) {
        setTimeout(() => {
          newSound(message, config);
        }, 1000);
      } else if (
        message.donationMessage ? message.donationMessage.length : false
      ) {
        const giftType = () => {
          if (message.gift === 'LEMON') {
            return 'lemon';
          } else if (message.gift === 'ICE_CREAM') {
            return 'ice cream';
          } else if (message.gift === 'DIAMOND') {
            return 'diamond!';
          } else if (message.gift === 'NINJAGHINI') {
            return 'ninjaghini!';
          } else if (message.gift === 'NINJET') {
            return 'ninjet!';
          }
        };
        soundIsRunning = true;
        var utter = new SpeechSynthesisUtterance();
        utter.text = `${message.sender.dliveUsername} just donated ${
          message.amount
        } ${giftType()} ${
          message.donationMessage ? message.donationMessage : ''
        }`;
        utter.volume =
          (typeof config.tts_Amplitude === 'number'
            ? config.tts_Amplitude
            : 100) / 100;
        utter.pitch =
          (typeof config.tts_Pitch === 'number' ? config.tts_Pitch : 100) / 100;
        utter.rate =
          (typeof config.tts_Speed === 'number' ? config.tts_Speed : 100) / 100;
        utter.onend = () => {
          soundIsRunning = false;
        };
        speechSynthesis.speak(utter);
      }
    };

    ipcRenderer.on('newdonation', (event, { message }) => {
      firebaseConfig$
        .pipe(
          first(),
          filter(x => !isEmpty(x))
        )
        .subscribe((config: any) => {
          if (config.hasTTSDonations) {
            newSound(message, config);
          }
        });
    });

    ipcRenderer.on('newmessage', (event, { message }) => {
      var date = new Date();
      var hourMilitary = '';
      if (!!message.gift) {
      }
      if (date.getHours() > 12) {
        hourMilitary = String(date.getHours() - 12);
      } else {
        hourMilitary = String(date.getHours());
      }

      var timeDigital =
        String(date.getHours()).padStart(2, '0') +
        ':' +
        String(date.getMinutes()).padStart(2, '0') +
        ':' +
        String(date.getSeconds()).padStart(2, '0');

      var timeMilitary =
        hourMilitary.padStart(2, '0') +
        ':' +
        String(date.getMinutes()).padStart(2, '0');

      message['Msg_timestamp_digital'] = timeDigital;
      message['Msg_timestamp'] = timeMilitary;
      let newArr = [...this.state.messages, message];
      this.setState({ messages: newArr });
    });
    ipcRenderer.on('livestreamObject', (event, livestream) => {
      this.setState({ livestream });
    });

    firebaseConfig$.subscribe(Config => {
      this.setState({ config: Config });
    });
  }

  popups = [];

  addPopup = (element, hasGradiant = false, noX = false) => {
    this.popups = this.popups.concat([element]);
    this.setState({
      popups: this.popups,
      hasGradiant: hasGradiant,
      noX
    });
  };

  closeCurrentPopup = () => {
    let arr = this.popups.concat([]);
    arr.splice(-1, 1);
    this.popups = arr;
    this.setState({ popups: arr });
  };

  render() {
    const { url, setUrl } = this.props;
    const { popups, hasGradiant } = this.state;

    return (
      <React.Fragment>
        {popups.length > 0 ? (
          /*<Popup
            Component={popups[popups.length - 1]}
            closePopup={this.closeCurrentPopup}
            hasGradiant={hasGradiant}
            noX={this.state.noX}
          />*/
          <Popup
            hasGradiant={hasGradiant}
            noX={this.state.noX}
            closePopup={this.closeCurrentPopup}
          >
            {popups[popups.length - 1]}
          </Popup>
        ) : null}
        <div
          id='content'
          style={Object.assign(
            {},
            this.state.popups == null || this.state.popups.length == 0
              ? null
              : theme.globals.blurred,
            {}
          )}
        >
          <Route
            url={url}
            path={'/'}
            componentProps={{
              Messages: this.state.messages,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup,
              viewers: this.state.livestream.watchingCount || 0
            }}
            Component={Chat}
            exact={true}
          />
          <Route
            url={url}
            path={'/giveaways'}
            componentProps={{
              giveaways: this.state.giveaways,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={GiveawaysPage}
          />
          <Route
            url={url}
            path={'/users'}
            componentProps={{
              Users: this.state.users,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={UsersPage}
          />
          <Route
            url={url}
            path={'/commands'}
            componentProps={{
              commands: this.state.commands,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={CommandsPage}
          />
          <Route
            url={url}
            path={'/timers'}
            componentProps={{
              timers: this.state.timers,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={TimersPage}
          />
          <Route
            url={url}
            path={'/quotes'}
            componentProps={{
              quotes: this.state.quotes,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={QuotesPage}
          />
          {/* <Route
            url={url}
            path={'/lists'}
            componentProps={{
              lists: this.state.lists,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={ListsPage}
          /> */}
          <Route
            url={url}
            path={'/settings'}
            componentProps={{
              config: this.state.config,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={ConfigPage}
          />
        </div>
      </React.Fragment>
    );
  }
}

const Router = (props, getFuncs) => {
  const [url, setUrl] = useState('/');
  return (
    <RouteContext.Provider value={{ currentUrl: url, setUrl }}>
      <Menu setUrl={setUrl} />
      <RouterWrapper url={url} setUrl={setUrl} />
    </RouteContext.Provider>
  );
};
export { Router };
