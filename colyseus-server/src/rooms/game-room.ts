import { Room, Client } from "colyseus";
import { Game } from "./schema/game";
import { Player } from './schema/player';

export class GameRoom extends Room {

  onCreate(options: any) {
    this.setState(new Game());
    this.onMessage('input', (client, message) => {
      console.log(message);
      this.broadcast('input', message);
    });
  }

  onJoin(client: Client, options: any) {
    let player: Player = new Player();
    player.username = options.username;
    player.sessionId = client.sessionId;
    this.state.players.push(player);
    this.broadcast('user-joined', `${player.username} joined room: ${this.roomId} with session: ${player.sessionId}`);
  }

  onLeave(client: Client, consented: boolean) {
    let index = this.state.players.findIndex((player: Player) => player.sessionId == client.sessionId);
    let player = this.state.players.splice(index)[0];
    this.broadcast('user-left', `${player.username} left room: ${this.roomId} with session: ${player.sessionId}`);
  }

  onDispose() {}

}
