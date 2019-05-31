import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { AddQuotePopup } from './AddQuotePopup';
import { MdAddCircle } from 'react-icons/md';
import { Quote } from './Quote';

const { Sorting } = require('./Sorting');

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Quotes.scss');

const QuotesPage = ({ props }) => {
    const { stateTheme, setStateTheme } = useContext(ThemeContext);
    const [toggle, setToggle] = useState<string>('name');
    const [isDesc, setIsDesc] = useState<boolean>(true);
    const [searchQuoteName, setSearchQuoteName] = useState<string>('');
    const { quotes, addPopup, closeCurrentPopup } = props;

      const addQuotePopup = () => {
        addPopup(
          <AddQuotePopup
            styles={styles}
            closeCurrentPopup={closeCurrentPopup}
            stateTheme={stateTheme}
            quotes={quotes}
          />
        );
      };
      return (
        <div style={stateTheme.menu} className={styles.Points}>
            <div style={stateTheme.menu.title} className={styles.header}>
                Quotes
                <textarea
                className={styles.usersearch}
                style={stateTheme.chat.message.alternate}
                placeholder={'Search...'}
                value={searchQuoteName}
                onChange={e => {
                    setSearchQuoteName(e.target.value);
                }}
                />
                <MdAddCircle
                className={styles.add_circle}
                onClick={() => {
                    addQuotePopup();
                }}
                />
            </div>
            <div style={{}} className={styles.content}>
                {/* TODO ADD PAGINATION */}
                <Sorting
                toggle={toggle}
                setToggle={setToggle}
                isDesc={isDesc}
                setIsDesc={setIsDesc}
                styles={styles}
                stateTheme={stateTheme}
                />
                {quotes['quotes'].map((quote, nth) => {
                  return (
                    <Quote
                      styles={styles}
                      quote={quote}
                      stateTheme={stateTheme}
                      nth={nth + 1}
                      addPopup={addPopup}
                      closeCurrentPopup={closeCurrentPopup}
                      quotes={quotes}
                    />
                  );
                })}
               
            </div>
        </div>
      );
}

export { QuotesPage };