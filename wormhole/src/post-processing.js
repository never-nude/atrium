import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const lensShader = {
  uniforms: {
    tDiffuse: { value: null },
    uAberration: { value: 0.0 },
    uWarp: { value: 0.0 },
    uVignette: { value: 0.3 },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uAberration;
    uniform float uWarp;
    uniform float uVignette;

    varying vec2 vUv;

    void main() {
      vec2 centered = vUv - 0.5;
      float dist = dot(centered, centered);
      vec2 warpOffset = centered * dist * uWarp;
      vec2 sampleUv = clamp(vUv - warpOffset, 0.0, 1.0);
      vec2 chromaOffset = centered * (0.003 + dist * 0.012) * uAberration;

      float red = texture2D(tDiffuse, clamp(sampleUv + chromaOffset, 0.0, 1.0)).r;
      float green = texture2D(tDiffuse, sampleUv).g;
      float blue = texture2D(tDiffuse, clamp(sampleUv - chromaOffset, 0.0, 1.0)).b;

      vec3 color = vec3(red, green, blue);
      float vignette = smoothstep(1.12, 0.12, dist * (1.0 + uVignette * 1.4));
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export function createPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.42,
    0.72,
    0.32,
  );
  composer.addPass(bloomPass);

  const lensPass = new ShaderPass(lensShader);
  composer.addPass(lensPass);

  function resize(width, height, pixelRatio) {
    composer.setSize(width, height);
    composer.setPixelRatio(Math.min(pixelRatio, 2));
  }

  function update(runtime) {
    let bloomStrength =
      0.08 +
      runtime.glow * 0.1 +
      runtime.bloom * 0.16 +
      runtime.transitProgress * 0.08 +
      runtime.phaseIntensity * 0.18 +
      runtime.entryFlash * 0.28 +
      runtime.exitReveal * runtime.bloom * 0.26 +
      runtime.transitVelocity * 0.7 +
      runtime.pulse * 0.16;

    if (runtime.viewMode === "inspect") {
      bloomStrength *= 0.34;
    }

    bloomPass.threshold = runtime.viewMode === "inspect" ? 0.36 : 0.28 - runtime.entryFlash * 0.08;
    bloomPass.radius = THREE.MathUtils.lerp(
      0.44,
      0.94,
      runtime.exitReveal * 0.84 + runtime.entryFlash * 0.28 + runtime.transitProgress * 0.08,
    );
    bloomPass.strength = bloomStrength;

    lensPass.uniforms.uAberration.value =
      runtime.viewMode === "inspect"
        ? 0.0
        : 0.004 +
          runtime.distortion * 0.018 +
          runtime.phaseIntensity * 0.012 +
          runtime.transitProgress * 0.006 +
          runtime.pulse * 0.026;
    lensPass.uniforms.uWarp.value = runtime.lensWarp * (0.92 + runtime.distortion * 0.28);
    lensPass.uniforms.uVignette.value =
      0.18 + runtime.phaseIntensity * 0.12 + runtime.entryFlash * 0.12 - runtime.exitReveal * 0.04;

    return bloomStrength;
  }

  function render() {
    composer.render();
  }

  return {
    render,
    resize,
    update,
  };
}
