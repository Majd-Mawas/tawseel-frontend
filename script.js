function calculateAStarPath(start, end, gridSize = 20) {
  console.log("Calculating A* path from", start, "to", end);

  function heuristic(a, b) {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLon = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;

    const x = dLon * Math.cos((lat1 + lat2) / 2);
    const y = dLat;
    return Math.sqrt(x * x + y * y) * R;
  }

  function createGrid(start, end, size) {
    const grid = [];
    const latStep = (end[0] - start[0]) / size;
    const lngStep = (end[1] - start[1]) / size;

    for (let i = 0; i <= size; i++) {
      for (let j = 0; j <= size; j++) {
        const lat = start[0] + i * latStep;
        const lng = start[1] + j * lngStep;
        grid.push([lat, lng]);
      }
    }

    return grid;
  }

  class Node {
    constructor(position, parent = null) {
      this.position = position;
      this.parent = parent;
      this.g = parent ? parent.g + heuristic(parent.position, position) : 0;
      this.h = heuristic(position, end);
      this.f = this.g + this.h;
    }
  }

  const grid = createGrid(start, end, gridSize);

  const openSet = [new Node(start)];
  const closedSet = [];

  function getNeighbors(node, grid) {
    return grid.filter((point) => {
      const distance = heuristic(node.position, point);
      return distance > 0 && distance < 0.5;
    });
  }

  while (openSet.length > 0) {
    let currentIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIndex].f) {
        currentIndex = i;
      }
    }

    const current = openSet[currentIndex];

    if (heuristic(current.position, end) < 0.1) {
      const path = [];
      let temp = current;
      while (temp) {
        path.push(temp.position);
        temp = temp.parent;
      }
      return path.reverse();
    }

    openSet.splice(currentIndex, 1);
    closedSet.push(current);

    const neighbors = getNeighbors(current, grid);
    for (const neighborPos of neighbors) {
      if (
        closedSet.some((node) => heuristic(node.position, neighborPos) < 0.01)
      ) {
        continue;
      }

      const neighbor = new Node(neighborPos, current);

      const openNode = openSet.find(
        (node) => heuristic(node.position, neighborPos) < 0.01
      );
      if (openNode && neighbor.g >= openNode.g) {
        continue;
      }

      if (!openNode) {
        openSet.push(neighbor);
      } else {
        openNode.parent = current;
        openNode.g = neighbor.g;
        openNode.f = openNode.g + openNode.h;
      }
    }

    if (closedSet.length > 1000) {
      console.warn("A* algorithm reached iteration limit");
      break;
    }
  }

  console.warn("A* could not find optimal path, returning direct line");
  return [start, end];
}
