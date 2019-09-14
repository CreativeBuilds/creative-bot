import { GraphQLClient } from 'graphql-request';
import { IMe } from '@/renderer';

/**
 * @description Send request to dlive for info on a auth token
 */
export const sendMessage = async (
  authToken: string,
  input: {
    message: string;
    roomRole: string;
    streamer: string;
    subscribing: boolean;
  }
) => {
  // tslint:disable-next-line: promise-must-complete
  return new Promise((res, rej) => {
    const client = new GraphQLClient('https://api.dlive.tv/', {
      headers: {
        authorization: authToken
      }
    });

    const query = `
        mutation sendStreamchatMessage($input: SendStreamchatMessageInput!) {
          sendStreamchatMessage(input: $input) {
            err {
              code
              message
              __typename
            }
            __typename
          }
        }
    `;

    // tslint:disable-next-line: no-unsafe-any
    client
      .request(query, { input })
      .then((me: { me: IMe }) => {
        res(me.me);
      })
      .catch(rej);
  });
};
