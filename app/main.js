// super-simple, dependency-free scene loader

const box = document.getElementById("eidra-out");

// draw one scene (text + buttons)
function render(scene) {
  if (!box) return;
  box.innerHTML = "";

  const head = document.createElement("div");
  head.style.opacity = ".8";
  head.style.marginBottom = ".5rem";
  head.innerHTML = `<b>Scene:</b> ${scene.id}`;
  box.appendChild(head);

  const p = document.createElement("p");
  p.textContent = scene.text || "(no text)";
  box.appendChild(p);

  if (Array.isArray(scene.choices) && scene.choices.length) {
    const choices = document.createElement("div");
    choices.style.marginTop = ".75rem";
    scene.choices.forEach(c => {
      const btn = document.createElement("button");
      btn.textContent = c.label || c.id;
      btn.style.display = "block";
      btn.style.margin = ".5rem 0";
      btn.onclick = () => load(c.target);
      choices.appendChild(btn);
    });
    box.appendChild(choices);
  }
}

// fetch a scene JSON by id (with cache-buster)
async function load(id) {
  box.textContent = "Loading...";
  const url = `./content/${id}.json?v=${Date.now()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const scene = await res.json();
    render(scene);
  } catch (err) {
    console.error(err);
    box.innerHTML = `<b>Error:</b> ${String(err)}`;
  }
}

// start at the intro
load("mirrorfields_intro");
