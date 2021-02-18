import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as Colyseus from 'colyseus.js';
import { exists } from 'src/app/utilities/username.utility';

@Component({
  selector: 'app-colyseus',
  templateUrl: './colyseus.component.html',
  styleUrls: ['./colyseus.component.css']
})
export class ColyseusComponent implements OnInit {

  username: string = '';
  client: Colyseus.Client;
  room: Colyseus.Room;

  constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    
    this.getUserName();
    this.defineUserInputs();
    await this.connectToServer();
  }

  getUserName() {
    this.route.queryParams.subscribe(params => this.username = exists(params['username']));
  }

  async connectToServer() {
    this.client = new Colyseus.Client(environment.COLYSEUS_ENDPOINT);

    this.room = await this.client.joinOrCreate('game_room', {username: this.username});

    this.room.onStateChange((state) => {
      console.log(state);
    });

    this.room.onMessage('user-joined', (message) => {
      console.log(message);
    });

    this.room.onMessage('user-left', (message) => {
      console.log(message);
    });

    this.room.onMessage('input', (message) => {
      console.log(message);
    });

    this.room.onError((code, message) => console.log(`Error in room ${this.room.name}`));
    this.room.onLeave((code) => {});
  }

  defineUserInputs() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {

      switch(event.code) {
        case 'KeyW':
          this.room.send('input', `${this.username} is moving forward`);
          break;
        case 'KeyA':
          this.room.send('input', `${this.username} is moving left`);
          break;
        case 'KeyS':
          this.room.send('input', `${this.username} is moving backward`);
          break;
        case 'KeyD':
          this.room.send('input', `${this.username} is moving right`);
          break;
        case 'ShiftLeft':
          this.room.send('input', `${this.username} is sprinting`);
          break;
        case 'Space':
          this.room.send('input', `${this.username} is jumping`);
          break;
        case 'KeyR':
          this.room.send('input', `${this.username} is reloading`);
          break;
      }
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {

      switch(event.code) {
        case 'KeyW':
          this.room.send('input', `${this.username} stopped moving forward`);
          break;
        case 'KeyA':
          this.room.send('input', `${this.username} stopped moving left`);
          break;
        case 'KeyS':
          this.room.send('input', `${this.username} stopped moving backward`);
          break;
        case 'KeyD':
          this.room.send('input', `${this.username} stopped moving right`);
          break;
        case 'ShiftLeft':
          this.room.send('input', `${this.username} stopped sprinting`);
          break;
      }
    });

    document.addEventListener('pointerdown', (event: PointerEvent) => {

      switch(event.button) {
        case 0:
          this.room.send('input', `${this.username} is firing weapon`);
          break;
        case 2:
          this.room.send('input', `${this.username} is aiming down sight`);
          break;
      }
    });

    document.addEventListener('pointerup', (event: PointerEvent) => {

      switch(event.button) {
        case 0:
          this.room.send('input', `${this.username} stopped firing weapon`);
          break;
        case 2:
          this.room.send('input', `${this.username} stopped aiming down sight`);
          break;
      }
    });

  }

}
