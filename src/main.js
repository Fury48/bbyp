import Phaser from "phaser";
import MainScene, { WORLD_W, WORLD_H } from "./scenes/MainScene.js";
import { initThoughtBook } from "./ui/thoughtBook.js";
import { initCombinationTable } from "./ui/combinationTable.js";
import { initInventory } from "./ui/inventory.js";
import { initGarden } from "./ui/garden.js";
import { initTitleScreen } from "./ui/titleScreen.js";
import { initSave } from "./state/gameState.js";

function startGame(username) {
  initSave(username || "guest");

  document.getElementById("game-container").classList.remove("hidden");
  document.getElementById("ui-root").classList.remove("hidden");

  initThoughtBook();
  initCombinationTable();
  initInventory();
  initGarden();

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document
      .querySelectorAll("#ui-root .modal:not(.hidden)")
      .forEach((modal) => modal.classList.add("hidden"));
  });

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
}

initTitleScreen(startGame);
