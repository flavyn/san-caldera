# HEATLINE verification gate

Verified 17 November 2026 in this repository. This records local evidence, not a judge score or a submission receipt.

## Live eligibility facts

- The live requirements endpoint `https://make.fun/api/competitions/gta6-01/requirements` returned HTTP 200, competition `open`, and `entry_fee: null`. No fee, credits, transaction or paid service was used.
- The official kit's local check reports opening `2026-11-17T15:00:00Z` and entry deadline `2026-11-24T15:00:00Z`.
- GitHub's public repository API returned `flavyn/san-caldera`, `private: false`, creation time `2026-11-17T15:00:13Z`, homepage `https://make.fun/bounty/gta6-01`, and topic `makefun`. Repository creation is 13 seconds after opening.
- README includes all three required live badge images with the concrete owner/repository `flavyn/san-caldera` and links to make.fun.
- A local recording metadata file exists for this repository: recording `01a1ea06-b279-70a2-867c-a64acc74313d`, started `2026-11-17T15:01:09.852Z`. Its existence and advancing local recording files are evidence of a recorder, not proof that the server accepted or sealed this session. Final transcript eligibility is unverified locally.

## Authored deliverables

The entire starter `game/` directory was removed before the replacement was created. The old flat `world.js`, `render.js`, `config.js`, `input.js` and `random.js` are gone. The entrypoint `main.ts` was deleted and rewritten. Every current game source, README, this gate document and the four photographs was created in this session. No game engine, downloaded source or generated starter was imported. `vendor/makefun-game.ts` has no diff against HEAD.

The 19 game files have separate responsibilities: bootstrap and fixed steps, city, collision, traffic, pedestrians, on-foot movement/combat, driving, wanted heat, pursuit, mission chain, delivery progression, minimap, HUD, save slots, synthesis, camera, perspective scene drawing, deterministic photographs and the HTML entry.

All city names, districts, characters, vehicles, story beats, meshes and synthesis are original. No external art, font, sound recording, music recording or commercial game material is present.

## Browser acceptance

Browser reported **Chrome/156.0.8078.96** on Windows. Both direct disk loading and the supplied static server were exercised. The Node 22 server command was:

```powershell
& C:\Users\xywal\.local\bin\node.exe serve.ts --port 8097
```

Port 8080 was already occupied, so testing used 8096 on Node 24 and 8097 on Node 22.18-compatible Node 22.23.4. The server source was unchanged.

| Check | Observed evidence |
| --- | --- |
| Direct open | `file:///.../game/index.html` starts at the title screen and enters play with N |
| Walking | Keyboard W moved player Z from 6 to 9.01 |
| Enter and drive | E entered a nearby parked vehicle; W accelerated to 9.095 world metres/second |
| Vehicle theft | E entered an occupied civilian car; wanted heat became 34 |
| Responding police | Continued gunfire reached wanted 3 with 4 officers and 4 police cruisers in live state |
| Missions | N begins the first briefing; M accepts/replays a contract through keyboard input |
| Slot 1 | F saved position, car, story and cash; reload + Enter restored car and position |
| Slots 2 and 3 | Escape, slot number, F, reload, slot number, Enter restored wanted 3 and heat 80 |
| Sound | A user input unlocked an AudioContext in `running` state; engine, gunfire, siren and original musical sequence are synthesized |
| Console | Runtime exception and browser error events: none during tested file and HTTP flows |
| Disk network audit | 0 HTTP/HTTPS requests; script reads used only `file:` URLs under game/ |
| Dependencies | No imports, third-party engine, network API or media file requests |

The browser registered 38 local file reads across a disk-page load and reload: 19 files per page. Those are filesystem reads, not network requests. On HTTP, the same files necessarily arrive through the local static server; there are no external requests.

The mission chain was additionally tested in isolated fresh state by invoking its actual gameplay functions at the destination coordinates. This was a system test, not a claim that all three missions were manually driven end to end:

1. Delivery advanced index 0 → 1 and money $1,240 → $2,090.
2. Harbor recovery advanced index 1 → 2 and money $2,090 → $3,690, with heat 134.
3. Final delivery remained blocked while wanted; clearing heat then returning advanced index 2 → 3 and money $3,690 → $6,890.
4. Interior building coordinates were solid; repeated city generation with seed 71 was identical.

