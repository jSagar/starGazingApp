# StarGazing Navigator

A comprehensive single-page star gazing web application for planning observing sessions.

## Features
- Tonight sky condition estimator (moon phase, darkness window, seeing guidance).
- Seasonal visible object explorer with filters, now including all major observable planets.
- Automatic observing plan generator and custom target adder.
- Telescope optics calculator.
- Persistent observation journal (localStorage).
- Full solar-system planet gallery with images and quick facts.
- Red night-mode UI toggle.

## Run
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.


## Troubleshooting
- If you see a blank or not found page, open `http://localhost:8000/index.html` directly.
- Click **Generate Tonight's Plan** to refresh all widgets and the sky preview.
