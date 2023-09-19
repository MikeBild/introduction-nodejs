import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gemeinden as mockGemeinden } from "./mocks/Gemeinden";

const typeDefs = `
type Kennzeichen {
    wert: String
}

type Geometrie {
    flaeche: Float
    einheit: String
}

type Gemeinde {
    id: ID
    fehler: String
    kennzeichen: Kennzeichen
    geometrie: Geometrie
    name: String!
    country: String
}

type Query {
    gemeinden(id: ID): [Gemeinde]
}
`;

const resolvers = {
  Query: {
    gemeinden: (parent: any, params: any) => {
      if (params.id) {
        return mockGemeinden.filter((x) => x.id === parseInt(params.id));
      }
      return mockGemeinden;
    },
  },
  Gemeinde: {
    geometrie: () => {
      return {
        flaeche: 1 + 99,
        einheit: "Quadratmeter",
      };
    },
  },
};

main();

async function main() {
  const srv = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await startStandaloneServer(srv, {
    listen: { port: 9090 },
  });
  console.log("GraphQL listen on http://localhost:9090. Exit with CTRL+C.");
}
