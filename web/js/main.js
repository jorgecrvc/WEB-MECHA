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

  /* ---------- filtros de portfolio ---------- */
  var filtros = document.querySelectorAll(".filtro");
  var piezas = document.querySelectorAll(".pieza");

  filtros.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.filtro;
      filtros.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      piezas.forEach(function (p) {
        p.classList.toggle("is-hidden", cat !== "todo" && p.dataset.cat !== cat);
      });
    });
  });

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox.querySelector("img");
  var lightboxClose = lightbox.querySelector(".lightbox__close");

  piezas.forEach(function (pieza) {
    pieza.addEventListener("click", function () {
      var img = pieza.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.showModal();
    });
  });

  lightboxClose.addEventListener("click", function () { lightbox.close(); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("close", function () { lightboxImg.src = ""; });

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
