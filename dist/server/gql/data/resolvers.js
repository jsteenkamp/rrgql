const Resolvers = {
  Query: {
    channels() {
      return [
        {id: 1, name: 'Hello World 1'},
        {id: 2, name: 'Hello World 2'},
        {id: 3, name: 'Hello World @' + new Date().getTime()},
      ];
    },
  },
};

export default Resolvers;
