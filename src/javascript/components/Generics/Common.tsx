import * as React from 'react';
import { useState } from 'react';

const Page = ({ children, stateTheme, style = {} }) => {

  return (
    <div style={Object.assign({}, style, stateTheme.page)}>
        {children}
    </div>
  );
};

const PageHeader = ({ children, stateTheme, style = {} }) => {

    return (
      <div style={Object.assign({}, style, stateTheme.page.header)}>
          {children}
      </div>
    );
};

const PageBody = ({ children, stateTheme, style = {}, id = null }) => {

    return (
      <div style={Object.assign({}, style, stateTheme.page.content)} id={id}>
          {children}
      </div>
    );
};

export { Page, PageHeader, PageBody }