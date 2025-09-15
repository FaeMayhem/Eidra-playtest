// main.js — super simple starter

const box = document.getElementById("out");
box.textContent = "Loading scene...";

async function loadScene(id) {
  const res = await fetch(`./content/${id}.json`);
  if (!res.ok) {
    box.textContent = "Error: couldn't load " + id;
    return;
  }
  const scene = await res.json();

  // show scene text + choices
  box.innerHTML = `
    <b>Scene:</b> ${scene.id}<br>
    <p>${scene.text}</p>
    <ul>
      ${scene.choices.map(c => `<li>${c.label}</li>`).join("")}
    </ul>
  `;
}

// load first scene
loadScene("mirrorfields_intro");
