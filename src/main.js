import Phaser from "phaser";
import MainScene, { WORLD_W, WORLD_H } from "./scenes/MainScene.js";
import { initThoughtBook } from "./ui/thoughtBook.js";
import { initCombinationTable } from "./ui/combinationTable.js";
import { initInventory } from "./ui/inventory.js";
import { initGarden } from "./ui/garden.js";

initThoughtBook();
initCombinationTable();
initInventory();
initGarden();

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#1b1b1b",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WORLD_W,
    height: WORLD_H,
  },
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [MainScene],
});
