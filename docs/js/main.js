/* MECHA Tattoo — interacción y animación de scroll. Sin dependencias.
   Todo el movimiento usa transform/opacity y respeta prefers-reduced-motion. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  // cierra el menú al navegar a una sección
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox.querySelector("img");
  var lightboxClose = lightbox.querySelector(".lightbox__close");

  function abrirLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.showModal();
  }

  lightboxClose.addEventListener("click", function () { lightbox.close(); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("close", function () { lightboxImg.src = ""; });

  /* ---------- filtros de portfolio ---------- */
  var filtros = document.querySelectorAll(".filtro");
  var piezas = document.querySelectorAll(".pieza");
  var galeria = document.querySelector(".galeria");
  var carrusel = document.getElementById("carrusel");
  var carruselBuilt = false;

  piezas.forEach(function (pieza) {
    pieza.addEventListener("click", function () {
      var img = pieza.querySelector("img");
      abrirLightbox(img.src, img.alt);
    });
  });

  /* ---------- carrusel animado ---------- */
  function buildCarrusel() {
    if (carruselBuilt) return;
    carruselBuilt = true;

    var track = document.createElement("div");
    track.className = "carrusel__track";

    var snapData = [];

    piezas.forEach(function (pieza) {
      var img = pieza.querySelector("img");
      var catEl = pieza.querySelector(".pieza__cat");
      var item = document.createElement("button");
      item.type = "button";
      item.className = "carrusel__item";
      item.setAttribute("aria-label", img.alt);

      var imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      imgEl.loading = "lazy";

      var label = document.createElement("span");
      label.className = "pieza__cat";
      label.textContent = catEl ? catEl.textContent : "";

      item.appendChild(imgEl);
      item.appendChild(label);
      item.addEventListener("click", function () { abrirLightbox(img.src, img.alt); });
      track.appendChild(item);
      snapData.push({ src: img.src, alt: img.alt });
    });

    /* duplicar para bucle infinito */
    snapData.forEach(function (d, i) {
      var orig = track.children[i];
      var clone = orig.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.addEventListener("click", function () { abrirLightbox(d.src, d.alt); });
      track.appendChild(clone);
    });

    carrusel.appendChild(track);
    setupCarruselDrag(track);
  }

  /* ---------- drag de ratón y swipe táctil en el carrusel ---------- */
  function setupCarruselDrag(track) {
    var DURATION = 70; // segundos — debe coincidir con el CSS
    var isDragging = false;
    var startX = 0;
    var startOffset = 0;
    var lastX = 0;
    var lastT = 0;
    var velX = 0;
    var touchStartY = 0;
    var isHorizontal = null;

    function getHalfWidth() { return track.scrollWidth / 2; }

    function getComputedX() {
      var m = new DOMMatrix(window.getComputedStyle(track).transform);
      return m.m41;
    }

    function wrapX(x) {
      var hw = getHalfWidth();
      x = x % hw;
      if (x > 0) x -= hw;
      return x;
    }

    function applyX(x) {
      track.style.transform = "translateX(" + wrapX(x) + "px)";
    }

    function resumeFrom(x) {
      var hw = getHalfWidth();
      x = wrapX(x);
      track.style.animationDelay = -((-x / hw) * DURATION) + "s";
      track.style.transform = "";
      track.style.animationPlayState = ""; /* quita inline, el CSS hover toma el control */
      carrusel.classList.remove("carrusel--dragging");
    }

    function onStart(clientX, clientY) {
      isDragging = true;
      isHorizontal = null;
      startX = clientX;
      touchStartY = clientY || 0;
      startOffset = getComputedX();
      lastX = clientX;
      lastT = performance.now();
      velX = 0;
      track.style.animationPlayState = "paused";
      carrusel.classList.add("carrusel--dragging");
    }

    function onMove(clientX, clientY) {
      if (!isDragging) return;
      /* detectar dirección del gesto en el primer movimiento */
      if (isHorizontal === null) {
        var dx = Math.abs(clientX - startX);
        var dy = Math.abs((clientY || touchStartY) - touchStartY);
        if (dx < 4 && dy < 4) return; /* aún no hay movimiento suficiente */
        isHorizontal = dx >= dy;
        if (!isHorizontal) { /* gesto vertical → cancelar drag */
          isDragging = false;
          resumeFrom(startOffset);
          return;
        }
      }
      var now = performance.now();
      var dt = now - lastT;
      if (dt > 0) velX = (clientX - lastX) / dt;
      lastX = clientX;
      lastT = now;
      applyX(startOffset + (clientX - startX));
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      var endX = startOffset + (lastX - startX);
      var momentum = Math.max(-300, Math.min(300, velX * 160));
      resumeFrom(endX + momentum);
    }

    /* ratón */
    track.addEventListener("mousedown", function (e) {
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    });
    document.addEventListener("mousemove", function (e) {
      if (isDragging) onMove(e.clientX, e.clientY);
    });
    document.addEventListener("mouseup", function () {
      if (isDragging) onEnd();
    });

    /* toque */
    track.addEventListener("touchstart", function (e) {
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    track.addEventListener("touchmove", function (e) {
      if (!isDragging) return;
      var t = e.touches[0];
      var dx = Math.abs(t.clientX - startX);
      var dy = Math.abs(t.clientY - touchStartY);
      if (isHorizontal === null && (dx >= 4 || dy >= 4)) {
        isHorizontal = dx >= dy;
      }
      if (isHorizontal) e.preventDefault();
      onMove(t.clientX, t.clientY);
    }, { passive: false });
    track.addEventListener("touchend", onEnd);
    track.addEventListener("touchcancel", onEnd);

    /* click: solo abrir lightbox si no hubo arrastre */
    track.addEventListener("click", function (e) {
      if (Math.abs(lastX - startX) > 6) e.stopPropagation();
    }, true);
  }

  function mostrarCarrusel() {
    buildCarrusel();
    galeria.style.display = "none";
    carrusel.classList.add("is-active");
  }

  function mostrarGaleria(cat) {
    carrusel.classList.remove("is-active");
    galeria.style.display = "";
    piezas.forEach(function (p) {
      p.classList.toggle("is-hidden", p.dataset.cat !== cat);
    });
  }

  filtros.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.filtro;
      filtros.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      if (cat === "todo") {
        mostrarCarrusel();
      } else {
        mostrarGaleria(cat);
      }
    });
  });

  /* estado inicial: "Todo" activo → arrancar carrusel */
  mostrarCarrusel();

  /* ---------- año del footer ---------- */
  document.getElementById("year").textContent = String(new Date().getFullYear());

  /* ==========================================================
     Animación de scroll (se omite con prefers-reduced-motion)
     ========================================================== */

  /* reveals escalonados: añade .anim con retardo a hijos de grupos */
  var grupos = [".estilos__grid", ".galeria", ".pasos", ".canales"];
  if (!reduced) {
    grupos.forEach(function (sel) {
      var grupo = document.querySelector(sel);
      if (!grupo) return;
      Array.prototype.forEach.call(grupo.children, function (el, i) {
        el.classList.add("anim");
        el.style.setProperty("--d", (i % 6) * 0.07 + "s");
      });
    });
  }

  var observados = document.querySelectorAll(".reveal, .anim");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    observados.forEach(function (el) { io.observe(el); });
  } else {
    observados.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (reduced) return; // a partir de aquí, todo es movimiento ligado al scroll

  /* manifiesto: partir en palabras para encenderlas al hacer scroll */
  var manifiesto = document.querySelector(".manifiesto p");
  var palabras = [];
  if (manifiesto) {
    var splitWords = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (parte) {
            if (/^\s+$/.test(parte) || parte === "") {
              frag.appendChild(document.createTextNode(parte));
            } else {
              var w = document.createElement("span");
              w.className = "w";
              w.textContent = parte;
              frag.appendChild(w);
              palabras.push(w);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          splitWords(child);
        }
      });
    };
    splitWords(manifiesto);
    manifiesto.classList.add("js-split");
  }

  /* referencias para el bucle de scroll */
  var header = document.querySelector(".header");
  var fuse = document.getElementById("fuse");
  var heroBg = document.querySelector(".hero__bg img");
  var heroIn = document.querySelector(".hero__in");
  var marquees = Array.prototype.map.call(
    document.querySelectorAll("[data-marquee]"),
    function (m) {
      return {
        track: m.querySelector(".marquee__track"),
        dir: parseFloat(m.dataset.marquee) || -1,
        half: 0
      };
    }
  );

  var medirMarquees = function () {
    marquees.forEach(function (m) { m.half = m.track.scrollWidth / 3; });
  };
  medirMarquees();
  window.addEventListener("resize", medirMarquees);

  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    /* mecha de progreso */
    fuse.style.transform = "scaleX(" + (docH > 0 ? Math.min(1, y / docH) : 0) + ")";

    /* header: ocultar al bajar, mostrar al subir */
    if (y > 200 && y > lastY && !nav.classList.contains("is-open")) {
      header.classList.add("is-hidden");
    } else if (y < lastY || y <= 200) {
      header.classList.remove("is-hidden");
    }
    lastY = y;

    /* parallax del hero mientras está en pantalla */
    if (y < vh) {
      heroBg.style.transform = "translateY(" + y * 0.3 + "px) scale(" + (1 + y / vh * 0.06) + ")";
      heroIn.style.transform = "translateY(" + y * 0.18 + "px)";
      heroIn.style.opacity = String(Math.max(0, 1 - y / (vh * 0.7)));
    }

    /* marquees ligados al scroll (módulo para bucle infinito) */
    marquees.forEach(function (m) {
      if (!m.half) return;
      var x = (y * 0.45 * m.dir) % m.half;
      if (x > 0) x -= m.half;
      m.track.style.transform = "translateX(" + x + "px)";
    });

    /* manifiesto: encender palabras según el progreso del bloque */
    if (palabras.length) {
      var rect = manifiesto.getBoundingClientRect();
      var progreso = (vh * 0.9 - rect.top) / (rect.height + vh * 0.45);
      var lit = Math.floor(Math.max(0, Math.min(1, progreso)) * palabras.length);
      palabras.forEach(function (w, i) { w.classList.toggle("lit", i < lit); });
    }

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();
})();
