// main.js — uses the Eidra engine to load + render a scene
import { eidra } from "./engine.js";

const box = document.getElementById("out");
const sessionId = "demo";

// render the current scene into the #out box
function renderScene(payload){
  const { scene } = payload;
  box.innerHTML = `
    <b>Scene:</b> ${scene.id}<br>
    <p>${scene.text}</p>
    <ul id="choices" style="margin-left:1rem;">
      ${scene.choices.map(c => `<li><button data-choice="${c.id}">${c.label}</button></li>`).join("")}
    </ul>
    <p><button id="waitBtn">(wait)</button></p>
  `;

  // hook up choices
  const choicesUl = document.getElementById("choices");
  choicesUl.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-choice]");
    if (!btn) return;
    const choiceId = btn.getAttribute("data-choice");
    const next = await eidra.choose({ sessionId, choiceId });
    renderScene(next);
  });

  // hook up wait
  document.getElementById("waitBtn").addEventListener("click", async ()=>{
    const next = await eidra.wait({ sessionId });
    renderScene(next);
  });
}

(async () => {
  // load first scene from the engine
  const out = await eidra.load_scene({ sessionId, sceneId: "mirrorfields_intro" });
  renderScene(out);
})();
