README.md - Mobile App

# MiniMoney Mobile App - Money Transfer & Financial Management

A modern, cross-platform mobile application for instant money transfers and financial management, built with React Native, Expo, and GraphQL.

## 🚀 Features

### Core Functionality
- **Money Transfers**: Send money instantly to friends and family
- **Transaction History**: Complete transaction tracking with status updates
- **Multi-Currency Support**: Support for USD, EUR, GBP, JPY, CAD, AUD
- **User Authentication**: Secure login and registration system

## 🏗️ Architecture

### Mobile App Stack
- **React Native**: Cross-platform mobile development
- **Expo SDK 53**: Development platform with built-in tools
- **TypeScript**: Type-safe development with strict type checking
- **Expo Router**: File-based routing system
- **Apollo Client**: GraphQL client for data management

### Backend Stack
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **GraphQL**: Query language and runtime
- **Apollo Server**: GraphQL server implementation
- **PostgreSQL**: Relational database
- **Sequelize**: Database ORM
- **JWT**: Authentication and authorization

### Data Flow
- **GraphQL API**: Efficient data fetching with single endpoint
- **State Management**: React hooks and Apollo Client cache
- **Authentication**: JWT-based secure authentication

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js 18+** or **Bun** (recommended)
- **Expo CLI**: `npm install -g @expo/cli`
- **Git** for version control
- **PostgreSQL** database (for backend)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohaleDesigns/MinitMoney_App.git
   cd MinitMoney_App
   ```

2. **Install mobile app dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Start mobile app**
   ```bash
   cd ..
   bun run start
   ```

## 📱 App Structure

### Navigation
- **Authentication Flow**: Login/Register screens
- **Tab Navigation**: Home, Send Money, Transaction History, Explore
- **Stack Navigation**: Nested screens within tabs

### Key Screens
- **Login**: To login into the app but using dummy data
- **Register**: To register a new user, it simulate creating a new user
- **Home**: Dashboard with quick actions and stats
- **Send Money**: Money transfer form with validation
- **Transaction History**: List of all transactions

**NOTE**: The app uses mocked up data, couldn't get to back-end side of things because I working on the assignment late at night after hours.

**MiniMoney** - Simplifying money transfers with modern mobile technology.