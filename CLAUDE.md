# MECHA Tattoo — Instrucciones maestras para Claude Code

## Contexto del proyecto

Este proyecto consiste en crear una web profesional para MECHA Tattoo, marca artística de Ángel Sánchez, tatuador en Profano Tattoo, Murcia.

La web debe funcionar como portfolio artístico premium, carta de presentación profesional y canal de reservas cualificadas.

El objetivo no es crear una web genérica de tatuajes, sino una presencia digital con identidad propia, oscura, artística, alternativa, energética y coherente con el universo visual de Mecha.

---

## Skill principal de UI/UX

Este proyecto usa una skill local instalada manualmente en:

`.claude/skills/ui-ux-pro-max-skill`

Claude debe usar esta skill como apoyo principal para:

* Dirección visual.
* UI/UX premium.
* Diseño mobile-first.
* Arquitectura de la experiencia.
* Composición visual.
* Sistema de color.
* Tipografías.
* Presentación del portfolio.
* Microinteracciones.
* Accesibilidad.
* Conversión a contacto/reserva.

No debe instalar plugins, marketplace ni dependencias innecesarias sin justificarlo.

No debe gastar tiempo ni tokens en instalar la skill. Ya está instalada localmente.

---

## Archivos que Claude debe revisar antes de trabajar

Antes de escribir código, Claude debe revisar obligatoriamente:

* `briefing/preguntas-respuestas.md`
* `briefing/contenido-web.md`
* `briefing/estructura-web.md`
* `branding/guia-visual.md`
* `branding/guia-visual/guia-visual-mecha-branding.jpg`
* `portfolio-seleccionado/`
* `referencias/webs-referencia.md`
* `legal/pendiente-legal.md`

También debe revisar la skill local:

* `.claude/skills/ui-ux-pro-max-skill`

---

## Identidad de marca

Nombre en la web: Mecha
Nombre real: Ángel Sánchez
Nombre artístico: Mecha
Estudio: Profano Tattoo
Ubicación: Murcia
Instagram: @mecha.ttt
WhatsApp: +34 611 64 53 33
Email: [mecha.tatt@gmail.com](mailto:mecha.tatt@gmail.com)

Mecha es un tatuador motivado por el arte y la ilustración, en búsqueda constante de un estilo propio que lo defina.

Tatuar para él es una forma de expresión artística con identidad, no un servicio genérico.

---

## Posicionamiento

La web debe posicionar a Mecha como un tatuador serio, artístico y con una identidad visual propia.

Debe atraer a personas alternativas, con gustos estéticos oscuros y distintos a lo convencional.

Debe filtrar al cliente correcto: personas que buscan algo artístico, con carácter, oscuro, ornamental, orgánico, tribal o ilustrativo.

La web no debe intentar gustar a todo el mundo.

---

## Estilos principales a promocionar

La web debe promocionar estos estilos:

* Blackwork ilustrativo.
* Ornamental.
* Orgánico.
* Tribal.
* Black & gray.
* Flash artístico.

Los flash son una especialidad de Mecha y deben tener presencia destacada.

---

## Estilos que NO deben promocionarse

La web no debe promocionar ni sugerir como línea principal:

* Fine line.
* Lettering.
* Color.
* Tatuajes comerciales.
* Tatuajes genéricos.
* Estética limpia en exceso.
* Diseño corporativo frío.
* Plantilla básica de estudio de tatuajes.

---

## Dirección visual

La web debe sentirse:

* Oscura.
* Gótica.
* Alternativa.
* Mágica.
* Orgánica.
* Tribal.
* Ornamental.
* Artística.
* Energética.
* Premium.
* Profesional.
* Selectiva.
* No apta para todos los públicos.

Debe evitar:

* Estética comercial.
* Web blanca o demasiado luminosa.
* Recursos genéricos de tattoo studio.
* Clichés visuales si no pertenecen realmente al universo de Mecha.
* Diseño de marketplace.
* Diseño de clínica.
* Diseño demasiado amable, neutro o corporativo.

---

## Branding

La guía visual principal está en:

`branding/guia-visual/guia-visual-mecha-branding.jpg`

Esta imagen contiene:

* Logos.
* Paleta de colores.
* Tipografía.
* Estilo visual general.
* Referencias de marca.

Claude debe analizar esta imagen antes de definir colores, tipografías, favicon, layout y recursos gráficos.

Si necesita extraer colores aproximados, debe hacerlo desde esa imagen y proponer una paleta coherente.

No debe rediseñar la marca desde cero salvo que sea necesario para crear adaptaciones técnicas como favicon, versión responsive o uso sobre fondo oscuro.

---

## Portfolio

La carpeta principal para imágenes finales es:

`portfolio-seleccionado/`

