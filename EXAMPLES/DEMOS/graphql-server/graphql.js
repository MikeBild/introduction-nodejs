export const resolvers = {
  User: {
    pets: parent => {
      console.log(parent);
      if (parent.id === 1) return [{ id: "A", age: 12 }];
      if (parent.id === 2) return [{ id: "Perter", age: 99 }];
    }
  },
  Query: {
    users: async () => await [{ id: 1, name: "mike" }, { id: 2, name: "olaf" }]
  }
};

export const loaders = {};

export const channels = {};

export const directives = {};
