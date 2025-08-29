README.md - Mobile App

# MiniMoney Mobile App - Money Transfer & Financial Management

A modern, cross-platform mobile application for instant money transfers and financial management, built with React Native, Expo, and GraphQL.

## 🚀 Features

### Core Functionality
- **Money Transfers**: Send money instantly to friends and family
- **Transaction History**: Complete transaction tracking with status updates
- **Multi-Currency Support**: Support for USD, EUR, GBP, JPY, CAD, AUD etc...
- **User Authentication**: Secure login and registration system

## 🏗️ Architecture

### Mobile App Stack
- **React Native**: Cross-platform mobile development
- **Expo SDK 53**: Development platform with built-in tools
- **TypeScript**: Type-safe development with strict type checking
- **Expo Router**: File-based routing system

### Backend Stack
- **Prisma Accelerate**: A global database cache and connection pooler that works in conjunction with a database, rather than being a database itself.

### Data Flow
- **GraphQL API**: Efficient data fetching with single endpoint
- **State Management**: React hooks and Apollo Client cache
- **Authentication**: JWT-based secure authentication

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js 18+** or **Bun**
- **Expo CLI**: `npm install -g @expo/cli`
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```on the terminal
   git clone https://github.com/MohaleDesigns/MinitMoney_App.git
   cd MinitMoney_App
   ```

2. **Install mobile app dependencies**
   ```on the terminal
   # Using Bun
   bun install
   
   # Or using npm
   npm install
   ```

2. **Set the right IP Address**
   ```on the .env
   # I pushed the .env file just to make thing easy for you as it is not good practice
   
   Change the EXPO_PUBLIC_IP_ADDRESS to your IP Address
   
   # How get an IP Address

   On Windows
   1. On your terminal type "ipconfig" without the double qoutation marks
   2. Look for the “IPv4 Address” under the network adapter you’re using (usually Wi-Fi or Ethernet).
      Example: 192.168.1.10

   On MacOS
   1. On your terminal type "ifconfig" without the double qoutation marks
   2. Look for the inet value under your active interface (usually en0 for Wi-Fi).

   On Mac
   1. On your terminal type "ip addr show" without the double qoutation marks
   2. Look for the inet value under your active network interface (like wlan0 or eth0).
      Example: 192.168.1.10/24 
   ```

3. **Start mobile app**
   ```on the terminal
   # Using Bun
   bun run start

   # Or using npm
   npm run start
   ```

3. **Run the app** 
   ```
   # Use Expo App - download on Play Store, App Gallery or App Store if you don't have
   Scan the QR code using the Expo app
   ```  

## 📱 App Structure

### Navigation
- **Authentication Flow**: Login/Register screens
- **Tab Navigation**: Home, Send Money, Transaction History
- **Stack Navigation**: Nested screens within tabs

### Key Screens
- **Login**: To login into the app
- **Register**: To register a new user, it creates a new user to the Prisma database
- **Home**: Dashboard with quick actions and stats
- **Send Money**: Money transfer form with validation
- **Transaction History**: List of all user transactions

**MiniMoney** - Simplifying money transfers with modern mobile technology.