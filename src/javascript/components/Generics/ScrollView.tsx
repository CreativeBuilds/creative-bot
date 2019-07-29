import * as React from 'react';
import { useState } from 'react';

const ScrollView = ({ 
    children = null, 
    stateTheme, 
    style = {}, 
    id = null, 
    HScrollBar = 'hidden', 
    VScrollBar = 'auto',
    maxHeight = '420px' 
}) => {

    return (
      <div style={Object.assign({}, 
        Object.assign({}, {
            'overflow-y': VScrollBar,
            'overflow-x': HScrollBar,
            'max-height': maxHeight
        },style), 
        stateTheme.scrollView)} 
        id={id}>
          {children}
      </div>
    );
};

export { ScrollView }