import { setUpMicrophone, getMicVolume } from "./MicVolume";
import * as PIXI from "pixi.js";

setUpMicrophone();

import birdImage from "./assets/bird.png";

const app = new PIXI.Application();

document.body.appendChild(app.view);

let bird;

const setup = (loader, resources) => {
  bird = new PIXI.Sprite(resources.bird.texture);

  bird.width = 36 * 2;
  bird.height = 28 * 2;
  bird.anchor.set(0.5, 0.5);
  bird.position.set(app.renderer.width / 2, app.renderer.height / 2);
  app.stage.addChild(bird);

  app.ticker.add(delta => gameLoop(delta));
};

PIXI.loader.add("bird", birdImage).load(setup);

const gameLoop = delta => {
  bird.vy = 4.5;
  bird.vy -= getMicVolume() / 5;
  bird.y += bird.vy;

  if (bird.y < 0) {
    bird.y = 0;
  }

  if (bird.y > app.renderer.height) {
    // die
    bird.y = app.renderer.height;
  }
};