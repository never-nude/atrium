const PHASE_ORDER = ["approach", "entry", "transit", "exit"];
const PANEL_REVEAL_MS = 3600;

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function createUI({ initialMode = "transit", initialValues, onControlsChange, onModeChange, onReplay, onPulse }) {
  const root = document.querySelector(".hud");
  const phaseBadge = document.querySelector("#phaseBadge");
  const inspectButton = document.querySelector("#inspectButton");
  const transitButton = document.querySelector("#transitButton");
  const replayButton = document.querySelector("#replayButton");
  const pulseButton = document.querySelector("#pulseButton");
  const progressFill = document.querySelector("#progressFill");
  const phaseItems = Array.from(document.querySelectorAll("[data-phase-item]"));
  let panelRevealUntil = 0;

  const controls = {
    speed: {
      input: document.querySelector("#speedInput"),
      output: document.querySelector("#speedValue"),
      format: (value) => `${value.toFixed(2)}x`,
    },
    throat: {
      input: document.querySelector("#throatInput"),
      output: document.querySelector("#throatValue"),
      format: (value) => `${value.toFixed(1)}m`,
    },
    distortion: {
      input: document.querySelector("#distortionInput"),
      output: document.querySelector("#distortionValue"),
      format: (value) => value.toFixed(2),
    },
    glow: {
      input: document.querySelector("#glowInput"),
      output: document.querySelector("#glowValue"),
      format: (value) => value.toFixed(2),
    },
    bloom: {
      input: document.querySelector("#bloomInput"),
      output: document.querySelector("#bloomValue"),
      format: (value) => value.toFixed(2),
    },
  };

  const telemetry = {
    phase: document.querySelector("#phaseReading"),
    mode: document.querySelector("#modeReading"),
    velocity: document.querySelector("#velocityReading"),
    shear: document.querySelector("#shearReading"),
    stability: document.querySelector("#stabilityReading"),
    bloom: document.querySelector("#bloomReading"),
    exit: document.querySelector("#exitReading"),
    duration: document.querySelector("#durationReading"),
    progress: document.querySelector("#progressValue"),
  };

  function getControlValues() {
    return {
      speed: Number(controls.speed.input.value),
      throat: Number(controls.throat.input.value),
      distortion: Number(controls.distortion.input.value),
      glow: Number(controls.glow.input.value),
      bloom: Number(controls.bloom.input.value),
    };
  }

  function syncControlOutputs(values) {
    Object.entries(controls).forEach(([key, control]) => {
      control.output.textContent = control.format(values[key]);
    });
  }

  function updateModeButtons(mode) {
    const isInspect = mode === "inspect";
    inspectButton.classList.toggle("is-active", isInspect);
    transitButton.classList.toggle("is-active", !isInspect);
    inspectButton.setAttribute("aria-pressed", String(isInspect));
    transitButton.setAttribute("aria-pressed", String(!isInspect));
  }

  function updatePhaseTrack(phase) {
    const currentIndex = PHASE_ORDER.indexOf(phase);
    phaseItems.forEach((item) => {
      const itemIndex = PHASE_ORDER.indexOf(item.dataset.phaseItem);
      item.classList.toggle("is-active", itemIndex === currentIndex);
      item.classList.toggle("is-complete", itemIndex < currentIndex);
    });
  }

  function update(runtime) {
    const transitProgress = runtime.transitProgress ?? runtime.progress ?? 0;
    const inTransitRun = runtime.viewMode === "transit" && (runtime.phase !== "approach" || transitProgress > 0.03);
    const prefersPanel = !inTransitRun || performance.now() < panelRevealUntil;

    root.dataset.mode = runtime.viewMode;
    root.dataset.phase = runtime.phase;
    root.dataset.focus = prefersPanel ? "panel" : "scene";
    phaseBadge.textContent = capitalize(runtime.phase);
    updateModeButtons(runtime.viewMode);
    updatePhaseTrack(runtime.phase);

    telemetry.phase.textContent = capitalize(runtime.phase);
    telemetry.mode.textContent = capitalize(runtime.viewMode);
    telemetry.velocity.textContent = `${runtime.velocityIndex.toFixed(2)}x`;
    telemetry.shear.textContent = runtime.shear.toFixed(2);
    telemetry.stability.textContent = `${runtime.stability.toFixed(0)}%`;
    telemetry.bloom.textContent = `${runtime.bloomGain.toFixed(2)}x`;
    telemetry.exit.textContent = `${runtime.exitLock.toFixed(0)}%`;
    telemetry.duration.textContent = `${runtime.transitTime.toFixed(1)} s`;
    telemetry.progress.textContent = `${(transitProgress * 100).toFixed(0)}%`;
    progressFill.style.transform = `scaleX(${Math.max(0, Math.min(1, transitProgress))})`;
  }

  function handleControlInput() {
    const values = getControlValues();
    syncControlOutputs(values);
    onControlsChange(values);
  }

  function revealPanel(duration = PANEL_REVEAL_MS) {
    panelRevealUntil = performance.now() + duration;
  }

  Object.values(controls).forEach((control) => {
    control.input.addEventListener("input", handleControlInput);
  });

  root.addEventListener("pointerenter", () => revealPanel(1800));
  root.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch" && performance.now() > panelRevealUntil - 900) {
      revealPanel(1800);
    }
  });
  root.addEventListener("pointerdown", () => revealPanel());
  root.addEventListener("focusin", () => revealPanel());

  inspectButton.addEventListener("click", () => onModeChange("inspect"));
  transitButton.addEventListener("click", () => onModeChange("transit"));
  replayButton.addEventListener("click", () => onReplay());
  pulseButton.addEventListener("click", () => onPulse());

  syncControlOutputs(initialValues);
  root.dataset.mode = initialMode;
  updateModeButtons(initialMode);
  updatePhaseTrack("approach");

  return {
    update,
    getControlValues,
    setControlValues(values) {
      Object.entries(values).forEach(([key, value]) => {
        if (controls[key]) {
          controls[key].input.value = String(value);
        }
      });
      syncControlOutputs(getControlValues());
    },
  };
}
