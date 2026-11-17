# HEATLINE — San Caldera

[![make.fun · gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01)
[![rank](https://make.fun/badge/gta6-01/flavyn/san-caldera/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard)
[![reward](https://make.fun/badge/gta6-01/flavyn/san-caldera/reward.svg)](https://make.fun/bounty/gta6-01)

A sunlit coastal crime story, built from original Canvas geometry and synthesized sound. Explore San Caldera on foot, borrow or steal a Nomad S4, navigate live traffic, and outrun a responding police force. Three connected contracts follow a missing courier, a stolen harbor ledger, and the journey home.

Open `game/index.html` in desktop Chrome. It runs directly from disk, offline, without installation or a build. For local HTTP play, use Node 22.18 or newer:

```sh
node serve.ts --port 8096
```

Then open `http://localhost:8096`. The game contains no external libraries, fonts, images, recordings, telemetry, or network API calls. Graphics are software-projected Canvas 2D paths. Music, engines, gunfire and sirens are WebAudio synthesis, enabled by the first keyboard or mouse interaction.

| Control | Action |
| --- | --- |
| Enter / N | Continue selected save / new story |
| WASD | Walk / accelerate, brake and steer |
| Left / Right arrow | Turn on foot |
| Right mouse + drag | Aim and turn |
| Left mouse / Space | Fire on foot; Space is handbrake in a car |
| Shift | Run / ready sidearm |
| E | Enter, steal, or exit a nearby car |
| R | Reload from reserve ammunition |
| M | Accept the next contract / replay its briefing |
| Escape | Pause and open the save screen |
| 1 / 2 / 3 | Select one of three local save slots in the menu |
| F / L | Save / load selected slot; F also quicksaves during play |
| V | Toggle synthesized audio |

Saves live in this browser's local storage. A save includes your position, vehicle, mission progress, money, health, armour, ammunition and wanted heat. Save, reload the page, then press Enter to continue the selected slot. Slot selection resets to slot 1 on a fresh page; select 2 or 3 before continuing those stories. Private browsing or disabled storage can prevent persistence; the game displays a storage error when a save fails. The title photograph uses deterministic example slots and does not overwrite real saves.

The minimap remains visible throughout gameplay. Gold indicates your contract route; red identifies responding units. Shooting, stealing an occupied vehicle and collisions raise wanted heat. Drive beyond pursuing units and stay out of their observation range to let heat decay. Officers can be stunned by aimed fire. Losing all health returns you to the downtown clinic with a $200 charge.

Three contracts unlock in order: **Borrowed Time** ($850 delivery), **Paper Trail** ($1,600 ledger recovery), and **The Long Way Home** ($3,200 escape and return). Press M to accept each new contract. Reach the harbor marker, step out of the car, and fire three shots to break the lockbox seal. Lose the police before returning home. Free roam continues after the final reward.

The four 1280×720 photographs are drawn by the game itself at a frozen simulation state, using the same world, vehicles, characters, HUD and renderer as live play:

| File | Query |
| --- | --- |
| `screenshots/1-chase.jpg` | `?shot=play&seed=71` |
| `screenshots/2-drive.jpg` | `?shot=drive&seed=71` |
| `screenshots/3-mission.jpg` | `?shot=mission&seed=71` |
| `screenshots/4-title.jpg` | `?shot=title&seed=71` |

`window.__shotReady` becomes true after the complete frame is on the canvas. Photograph simulation time is exactly 42 seconds; it never advances with wall time. The seed changes the city's architectural details. Photo mode ignores input and storage contents.

To create the submission artifact in PowerShell:

```powershell
$env:MAKEFUN_OUTPUT_DIR = 'out'
node main.ts
```

`main.ts` copies only `game/` and `screenshots/`, then creates the canonical dossier using the unchanged vendored helper. It uses the standard library and does not run a build or make requests. See [GATE.md](GATE.md) for measured checks and submission status. This project targets [the make.fun bounty](https://make.fun/bounty/gta6-01); a local check is not a server verdict or a submitted entry.

All city planning, names, characters, vehicles, story, geometry and synthesis in HEATLINE are original to this entry. Licensed under MIT.