The renderer's four-sample cover timing improved from roughly 33–40 ms to 22–27 ms after hidden surfaces and distant windows were culled. This is a small local sample, not a guaranteed frame rate.

## Photographs

Each file comes directly from the game's 1280×720 canvas via `toDataURL('image/jpeg', 0.9)`. No editing, compositing, resizing or external imagery was used. The game freezes state at simulation tick 2520 and time 42 seconds; `window.__shotReady` is set after drawing. The byte string was compared with a fresh page reload for each query: all four matched.

| File | Query (seed 71) | Bytes | Visible content |
| --- | --- | ---: | --- |
| `screenshots/1-chase.jpg` | `?shot=play&seed=71` | 145,698 | Third-person downtown incident, aiming protagonist, broadside cruiser, two officers, stopped civilian cars, pedestrians, three wanted stars, contract, health/armour/cash and red minimap blips |
| `screenshots/2-drive.jpg` | `?shot=drive&seed=71` | 125,400 | Rear follow camera, nearby oncoming car, traffic ahead, coastal promenade, palms, sailboats and ocean, 086 km/h, route line and gold mission marker |
| `screenshots/3-mission.jpg` | `?shot=mission&seed=71` | 154,558 | Player behind a car, muzzle flash and tracer, named Tomas Reyes dialogue, objective list, three wanted stars, minimap and 06/72 ammunition |
| `screenshots/4-title.jpg` | `?shot=title&seed=71` | 109,410 | Title, continue/new story, three deterministic example save slots with playtime/cash/district and a city background |

Title photograph slots are example state inside photo mode; photo mode never reads or changes real saves. The ordinary title screen displays actual local slots.

## Artifact verification

```powershell
& C:\Users\xywal\.local\bin\node.exe verify.mjs
```

Measured with **Node v22.23.4**:

- `game/`: **28 files plus directories**, 19 regular files, **55,607 bytes**; limits 993 entries / 50,331,648 bytes.
- All game JavaScript files pass Node syntax checking; every HTML script names an existing file under game/.
- Four valid JPEG headers, each below 262,144 bytes.
- `main.ts` produces **24 output files**, including a **771,737-byte** canonical dossier.
- Output trees from `out/` and `out-repeat/` matched by relative path and SHA-256 for every file. A third packaging run into the existing `out/` matched the same manifest.
- Dossier SHA-256: `f2d8d1465477e88ad223120b72e3fa83350f4d4b3d9eaa3255c5fa3c35557978`.
- The vendored helper is unchanged. `git diff --check` exited 0. Git printed a warning about an invalid attribute in the deleted starter `.gitattributes`; that file was already deleted before this task and was left alone.

The official pre-submit command was also executed against the working tree:

```powershell
& C:\Users\xywal\.local\bin\node.exe D:\dipsik\makefun\kit\gta6-01\gta6-01-kit\cli\makefun.mjs check --repo D:\dipsik\makefun\entries\gta6-san-caldera --worktree --json
```

Result: **`ok: true`, `failed: []`**. Local passing rows include competition window, snapshot limits, MIT license and the Node 22 entrypoint. Other rows are skipped or deferred to submission. There is no local judge grade for this bounty. A local pre-submit check does not certify the sealed output gate, transcript authorship, witnessed recordings, account wallet, quota, final committed snapshot or server judging.

## Submission boundary

The playable files, four photographs, canonical output and README are ready locally. No entry was submitted and no score or rank is claimed. This session did not commit or push changes, sign a wallet message, stop/seal the existing recorder, or pay anything. The repository HEAD inspected before work was `6e5c3ccec07a9fd828f480bc43ef67eeee795298`; the verified implementation is the current working tree.

Complete the existing recording's normal seal after the build session, commit/push the authored tree and screenshots, then use that sealed recording and the resulting commit in the official submit command. The CLI must construct its run record from the actual session; never invent transcript, usage, witness or signature data. Server acceptance remains the final gate.
