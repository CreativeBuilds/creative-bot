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
    commands: {},
    config: {}
  };
  componentDidMount() {
    rxUsers.subscribe(Users => {
      this.setState({ users: Users });
    });
    rxCommands.subscribe(Commands => {
      this.setState({ commands: Commands });
    });
    ipcRenderer.on('updatedUser', (event, { user }) => {
      let users = Object.assign({}, this.state.users);
      users[user.username] = user;
    });
    ipcRenderer.on('newmessage', (event, data) => {
      let newArr = [...this.state.messages, data.message];
      this.setState({ messages: newArr });
    });
    rxConfig.subscribe(Config => {
      this.setState({ config: Config });
    });
  }

  popups = [];

  addPopup = element => {
    this.popups = this.popups.concat([element]);
    this.setState({
      popups: this.popups
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
    const { popups } = this.state;
    return (
      <React.Fragment>
        {popups.length > 0 ? (
          <Popup
            Component={popups[popups.length - 1]}
            closePopup={this.closeCurrentPopup}
          />
        ) : null}
        <div id='content'>
          <Route
            url={url}
            path={'/'}
            componentProps={{
              Messages: this.state.messages,
              addPopup: this.addPopup,
              closeCurrentPopup: this.closeCurrentPopup
            }}
            Component={Chat}
            exact={true}
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
