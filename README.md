# Jose Luis Pastor — Portfolio web

Sitio web personal (una sola página, bilingüe ES/EN) con estética de tecnología geoespacial: fondo animado de estrellas, globo terráqueo wireframe y satélites en órbita.

## Estructura

```
.
├── index.html          # Estructura y contenido
├── css/
│   └── styles.css      # Estilos (tema cosmos oscuro)
├── js/
│   └── main.js         # Idioma ES/EN, animaciones canvas, formulario
├── assets/
│   └── favicon.svg     # Logo / icono de pestaña
├── CV_ES.pdf           # CV descargable (español)
└── CV_EN.pdf           # CV descargable (inglés)
```

Es un sitio **100% estático**: no necesita build ni servidor. Se puede abrir `index.html` directamente o publicarlo en cualquier hosting estático.

## Desarrollo local

Abrir `index.html` en el navegador. Para servirlo con un servidor local (recomendado para rutas relativas):

```bash
# Python
python -m http.server 8000
# o Node
npx serve
```

Luego visita `http://localhost:8000`.

## Publicar en GitHub Pages

1. Crear un repositorio en GitHub (p. ej. `cv-web` o `jose-luis-pastor.github.io`).
2. Desde esta carpeta:

   ```bash
   git init
   git add .
   git commit -m "Primera versión del portfolio web"
   git branch -M main
   git remote add origin https://github.com/USUARIO/REPO.git
   git push -u origin main
   ```

3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guardar.
4. En 1-2 minutos estará online en `https://USUARIO.github.io/REPO/`.
5. (Opcional) **Dominio propio**: en *Settings → Pages → Custom domain*, escribe tu dominio y añade los registros DNS que indique GitHub. HTTPS es gratis.

Cada `git push` a `main` actualiza la web automáticamente.

## Notas

- El botón "Descargar CV" descarga `CV_ES.pdf` o `CV_EN.pdf` según el idioma seleccionado en la web: mantén ambos junto al `index.html`.
- El formulario de contacto abre el cliente de correo del usuario (mailto), no requiere backend.
