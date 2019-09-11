import { GraphQLClient } from 'graphql-request';
import { IMe } from '@/renderer';

/**
 * @description Send request to dlive for info on a auth token
 */
export const getSelf = async (authToken: string) => {
  // tslint:disable-next-line: promise-must-complete
  return new Promise((res, rej) => {
    const options = {
      url: 'https://api.dlive.tv/',
      headers: {
        authorization: authToken
      }
    };

    const client = new GraphQLClient('https://api.dlive.tv/', {
      headers: {
        authorization: authToken
      }
    });

    const query = `
      query {
        me {
            username
            displayname
        }
      }
    `;

    // tslint:disable-next-line: no-unsafe-any
    client
      .request(query)
      .then((me: { me: IMe }) => {
        res(me.me);
      })
      .catch(rej);
  });
};
