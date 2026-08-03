const compliments = [
  "Du siehst heute wunderschön aus. Wirklich.",
  "Dein Lächeln ist gefährlich süß.",
  "Du hast eine Ausstrahlung, die man nicht übersehen kann.",
  "Du bist nicht nur hübsch – du bist unvergesslich.",
  "Ganz ehrlich: Du machst jeden Ort schöner.",
  "Deine Art ist mindestens genauso schön wie dein Aussehen.",
  "Du bist die Art Mensch, über die man noch lange lächelt.",
  "Du bist viel besonderer, als du selbst manchmal denkst."
];

const quotes = [
  "Du musst nichts Besonderes tun, um besonders zu sein. Du bist es einfach.",
  "Manche Menschen sind wie Sterne – du bemerkst sofort, wenn sie da sind.",
  "Dein Lächeln ist eine kleine Erinnerung daran, dass schöne Dinge existieren.",
  "Du bist nicht perfekt. Du bist besser: echt, einzigartig und du selbst.",
  "Es gibt Menschen, die einen Moment schöner machen. Du machst ganze Tage schöner."
];

const words = ["wunderschön", "süß", "einzigartig", "zauberhaft", "besonders"];
let wordIndex = 0;

const changingWord = document.getElementById("changingWord");
setInterval(() => {
  changingWord.animate(
    [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-12px)" }],
    { duration: 250, fill: "forwards" }
  ).onfinish = () => {
    wordIndex = (wordIndex + 1) % words.length;
    changingWord.textContent = words[wordIndex];
    changingWord.animate(
      [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 350, fill: "forwards" }
    );
  };
}, 2400);

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min((i % 4) * 90, 270)}ms`;
  observer.observe(el);
});

// Mouse glow
const glow = document.getElementById("cursor-glow");
window.addEventListener("pointermove", (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

// 3D tilt cards
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// Compliment modal
const modal = document.getElementById("complimentModal");
const modalText = document.getElementById("modalText");

function randomCompliment() {
  return compliments[Math.floor(Math.random() * compliments.length)];
}

function openModal() {
  modalText.textContent = randomCompliment();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  createHeartBurst(innerWidth / 2, innerHeight / 2 + 80, 16);
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("complimentBtn").addEventListener("click", openModal);
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("anotherCompliment").addEventListener("click", () => {
  modalText.style.opacity = "0";
  setTimeout(() => {
    modalText.textContent = randomCompliment();
    modalText.style.opacity = "1";
  }, 180);
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Quote changer
document.getElementById("newQuote").addEventListener("click", () => {
  const text = document.getElementById("quoteText");
  text.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: "forwards" }).onfinish = () => {
    text.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    text.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, fill: "forwards" });
  };
});

// Heart effects
function createHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "flying-heart";
  heart.textContent = Math.random() > .4 ? "♡" : "♥";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty("--x", `${(Math.random() - .5) * 180}px`);
  heart.style.setProperty("--r", `${(Math.random() - .5) * 120}deg`);
  heart.style.fontSize = `${14 + Math.random() * 20}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1900);
}

function createHeartBurst(x, y, amount = 12) {
  for (let i = 0; i < amount; i++) {
    setTimeout(() => createHeart(x + (Math.random() - .5) * 65, y + (Math.random() - .5) * 35), i * 45);
  }
}

document.getElementById("navHeart").addEventListener("click", (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  createHeartBurst(r.left + r.width / 2, r.top + r.height / 2, 10);
});

document.getElementById("bigHeart").addEventListener("click", (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  createHeartBurst(r.left + r.width / 2, r.top + r.height / 2, 24);
  document.getElementById("secretMessage").classList.add("show");
  e.currentTarget.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }],
    { duration: 500 }
  );
});

// Three.js animated background
if (window.THREE) {
  const canvas = document.getElementById("three-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  const material = new THREE.MeshBasicMaterial({
    color: 0xff78bd,
    wireframe: true,
    transparent: true,
    opacity: .12
  });

  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.55, .38, 120, 18), material);
  knot.position.set(3.8, .4, -1);
  group.add(knot);

  const geo = new THREE.BufferGeometry();
  const count = 700;
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - .5) * 18;
    pos[i * 3 + 1] = (Math.random() - .5) * 12;
    pos[i * 3 + 2] = (Math.random() - .5) * 10;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xffc4e3,
      size: .025,
      transparent: true,
      opacity: .55
    })
  );
  scene.add(particles);

  let mx = 0, my = 0;
  window.addEventListener("pointermove", (e) => {
    mx = (e.clientX / innerWidth - .5) * .35;
    my = (e.clientY / innerHeight - .5) * .35;
  });

  function animate() {
    requestAnimationFrame(animate);
    knot.rotation.x += .0015;
    knot.rotation.y += .0025;
    particles.rotation.y += .00015;
    group.rotation.y += (mx - group.rotation.y) * .02;
    group.rotation.x += (-my - group.rotation.x) * .02;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
