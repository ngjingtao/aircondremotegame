# Copy-paste prompts

Give the image model the **master style**, then the **scene line** for the file,
then the **negative** line. One image per file. Do not ask it to draw a grid or
a contact sheet; the app needs separate files.

## Master style (paste first)

```text
Flat 2D children's science illustration for ages 5–9, hand-drawn vector look,
thick soft rounded shapes, subtle paper grain, warm friendly light, limited
palette: ink #1b2430, paper #f4efe4, cyan #67e8f9, teal #22a8c4, amber #f0a03a,
coral #e85d5d, leaf #6fbf5f, sky #8fd0ff. Centered composition, large simple
forms, clear silhouette, calm negative space, consistent props and light
direction within a lesson. Portrait 2:3, 1024×1536.
```

## Negative (paste last)

```text
text, letters, numbers, labels, captions, arrows containing words, UI,
watermark, logo, frame, photorealistic, 3D render, CGI, glossy plastic, neon,
lens flare, heavy gradients, clutter, scary faces, deformed anatomy, extra
limbs, extra fingers, muddy colours.
```

The only allowed letters anywhere in this set are **N** and **S** on magnets and
a compass. Everything else is textless. The app writes every word.

## Template

```text
<MASTER STYLE>

Scene: <the line below>

<only for magnets: Only the letters N and S may appear, painted on the magnet.>
<only for tiles: Square 1:1, 512×512, one clear moment readable at 76 px.>

Negative: <NEGATIVE>
```

Generate the six plates of one lesson in one session, with the same style
reference/seed if the tool supports it. Review them side by side before moving
to the next lesson.

---

## Electricity — `www/art/lessons/electric/`

```text
01  A friendly battery on a wooden workbench, two metal terminals, a soft charge
    glow, no wires yet.
02  The same workbench and battery wired in a complete loop to a small open
    switch and a dark bulb; the wire path is clear.
03  Close-up of the switch lever closing the loop, a tiny clean spark, the wire
    path continuous.
04  The same circuit with the bulb glowing warm, filament visible, soft amber
    light on the workbench.
05  A tray with a copper coin and an iron nail beside a rubber eraser and a
    plastic ruler; the metal path glows, the plastic path is blocked.
06  A wall socket with a red warning triangle, a hand and a key pulled back, a
    red danger arc, safe distance, danger averted, no injury.
```

## Magnetism — `www/art/lessons/magnet/`

```text
01  A bar magnet on a wooden shelf pulling a nail and paperclips; a wooden
    block, eraser and glass cup stay still.
02  Close-up of a bar magnet's two poles with soft field rings; only the
    letters N and S are painted on the magnet.
03  Two pairs of bar magnets: N-to-N pushing apart, N-to-S snapping together,
    clear motion arcs; N and S on the magnets.
04  Iron filings forming curved field lines around a bar magnet on paper.
05  A nail touching a magnet, a chain of paperclips hanging from the nail.
06  A compass on a shelf, needle pointing north, a soft curved Earth horizon
    behind; N and S on the compass only.
```

## Light — `www/art/lessons/light/`

```text
01  A warm lamp in a dim room, straight light rays, a watching eye in the
    foreground.
02  A beam passing through a slit in a card and landing as a straight line on a
    screen.
03  A small tree and a ball casting soft shadows on the floor in lamp light.
04  The lamp moved close to the ball, a much bigger shadow, same room and ball.
05  A hand mirror on a stand reflecting a beam across the room.
06  A glass of water with a straw that looks bent at the water line.
```

## Sun bear — `www/art/lessons/sunbear/`

```text
01  A small sun bear in a green rainforest, a soft height marker beside it, no
    numbers or text on the marker.
02  Close-up of the sun bear's orange chest patch glowing like a little sun;
    short black fur, pale muzzle.
03  The sun bear's long tongue reaching a hive on a tree trunk.
04  Forest floor with a termite mound, ants, a beetle and a piece of fruit; the
    bear sniffing.
05  The sun bear climbing a tall trunk, strong claws visible, four limbs on the
    trunk.
06  The sun bear behind a green shield with a paw print and small hearts, the
    forest safe behind, hopeful not sad.
```

## Speaker — `www/art/lessons/speaker/`

```text
01  A cutaway speaker cabinet showing the cone, magnet and coil, cut open not
    broken.
02  Close-up of the magnet and voice coil inside the speaker; the coil sits in
    the magnet gap.
03  A soft signal waveform entering the coil, the coil pushing, motion arrows,
    no numbers.
04  The cone pushing air, sound arcs and tiny dust particles moving.
05  Dense high-frequency waves, the cone moving quickly with tight arcs.
06  Tall amplitude waves, a big sound arc, the cone at full excursion.
```

## Computer — `www/art/lessons/computer/`

