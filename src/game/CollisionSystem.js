export class CollisionSystem {
  check(player, obstacles, collectibles) {
    const box = player.getCollisionBox();
    const playerZ = player.root.position.z;
    let obstacleHit = null;

    for (const object of obstacles) {
      const meta = object.userData.meta;
      if (!meta) continue;

      const zDistance = Math.abs(object.position.z - playerZ);
      if (zDistance > (box.depth + meta.depth) * 0.5 + 0.08) continue;

      const xDistance = Math.abs(object.position.x - box.x);
      if (xDistance > (box.width + meta.width) * 0.5 * 0.82) continue;

      const playerBottom = box.y;
      const playerTop = box.y + box.height;
      const obstacleBottom = meta.y + object.position.y;
      const obstacleTop = meta.y + meta.height + object.position.y;

      if (playerBottom < obstacleTop - 0.04 && playerTop > obstacleBottom + 0.04) {
        obstacleHit = object;
        break;
      }
    }

    const collected = [];
    for (const object of collectibles) {
      if (Math.abs(object.position.z - playerZ) > 1.05) continue;
      if (Math.abs(object.position.x - box.x) > 1.0) continue;
      const playerCenterY = box.y + box.height * 0.5;
      if (Math.abs(object.position.y - playerCenterY) > 1.3) continue;
      collected.push(object);
    }

    return { obstacle: obstacleHit, collectibles: collected };
  }
}
