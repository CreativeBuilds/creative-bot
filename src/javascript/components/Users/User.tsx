import * as React from 'react';

const User = ({ styles, User, nth, stateTheme }) => {
  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.chat.message,
        nth % 2 ? stateTheme.chat.message.alternate : {}
      )}
    >
      <div className={styles.image_container}>
        {/* TODO add the user avatar when the user chats for the first time! */}
        <img
          src={
            User.avatar
              ? User.avatar
              : 'https://images-sih.prd.dlivecdn.com/fit-in/50x50/filters:quality(90)/avatar/default17.png'
          }
          width={26}
          height={26}
        />
      </div>
    </div>
  );
};

export { User };