Claude debe usar esta carpeta para construir el portfolio de la web.

La carpeta:

`portfolio-original/`

es solo archivo bruto. No debe modificarse ni usarse como fuente principal salvo que se indique expresamente.

El portfolio debe priorizar calidad, impacto visual y coherencia estética por encima de cantidad.

Mejor pocas imágenes muy buenas que muchas imágenes medias.

Categorías previstas:

* Orgánico.
* Ornamental.
* Ilustrativo.
* Tribal.
* Black & gray.
* Flash.
* Bocetos / conceptos.
* Proceso.
* Cicatrizados.
* Estudio / retrato.

Claude puede reorganizar visualmente estas categorías si encuentra una estructura más potente, pero debe justificarlo.

---

## Contacto y reservas

Los canales prioritarios son:

1. WhatsApp: +34 611 64 53 33
2. Instagram DM: @mecha.ttt
3. Email: [mecha.tatt@gmail.com](mailto:mecha.tatt@gmail.com)

No es obligatorio crear un formulario complejo si WhatsApp e Instagram resuelven mejor la conversión.

El proceso de reserva debe explicarse así:

1. El cliente escribe con su idea principal y la zona del cuerpo donde quiere el tatuaje.
2. Se agenda una videollamada o consulta presencial.
3. Mecha asesora al cliente, conoce su estética personal y entiende el proyecto antes de diseñar.
4. Se define la pieza, tamaño, zona y fecha.

La web debe orientar hacia reservas cualificadas, no hacia contactos vacíos.

---

## Arquitectura web

Claude tiene libertad para decidir la arquitectura definitiva.

Puede proponer:

* Landing page premium.
* Web multipágina.
* Estructura híbrida.
* Portfolio filtrable.
* Página específica para flash.
* Secciones narrativas.
* Animaciones sutiles.
* Transiciones visuales.
* Recursos gráficos propios.

Antes de construir, debe entregar:

1. Diagnóstico visual del proyecto.
2. Propuesta de arquitectura web.
3. Justificación de la estructura elegida.
4. Stack técnico recomendado.
5. Plan de ejecución por fases.

No debe escribir código hasta entregar ese diagnóstico inicial y recibir validación.

---

## Stack técnico

Claude debe recomendar el stack más adecuado para una web:

* Rápida.
* Visual.
* Mobile-first.
* SEO-friendly.
* Fácil de desplegar.
* Fácil de mantener.
* Preparada para portfolio de imágenes.

Opciones aceptables:

* Astro.
* Next.js.
* React + Vite.
* HTML/CSS/JS si lo considera suficiente.
* Tailwind CSS si aporta velocidad y consistencia visual.
* Otras herramientas justificadas.

Debe evitar sobredimensionar el proyecto.

La prioridad es una web sólida, estética, rápida y fácil de publicar.

---

## Reglas de trabajo

Claude debe cumplir estas reglas:

* No borrar imágenes originales.
* No modificar `portfolio-original/`.
* No instalar dependencias innecesarias.
* No usar marketplace para instalar skills.
* No crear una web genérica.
* No empezar a programar sin diagnóstico previo.
* No hacer preguntas innecesarias si la información ya está en los archivos.
* No inventar datos personales, legales o profesionales.
* No usar imágenes externas sin permiso.
* No usar textos vacíos tipo plantilla.
* No usar estética comercial ni corporativa.
* No promocionar estilos que Mecha no quiere trabajar.

---

## Criterios de calidad

La web final debe cumplir:

* Diseño mobile-first.
* Carga rápida.
* Buen contraste.
* Portfolio visual potente.
* CTAs claros a WhatsApp e Instagram.
* Estética oscura y premium.
* Textos con carácter.
* SEO básico.
* Buena estructura semántica.
* Imágenes optimizadas.
* Footer profesional.
* Preparación para aviso legal, privacidad y cookies si se despliega públicamente.
* Experiencia visual memorable.

---

## Tono de comunicación

El tono debe ser:

* Directo.
* Artístico.
* Oscuro.
* Seguro.
* Profesional.
* Con carácter.
* Nada genérico.
* Nada excesivamente comercial.
* Nada artificialmente amable.

La web debe sonar como una marca artística con criterio, no como una plantilla de servicios.

---

## Primera tarea obligatoria de Claude

Cuando se inicie Claude Code en este proyecto, la primera respuesta debe ser solo un diagnóstico y plan.

Claude debe responder con:

1. Qué entiende del proyecto.
2. Qué archivos ha revisado.
3. Qué oportunidades visuales detecta.
4. Qué riesgos hay que evitar.
5. Qué arquitectura web propone.
6. Qué stack recomienda.
7. Qué fases de ejecución propone.

No debe modificar archivos ni escribir código en la primera respuesta.
