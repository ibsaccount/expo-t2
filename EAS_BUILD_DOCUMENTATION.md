# EAS Build Configuration Documentation

## 🎯 Overview

This project is configured with Expo Application Services (EAS) for automated builds across multiple environments. The setup includes environment-specific configurations, GitHub Actions workflows, and comprehensive build profiles.

## 📁 Environment Files

### Available Environments
- **`.env.development`** - Development environment with debug features enabled
- **`.env.staging`** - Staging environment for internal testing
- **`.env.production`** - Production environment for store releases
- **`.env`** - Default fallback environment

### Environment Variables Structure
```bash
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=Expo T2
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=error
EXPO_PUBLIC_ANALYTICS_ENABLED=true
EXPO_PUBLIC_DATABASE_URL=https://database.example.com
EXPO_PUBLIC_AUTH_DOMAIN=auth.example.com
EXPO_PUBLIC_AUTH_CLIENT_ID=prod_client_id_12345
EXPO_PUBLIC_ENABLE_BETA_FEATURES=false
EXPO_PUBLIC_ENABLE_DEV_TOOLS=false
EXPO_PUBLIC_BUILD_VERSION=1.0.0
EXPO_PUBLIC_BUNDLE_IDENTIFIER=com.ibsaccount.expot2
```

## 🏗 Build Profiles

### Available Profiles in `eas.json`

| Profile | Environment | Distribution | Android | iOS | Description |
|---------|-------------|--------------|---------|-----|-------------|
| `development` | development | internal | APK (debug) | Debug + Simulator | Development builds with debug features |
| `staging` | staging | internal | APK (release) | Release | Internal testing builds |
| `staging-aab` | staging | internal | AAB (release) | Release | Android App Bundle for staging |
| `production` | production | store | APK (release) | Release | Store-ready builds |
| `production-aab` | production | store | AAB (release) | Release | Android App Bundle for store |
| `preview` | - | internal | APK | Release | Quick preview builds |
| `preview-aab` | - | internal | AAB | Release | Preview builds as AAB |

## 🚀 Usage

### Local Development

#### Start with specific environment:
```bash
# Development environment
npm run start:dev
# or manually
npm run env:dev && npm start

# Staging environment  
npm run start:staging

# Production environment
npm run start:prod
```

#### Platform-specific commands:
```bash
# Android with development env
npm run android:dev

# iOS with staging env
npm run ios:staging

# Production environment
npm run android:prod
```

### EAS Builds

#### Direct EAS Commands:
```bash
# Development builds
npm run build:dev
npm run build:dev:android
npm run build:dev:ios

# Staging builds
npm run build:staging
npm run build:staging:android
npm run build:staging:aab    # Android App Bundle

# Production builds
npm run build:prod
npm run build:prod:android
npm run build:prod:aab       # Android App Bundle for Play Store

# Preview builds
npm run build:preview
npm run build:preview:aab
```

#### Manual EAS Commands:
```bash
# Build with specific profile
eas build --profile staging --platform android

# Build both platforms
eas build --profile production --platform all

# Build and wait for completion
eas build --profile production --wait
```

## 🤖 GitHub Actions Workflow

### Automated Builds

The workflow (`.github/workflows/eas-build.yml`) provides:

1. **Manual Trigger** with options to select:
   - Environment (development/staging/production)
   - Platform (android/ios/all)
   - Build type (apk/aab for Android)
   - Custom build profile (optional)

2. **Automatic Triggers**:
   - Push to `main` or `develop` branches
   - Pull requests to `main` branch

### Workflow Features

- ✅ Environment validation
- ✅ Automatic profile selection based on inputs
- ✅ Support for both APK and AAB builds
- ✅ Build logs upload on failure
- ✅ Comprehensive build summary
- ✅ Environment variable management

### Setting Up GitHub Actions

1. **Create Expo Access Token**:
   - Go to [Expo Dashboard](https://expo.dev/accounts/[your-account]/settings/access-tokens)
   - Create a new token with appropriate permissions

2. **Add GitHub Secret**:
   - Go to your repository: `https://github.com/ibsaccount/expo-t2/settings/secrets/actions`
   - Add new secret: `EXPO_TOKEN` with your Expo access token

3. **Trigger Manual Build**:
   - Go to Actions tab in your repository
   - Select "EAS Build" workflow
   - Click "Run workflow"
   - Choose your options and run

### Workflow Inputs

| Input | Options | Description |
|-------|---------|-------------|
| Environment | development/staging/production | Target environment configuration |
| Platform | android/ios/all | Build platform selection |
| Build Type | apk/aab | Android build format (ignored for iOS) |
| Profile | (optional) | Custom build profile override |

## 🔧 Configuration Files

### `app.json`
Updated with:
- Bundle identifiers for iOS/Android
- Build numbers and version codes
- Permissions and platform-specific settings
- Runtime version for updates

### `eas.json`
Contains:
- Multiple build profiles for different scenarios
- Platform-specific build configurations
- Distribution settings (internal/store)
- Environment variable mappings

## 📱 Build Artifacts

### Android
- **APK**: Direct installation file for testing
- **AAB**: Android App Bundle for Play Store distribution

### iOS
- **IPA**: iOS application archive for App Store or TestFlight

## 🔐 Environment Security

- Environment files are included in repository for transparency
- Sensitive values should use placeholder text
- Override sensitive variables using EAS Secrets for builds
- Local `.env.local` files are gitignored

### Using EAS Secrets
```bash
# Set build-time secrets
eas secret:create --scope project --name API_SECRET --value your_secret_value
eas secret:create --scope account --name GLOBAL_SECRET --value global_value
```

## 🚨 Important Notes

1. **Bundle Identifiers**: Update in both `app.json` and environment files
2. **Apple Team ID**: Required for iOS builds and submissions
3. **Store Configuration**: Update submission settings in `eas.json`
4. **Dependencies**: Ensure EAS CLI is up to date (`npm install -g @expo/cli`)

## 📞 Troubleshooting

### Common Issues

1. **Build Fails**: Check EAS build logs and environment variables
2. **Wrong Environment**: Ensure correct `.env.*` file is being used
3. **Platform Errors**: Verify platform-specific settings in `eas.json`
4. **Secrets Missing**: Add required secrets to EAS or GitHub

### Debug Commands
```bash
# Check EAS configuration
eas config

# Validate build configuration
eas build --dry-run

# Check project status
eas project:info
```

## 📚 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [GitHub Actions with Expo](https://docs.expo.dev/build/building-on-ci/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)