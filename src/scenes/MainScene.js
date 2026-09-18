import Phaser from "phaser";

export const WORLD_W = 1600;
export const WORLD_H = 1000;
const SPEED = 200;

const WALL = 16;
const ROOM_W = 420;
const ROOM_H = 300;
const HOUSE_CX = 240;
const HOUSE_CY = 210;
const DOOR_HALF = 30;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  createTextures() {
    const g = this.add.graphics();

    g.fillStyle(0x6aa84f, 1);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(0x5c9440, 1);
    g.fillRect(4, 6, 3, 3);
    g.fillRect(20, 4, 3, 3);
    g.fillRect(10, 18, 3, 3);
    g.fillRect(24, 22, 3, 3);
    g.fillStyle(0x7ebb5c, 1);
    g.fillRect(14, 10, 3, 3);
    g.fillRect(2, 24, 3, 3);
    g.generateTexture("grass-tile", 32, 32);

    g.clear();
    g.fillStyle(0xc8935b, 1);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(0xb37e49, 1);
    g.fillRect(0, 0, 32, 3);
    g.fillRect(0, 16, 32, 3);
    g.generateTexture("wood-tile", 32, 32);

    g.destroy();
  }

  addShadow(x, y, w, h) {
    return this.add.ellipse(x, y + h / 2, w * 0.7, h * 0.25, 0x000000, 0.3);
  }

  create() {
    this.createTextures();
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // 마당
    this.add.tileSprite(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, "grass-tile");

    const innerLeft = HOUSE_CX - ROOM_W / 2;
    const innerRight = HOUSE_CX + ROOM_W / 2;
    const innerTop = HOUSE_CY - ROOM_H / 2;
    const innerBottom = HOUSE_CY + ROOM_H / 2;
    const outerLeft = innerLeft - WALL;
    const outerRight = innerRight + WALL;
    const outerTop = innerTop - WALL;
    const outerBottom = innerBottom + WALL;
    const doorLeft = HOUSE_CX - DOOR_HALF;
    const doorRight = HOUSE_CX + DOOR_HALF;

    // 지붕 (장식)
    this.add.rectangle(
      HOUSE_CX,
      outerTop - 10,
      outerRight - outerLeft + 20,
      20,
      0x4e342e,
    );

    // 집 바닥
    this.add.tileSprite(HOUSE_CX, HOUSE_CY, ROOM_W, ROOM_H, "wood-tile");

    // 현관 매트 (장식)
    this.add.rectangle(HOUSE_CX, outerBottom - WALL / 2, DOOR_HALF * 2 - 10, 8, 0xd7b98e);

    // 벽 (충돌체, 문 자리는 비워둔다)
    const wallColor = 0x5d4037;
    const walls = [];
    const addWall = (cx, cy, w, h) => {
      const wall = this.add.rectangle(cx, cy, w, h, wallColor);
      this.physics.add.existing(wall, true);
      walls.push(wall);
    };
    addWall(HOUSE_CX, outerTop + WALL / 2, outerRight - outerLeft, WALL); // 위
    addWall(outerLeft + WALL / 2, HOUSE_CY, WALL, innerBottom - innerTop); // 왼쪽
    addWall(outerRight - WALL / 2, HOUSE_CY, WALL, innerBottom - innerTop); // 오른쪽
    addWall(
      (outerLeft + doorLeft) / 2,
      outerBottom - WALL / 2,
      doorLeft - outerLeft,
      WALL,
    ); // 아래-왼쪽 (문 왼편)
    addWall(
      (doorRight + outerRight) / 2,
      outerBottom - WALL / 2,
      outerRight - doorRight,
      WALL,
    ); // 아래-오른쪽 (문 오른편)

    // 책상 (책 상호작용 존, 집 내부)
    const deskX = 150;
    const deskY = 180;
    this.addShadow(deskX, deskY, 60, 60);
    this.deskZone = this.add.zone(deskX, deskY, 60, 60);
    this.physics.add.existing(this.deskZone, true);
    this.add.rectangle(deskX, deskY, 60, 60, 0x5d4037);

    // 조합대 (집 내부)
    const tableX = 330;
    const tableY = 180;
    this.addShadow(tableX, tableY, 70, 70);
    this.tableZone = this.add.zone(tableX, tableY, 70, 70);
    this.physics.add.existing(this.tableZone, true);
    this.add.rectangle(tableX, tableY, 70, 70, 0xffc107);

    // 정원 꾸미기 존 (마당 쪽)
    const gardenX = 1300;
    const gardenY = 800;
    this.addShadow(gardenX, gardenY, 120, 120);
    this.gardenZone = this.add.zone(gardenX, gardenY, 120, 120);
    this.physics.add.existing(this.gardenZone, true);
    this.add.rectangle(gardenX, gardenY, 120, 120, 0xa1887f);

    // 플레이어
    this.playerShadow = this.add.ellipse(240, 430 + 16, 22, 8, 0x000000, 0.3);
    this.player = this.add.rectangle(240, 430, 32, 32, 0x2196f3);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    for (const wall of walls) {
      this.physics.add.collider(this.player, wall);
    }

    this.keys = this.input.keyboard.addKeys("W,A,S,D");
    this.eKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
    );
    this.iKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.I,
    );
  }

  update() {
    const body = this.player.body;
    let vx = 0;
    let vy = 0;
    if (this.keys.A.isDown) vx -= SPEED;
    if (this.keys.D.isDown) vx += SPEED;
    if (this.keys.W.isDown) vy -= SPEED;
    if (this.keys.S.isDown) vy += SPEED;
    body.setVelocity(vx, vy);
    this.playerShadow.setPosition(this.player.x, this.player.y + 16);

    if (Phaser.Input.Keyboard.JustDown(this.iKey)) {
      window.dispatchEvent(new CustomEvent("toggle-inventory"));
    }

    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      if (this.physics.overlap(this.player, this.deskZone)) {
        window.dispatchEvent(
          new CustomEvent("interact", { detail: { zone: "book" } }),
        );
      } else if (this.physics.overlap(this.player, this.tableZone)) {
        window.dispatchEvent(
          new CustomEvent("interact", { detail: { zone: "table" } }),
        );
      } else if (this.physics.overlap(this.player, this.gardenZone)) {
        window.dispatchEvent(
          new CustomEvent("interact", { detail: { zone: "garden" } }),
        );
      }
    }
  }
}
