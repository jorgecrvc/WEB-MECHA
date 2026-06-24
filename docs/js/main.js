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
    var DURATION    = 70;   // segundos — debe coincidir con el CSS
    var isDragging  = false;
    var decRafId    = null;
    var startX      = 0;
    var startOffset = 0;
    var currentDragX = 0;
    var touchStartY = 0;
    var isHorizontal = null;
    var velBuffer   = []; /* {x, t} de los últimos ~100ms */

    function getHalfWidth() { return track.scrollWidth / 2; }

    function wrapX(x) {
      var hw = getHalfWidth();
      x = x % hw;
      if (x > 0) x -= hw;
      return x;
    }

    function setX(x) {
      track.style.transform = "translateX(" + wrapX(x).toFixed(1) + "px)";
    }

    /* pausa la animación ANTES de leer — getComputedStyle fuerza recálculo
       y devuelve la posición exacta del fotograma pausado, sin salto */
    function captureAndPause() {
      track.style.animationPlayState = "paused";
      return new DOMMatrix(window.getComputedStyle(track).transform).m41;
    }

    function resumeAt(x) {
      var hw = getHalfWidth();
      x = wrapX(x);
      /* todo en la misma microtarea → el navegador lo batchea, sin parpadeo */
      track.style.animationDelay      = -((-x / hw) * DURATION) + "s";
      track.style.transform           = "";
      track.style.animationPlayState  = ""; /* CSS hover recupera el control */
    }

    function getVelocity() {
      var now    = performance.now();
      var recent = velBuffer.filter(function (s) { return now - s.t < 80; });
      if (recent.length < 2) return 0;
      var first = recent[0], last = recent[recent.length - 1];
      var dt = last.t - first.t;
      return dt > 0 ? (last.x - first.x) / dt : 0;
    }

    function onStart(clientX, clientY) {
      /* cancelar cualquier deceleración en curso */
      if (decRafId) { cancelAnimationFrame(decRafId); decRafId = null; }

      startOffset  = captureAndPause(); /* pausa + posición real, sin salto */
      currentDragX = startOffset;
      startX       = clientX;
      touchStartY  = clientY || 0;
      isHorizontal = null;
      isDragging   = true;
      velBuffer    = [];
      carrusel.classList.add("carrusel--dragging");
    }

    function onMove(clientX, clientY) {
      if (!isDragging) return;

      if (isHorizontal === null) {
        var adx = Math.abs(clientX - startX);
        var ady = Math.abs((clientY || touchStartY) - touchStartY);
        if (adx < 5 && ady < 5) return;
        isHorizontal = adx >= ady;
        if (!isHorizontal) {
          isDragging = false;
          resumeAt(startOffset);
          carrusel.classList.remove("carrusel--dragging");
          return;
        }
      }

      var now = performance.now();
      velBuffer.push({ x: clientX, t: now });
      while (velBuffer.length > 1 && now - velBuffer[0].t > 120) velBuffer.shift();

      currentDragX = startOffset + (clientX - startX);
      setX(currentDragX);
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      carrusel.classList.remove("carrusel--dragging");

      var vel      = getVelocity();            /* px/ms promediado sobre 80ms */
      var momentum = vel * 220;
      momentum = Math.max(-500, Math.min(500, momentum));

      if (Math.abs(momentum) < 8) { resumeAt(currentDragX); return; }

      /* deceleración ease-out quart en JS → entrega suave a la animación CSS */
      var fromX    = currentDragX;
      var toX      = fromX + momentum;
      var t0       = performance.now();
      var decMs    = Math.min(700, Math.max(180, Math.abs(momentum) * 1.1));

      function decTick(now) {
        var p    = Math.min(1, (now - t0) / decMs);
        var ease = 1 - Math.pow(1 - p, 4); /* ease-out quart */
        var x    = fromX + (toX - fromX) * ease;
        setX(x);

        if (p < 1) {
          decRafId = requestAnimationFrame(decTick);
        } else {
          decRafId = null;
          resumeAt(x);
        }
      }

      decRafId = requestAnimationFrame(decTick);
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
      if (isDragging || decRafId) onEnd();
    });

    /* toque */
    track.addEventListener("touchstart", function (e) {
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    track.addEventListener("touchmove", function (e) {
      if (!isDragging) return;
      var t   = e.touches[0];
      var adx = Math.abs(t.clientX - startX);
      var ady = Math.abs(t.clientY - touchStartY);
      if (isHorizontal === null && (adx >= 5 || ady >= 5)) isHorizontal = adx >= ady;
      if (isHorizontal) e.preventDefault();
      onMove(t.clientX, t.clientY);
    }, { passive: false });
    track.addEventListener("touchend",   onEnd);
    track.addEventListener("touchcancel", onEnd);

    /* click: cancelar si hubo arrastre real */
    track.addEventListener("click", function (e) {
      if (Math.abs(currentDragX - startOffset) > 8) e.stopPropagation();
    }, true);
  }

  /* ---------- efecto foco: imagen central amplificada ---------- */
  var focoRafId = null;

  function iniciarFocoCarrusel() {
    if (focoRafId || reduced) return;
    var track = carrusel.querySelector(".carrusel__track");
    if (!track) return;

    function tick() {
      if (!carrusel.classList.contains("is-active")) { focoRafId = null; return; }

      var cr  = carrusel.getBoundingClientRect();
      var cx  = cr.left + cr.width / 2;
      var items = track.children;
      var rects = [];
      var i;

      /* lectura en lote (evita thrashing) */
      for (i = 0; i < items.length; i++) rects.push(items[i].getBoundingClientRect());

      /* escritura en lote */
      var range = cr.width * 0.58;
      for (i = 0; i < items.length; i++) {
        var ic   = rects[i].left + rects[i].width / 2;
        var dist = Math.abs(ic - cx);
        var t    = Math.max(0, 1 - dist / range);
        var s    = t * t * (3 - 2 * t); /* smoothstep: pop suave en el centro */

        items[i].style.transform = "scale(" + (0.80 + s * 0.26).toFixed(3) + ")";
        items[i].style.opacity   = (0.38 + s * 0.62).toFixed(3);
        items[i].style.zIndex    = Math.round(s * 10);
      }

      focoRafId = requestAnimationFrame(tick);
    }

    focoRafId = requestAnimationFrame(tick);
  }

  function detenerFocoCarrusel() {
    if (focoRafId) { cancelAnimationFrame(focoRafId); focoRafId = null; }
    carrusel.querySelectorAll(".carrusel__item").forEach(function (item) {
      item.style.transform = "";
      item.style.opacity   = "";
      item.style.zIndex    = "";
    });
  }

  function mostrarCarrusel() {
    buildCarrusel();
    galeria.style.display = "none";
    carrusel.classList.add("is-active");
    iniciarFocoCarrusel();
  }

  function mostrarGaleria(cat) {
    detenerFocoCarrusel();
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
