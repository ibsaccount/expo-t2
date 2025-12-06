# Material Top Tabs Documentation

## Overview
The application now supports role-based Material Top Tabs in both Home and Timecard screens. These tabs provide "Me" and "My Team" views that are conditionally displayed based on user role and maintain state persistence between screens.

## Features

### Role-Based Display
- **Employee Users**: See only a simple view without tabs (username: `user`, password: `password`)
- **Admin Users**: See Material Top Tabs with "Me" and "My Team" views (username: `admin`, password: `password`)

### Tab Persistence
- Tab selection is maintained between Home and Timecard screens
- If you select "My Team" in Home, switching to Timecard will show "My Team" tab active
- Vice versa: selecting "Me" in Timecard and switching to Home will show "Me" tab active

### Visual Features
- **Tab Styling**: Material design with theme-aware colors
- **Active Indicators**: Bottom border indicator for active tab
- **Theme Integration**: Tabs respect light/dark mode settings

## Screen Implementations

### HomeScreen
- **Me Tab**: Personal dashboard with user greeting and task overview
- **My Team Tab**: Team management interface with performance overview

### TimecardScreen  
- **Me Tab**: Personal timecard with clock in/out functionality and personal time entries
- **My Team Tab**: Team timecard overview showing all team members' time entries (clock in/out disabled)

## Technical Implementation

### Components Used
1. `@react-navigation/material-top-tabs` - Material top tab navigator
2. `TabProvider` - Custom context for tab state persistence
3. `AuthProvider` - Enhanced with role-based authentication

### User Roles
```typescript
interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employee';
}
```

### Tab State Management
```typescript
interface TabContextType {
  activeTab: TabType; // 'me' | 'team'
  setActiveTab: (tab: TabType) => void;
}
```

## Testing Instructions

### Test as Employee
1. Login with: `user` / `password`
2. Navigate to Home and Timecard screens
3. Verify: NO tabs are shown, only simple content views

### Test as Admin
1. Login with: `admin` / `password`
2. Navigate to Home screen
3. Verify: "Me" and "My Team" tabs are visible
4. Switch between tabs - content changes
5. Navigate to Timecard screen  
6. Verify: Same tabs are visible with active tab preserved
7. Switch to "My Team" in Timecard
8. Navigate back to Home
9. Verify: "My Team" tab is still selected

## Key Benefits

1. **Role-Based Access Control**: Admins get team management features, employees get simplified interface
2. **Consistent UX**: Tab selection persists across screen navigation
3. **Material Design**: Professional, standard UI patterns
4. **Theme Aware**: Adapts to light/dark mode automatically
5. **Scalable**: Easy to add more tabs or screens with same pattern

## File Structure
```
src/screens/
├── HomeScreen.tsx        # Home with material tabs (role-based)
└── TimecardScreen.tsx    # Timecard with material tabs (role-based)

components/ui/
├── auth-context.tsx      # Enhanced with role support
└── tab-context.tsx       # Tab state persistence
```

## Future Enhancements
- Add more granular role permissions
- Implement team member selection in "My Team" tabs
- Add real-time data updates for team views
- Extend tab pattern to other screens (My Schedule, Menu)