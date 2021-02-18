import { Schema, type } from '@colyseus/schema';

export class Player extends Schema {

  @type('string')
  username: string;

  @type('string')
  sessionId: string;

}