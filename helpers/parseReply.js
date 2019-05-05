module.exports = ({ reply, custom_variables, message, streamChannel }) => {
  return new Promise(res => {
    let keys = Object.keys(custom_variables);
    let replace = (i = 0) => {
      return new Promise(res => {
        if (i === keys.length) return res(reply);
        let key = keys[i];
        let str = `{${key}}`;
        console.log('str', str);
        let run = custom_variables[key].function;
        if (new RegExp(str, 'gi').test(reply) && run) {
          console.log('streamChannel', streamChannel);
          run({
            message,
            streamChannel: streamChannel ? streamChannel : null
          }).then(replacement => {
            console.log('REPLACEMENT', replacement);
            reply = reply.replace(new RegExp(str, 'gi'), replacement);
            return res(replace(i + 1));
          });
        } else {
          return res(replace(i + 1));
        }
      });
    };
    return res(replace());
  });
};
