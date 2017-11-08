const plantsRepo = require("./lib/repos/plants-repo");
const genoTypeRepo = require("./lib/repos/genotypes-repo");

export const resolvers = {
  Plant: {
    genoType: (parent, args, context, info) =>
      genoTypeRepo.byName(parent.genoTypeName).catch(_ => null)
  },
  GenoType: {
    plants: (parent, args, context, info) => {
      console.log(parent);
      return plantsRepo.allByGenoTypeName(parent.name);
    }
  },
  Query: {
    plants: () => plantsRepo.all(),
    genoTypes: () => genoTypeRepo.all()
  },
  Mutation: {
    insertPlant: (parent, args, context, info) => plantsRepo.insert(args.input),
    insertGenoType: (parent, args, context, info) =>
      genoTypeRepo.insert(args.input)
  }
};

export const loaders = {
  items: async () => [],
  item: async id => ({ id })
};

export const channels = {};

export const directives = {};
