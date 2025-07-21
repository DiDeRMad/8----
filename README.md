# 🌌 Cosmic Empire - Online Space Strategy Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Game Status](https://img.shields.io/badge/Status-In%20Development-blue.svg)](https://github.com)

**Cosmic Empire** is a massive multiplayer online space strategy game where players build galactic empires, explore the universe, engage in epic battles, and dominate through diplomacy, economics, or military might.

## 🚀 Features

### Core Gameplay
- **🏛️ Empire Building**: Build and manage your galactic empire with complex resource management
- **🌟 Space Exploration**: Discover new star systems, planets, and cosmic phenomena
- **⚔️ Real-time Combat**: Engage in tactical space battles with detailed ship designs
- **🔬 Technology Research**: Unlock new technologies across Physics, Engineering, and Society trees
- **🤝 Diplomacy**: Form alliances, trade agreements, and wage wars with other players
- **💰 Economic System**: Complex economy with multiple resources and galactic market
- **🏗️ Planet Management**: Colonize and develop planets with various building types
- **🚀 Fleet Management**: Design ships and manage fleets for exploration and warfare

### Technical Features
- **🌐 Multiplayer**: Supports up to 100 players per galaxy
- **⚡ Real-time Updates**: Socket.IO-powered real-time game state synchronization
- **📱 Responsive Design**: Modern, space-themed UI that works on all devices
- **🔒 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **💾 Persistent Game State**: SQLite database with auto-save functionality
- **🎨 Beautiful Graphics**: HTML5 Canvas-based galaxy visualization
- **🔊 Audio & Visual Effects**: Immersive space-themed sound and visual effects
- **📊 Performance Monitoring**: Built-in performance tracking and optimization

## 🛠️ Technology Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **SQLite** - Database
- **bcrypt** - Password hashing
- **JWT** - Authentication tokens

### Frontend
- **HTML5 Canvas** - Game visualization
- **Vanilla JavaScript** - No heavy frameworks for optimal performance
- **CSS3** - Modern styling with animations
- **Webpack** - Module bundling

### DevOps
- **Docker** (Optional) - Containerization
- **PM2** (Optional) - Process management
- **Nginx** (Optional) - Reverse proxy

## 📋 Prerequisites

Before installing Cosmic Empire, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **4GB RAM** minimum (8GB recommended for development)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/cosmic-empire/cosmic-empire-game.git
   cd cosmic-empire-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init:db
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` and start playing!

### Production Setup

1. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your production settings
   ```

2. **Build the client**
   ```bash
   npm run build
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DB_PATH=./data/cosmic_empire.db

# Security
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret
BCRYPT_ROUNDS=12

# Client
CLIENT_URL=http://localhost:3001

# Game Settings
TICK_RATE=1000
MAX_PLAYERS_PER_GALAXY=100
AUTO_SAVE_INTERVAL=60000

# Development
DEBUG=cosmic-empire:*
```

### Game Configuration

Game parameters can be adjusted in the database or through the admin interface:

- **Galaxy Size**: Number of star systems
- **Resource Generation**: Starting resources and production rates
- **Research Speed**: Technology research rate modifier
- **Combat Balance**: Ship damage and defense modifiers
- **AI Difficulty**: AI empire aggressiveness

## 🎮 How to Play

### Getting Started

1. **Create Your Empire**
   - Choose a unique username and empire name
   - Select your faction and government type
   - Pick your empire's color

2. **Learn the Interface**
   - **Top Bar**: Resources, empire info, game controls
   - **Galaxy Map**: Central game area for exploration
   - **Side Panel**: Empire management, research, diplomacy
   - **Event Log**: Important game notifications

3. **Basic Gameplay Loop**
   - Explore nearby star systems
   - Colonize habitable planets
   - Build infrastructure and fleets
   - Research new technologies
   - Interact with other empires

### Core Mechanics

#### Resources
- **💰 Credits**: Universal currency for trade and purchases
- **⚡ Energy**: Powers your empire's infrastructure
- **⛏️ Minerals**: Raw materials for construction
- **🌾 Food**: Sustains your population growth
- **🔬 Research**: Advances your technology
- **🏛️ Influence**: Diplomatic and administrative power
- **🔧 Alloys**: Advanced materials for ships and buildings

#### Technologies
- **Physics**: Energy systems, sensors, FTL travel
- **Engineering**: Ship weapons, defenses, construction
- **Society**: Government, diplomacy, administration

#### Diplomacy
- **Peace**: Default state between empires
- **Trade Agreement**: Economic cooperation
- **Non-Aggression Pact**: Military neutrality
- **Alliance**: Full cooperation and mutual defense
- **War**: Active hostilities

## 🎯 Game Modes

### Sandbox Mode
- Unlimited resources for testing and experimentation
- AI empires for practice
- All technologies unlocked

### Campaign Mode
- Guided gameplay with objectives
- Progressive difficulty
- Story-driven scenarios

### Multiplayer Mode
- Competitive gameplay with other players
- Ranked matches with leaderboards
- Custom game settings

