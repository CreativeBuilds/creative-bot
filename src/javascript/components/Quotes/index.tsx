import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { AddQuotePopup } from './AddQuotePopup';
import { MdAddCircle } from 'react-icons/md';

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

    let quotesArray = _.orderBy(
        _.sortBy(Object.keys(quotes))
          .map(name => quotes[name])
          .filter(quote => {
            if (searchQuoteName.trim() === '') return true;
            return quote.quote
              .toLowerCase()
              .includes(searchQuoteName.trim().toLowerCase());
          }),
        [toggle],
        [isDesc ? 'desc' : 'asc']
      );

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
               
            </div>
        </div>
      );
}

export { QuotesPage };