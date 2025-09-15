// super-simple scene loader (no dependencies)

const box = document.getElementById("eidra-out");

// render a scene (text + buttons)
function render(scene) {
  if (!box) return;
  box.innerHTML = "";

  const h = document.createElement("div");
  h.innerHTML = `<div style="opacity:.8;margin-bottom:.5rem"><b>Scene:</b> ${scene.id}</div>`;
  box.appendChild(h);

  const p = document.createElement("p");
  p.textContent = scene.text || "(no text)";
  box.appendChild(p);

  if (Array.isArray(scene.choices) && scene.choices.length) {
    const list = document.createElement("div");
    list.style.marginTop = ".75rem";
    scene.choices.forEach(c => {
      const btn = document.createElement("button");
      btn.textContent = c.label || c.id;
      btn.style.display = "block";
      btn.style.margin = ".5rem 0";
      btn.onclick = () => load(c.target);
      list.appendChild(btn);
    });
    box.appendChild(list);
  }
}

// fetch a scene JSON by id
async function load(id) {
  box.textContent = "Loading...";
  // cache-buster to avoid old copies
  const url = `./content/${id}.json?v=${Date.now()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const scene = await res.json();
    render(scene);
  } catch (err) {
    box.innerHTML = `<b>Error:</b> ${String(err)}`;
    console.error(err);
  }
}

// kick off
load("mirrorfields_intro");