## 🛡️ Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: All user inputs are sanitized
- **Secure Headers**: Helmet.js for security headers
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Content Security Policy
- **Authentication**: JWT tokens with refresh mechanism

## 📊 Performance

### Server Performance
- Optimized for 100+ concurrent players
- Event-driven architecture for scalability
- Efficient database queries with indexing
- Memory leak prevention and monitoring

### Client Performance
- 60 FPS target on modern browsers
- Efficient canvas rendering
- Memory usage optimization
- Progressive loading for large galaxies

## 🧪 Development

### Development Setup

1. **Install development dependencies**
   ```bash
   npm install
   ```

2. **Start development servers**
   ```bash
   # Terminal 1: Start backend with hot reload
   npm run dev

   # Terminal 2: Start client development server
   npm run dev:client
   ```

3. **Run tests**
   ```bash
   npm test
   ```

### Project Structure

```
cosmic-empire-game/
├── client/                 # Frontend application
│   ├── src/               # Source files
│   │   ├── auth/         # Authentication logic
│   │   ├── game/         # Game engine
│   │   ├── network/      # WebSocket communication
│   │   ├── ui/           # User interface
│   │   └── styles/       # CSS styles
│   └── dist/             # Built files
├── server/                # Backend application
│   ├── controllers/      # API route handlers
│   ├── core/            # Game engine core
│   ├── database/        # Database management
│   ├── entities/        # Game entities
│   ├── middleware/      # Express middleware
│   └── socket/          # WebSocket handlers
├── shared/               # Shared code between client/server
├── scripts/             # Utility scripts
├── data/               # Database and game data
└── docs/               # Documentation
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards

- Use ESLint configuration provided
- Follow conventional commit messages
- Add tests for new features
- Update documentation for API changes

## 🐛 Debugging

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Reinitialize the database
   npm run init:db
   ```

2. **Port Already in Use**
   ```bash
   # Change the port in .env or kill the process
   lsof -ti:3000 | xargs kill -9
   ```

3. **Memory Issues**
   ```bash
   # Monitor memory usage
   node --max-old-space-size=4096 server/index.js
   ```

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=cosmic-empire:* npm run dev
```

### Performance Monitoring

Access performance metrics at `/health` endpoint:
- Server uptime
- Memory usage
- Active connections
- Game state size

## 📈 Deployment

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t cosmic-empire .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 -v $(pwd)/data:/app/data cosmic-empire
   ```

### PM2 Deployment

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name cosmic-empire.game;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Game Endpoints

- `GET /api/game/state` - Get current game state
- `POST /api/game/action` - Submit game action
- `GET /api/player/profile` - Get player profile
- `GET /api/universe/systems` - Get star systems

### WebSocket Events

- `game_state_update` - Real-time game state
- `notification` - Game notifications
- `player_joined` - Player connection
- `player_left` - Player disconnection

## 🎵 Audio & Graphics

### Audio Features
- Background music with dynamic themes
- Sound effects for UI interactions
- Spatial audio for battles
- Customizable volume settings

### Visual Features
- Particle effects for explosions and energy
- Smooth animations and transitions
- Dynamic lighting effects
- Customizable UI themes

## 🌟 Roadmap

### Version 1.1 (Q2 2024)
- [ ] Advanced combat mechanics
- [ ] More ship types and designs
- [ ] Enhanced AI behavior
- [ ] Mobile app support

### Version 1.2 (Q3 2024)
- [ ] Modding support
- [ ] Custom game modes
- [ ] Tournament system
- [ ] Advanced graphics options

### Version 2.0 (Q4 2024)
- [ ] 3D galaxy visualization
- [ ] VR support
- [ ] Machine learning AI
- [ ] Blockchain integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

### Community
- **Discord**: [Join our Discord server](https://discord.gg/cosmic-empire)
- **Forum**: [Official Game Forum](https://forum.cosmic-empire.game)
- **Reddit**: [r/CosmicEmpire](https://reddit.com/r/CosmicEmpire)

### Technical Support
- **GitHub Issues**: [Report bugs and issues](https://github.com/cosmic-empire/cosmic-empire-game/issues)
- **Email**: support@cosmic-empire.game
- **Documentation**: [docs.cosmic-empire.game](https://docs.cosmic-empire.game)

## 👥 Credits

### Development Team
- **Lead Developer**: [Your Name]
- **Game Designer**: [Designer Name]
- **Frontend Developer**: [Frontend Dev Name]
- **Backend Developer**: [Backend Dev Name]

### Special Thanks
- Node.js community for excellent tools
- Socket.IO team for real-time communication
- SQLite team for reliable database
- All beta testers and contributors

## 📊 Statistics

**Lines of Code**: 200,000+
**Database Tables**: 15+
**Game Features**: 50+
**Technologies**: 100+
**Supported Players**: 100+ concurrent

---

**⭐ Star this repository if you enjoyed the game!**

**🚀 Ready to conquer the galaxy? Start your empire today!** 
