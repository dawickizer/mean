import { Schema, ArraySchema, type } from '@colyseus/schema';
import { Player } from './player';

export class Game extends Schema {

  @type([Player])
  players = new ArraySchema<Player>();

}