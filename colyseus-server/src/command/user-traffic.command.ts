import { Client } from "colyseus";
import { Command } from "@colyseus/command";
import { Game } from '../schema/game.schema'
import { Player } from '../schema/player.schema'

export class OnJoinCommand extends Command<Game, {
    username: string,
    sessionId: string
}> {
    
  execute({ username, sessionId }: any) {
    let player: Player = new Player();
    player.username = username;
    player.sessionId = sessionId;
    player.position.x = 0;
    player.position.y = Math.floor(Math.random() * 20) + 1;
    player.position.z = 0;
    this.state.players.set(sessionId, player);
    this.room.broadcast('user-joined', `${player.username} joined room: ${this.room.roomId} with session: ${player.sessionId}`);
  }

}

export class OnLeaveCommand extends Command<Game, {
    client: Client
}> {
    
  execute({ client }: any) {
    let player = this.state.players.get(client.sessionId);
    this.room.broadcast('user-left', `${player.username} left room: ${this.room.roomId} with session: ${player.sessionId}`);
    this.state.players.delete(client.sessionId);
  }
}