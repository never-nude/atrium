import { createTestudoFormation } from "./formation.js";
import { createSceneApp } from "./scene.js";
import { createUI } from "./ui.js";

const mount = document.querySelector("#scene-root");
const loading = document.querySelector("#loading");
const statusBanner = document.querySelector("#status-banner");

if (location.protocol === "file:") {
  loading.hidden = true;
  showStatus("Serve this folder over local HTTP to load the GLB assets. Example: python3 -m http.server 8000");
} else {
  bootstrap();
}

async function bootstrap() {
  const sceneApp = createSceneApp(mount);
  const ui = createUI();

  ui.onCameraPreset((presetName) => {
    sceneApp.setCameraPreset(presetName);
  });

  try {
    const formation = await createTestudoFormation();
    sceneApp.scene.add(formation.root);
    formation.setDisplayState(ui.state);
    formation.setViewMode(ui.state.viewMode);

    ui.onDisplayState((state) => {
      formation.setDisplayState(state);
    });

    ui.onViewMode((mode) => {
      formation.setViewMode(mode);
    });

    sceneApp.setCameraPreset("front", true);
    loading.hidden = true;
  } catch (error) {
    console.error(error);
    loading.hidden = true;
    showStatus("The formation assets failed to load. Open the console for details.");
  }
}

function showStatus(message) {
  statusBanner.hidden = false;
  statusBanner.textContent = message;
}
