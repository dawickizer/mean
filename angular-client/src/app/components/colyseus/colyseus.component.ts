import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Colyseus from "colyseus.js";

@Component({
  selector: 'app-colyseus',
  templateUrl: './colyseus.component.html',
  styleUrls: ['./colyseus.component.css']
})
export class ColyseusComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let client = new Colyseus.Client(environment.COLYSEUS_ENDPOINT);

    console.log(client);

    client.joinOrCreate('my_room').then(room => {
      console.log(room.sessionId, 'joined', room.name);

      room.onMessage("message_type", (message) => {
        console.log(client.auth._id, "received on", room.name, message);
      });

      room.onError((code, message) => {
        console.log(client.auth._id, "couldn't join", room.name);
      });

      room.onLeave((code) => {
        console.log(client.auth._id, "left", room.name);
      });

    }).catch(e => {
      console.log('JOIN ERROR', e);
    });
  }

}
