# Expo T2 - React Native App with Material Tabs 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Features

- **Material Top Tabs Navigation** - Seamless navigation between "Me" and "My Team" views
- **Role-based Authentication** - Admin and Employee user types with different permissions
- **Synchronized Tab State** - Tab selection persists across Home and Timecard screens
- **Modern UI Components** - Built with React Native and Expo
- **Persistent Storage** - User preferences saved locally with AsyncStorage

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Login Credentials

- **Employee**: username: `user`, password: `password`
- **Admin**: username: `admin`, password: `password`

## Project Structure

- `src/screens/` - Main application screens
- `src/navigation/` - Navigation configuration
- `components/ui/` - Reusable UI components and contexts
- `assets/` - Images and static resources

## App Features

### Authentication
- Login screen with role-based access
- Employee users see simplified views
- Admin users get full access to team management features

### Navigation
- Bottom tab navigation (Home, My Schedule, Time Cards, Menu)
- Material top tabs within Home and Timecard screens
- Synchronized tab state across screens
- Child navigation support with state preservation

### Tab Synchronization
- Select "My Team" in Home → automatically shows "My Team" in Timecard
- Tab selection persists during navigation
- Automatic reset to "Me" tab on login

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src** directory. This project uses [React Navigation](https://reactnavigation.org/) for navigation.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
