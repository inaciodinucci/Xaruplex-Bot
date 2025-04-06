![Discord Bot](https://img.shields.io/badge/discord-bot-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A powerful and feature-rich Discord music bot made for my personal server with support for multiple music sources, customizable player settings, and voice channel management.

## THIS BOT IS MADE IN BRAZILLIAN PORTUGUESE, AND IT HAS A STRONG VOCABULARY. Don't mind the cursed words!


## Features

- **Multi-Platform Music Support**:
  - YouTube
  - Spotify
  - SoundCloud
  - Deezer

- **Advanced Player Controls**:
  - Play/Pause
  - Skip/SkipTo
  - Queue management
  - Seek within tracks
  - Volume control
  - Autoplay functionality

- **User Customization**:
  - Individual user preferences
  - Server-wide settings
  - Customizable search engine preference
  - Player message styles

- **Radio Stations**: Play your favorite radio stations directly in Discord

- **High-Quality Audio**: Using Lavalink for superior audio streaming quality

- **Flexible Deployment**: Works with either Lavalink or Discord Player backends

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB database
- Discord Bot Token
- (Optional) Lavalink server

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/Xaruplex-Music-Bot.git
   cd Xaruplex-Music-Bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Discord bot token, MongoDB URI, and other required fields

4. Start the bot:
   ```bash
   npm start
   ```

### Lavalink Configuration (Recommended)

For the best audio quality, set up a Lavalink server:

1. Set `LAVALINK=true` in your `.env` file
2. Configure your Lavalink server details in `LAVALINK_URI`
3. Run `npm run publicLavalinkServers` to get a list of public Lavalink servers if you don't want to host your own

## Commands

### Music Commands
- `/play <song name or URL>` - Play a song or playlist
- `/pause` - Pause the current playback
- `/skip` - Skip to the next track
- `/skipto <position>` - Skip to a specific position in the queue
- `/queue` - View the current queue
- `/seek <time>` - Seek to a specific position in the current track
- `/info` - Display information about the current track
- `/disconnect` - Disconnect the bot from the voice channel
- `/radio` - Play from various radio stations
- `/autoplay` - Toggle autoplay functionality
- `/playersettings` - Configure personal player settings

## Player Settings

Users can customize their experience with:
- Default volume level
- Preferred search engine
- Now Playing message style
- Link conversion options

Server administrators can set server-wide defaults for new users.

## Development

### Useful Scripts
- `npm start` - Start the bot
- `npm run guildList` - List all guilds the bot is in
- `npm run debug` - Run in debug mode
- `npm run publicLavalinkServers` - Get a list of public Lavalink servers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Dinucci](https://github.com/inaciodinucci)

## Support

If you encounter any issues or have suggestions, please open an issue on the GitHub repository.
