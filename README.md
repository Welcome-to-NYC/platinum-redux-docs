# Platinum Redux Docs

Static documentation site for the **Pokémon Platinum Redux v3.3** romhack — a browseable companion to the official xlsx/docx docs.

🔗 **Live site:** https://welcome-to-nyc.github.io/platinum-redux-docs/ *(once GitHub Pages is enabled)*

## What's here

- Pokédex with stats, abilities, level-up & TM learnsets, where each Pokémon appears in the wild and which trainers use it
- All moves, sortable & filterable
- TM list with single-copy + infinite-copy locations
- Modified type chart (Redux balance changes baked in) plus a list of every change with the explanation
- Every trainer team in the game (819 trainers)
- Every boss fight with IVs, nature, speed for both Normal and Hardcore mode
- Wild encounters by area
- Walkthrough item/event list per area
- Battle items + credits

Pixel/GBA-styled UI, mobile and desktop responsive. No build step — vanilla HTML/CSS/JS modules.

## Stack

- Plain HTML + ES modules, no framework
- Sprites pulled from [PokeAPI](https://github.com/PokeAPI/sprites) (Gen IV Platinum sprites)
- Data pre-built from `Platinum Redux v3.3 docs.xlsx` into `data/*.json`

## Rebuilding the data

If the source xlsx/docx is updated, regenerate the JSON files:

```bash
pip install openpyxl python-docx
python3 scripts/build_data.py
```

The script expects the xlsx + docx in `../platinum redux/` (sibling folder).

## Local dev

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Credits

- Romhack data and design: the Platinum Redux team (see [credits page](#/credits))
- Sprites: [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- This site: a fan-built static reference, not affiliated with The Pokémon Company or Game Freak.
