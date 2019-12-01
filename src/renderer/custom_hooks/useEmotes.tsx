import React, { useEffect, useState } from 'react';
import { rxEmotes } from '../helpers/rxEmote';
import { Emote } from '../helpers/db/db';

interface IUseEmotes {
  emotes: Emote[];
  loadingEmotes: boolean;
}

/**
 * @description custom hook for loading emotes into a react component
 */
export const useEmotes = () => {
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [loadingEmotes, setLoadingEmotes] = useState(true);

  useEffect(() => {
    const listener = rxEmotes.subscribe((mEmotes: Emote[]) => {
      setLoadingEmotes(false);
      setEmotes(mEmotes);
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  return { emotes, loadingEmotes };
};
