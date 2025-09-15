import { eidra } from "../engine/engine.js";

const sessionId = "demo";
const box = document.getElementById("eidra-out");

// Render a scene into the page
async function renderScene(out) {
  // clear the box
  box.innerHTML = "";

  // show scene text
  const text = document.createElement("p");
  text.textContent = out.scene.text;
  box.appendChild(text);

  // show choices as buttons
  const choicesBox = document.createElement("div");
  out.scene.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c.label;
    btn.style.display = "block";
    btn.style.margin = "0.5rem 0";
    btn.onclick = async () => {
      const next = await eidra.choose({ sessionId, choiceId: c.id });
      renderScene(next);
    };
    choicesBox.appendChild(btn);
  });
  box.appendChild(choicesBox);
}

// initial load
(async () => {
  const out = await eidra.load_scene({ sessionId, sceneId: "mirrorfields_intro" });
  renderScene(out);
})();
