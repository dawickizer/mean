import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { OnJoinCommand, OnLeaveCommand } from "../command/user-traffic.command";
import { Game } from "../schema/game.schema";

export class GameRoom extends Room {

  dispatcher = new Dispatcher(this);

  onCreate(options: any) {
    this.setState(new Game());
    this.onMessage('input', (client, message) => {
      console.log(message);
      this.broadcast('input', message);
    });
  }

  onJoin(client: Client, options: any) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      username: options.username,
      sessionId: client.sessionId
    });
  }

  onLeave(client: Client, consented: boolean) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client: client
    });

  }

  onDispose() {}

}