```text
01  A laptop with a glowing keyboard, a data path flowing into a cutaway
    circuit board; no readable letters on the keys.
02  A close-up CPU chip glowing on a green circuit board, no brand marks.
03  Two RAM sticks glowing in their slots, not a hard drive.
04  An SSD with a simple file icon, data blocks moving in, no file names.
05  A data path from the board to a bright screen showing a simple picture, no
    UI text on the screen.
06  Abstract two-colour dots and dashes flowing around the CPU, no readable
    0/1 or code.
```

## Power journey — `www/art/lessons/power/`

```text
01  A friendly power plant with a spinning turbine and generator, soft smoke,
    green landscape.
02  A step-up transformer beside the plant, coils and a tall bushing, no
    voltage numbers.
03  Pylons carrying wires across hills, a soft current glow along connected
    cables.
04  A fenced substation with transformers and insulators, no people climbing.
05  A distribution wire to a house, a meter on the wall, no digits on the
    meter.
06  A wall socket and plug close-up with a small lightning motif, no 230 V or
    50 Hz text.
```

## Electrical safety — `www/art/lessons/safety/`

```text
01  A wall socket with a key and a finger pulled away by a red warning arc,
    danger averted, no injury.
02  A dripping tap above a plug lying in a puddle, water droplets, danger, the
    plug is not plugged in.
03  An extension lead with too many plugs, heat squiggles and a red glow, a
    warning moment, no fire.
04  A damaged cord with exposed copper and small sparks, no child holding the
    bare copper.
05  A three-pin plug with the earth wire going to a ground symbol, an RCD box
    beside it, earth in green/yellow, no other text.
06  A stormy room with lightning, a short-circuit spark and smoke, a child
    safely back, fear is okay but no injury.
```

---

# Home tiles

Master tile style — same palette and line language, but square and simpler:

```text
Flat 2D children's illustration tile for a learning app, hand-drawn vector
look, thick soft rounded shapes, subtle paper grain, warm friendly light,
limited palette: ink #1b2430, paper #f4efe4, cyan #67e8f9, teal #22a8c4,
amber #f0a03a, coral #e85d5d, leaf #6fbf5f, sky #8fd0ff. One clear moment,
large silhouette readable at 76 px, simple background, square 1:1, 512×512.
Negative: <NEGATIVE>.
```

Place each at `www/art/tiles/<key>.webp`.

```text
aircond      A child with a remote between a hot sun and a cool snowflake room,
             one split moment.
food         A sandwich and an apple following a friendly path through a simple
             body outline.
train        A cheerful train at a level crossing, barrier down, one moment.
breath       Lungs and a heart in a soft body outline, air and blood paths.
aircare      A cutaway air conditioner with a sponge, water droplets and a clean
             filter.
toilet       A cutaway toilet showing the tank, flapper, siphon and water seal.
indah        Wastewater flowing from a house through pipes to a green treatment
             plant.
hood         A kitchen hood pulling smoke and smell up from a pan.
laundry      A washing machine and dryer with clothes and bubbles.
tree         A seed, a sprout and a tall tree in one growing arc.
sandwich     A tall sandwich with bread, egg, cucumber and lettuce.
waterhome    A rooftop tank, pipes and a tap with a water drop.
cycle        A water droplet travelling from sea to cloud to rain to river.
weather      A weather station with sun, cloud, rain and a wind vane.
engine       A cutaway car engine with piston, crank and spark plug.
electric     A battery, a wire loop and a glowing bulb.
magnet       A horseshoe magnet pulling paperclips, field arcs.
light        A lamp, a beam and the shadow of a ball.
sunbear      A sun bear's face and orange chest patch in the forest.
speaker      A speaker cone with sound waves.
computer     A laptop with a glowing chip and data path.
power        A pylon, a wire and a house with a meter.
safety       A socket with a red warning triangle and a hand pulling away.
```

## One assembled example

```text
Flat 2D children's science illustration for ages 5–9, hand-drawn vector look,
thick soft rounded shapes, subtle paper grain, warm friendly light, limited
palette: ink #1b2430, paper #f4efe4, cyan #67e8f9, teal #22a8c4, amber #f0a03a,
coral #e85d5d, leaf #6fbf5f, sky #8fd0ff. Centered composition, large simple
forms, clear silhouette, calm negative space, consistent props and light
direction within a lesson. Portrait 2:3, 1024×1536.

Scene: The same circuit with the bulb glowing warm, filament visible, soft
amber light on the workbench.

Negative: text, letters, numbers, labels, captions, arrows containing words, UI,
watermark, logo, frame, photorealistic, 3D render, CGI, glossy plastic, neon,
lens flare, heavy gradients, clutter, scary faces, deformed anatomy, extra
limbs, extra fingers, muddy colours.
```

If the model only offers 1024×1024 or 1024×1536, ask for the closest 2:3 and
resize/crop without stretching. Keep the subject in the central 80%.
