# Angular YouTube Clone

[![Angular](https://img.shields.io/badge/Angular-20.2.0-dd0031.svg?style=flat&logo=angular)](https://angular.io/)
[![Nx](https://img.shields.io/badge/Nx-21.5.3-143055.svg?style=flat&logo=nx)](https://nx.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-007acc.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> A modern, feature-rich YouTube clone built with latest Angular 20

---

## ✨ Overview

Experience YouTube reimagined with modern web technologies! This project showcases a full-featured video platform built with Angular 20, featuring server-side rendering, modular architecture, and enterprise-grade development practices. Perfect for learning modern Angular patterns or building your own video platform.

## 🎯 Key Highlights

- 🚀 **Latest Angular 20** with standalone components and signals
- 🏗️ **Enterprise Architecture** using Nx monorepo and domain-driven design
- 🎥 **Custom Video Player** with theater mode, PiP, and keyboard controls
- � **Full Playlist Support** with YouTube playlist loading and management
- �🔐 **Social Authentication** with Google OAuth integration
- 🌐 **SSR Support** for better SEO and performance
- 📱 **Responsive Design** with Angular Material and TailwindCSS
- 🔒 **Privacy-Focused** using Invidious backend proxy

## 🚀 Features

### 🔍 **Content Features**

- **Video Details Page**: Comprehensive video information display
- **Video Recommendations**: Related videos and suggestions
- **Video Playlists**: YouTube playlist support with loading, auto-scrolling, and automatic next video playback
- **Search Functionality**: Video search with suggestions
- **Home Page**: Grid layout for video browsing
- **Video Categories**: Organized content categorization
- **External Navigation**: Safe external link handling

### 🎬 **Video Player**

- **Custom Video Player**: Native HTML5 video player with YouTube-like controls
- **Theater & Default View Modes**: Toggle between regular and theater (wide) viewing modes
- **Picture-in-Picture**: Built-in PiP support for multitasking
- **Keyboard Controls**: Arrow keys for seeking, spacebar for play/pause
- **Auto-Next**: Automatic video progression with toggle control
- **Audio & Video Sync**: Separate audio/video streams with perfect synchronization
- **Volume Control**: Mute/unmute with visual feedback
- **Progress Bar**: Interactive seeking with visual progress indicators
- **Fullscreen Support**: Native fullscreen mode with custom controls

### 🎨 **User Interface**

- **Material Design**: Angular Material components with custom styling
- **Responsive Layout**: Adaptive design for desktop and laptop
- **Sidebar Navigation**: Collapsible sidebar with mini-sidebar mode
- **Fixed Header**: Sticky header with blur backdrop effect
- **Dark Theme**: YouTube-inspired dark color scheme
- **Loading States**: Skeleton screens and loading indicators
- **Smart Playlist**: Auto-scrolling playlist with selected video highlighting

### 🔐 **Authentication**

- **Social Login**: Google OAuth integration
- **User Profiles**: Social user management
- **Session Handling**: Secure authentication state management

## ⚡ Technology Stack

- **Framework**: Angular 20 with standalone components
- **Build Tool**: Nx 21 monorepo workspace
- **State Management**: NgRx Signals 20
- **UI Library**: Angular Material 20
- **Styling**: TailwindCSS
- **Testing**: Vitest + Playwright
- **Server**: Express.js for SSR
- **Language**: TypeScript 5.9 with strict mode
- **Backend**: Invidious API integration

## 📁 Project Structure

The application follows a modular, domain-driven architecture:

```text
modules/
├── details-page/       # Video details and player functionality
│   ├── data-access/    # State management and data services
│   ├── feature/        # Smart components and routing
│   └── ui/             # Presentational components
├── header/             # Application header and navigation
├── home-page/          # Main landing page with video grid
├── search-page/        # Search functionality and results
├── shared/             # Shared components, services, and utilities
├── shell/              # Application shell and layout
└── sidebar/            # Sidebar navigation and menu
```

Each feature module is organized with:

- **`feature/`** - Smart components, containers, and routing
- **`ui/`** - Presentational components and UI elements
- **`data-access/`** - State management, services, and data models

## 🏗️ Architecture Principles

This project follows modern Angular best practices:

- **Standalone Components**: No NgModules, using standalone components
- **Modular Design**: Domain-driven architecture using Nx workspace
- **Lazy Loading**: Route-based code splitting for optimal performance
- **Signal-based State**: Reactive state management with NgRx Signals
- **OnPush Change Detection**: Optimized performance
- **Functional Guards**: Router guards using functional approach
- **Native Control Flow**: Using `@if`, `@for`, `@switch` instead of structural directives
- **Reactive Forms**: Form handling with reactive patterns
- **SSR Support**: Server-side rendering with hydration (optional)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/ngiakhanh96/angular-youtube.git
cd angular-youtube

# Install dependencies
npm install --legacy-peer-deps
```

### Development Server

**Client-Side Rendering (Recommended for development):**

```bash
npm run start-csr
```

**Server-Side Rendering:**

```bash
npm run start
```

The application will be available at `http://localhost:4200/`

### Building for Production

```bash
# Client-Side Rendering (Recommended)
npm run build-csr

# Server-Side Rendering
npm run build

# GitHub Pages (with base href)
npm run build-ghp
```

## 🧪 Testing & Quality

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific projects
npx nx test [project-name]

# Run E2E tests
npx nx e2e e2e
```

### Development Tools

```bash
# View available commands
npx nx show project angular-youtube

# Run specific targets
npx nx [target] [project-name]

# Lint the codebase
npx nx lint angular-youtube
```

## 🔧 Backend Setup

This application integrates with Invidious as a privacy-friendly YouTube backend proxy.

### Invidious Setup

Follow the [official Invidious installation guide](https://docs.invidious.io/installation/#docker-compose-method-production).

**Quick setup with Docker Compose:**

```yaml
# docker-compose.yml
version: '3'
services:
  invidious:
    image: quay.io/invidious/invidious:latest
    # image: quay.io/invidious/invidious:latest-arm64 # ARM64/AArch64 devices
    restart: unless-stopped
    # Remove "127.0.0.1:" if used from an external IP
    ports:
      - '127.0.0.1:3000:3000'
    environment:
      # Please read the following file for a comprehensive list of all available
      # configuration options and their associated syntax:
      # https://github.com/iv-org/invidious/blob/master/config/config.example.yml
      INVIDIOUS_CONFIG: |
        db:
          dbname: invidious
          user: kemal
          password: kemal
          host: invidious-db
          port: 5432
        check_tables: true
        invidious_companion:
        # URL used for the internal communication between invidious and invidious companion
        # There is no need to change that except if Invidious companion does not run on the same docker compose file.
        - private_url: "http://companion:8282/companion"
        # IT is NOT recommended to use the same key as HMAC KEY. Generate a new key!
        # Use the key generated in the 2nd step
        invidious_companion_key: "aePh1eiNghoht7Oh"
        # external_port:
        # domain:
        # https_only: false
        # statistics_enabled: false
        # Use the key generated in the 2nd step
        hmac_key: "MooXae4pu3Vaedai"
    healthcheck:
      test: wget -nv --tries=1 --spider http://127.0.0.1:3000/api/v1/trending || exit 1
      interval: 30s
      timeout: 5s
      retries: 2
    logging:
      options:
        max-size: '1G'
        max-file: '4'
    depends_on:
      - invidious-db

  companion:
    image: quay.io/invidious/invidious-companion:latest
    environment:
      # Use the key generated in the 2nd step
      - SERVER_SECRET_KEY=aePh1eiNghoht7Oh
    restart: unless-stopped
    # Uncomment only if you have configured "public_url" for Invidious companion
    # Or if you want to use Invidious companion as an API in your program.
    # Remove "127.0.0.1:" if used from an external IP
    #ports:
    #  - "127.0.0.1:8282:8282"
    logging:
      options:
        max-size: '1G'
        max-file: '4'
    cap_drop:
      - ALL
    read_only: true
    # cache for youtube library
    volumes:
      - companioncache:/var/tmp/youtubei.js:rw
    security_opt:
      - no-new-privileges:true

  invidious-db:
    image: docker.io/library/postgres:14
    restart: unless-stopped
    volumes:
      - postgresdata:/var/lib/postgresql/data
      - ./config/sql:/config/sql
      - ./docker/init-invidious-db.sh:/docker-entrypoint-initdb.d/init-invidious-db.sh
    environment:
      POSTGRES_DB: invidious
      POSTGRES_USER: kemal
      POSTGRES_PASSWORD: kemal
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB']

volumes:
  postgresdata:
  companioncache:
```

## 📚 Learning Resources

This project is designed for learning modern Angular development patterns:

### Official Documentation

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ngiakhanh96/angular-youtube)

### Step-by-Step Tutorial

Comprehensive tutorial available at [Code2tutorial](https://code2tutorial.com/tutorial/4400c614-c8a2-4aa8-8078-ea3157683b12/08_http_services_.md)

## 📄 License

This project is available under a **dual licensing model**:

- **AGPL-3.0 License** - For open source, educational, and non-commercial use
- **Commercial License** - For commercial use (requires payment)

### Open Source Use (AGPL-3.0)

✅ Educational projects  
✅ Personal learning  
✅ Open source contributions  
✅ Non-commercial use

### Commercial Use (Paid License Required)

💰 Commercial products or services  
💰 SaaS applications  
💰 Proprietary/closed-source integration  
💰 Reselling or distributing for profit

**Need a commercial license?** Contact us for pricing and terms.

See the [LICENSE](LICENSE) file for complete details.

## 🙏 Acknowledgments

Special thanks to the amazing open-source community:

- **[Angular Team](https://angular.io/)** - For the incredible framework
- **[Nx Team](https://nx.dev/)** - For the powerful development tools
- **[Angular Material](https://material.angular.io/)** - For beautiful UI components
- **[Invidious Project](https://invidious.io/)** - For privacy-focused YouTube API alternative
- **[TailwindCSS](https://tailwindcss.com/)** - For utility-first CSS framework

### Built With Love Using

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Nx](https://img.shields.io/badge/Nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
