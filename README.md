#Among Us Code Hider
This application consists of 2 programs, one is a Unity Assets Bundle Extractor mod installer that patches Among Us v2020.12.9's assets so that instead of seeing a code, you'll see <REDACTED>. The other program will start a web server that will show the room code. This second program uses the same code that Crewlink uses to discover the current game state.

##Installation
1. Download the latest version from [releases](https://github.com/proEndreeper/AmongUsCodeHider/releases)
2. Extract AmongUsCodeHider.zip.
3. Run AmongUsCodeHider.exe (you may need to select the path to Among Us's root directory)
	- To find Among Us's root directory, you can right click on Among Us in your Steam library and click on **Manage -> Browse local files**
4. Copy .env.example to .env and modify the port to an unused port, by default it will be set to 8080.
5. Run AmongUsCodeViewer.exe to launch a web server to display your room code.
6. Launch a browser and go to the url listed in the console of AmongUsCodeViewer

##Credits
[ottomated](https://github.com/ottomated) for CrewLink's GameReader, interfaces and some functions from the game hook script (hook.ts), as well as the offsets used by Crewlink to determine the game state and room code.

[u/Vinzlr](https://www.reddit.com/user/Vinzlr) for the banner image packaged with AmongUsCodeDisplay.
