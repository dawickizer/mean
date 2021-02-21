import { Schema, MapSchema, type } from '@colyseus/schema';
import { Player } from './player.schema';

export class Game extends Schema {

  @type({map: Player})
  players = new MapSchema<Player>();

}