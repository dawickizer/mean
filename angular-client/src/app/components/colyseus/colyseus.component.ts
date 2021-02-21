// Angular
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from 'src/app/models/player/player';
import { environment } from 'src/environments/environment';

// Colyseus
import * as Colyseus from 'colyseus.js';
import { exists } from 'src/app/utilities/username.utility';

// Babylonjs
import * as BABYLON from "@babylonjs/core";

@Component({
  selector: 'app-colyseus',
  templateUrl: './colyseus.component.html',
  styleUrls: ['./colyseus.component.css']
})
export class ColyseusComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  camera: BABYLON.UniversalCamera;
  light: BABYLON.HemisphericLight;
  ground: BABYLON.Mesh;
  playerViews: {[id: string]: BABYLON.Mesh} = {};

  username: string = '';
  client: Colyseus.Client;
  room: Colyseus.Room;

  constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    
    this.getUserName();
    this.defineUserInputs();
    await this.connectToServer();

    this.createScene();
    this.render();
  }

  ngAfterViewInit() {
    
  }

  getUserName() {
    this.route.queryParams.subscribe(params => this.username = exists(params['username']));
  }

  async connectToServer() {
    this.client = new Colyseus.Client(environment.COLYSEUS_ENDPOINT);
    this.room = await this.client.joinOrCreate('game_room', {username: this.username});

    this.room.onStateChange((state) => {
      console.log(state.toJSON());
    });

    this.room.state.players.onAdd = (player, key) => {
      // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
      this.playerViews[key] = BABYLON.Mesh.CreateSphere("sphere", 16, 2, this.scene);

      // Move the sphere upward 1/2 its height
      this.playerViews[key].position.set(player.position.x, player.position.y, player.position.z);

      // Update player position based on changes from the server.
      player.position.onChange = () => {
          this.playerViews[key].position.set(player.position.x, player.position.y, player.position.z);
      };

      // Set camera to follow current player
      if (key === this.room.sessionId) {
          this.camera.setTarget(this.playerViews[key].position);
      }
    };

    this.room.state.players.onRemove = (player, key) => {
      this.scene.removeMesh(this.playerViews[key]);
      delete this.playerViews[key];
    } ;

    this.room.onMessage('user-joined', (message) => {
      console.log(message);
    });

    this.room.onMessage('user-left', (message) => {
      console.log(message);
    });

    this.room.onMessage('user-input', (message) => {
      console.log(message);
    });

    this.room.onError((code, message) => console.log(`Error in room ${this.room.name}`));
    this.room.onLeave((code) => {});
  }

  defineUserInputs() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {

      switch(event.code) {
        case 'KeyW':
          this.room.send('user-input', `${this.username} is moving forward`);
          break;
        case 'KeyA':
          this.room.send('user-input', `${this.username} is moving left`);
          break;
        case 'KeyS':
          this.room.send('user-input', `${this.username} is moving backward`);
          break;
        case 'KeyD':
          this.room.send('user-input', `${this.username} is moving right`);
          break;
        case 'ShiftLeft':
          this.room.send('user-input', `${this.username} is sprinting`);
          break;
        case 'Space':
          this.room.send('user-input', `${this.username} is jumping`);
          break;
        case 'KeyR':
          this.room.send('user-input', `${this.username} is reloading`);
          break;
      }
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {

      switch(event.code) {
        case 'KeyW':
          this.room.send('user-input', `${this.username} stopped moving forward`);
          break;
        case 'KeyA':
          this.room.send('user-input', `${this.username} stopped moving left`);
          break;
        case 'KeyS':
          this.room.send('user-input', `${this.username} stopped moving backward`);
          break;
        case 'KeyD':
          this.room.send('user-input', `${this.username} stopped moving right`);
          break;
        case 'ShiftLeft':
          this.room.send('user-input', `${this.username} stopped sprinting`);
          break;
      }
    });

    document.addEventListener('pointerdown', (event: PointerEvent) => {

      switch(event.button) {
        case 0:
          this.room.send('user-input', `${this.username} is firing weapon`);
          break;
        case 2:
          this.room.send('user-input', `${this.username} is aiming down sight`);
          break;
      }
    });

    document.addEventListener('pointerup', (event: PointerEvent) => {

      switch(event.button) {
        case 0:
          this.room.send('user-input', `${this.username} stopped firing weapon`);
          break;
        case 2:
          this.room.send('user-input', `${this.username} stopped aiming down sight`);
          break;
      }
    });

  }

  createScene() {
    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.camera = new BABYLON.UniversalCamera('universalCamera', new BABYLON.Vector3(0, 5, -30), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);
    this.scene.activeCamera = this.camera; 
    this.ground = BABYLON.Mesh.CreateGround("ground", 10, 10, 2, this.scene);
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  handleWindowResize() {
    window.addEventListener('resize', () => this.engine.resize());   
  }

  ngOnDestroy() {
    console.log('Disposing scene')
    this.scene.dispose();
  }

}
