export const GARDEN_GRID_SIZE = 4;

const STORAGE_KEY = "bypp-save";

function emptyState() {
  return {
    inventory: [],
    normalItems: [],
    garden: Array(GARDEN_GRID_SIZE * GARDEN_GRID_SIZE).fill(null),
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      inventory: Array.isArray(saved.inventory) ? saved.inventory : [],
      normalItems: Array.isArray(saved.normalItems) ? saved.normalItems : [],
      garden:
        Array.isArray(saved.garden) &&
        saved.garden.length === GARDEN_GRID_SIZE * GARDEN_GRID_SIZE
          ? saved.garden
          : emptyState().garden,
    };
  } catch {
    return emptyState();
  }
}

const state = loadState();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addStrength(name) {
  if (!hasStrength(name)) {
    state.inventory.push(name);
    save();
    window.dispatchEvent(new CustomEvent("inventory-changed"));
  }
}

export function hasStrength(name) {
  return state.inventory.includes(name);
}

export function getInventory() {
  return state.inventory;
}

export function addNormalItem(name) {
  state.normalItems.push(name);
  save();
  window.dispatchEvent(new CustomEvent("inventory-changed"));
}

export function getNormalItems() {
  return state.normalItems;
}

export function getGarden() {
  return state.garden;
}

export function setGardenCell(index, name) {
  state.garden[index] = name || null;
  save();
  window.dispatchEvent(new CustomEvent("garden-changed"));
}
