const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    balance: Float
    currency: String
    createdAt: String
  }

  type Transaction {
    id: ID!
    recipient: String!
    amount: Float!
    currency: String!
    timestamp: Float!
    status: TransactionStatus!
    description: String
    sender: User
  }

  enum TransactionStatus {
    PENDING
    COMPLETED
    FAILED
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  type TransactionUpdate {
    id: ID!
    status: TransactionStatus!
    updatedAt: String!
  }

  type Balance {
    balance: Float!
    currency: String!
    lastUpdated: String!
  }

  type Query {
    transactions(limit: Int, offset: Int): [Transaction!]!
    transaction(id: ID!): Transaction
    userProfile: User
    userBalance: Balance
  }

  type Mutation {
    registerUser(email: String!, password: String!, name: String!): AuthResponse!
    loginUser(email: String!, password: String!): AuthResponse!
    sendMoney(recipientEmail: String!, amount: Float!, currency: String!, description: String): Transaction!
    updateTransactionStatus(id: ID!, status: TransactionStatus!): TransactionUpdate!
  }
`;

// In-memory data store
let users = [
  { 
    id: '1', 
    email: 'demo@example.com', 
    name: 'Demo User', 
    balance: 1000, 
    currency: 'USD', 
    createdAt: new Date().toISOString() 
  }
];

let transactions = [
  {
    id: '1',
    recipient: 'john@example.com',
    amount: 50.00,
    currency: 'USD',
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'COMPLETED',
    description: 'Lunch payment',
    sender: users[0]
  },
  {
    id: '2',
    recipient: 'jane@example.com',
    amount: 25.00,
    currency: 'USD',
    timestamp: Date.now() - 172800000, // 2 days ago
    status: 'COMPLETED',
    description: 'Coffee',
    sender: users[0]
  }
];

const resolvers = {
  Query: {
    transactions: (_, { limit = 50, offset = 0 }) => {
      return transactions.slice(offset, offset + limit);
    },
    transaction: (_, { id }) => {
      return transactions.find(t => t.id === id);
    },
    userProfile: () => users[0],
    userBalance: () => ({ 
      balance: users[0].balance, 
      currency: users[0].currency, 
      lastUpdated: new Date().toISOString() 
    })
  },
  Mutation: {
    registerUser: (_, { email, password, name }) => {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const user = { 
        id: Date.now().toString(), 
        email, 
        name, 
        balance: 1000, 
        currency: 'USD', 
        createdAt: new Date().toISOString() 
      };
      users.push(user);
      return { user, token: `token-${Date.now()}` };
    },
    loginUser: (_, { email, password }) => {
      const user = users.find(u => u.email === email);
      if (user) {
        // In a real app, you'd verify the password
        return { user, token: `token-${Date.now()}` };
      }
      throw new Error('Invalid credentials');
    },
    sendMoney: (_, { recipientEmail, amount, currency, description }) => {
      const transaction = {
        id: Date.now().toString(),
        recipient: recipientEmail,
        amount,
        currency,
        timestamp: Date.now(),
        status: 'COMPLETED',
        description,
        sender: users[0]
      };
      transactions.unshift(transaction);
      
      // Update user balance (simple simulation)
      users[0].balance -= amount;
      
      return transaction;
    },
    updateTransactionStatus: (_, { id, status }) => {
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      transaction.status = status;
      
      return {
        id,
        status,
        updatedAt: new Date().toISOString()
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀 Server ready at ${url}`);
  console.log(`📊 GraphQL Playground available at ${url}`);
  console.log(`\n📝 Sample Queries:`);
  console.log(`  - Query transactions: { transactions { id, recipient, amount, status } }`);
  console.log(`  - Query user profile: { userProfile { id, email, name, balance } }`);
  console.log(`\n🔐 Sample Mutations:`);
  console.log(`  - Login: loginUser(email: "demo@example.com", password: "password") { user { id, email } }`);
  console.log(`  - Send money: sendMoney(recipientEmail: "test@example.com", amount: 100, currency: "USD") { id, status }`);
}

startServer().catch(console.error);
