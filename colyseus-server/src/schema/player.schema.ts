import { Schema, type } from '@colyseus/schema';
import { Position } from './position.schema'

export class Player extends Schema {

  @type('string')
  username: string;

  @type('string')
  sessionId: string;

  @type(Position)
  position: Position = new Position();

}