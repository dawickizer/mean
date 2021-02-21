import { Command } from "@colyseus/command";
import { Game } from '../schema/game.schema'

export class UserInputCommand extends Command<Game, {
    message: string
}> {
    
  execute({ message }: any) {
    console.log(message);
    this.room.broadcast('input', message);
  }

}