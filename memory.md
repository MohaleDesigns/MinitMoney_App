# MinitMoney App - Development Memory

## Completed Features

### 1. Authentication System
- ✅ AuthContext with login/register/logout functionality
- ✅ AsyncStorage for token and user data persistence
- ✅ GraphQL integration for authentication operations
- ✅ Conditional routing based on auth state
- ✅ Proper auth group structure for Expo Router

### 2. UI Components
- ✅ Button component with multiple variants (primary, secondary, outline)
- ✅ Input component with validation states and error handling
- ✅ Responsive design with proper theming support

### 3. Screens
- ✅ **Register Screen**: User registration with form validation
- ✅ **Login Screen**: User authentication with demo account support
- ✅ **Home Screen**: Welcome dashboard with navigation to features
- ✅ **Send Money Screen**: Money transfer form with currency selection
- ✅ **Transaction History Screen**: List of past transactions with proper UI states

### 4. Core Services
- ✅ GraphQL integration with Apollo Client
- ✅ TransactionService with GraphQL operations
- ✅ Local storage fallback for offline support
- ✅ Real-time transaction processing via GraphQL

### 5. Navigation
- ✅ Tab-based navigation (Home, Send Money, Transaction History)
- ✅ Authentication flow with proper redirects
- ✅ Deep linking support for main screens
- ✅ Auth group structure for better routing

## App Structure

```
app/
├── _layout.tsx (Root layout with auth provider and conditional routing)
├── (auth)/
│   ├── _layout.tsx (Auth group layout - no redirects)
│   ├── login.tsx (Login screen)
│   └── register.tsx (Registration screen)
├── send-money.tsx (Send money screen)
├── transaction-history.tsx (Transaction history screen)
└── (tabs)/
    ├── _layout.tsx (Tab navigation - no redirects)
    ├── index.tsx (Home screen)
    ├── send-money.tsx (Tab redirect)
    └── transaction-history.tsx (Tab redirect)
```

## Technical Details

- **State Management**: React Context for authentication
- **GraphQL Integration**: Apollo Client with proper caching and error handling
- **Storage**: AsyncStorage for local data persistence with GraphQL fallback
- **Navigation**: Expo Router with group-based routing
- **Theming**: Dark/Light mode support with Colors constants
- **Validation**: Form validation with error states
- **UI States**: Loading, empty, error states for all screens
- **Routing**: Proper auth group structure for Expo Router

## GraphQL Integration

- **Apollo Client**: Configured with authentication headers and caching
- **Operations**: User registration, login, money sending, transaction fetching
- **Caching**: InMemoryCache with proper type policies
- **Error Handling**: Comprehensive error handling with fallback to local storage
- **Authentication**: JWT token management with automatic header injection

## Demo Credentials

- **Email**: demo@example.com
- **Password**: password

## Recent Fixes

- ✅ Fixed Expo Router layout warnings by restructuring navigation
- ✅ Moved auth screens to proper (auth) group
- ✅ Added proper authentication checks in tab layout
- ✅ Resolved "This screen does not exist" errors
- ✅ Fixed "Maximum update depth exceeded" infinite loop error
- ✅ Centralized routing logic in root layout to prevent circular redirects
- ✅ Added useMemo and useCallback to prevent unnecessary re-renders
- ✅ Improved AsyncStorage operations with better error handling
- ✅ Added comprehensive debugging to track authentication flow
- ✅ Implemented cleanup in useEffect to prevent memory leaks
- ✅ Fixed missing tab icons for Send Money and History tabs by adding Material Icons mappings

## Current Debugging Steps

- ✅ Removed explore tab completely (was causing import issues)
- ✅ Temporarily removed TabBarBackground component
- ✅ Temporarily removed HapticTab component
- ✅ Removed useGraphQL dependencies from send-money tab
- ✅ Removed useGraphQL dependencies from transaction-history tab
- ✅ Removed GraphQL dependencies from AuthContext (replaced with AsyncStorage)
- ✅ Removed TransactionService dependencies from all files
- ✅ Fixed all import errors and linter issues
- 🔄 Testing if completely cleaned app resolves the import error

## Next Steps (Potential Enhancements)

1. ✅ GraphQL backend implementation
2. Push notifications for transaction updates
3. Biometric authentication
4. QR code scanning for recipients
5. International currency conversion
6. Transaction limits and security features
7. Contact list integration
8. Payment scheduling
9. Analytics and reporting
10. Multi-language support
