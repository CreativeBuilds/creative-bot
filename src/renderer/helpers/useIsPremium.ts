import { useState, useEffect } from 'react';
import { auth } from '../helpers/firebase';
import * as moment from 'moment';
/**
 * @description returns 0,1,2 if the user has premium or not
 */
export function useIsPremium() {
  // 0, 1, 2 (0 loading, 1, no access, 2 access)
  const [hasAccess, setHasAccess] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    auth.currentUser?.getIdTokenResult().then(idTokenResult => {
      console.log(idTokenResult.claims, 'claims');
      // tslint:disable-next-line: prefer-type-cast
      const timer: number = idTokenResult?.claims.subscriber as number;
      if (!timer) {
        setHasAccess(1);
      } else {
        if (timer > moment.utc().valueOf()) {
          setHasAccess(2);
          setTimeout(() => {
            setHasAccess(1);
          }, moment.utc().valueOf() - timer);
        } else {
          setHasAccess(1);
        }
      }
    });
  }, []);

  return hasAccess;
}
