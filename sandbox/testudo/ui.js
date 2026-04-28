export function createUI() {
  const state = {
    showGrid: false,
    showSoldiers: true,
    shieldsOnly: false,
    viewMode: "solid",
  };

  const listeners = {
    cameraPreset: [],
    displayState: [],
    viewMode: [],
  };

  const viewButtons = document.querySelectorAll("[data-view-mode]");
  const cameraButtons = document.querySelectorAll("[data-camera-preset]");
  const toggleInputs = document.querySelectorAll("[data-toggle]");
  const soldierToggle = document.querySelector("#toggle-soldiers");
  const soldierInput = soldierToggle.querySelector("input");

  for (const button of viewButtons) {
    button.addEventListener("click", () => {
      state.viewMode = button.dataset.viewMode;
      setActive(viewButtons, button, "is-active");
      emit("viewMode", state.viewMode);
    });
  }

  for (const button of cameraButtons) {
    button.addEventListener("click", () => {
      setActive(cameraButtons, button, "is-active");
      emit("cameraPreset", button.dataset.cameraPreset);
    });
  }

  for (const input of toggleInputs) {
    input.addEventListener("change", () => {
      state[input.dataset.toggle] = input.checked;
      if (input.dataset.toggle === "shieldsOnly") {
        soldierInput.disabled = input.checked;
        soldierToggle.classList.toggle("is-disabled", input.checked);
      }
      emit("displayState", { ...state });
    });
  }

  function emit(type, payload) {
    for (const listener of listeners[type]) {
      listener(payload);
    }
  }

  return {
    onCameraPreset(listener) {
      listeners.cameraPreset.push(listener);
    },
    onDisplayState(listener) {
      listeners.displayState.push(listener);
    },
    onViewMode(listener) {
      listeners.viewMode.push(listener);
    },
    state,
  };
}

function setActive(buttons, activeButton, className) {
  for (const button of buttons) {
    button.classList.toggle(className, button === activeButton);
  }
}
