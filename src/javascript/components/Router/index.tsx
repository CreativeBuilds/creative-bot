import * as React from 'react';
import { useState, Component } from 'react';

import { Route } from './Route';
import { Chat } from '../Chat';
import { UsersPage } from '../Users';
import { Menu } from '../Menu';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const RouteContext = React.createContext({ currentUrl: '/' });

class RouterWrapper extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  state = {
    users: {},
    messages: []
  };
  componentDidMount() {
    ipcRenderer.send('getUsermap');
    ipcRenderer.on('usermap', (event, { Users }) => {
      this.setState({ users: Users });
    });
    ipcRenderer.on('updatedUser', (event, { user }) => {
      let users = Object.assign({}, this.state.users);
      users[user.username] = user;
    });
    ipcRenderer.on('newmessage', (event, data) => {
      let newArr = [...this.state.messages, data.message];
      this.setState({ messages: newArr });
    });
  }
  render() {
    const { url, setUrl } = this.props;
    return (
      <div id='content'>
        <Route
          url={url}
          path={'/'}
          componentProps={{ Messages: this.state.messages }}
          Component={Chat}
          exact={true}
        />
        <Route
          url={url}
          path={'/users'}
          componentProps={{ Users: this.state.users }}
          Component={UsersPage}
        />
      </div>
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
