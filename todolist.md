### Lista de tareas de MONETIX (MVP y base)

- [x] Prototipar la estructura base del proyecto
  - Elegir stack backend: Node.js/Express o Python/FastAPI
  - Frontend en React + Tailwind con layout de dashboard y tarjetas dummy
  - Backend con endpoints mockeados: `/inflation`, `/exchange-rate`, `/assets`, `/news`, `/daily-message`
  - Simular respuestas de cada endpoint con datos falsos (fixtures)
  - Scripts de desarrollo para correr frontend y backend en local

 - [x] Feature: Tarjeta de Inflación + endpoint `/inflation`
   - Backend: endpoint mock `/inflation` con datos de inflación del último mes
   - Frontend: card UI mostrando inflación del último mes
   - Integración: fetch, estado de carga y errores
   - Pruebas manuales y validación de formato

 - [ ] Feature: Precio del dólar (oficial y paralelo) + endpoint `/exchange-rate`
   - Backend: endpoint mock `/exchange-rate` con oficial y paralelo
   - Frontend: card UI con ambos valores y variación
   - Integración: fetch y refresco periódico
   - Pruebas manuales

 - [ ] Feature: Watchlist de activos + endpoint `/assets`
   - Backend: endpoint mock `/assets` con 5 activos (ej.: AAPL, BTC, S&P500, ETH, oro)
   - Frontend: card con lista/tabla de activos y variación
   - Frontend: CRUD simple para personalizar la watchlist
   - Integración: persistencia local/DB si disponible
   - Pruebas manuales

 - [ ] Feature: Noticias resumidas + endpoint `/news`
   - Backend: endpoint `/news` sirviendo dummy con titulares y resumen
   - Frontend: card "Noticias financieras resumidas"
   - Integración: fetch y top N
   - Pruebas manuales

 - [ ] Feature: Mensaje financiero del día + endpoint `/daily-message` + compartir
   - Backend: endpoint `/daily-message` con mensaje hardcoded
   - Frontend: card fija con el mensaje del día
   - Frontend: botón "Compartir" (Web Share API o copiar al portapapeles)
   - Integración: fetch y cache simple
   - Pruebas manuales

- [ ] Motor de traducción a impacto (reglas simples)
  - Inflación ↑ → "Tus gastos mensuales podrían subir X%"
  - Dólar ↑ → "Viajar o importar productos costará más caro"
  - Activo en alza/baja >5% → "Movimiento fuerte que puede impactar fondos de inversión"
  - Integrar el motor en el backend para enriquecer las respuestas

- [ ] Noticias resumidas
  - Ingesta/scraping de un feed de noticias financieras (ej.: RSS de Yahoo Finance)
  - Resumen automático con un modelo de IA (ej.: OpenAI API)
  - Exponer endpoint para consumir desde el frontend

- [ ] Infraestructura mínima
  - DB (Postgres o Mongo) para configuraciones de usuario y favoritos
  - Scheduler para refrescar datos cada 15 minutos
  - Logging básico
  - Manejo de errores

- [ ] Monetización
  - Definir versión gratuita con anuncios
  - Integrar anuncios en el frontend
  - Definir versión premium sin anuncios
  - Añadir más personalización y reportes de impacto detallados

- [ ] Estilo y calidad de código
  - Código limpio, modular y documentado
  - Arquitectura escalable para integrar alertas, calendarios y analítica
  - Configurar linters y formateadores
  - Documentación básica en `README`

- [ ] Lanzamiento inicial y QA
  - Pruebas manuales del dashboard
  - Validación de endpoints y consistencia de datos
  - Checklist básico de rendimiento
