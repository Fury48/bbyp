import Phaser from "phaser";

export const WORLD_W = 1600;
export const WORLD_H = 1000;
const SPEED = 200;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // 마당 (placeholder)
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, 0x4caf50);

    // 집 바닥 (placeholder) — 충돌 없음, 책상/조합대가 내부에 있어 자유롭게 드나든다
    this.add.rectangle(220, 180, 320, 220, 0x8d6e63);

    // 책상 (책 상호작용 존, 집 내부)
    this.deskZone = this.add.zone(140, 180, 60, 60);
    this.physics.add.existing(this.deskZone, true);
    this.add.rectangle(140, 180, 60, 60, 0x5d4037);

    // 조합대 (집 내부)
    this.tableZone = this.add.zone(300, 180, 70, 70);
    this.physics.add.existing(this.tableZone, true);
    this.add.rectangle(300, 180, 70, 70, 0xffc107);

    // 정원 꾸미기 존 (마당 쪽)
    this.gardenZone = this.add.zone(1300, 800, 120, 120);
    this.physics.add.existing(this.gardenZone, true);
    this.add.rectangle(1300, 800, 120, 120, 0xa1887f);

    // 플레이어 (placeholder)
    this.player = this.add.rectangle(220, 450, 32, 32, 0x2196f3);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

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
