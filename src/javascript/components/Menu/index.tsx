import * as React from 'react';
import { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';

const styles: any = require('./Menu.scss');

const Menu = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.menu}>
      <div
        className={styles.hamburger}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <MdMenu />
      </div>
      <div
      style={styles}
        className={`${styles.menu_popout} ${isOpen ? styles.menu_toggled : ''}`}
      >
      <MdClose />
      </div>
    </div>
  );
};

export { Menu };
