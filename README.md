# Among Us Code Hider
This application consists of 2 programs, one is a Unity Assets Bundle Extractor mod installer that patches Among Us v2020.12.9's assets so that instead of seeing a code, you'll see <REDACTED>. The other program will start a web server that will show the room code. This second program uses the same code that Crewlink uses to discover the current game state.

## Requirements
* Among Us (duh!)
* 64-bit Windows
* A web browser

## Installation
1. Download the latest version from [releases](https://github.com/proEndreeper/AmongUsCodeHider/releases)
2. Extract AmongUsCodeHider.zip.
3. Run AmongUsCodeHider.exe (you may need to select the path to Among Us's root directory)
	- To find Among Us's root directory, you can right click on Among Us in your Steam library and click on **Manage -> Browse local files**
4. Copy .env.example to .env and modify the port to an unused port, by default it will be set to 8080.
5. Run AmongUsCodeViewer.exe to launch a web server to display your room code.
6. Launch a browser and go to the url listed in the console of AmongUsCodeViewer

## Development

### Among Us Code Viewer
1. Clone the git repository
2. In the among-us-code-viewer directory, run `npm install` to install packages for development
3. While developing, `npm run dev` will monitor changes in the src directory, and relaunch the development environment whenever modifications are made.
4. To package as an executable, `npm run compile` will compile a Windows 64-bit executable

### Among Us Code Hider
1. Install [Unity Assets Bundle Extractor](https://github.com/DerPopo/UABE/releases/tag/2.2stabled)
2. If making changes to the existing mod, load the mod file (AmongUsCodeViewer.emip) otherwise File -> Open and choose Among Us's sharedassets0.assets file.
3. Select the latest type database in the list.
4. Sort by Name, then find the asset named "English", and export a dump of this file.
5. Open the exported dump file in your favorite text editor, and find RoomCode, in the file.
6. Replace everything up to the `\r\n` with `Code\\n<REDACTED>\\n\\n\\n\\n`. This will cause Among Us to render the lobby code below the screen, thereby hiding the room code from a stream.

## Credits
[ottomated](https://github.com/ottomated) for CrewLink's GameReader, interfaces and some functions from the game hook script (hook.ts), as well as the offsets used by Crewlink to determine the game state and room code.

[u/Vinzlr](https://www.reddit.com/user/Vinzlr) for the banner image packaged with AmongUsCodeViewer.

[UABE](https://github.com/DerPopo/UABE/releases/tag/2.2stabled) is used for AmongUsCodeHider.
