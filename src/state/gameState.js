export const GARDEN_GRID_SIZE = 4;

function emptyState() {
  return {
    inventory: [],
    normalItems: [],
    garden: Array(GARDEN_GRID_SIZE * GARDEN_GRID_SIZE).fill(null),
    answeredQuestions: [],
  };
}

let storageKey = "bypp-save-guest";
let state = emptyState();

// Must be called once after login, before any UI reads state - keys the save per account.
export function initSave(username) {
  storageKey = `bypp-save-${username}`;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    state = {
      inventory: Array.isArray(saved.inventory) ? saved.inventory : [],
      normalItems: Array.isArray(saved.normalItems) ? saved.normalItems : [],
      garden:
        Array.isArray(saved.garden) &&
        saved.garden.length === GARDEN_GRID_SIZE * GARDEN_GRID_SIZE
          ? saved.garden
          : emptyState().garden,
      answeredQuestions: Array.isArray(saved.answeredQuestions)
        ? saved.answeredQuestions
        : [],
    };
  } catch {
    state = emptyState();
  }
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(state));
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

export function isQuestionAnswered(question) {
  return state.answeredQuestions.includes(question);
}

export function markQuestionAnswered(question) {
  if (!isQuestionAnswered(question)) {
    state.answeredQuestions.push(question);
    save();
  }
}
