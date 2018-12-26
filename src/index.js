import { setUpMicrophone, getMicVolume } from "./MicVolume";
import * as PIXI from "pixi.js";
import birdImage from "./assets/bird.png";

setUpMicrophone();

const app = new PIXI.Application();
// Times in ms
const MICROPHONE_SCALE = 1 / 5;
const INITIAL_PILLAR_SPAWN_INTERVAL = 1000;
const GRAVITY_VELOCITY = 4.5;

let nextPillarSpawnTime = 0;
let averagePillarSpawnInterval = INITIAL_PILLAR_SPAWN_INTERVAL;
let pillarCount = 0;
document.body.appendChild(app.view);

let bird;

const setupBird = (loader, resources) => {
  bird = new PIXI.Sprite(resources.bird.texture);

  bird.width = 36 * 2;
  bird.height = 28 * 2;
  bird.anchor.set(0.5, 0.5);
  bird.position.set(app.renderer.width / 2, app.renderer.height / 2);
  app.stage.addChild(bird);

  app.ticker.add(delta => gameLoop(delta));
};

PIXI.loader.add("bird", birdImage).load(setupBird);

const birdLogic = delta => {
  const boostFromSoundInput = getMicVolume() * MICROPHONE_SCALE * delta;

  bird.vy = GRAVITY_VELOCITY - boostFromSoundInput;
  bird.y += bird.vy;

  if (bird.y < 0) {
    bird.y = 0;
  }

  if (bird.y > app.renderer.height) {
    // die
    bird.y = app.renderer.height;
  }
};

const gameLoop = (delta, ctx) => {
  birdLogic(delta);
  const timeElapsed = app.ticker.lastTime;
  if (timeElapsed > nextPillarSpawnTime) {
    nextPillarSpawnTime = timeElapsed + averagePillarSpawnInterval;
    pillarCount++;
  }
};
