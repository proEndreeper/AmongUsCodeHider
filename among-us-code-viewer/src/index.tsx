import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { Server as SocketServer, Socket } from "socket.io";

import { GameState, AmongUsState, Player } from './CrewLink/src/common/AmongUsState';
import GameReader from './CrewLink/src/main/GameReader';

import { existsSync, readFileSync } from 'fs';

import path, { resolve } from 'path';
import yml from 'js-yaml';
import { IOffsets } from "./CrewLink/src/main/IOffsets";

// Modified version of loadOffsets from CrewLink/src/main/hook.ts
async function loadOffsets(emit: (event: string, ...args: unknown[]) => void): Promise<IOffsets | undefined> {

  const valuesFile = resolve((process.env.LOCALAPPDATA || '') + 'Low', 'Innersloth/Among Us/Unity/6b8b0d91-4a20-4a00-a3e4-4da4a883a5f0/Analytics/values');
  let version = '';
  if (existsSync(valuesFile)) {
    try {
      const json = JSON.parse(readFileSync(valuesFile, 'utf8'));
      version = json.app_ver;
    } catch (e) {
      emit('error', `Couldn't determine the Among Us version - ${e}. Try opening Among Us and then restarting AmongUsCodeDisplay.`);
      return;
    }
  } else {
    emit('error', 'Couldn\'t determine the Among Us version - Unity analytics file doesn\'t exist. Try opening Among Us and then restarting AmongUsCodeDisplay.');
    return;
  }

  let offsetpath: string = `${resolve(__dirname)}/offsets/${version}.yml`;

  if(existsSync(`${resolve(process.cwd())}/offsets/${version}.yml`)) {
    offsetpath = `${resolve(process.cwd())}/offsets/${version}.yml`;
  }

  let data: string;
  try {
    data = readFileSync(offsetpath,{encoding:"utf8"});
  } catch (e) {
    emit('error', 'Couldn\'t load offsets for the current version. Check to see if AmongUsCodeDisplay is up to date!');
    console.error(e);
    return;
  }

  const offsets: IOffsets = yml.safeLoad(data) as unknown as IOffsets;
  try {
    if (!version) {
      emit('error', 'Couldn\'t determine the Among Us version. Try opening Among Us and then restarting CrewLink.');
      return;
    } 
    return offsets;
  } catch (e) {
    console.error(e);
    emit('error', `Couldn't parse the latest game offsets: ${offsetpath}.\n${e}`);
    return;
  }

}

let gameRunning: boolean = false;
let gameState: AmongUsState = {} as AmongUsState;

const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 8080; // default port to listen

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    // render the index template
    res.render( "index" );
} );

app.get( "/banner.png", (req, res) => {
  if(existsSync(resolve(process.cwd(),"banner.png"))) {
    res.sendFile(resolve(process.cwd(),"banner.png"));
  } else {
    res.sendFile(resolve(__dirname,"banner.png"));
  }
});

let io = new SocketServer(http);

io.on("connection", (socket: Socket) => {
  console.log("a user connected!");
  socket.emit('game_state',{
                gameRunning,
                gameState: {
                  lobbyCode: gameState.lobbyCode
                }
              });
});

// start the express server
http.listen( port, '0.0.0.0', async () => {
    let ip:string = "127.0.0.1";
    try {
      ip = (await require('dns').promises.lookup(require('os').hostname())).address;
    } catch(err)
    {
      console.log("Failed to lookup ip address for local machine, provided address below will only function on local machine.");
    }

    console.log( `server started at http://${ ip }:${ port }` );


    loadOffsets(io.emit).then((offsets: IOffsets | undefined)=>{
      if(offsets == undefined) {
        console.error("Failed to retrieve offsets!");
        process.exit(1);
      }
      const gameReader = new GameReader(
        (event: string, ...args: unknown[]) => {
          if(event=="gameState") {
            gameState = args[0] as AmongUsState;
          } else if(event=="gameOpen") {
            gameRunning = args[0] as boolean;
          }
          io.emit('game_state',{
            gameRunning,
            gameState: {
              lobbyCode: gameState.lobbyCode
            }
          });
      },offsets);
      const frame = () => {
        try {
          gameReader.loop();
        } catch(err)
        {
          console.error(err);
        }
        setTimeout(frame, 1000 / 20);
      };
      frame();
    });
} );