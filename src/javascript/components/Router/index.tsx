import * as React from 'react';
import { useState, Component } from 'react';

import { Route } from './Route';
import { Chat } from '../Chat';
import { UsersPage } from '../Users';
import { Menu } from '../Menu';
import { Popup } from '../Popup';
import { CommandsPage } from '../Commands';
import { rxUsers } from '../../helpers/rxUsers';
import { rxCommands } from '../../helpers/rxCommands';
import { rxConfig } from '../../helpers/rxConfig';
import { ConfigPage } from '../Config';
import { rxTimers } from '../../helpers/rxTimers';
import { TimersPage } from '../Timers';
import { GiveawaysPage } from '../Giveaways';
import { rxGiveaways } from '../../helpers/rxGiveaways';
import { rxEmotes } from '../../helpers/rxEmotes';
import { rxQuotes } from '../../helpers/rxQuotes';
import { QuotesPage } from '../Quotes';
import { rxLists } from '../../helpers/rxLists';
import { ListsPage } from '../Lists';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const RouteContext = React.createContext({ currentUrl: '/' });

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
    quotes:{},
    lists: {},
    livestream: { watchingCount: 0 }
  };
  componentDidMount() {
    rxUsers.subscribe(Users => {
      this.setState({ users: Users });
    });
    rxCommands.subscribe(Commands => {
      this.setState({ commands: Commands });
    });
    rxTimers.subscribe(Timers => {
      this.setState({ timers: Timers });
    });
    rxGiveaways.subscribe(Giveaways => {
      this.setState({ giveaways: Giveaways });
    });
    rxEmotes.subscribe(Emotes => {
      this.setState({ emotes: Emotes });
    });
    rxQuotes.subscribe(Quotes => {
      this.setState({ quotes: Quotes });
    });
    rxLists.subscribe(Lists => {
      this.setState({ lists: Lists });
    });
    ipcRenderer.on('updatedUser', (event, { user }) => {
      let users = Object.assign({}, this.state.users);
      users[user.username] = user;
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
    ipcRenderer.on('newmessage', (event, { message }) => {
      var date = new Date();
      var time = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0');
      message["Msg_timestamp"] = time;
      let newArr = [...this.state.messages, message];
      this.setState({ messages: newArr });
    });
    ipcRenderer.on('livestreamObject', (event, livestream) => {
      this.setState({ livestream });
    });
    rxConfig.subscribe(Config => {
      this.setState({ config: Config });
    });
  }

  popups = [];

  addPopup = (element, hasGradiant = false) => {
    this.popups = this.popups.concat([element]);
    this.setState({
      popups: this.popups,
      hasGradiant: hasGradiant
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
          <Popup
            Component={popups[popups.length - 1]}
            closePopup={this.closeCurrentPopup}
            hasGradiant={hasGradiant}
          />
        ) : null}
        <div id='content'>
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
          <Route
            url={url}
            path={'/lists'}
            componentProps={{
              lists: this.state.lists,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={ListsPage}
          />
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

const Router = props => {
  const [url, setUrl] = useState('/');
  return (
    <RouteContext.Provider value={{ currentUrl: url, setUrl }}>
      <Menu setUrl={setUrl} />
      <RouterWrapper url={url} setUrl={setUrl} />
    </RouteContext.Provider>
  );
};
export { Router };
