# JSON Server Setup for MinitMoney App

This document explains how to set up and use the JSON server for the MinitMoney app.

## Overview

The JSON server provides a RESTful API backend for:
- User registration and authentication
- Transaction creation and management
- User balance tracking
- Transaction history

## Setup Instructions

### 1. Install Dependencies

First, install the required dependencies:

```bash
npm install
```

### 2. Start the JSON Server

Start the JSON server on port 3001:

```bash
npm run server
```

The server will start and watch the `db.json` file for changes.

### 3. Start the Expo App

In a separate terminal, start your Expo app:

```bash
npm start
```

## API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user (e.g., balance)

### Transactions

- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get transaction by ID
- `POST /transactions` - Create new transaction
- `PATCH /transactions/:id` - Update transaction status

## Database Schema

### Users
```json
{
  "id": "string",
  "email": "string",
  "password": "string",
  "name": "string",
  "balance": "number",
  "createdAt": "string (ISO date)"
}
```

### Transactions
```json
{
  "id": "string",
  "senderId": "string",
  "receiverId": "string",
  "amount": "number",
  "type": "send|receive",
  "status": "pending|completed|failed",
  "description": "string",
  "createdAt": "string (ISO date)"
}
```

## Features Implemented

### 1. User Authentication
- **Registration**: Users can create new accounts with email, password, and name
- **Login**: Users can authenticate with existing credentials
- **Session Management**: Authentication state is persisted using AsyncStorage

### 2. Money Transfer
- **User Search**: Search for recipients by email or name
- **Transaction Creation**: Create money transfers between users
- **Balance Updates**: Automatically update sender and receiver balances
- **Validation**: Check for sufficient balance before allowing transfers

### 3. Transaction History
- **Real-time Data**: Display actual transaction data from the server
- **User-friendly Display**: Show transaction type (sent/received) and status
- **Refresh Support**: Pull-to-refresh functionality

### 4. Dashboard
- **Balance Display**: Show current user balance
- **Transaction Stats**: Display total transactions, sent, and received amounts
- **Net Position**: Calculate overall financial position

## Sample Data

The `db.json` file includes sample data:
- Demo user: `demo@example.com` / `password`
- Sample transactions between users
- User profiles and preferences

## Testing the App

1. **Register a new user**: Use the registration screen to create a new account
2. **Login**: Use existing credentials or create new ones
3. **Send money**: Search for other users and send money to them
4. **View history**: Check transaction history and balance updates
5. **Dashboard**: View your current balance and transaction statistics

## Troubleshooting

### Common Issues

1. **Server not starting**: Make sure port 3001 is available
2. **Connection errors**: Verify the server is running before using the app
3. **Data not persisting**: Check that the `db.json` file is writable

### Reset Database

To reset the database to initial state, simply restart the JSON server. The `db.json` file will be restored to its original content.

## Security Notes

⚠️ **Important**: This is a development setup and should NOT be used in production:

- Passwords are stored in plain text
- No authentication middleware
- No rate limiting
- No input validation on the server side
- Database is accessible to anyone on the network

For production use, implement proper security measures including:
- Password hashing
- JWT authentication
- Input validation
- Rate limiting
- HTTPS
- Database security

## Next Steps

To enhance this setup, consider:
1. Adding password hashing
2. Implementing JWT tokens
3. Adding transaction categories
4. Implementing push notifications
5. Adding user avatars
6. Creating admin dashboard
7. Adding transaction export functionality
