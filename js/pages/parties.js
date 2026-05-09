// Curated team recommendations for story progression. Each party member has
// catch info, the romhack's evolution levels, role, and a suggested moveset.
// Story-progression info is hand-curated based on the v3.3 data — if the
// data files change, double-check the levels here.

import { pkmnIdFromName } from "../data.js";
import { setTitle, escape, spriteImg, typeChips } from "../ui.js";

const PARTIES = [
  {
    id: "balanced",
    name: "Balanced — Anti-Cynthia",
    style: "Stable Story Clear",
    legendary: false,
    typeChart: "redux",
    blurb:
      "All-rounder team that hits every gym hard and sweeps Cynthia 1's Dragon spam thanks to this hack's Poison→Dragon 2× rule. No legendaries — every member is grabbable in the first half of the game.",
    why: [
      "Cynthia 1's team is Mawile / Sceptile / Milotic / Altaria. Roserade's Sludge Bomb is 2× on three of them.",
      "Steel got nerfed defensively (Dark/Ghost/Psy/Grass all hit it 1×) — Gardevoir Shadow Ball cleans up Steel walls.",
      "Two reliable Dragon answers (Garchomp + Crobat) for Wake/Volkner/Cynthia.",
    ],
    members: [
      {
        species: "Empoleon",
        type1: "Water", type2: "Steel",
        role: "Bulky pivot · special attacker",
        evo: [
          { name: "Piplup", at: "Lv 5 (Trainers School gift)" },
          { name: "Prinplup", at: "Lv 16" },
          { name: "Empoleon", at: "Lv 40" },
        ],
        catch: "Trainers School (Jubilife) — choose Piplup as your gift starter.",
        moves: ["Surf", "Ice Beam", "Flash Cannon", "Grass Knot"],
        carries: "Roark · Bertha · Candice · Flint",
      },
      {
        species: "Garchomp",
        type1: "Dragon", type2: "Ground",
        role: "Physical sweeper",
        evo: [
          { name: "Gible", at: "Route 219 wild (very early)" },
          { name: "Gabite", at: "Lv 20" },
          { name: "Garchomp", at: "Lv 46" },
        ],
        catch: "Route 219 tall grass — also egg from Bicycle Shop (Eterna).",
        moves: ["Earthquake", "Outrage", "Stone Edge", "Crunch"],
        carries: "Roark · Volkner · Flint · Candice",
      },
      {
        species: "Roserade",
        type1: "Grass", type2: "Poison",
        role: "Special wall · anti-Dragon",
        evo: [
          { name: "Roselia", at: "Valley Windworks wild" },
          { name: "Roserade", at: "Lv 25 (per romhack data)" },
        ],
        catch: "Valley Windworks tall grass — also egg from Bicycle Shop.",
        moves: ["Sludge Bomb", "Energy Ball", "Sleep Powder", "Extrasensory"],
        carries: "Cynthia 1 (Sceptile/Milotic/Altaria) · Bertha · Wake",
      },
      {
        species: "Gardevoir",
        type1: "Psychic", type2: "Ghost",
        role: "Special attacker · anti-Fighting/Ghost",
        evo: [
          { name: "Ralts", at: "Sandgem tall grass" },
          { name: "Kirlia", at: "Lv 14" },
          { name: "Gardevoir", at: "Lv 38 (female)" },
        ],
        catch: "Sandgem Town tall grass — also egg from Dawn's House.",
        moves: ["Psychic", "Shadow Ball", "Calm Mind", "Focus Blast"],
        carries: "Maylene · Fantina · Lucian Exeggutor (avoid switching into Girafarig — Normal immune to Shadow Ball)",
      },
      {
        species: "Volcarona",
        type1: "Bug", type2: "Fire",
        role: "Late-game sweeper (Quiver Dance)",
        evo: [
          { name: "Larvesta", at: "Floaroma Meadow wild" },
          { name: "Volcarona", at: "Lv 35" },
        ],
        catch: "Floaroma Meadow tall grass — Larvesta only spawns there pre-E4.",
        moves: ["Quiver Dance", "Bug Buzz", "Fiery Dance", "Giga Drain"],
        carries: "Aaron · Gardenia · Candice · Lucian",
      },
      {
        species: "Crobat",
        type1: "Poison", type2: "Flying",
        role: "Speed pivot · U-turn",
        evo: [
          { name: "Zubat", at: "Oreburgh Mine / Old Chateau" },
          { name: "Golbat", at: "Lv 15" },
          { name: "Crobat", at: "Lv 34" },
        ],
        catch: "Oreburgh Mine — also Old Chateau and several caves later.",
        moves: ["Brave Bird", "Cross Poison", "Roost", "U-turn"],
        carries: "Aaron · Gardenia · Maylene · Cynthia (Cross Poison)",
      },
    ],
  },
  {
    id: "physical",
    name: "Physical Power",
    style: "Hit Hard, Hit First",
    legendary: false,
    typeChart: "redux",
    blurb:
      "Six physical attackers with high BST and aggressive movepools. Less safety net than Balanced — built around overwhelming bosses before they can set up.",
    why: [
      "Five members hit 100+ Attack; four reach 100+ Speed after evolution.",
      "Lucario gets Adaptability in this hack — Close Combat & Bullet Punch are insane.",
      "Tyranitar (Rock/Dark) and Gyarados (Water/Dragon!) cover Fantina, Lucian, and Cynthia at once.",
    ],
    members: [
      {
        species: "Infernape",
        type1: "Fire", type2: "Fighting",
        role: "Mixed sweeper · Mach Punch priority",
        evo: [
          { name: "Chimchar", at: "Lv 5 (Trainers School gift)" },
          { name: "Monferno", at: "Lv 16" },
          { name: "Infernape", at: "Lv 40" },
        ],
        catch: "Trainers School gift — also wild on Route 210/Jubilife.",
        moves: ["Close Combat", "Flare Blitz", "Earthquake", "Mach Punch"],
        carries: "Byron · Candice · Maylene (Coalossal) · Cynthia (Mawile)",
      },
      {
        species: "Garchomp",
        type1: "Dragon", type2: "Ground",
        role: "Physical sweeper",
        evo: [
          { name: "Gible", at: "Route 219 wild" },
          { name: "Gabite", at: "Lv 20" },
          { name: "Garchomp", at: "Lv 46" },
        ],
        catch: "Route 219 tall grass.",
        moves: ["Earthquake", "Outrage", "Stone Edge", "Swords Dance"],
        carries: "Roark · Volkner · Flint · Cynthia (Altaria)",
      },
      {
        species: "Tyranitar",
        type1: "Rock", type2: "Dark",
        role: "Wallbreaker · Sand Stream",
        evo: [
          { name: "Larvitar", at: "Oreburgh Tunnel wild" },
          { name: "Pupitar", at: "Lv 20" },
          { name: "Tyranitar", at: "Lv 47" },
        ],
        catch: "Oreburgh Tunnel — also egg from Creators House (Sandgem).",
        moves: ["Stone Edge", "Crunch", "Earthquake", "Dragon Dance"],
        carries: "Aaron · Fantina · Candice · Lucian",
      },
      {
        species: "Lucario",
        type1: "Fighting", type2: "Steel",
        role: "Adaptability nuke · Bullet Punch priority",
        evo: [
          { name: "Riolu", at: "Eterna City wild / Bicycle Shop egg" },
          { name: "Lucario", at: "Lv 34" },
        ],
        catch: "Eterna City tall grass.",
        moves: ["Close Combat", "Bullet Punch", "Extreme Speed", "Earthquake"],
        carries: "Roark · Byron · Candice · Cynthia (Mawile)",
      },
      {
        species: "Staraptor",
        type1: "Fighting", type2: "Flying",
        role: "Early scout → late sweeper",
        evo: [
          { name: "Starly", at: "Verity Cliff wild (Lv 4-6)" },
          { name: "Staravia", at: "Lv 15" },
          { name: "Staraptor", at: "Lv 36" },
        ],
        catch: "Verity Cliff — also Rowan Lab gift area.",
        moves: ["Close Combat", "Brave Bird", "Double-Edge", "U-turn"],
        carries: "Aaron · Maylene Hakamo-O · Lucian Girafarig (CC neutral but high power)",
      },
      {
        species: "Gyarados",
        type1: "Water", type2: "Dragon",
        role: "Dragon Dance setup sweeper",
        evo: [
          { name: "Magikarp", at: "Valley Windworks (fishing/wild)" },
          { name: "Gyarados", at: "Lv 30" },
        ],
        catch: "Valley Windworks — also Old Chateau (Paranormal Room).",
        moves: ["Waterfall", "Dragon Dance", "Earthquake", "Crunch"],
        carries: "Roark · Flint · Bertha (post-DD)",
      },
    ],
  },
  {
    id: "endgame",
    name: "Endgame — Cynthia 2",
    style: "Postgame Lv100 Rematch",
    legendary: true,
    typeChart: "redux",
    blurb:
      "For the rematch tier (Cynthia 2 = Salamence/Garchomp/Jirachi/Rayquaza/Lucario/Palkia at Lv100). Three legendaries to match her power, three reliable mons that scale into endgame.",
    why: [
      "Latios (130 Speed) outspeeds her Salamence and Rayquaza.",
      "Hydreigon's Levitate + Dark/Dragon dual STAB walls Lucian permanently.",
      "Mewtwo as Psychic/Normal gets neutral Ghost coverage and absurd 150 SpA.",
    ],
    members: [
      {
        species: "Latios",
        type1: "Dragon", type2: "Psychic",
        role: "Special sweeper · Levitate",
        evo: [
          { name: "Latios", at: "Lake Valor (postgame)" },
        ],
        catch: "Lake Valor — also Creator Lodge (postgame).",
        moves: ["Draco Meteor", "Psychic", "Surf", "Calm Mind"],
        carries: "Cynthia 2 (Salamence/Rayquaza) · Lucian",
      },
      {
        species: "Hydreigon",
        type1: "Dragon", type2: "Dark",
        role: "Special wall · Levitate",
        evo: [
          { name: "Deino", at: "Oreburgh wild (also egg from Jasmine's House)" },
          { name: "Zweilous", at: "Lv 20" },
          { name: "Hydreigon", at: "Lv 48" },
        ],
        catch: "Oreburgh tall grass — useable in 1st run too if you grind.",
        moves: ["Dark Pulse", "Dragon Pulse", "Flamethrower", "Roost"],
        carries: "Lucian · Fantina · Cynthia (Mawile via Flamethrower)",
      },
      {
        species: "Mewtwo",
        type1: "Psychic", type2: "Normal",
        role: "Special nuke · Recover stall",
        evo: [
          { name: "Mewtwo", at: "Snowpoint Temple (postgame)" },
        ],
        catch: "Snowpoint Temple basement — also Creator Lodge.",
        moves: ["Psychic", "Aura Sphere", "Recover", "Calm Mind"],
        carries: "Cynthia 2 (Lucario/Jirachi) · Maylene",
      },
      {
        species: "Garchomp",
        type1: "Dragon", type2: "Ground",
        role: "Physical sweeper · Rough Skin",
        evo: [
          { name: "Gible", at: "Route 219 wild" },
          { name: "Gabite", at: "Lv 20" },
          { name: "Garchomp", at: "Lv 46" },
        ],
        catch: "Route 219 — Victory Road / Valor Cavern for fully evolved.",
        moves: ["Earthquake", "Outrage", "Stone Edge", "Swords Dance"],
        carries: "Cynthia 2 (Garchomp mirror) · Lucario · Palkia (EQ ground)",
      },
      {
        species: "Volcarona",
        type1: "Bug", type2: "Fire",
        role: "Quiver Dance late-game sweep",
        evo: [
          { name: "Larvesta", at: "Floaroma Meadow wild" },
          { name: "Volcarona", at: "Lv 35" },
        ],
        catch: "Floaroma Meadow — also Sunyshore at Lv75+.",
        moves: ["Quiver Dance", "Fiery Dance", "Bug Buzz", "Giga Drain"],
        carries: "Cynthia 2 (Jirachi) · Lucian",
      },
      {
        species: "Empoleon",
        type1: "Water", type2: "Steel",
        role: "Defensive pivot · Stealth Rock",
        evo: [
          { name: "Piplup", at: "Trainers School gift" },
          { name: "Prinplup", at: "Lv 16" },
          { name: "Empoleon", at: "Lv 40" },
        ],
        catch: "Trainers School gift — Acuity Cavern for fully evolved.",
        moves: ["Surf", "Ice Beam", "Flash Cannon", "Stealth Rock"],
        carries: "Cynthia 2 (Salamence/Rayquaza switch-in)",
      },
    ],
  },
  {
    id: "sun",
    name: "Solar Power — Sun Team",
    style: "Drought + Solar Rush",
    legendary: false,
    typeChart: "redux",
    blurb:
      "Built around Houndoom's Drought ability. Three Solar Rush (Chlorophyll) abusers double their Speed in sun, Volcarona auto-heals, and Sceptile's Solar Beam never charges. Surprisingly tanky once it gets rolling.",
    why: [
      "Houndour gets Drought as its hidden ability — and you can grab one as early as Route 207.",
      "Solar Rush is this hack's renamed Chlorophyll: 2× Speed in sun. Typhlosion / Victreebel / Rapidash all get it.",
      "Volcarona's hidden ability is Sunny Heal (Leaf Guard reskin) — heals 1/16 HP per turn in sun.",
    ],
    members: [
      {
        species: "Houndoom",
        type1: "Dark", type2: "Fire",
        role: "Sun setter · special wallbreaker",
        evo: [
          { name: "Houndour", at: "Route 207 wild (hidden ability for Drought)" },
          { name: "Houndoom", at: "Lv 29" },
        ],
        catch: "Route 207 tall grass — also Paranormal Room (Old Chateau).",
        moves: ["Fire Blast", "Dark Pulse", "Sucker Punch", "Nasty Plot"],
        carries: "Aaron · Fantina · Lucian · sets sun for the team",
      },
      {
        species: "Typhlosion",
        type1: "Fire", type2: "Poison",
        role: "Solar Rush special nuke",
        evo: [
          { name: "Cyndaquil", at: "Oreburgh wild / Trainers School egg" },
          { name: "Quilava", at: "Lv 16" },
          { name: "Typhlosion", at: "Lv 40" },
        ],
        catch: "Oreburgh tall grass — also egg from Trainers School.",
        moves: ["Eruption", "Solar Beam", "Sludge Bomb", "Focus Blast"],
        carries: "Aaron · Gardenia · Candice · Maylene Coalossal",
      },
      {
        species: "Victreebel",
        type1: "Grass", type2: "Ghost",
        role: "Solar Rush physical · anti-Fighting",
        evo: [
          { name: "Bellsprout", at: "Route 201 / Verity Lakefront wild" },
          { name: "Weepinbell", at: "Lv 15" },
          { name: "Victreebel", at: "Lv 35" },
        ],
        catch: "Route 201 tall grass — earliest Grass option.",
        moves: ["Leaf Blade", "Shadow Sneak", "Sucker Punch", "Swords Dance"],
        carries: "Bertha · Wake · Maylene (Ghost 2× vs Fighting in this hack)",
      },
      {
        species: "Sceptile",
        type1: "Grass", type2: "Dragon",
        role: "Special sweeper · Cynthia answer",
        evo: [
          { name: "Treecko", at: "Route 203 wild / Trainers School egg" },
          { name: "Grovyle", at: "Lv 16" },
          { name: "Sceptile", at: "Lv 40" },
        ],
        catch: "Route 203 tall grass — also Trainers School egg.",
        moves: ["Leaf Storm", "Dragon Pulse", "Focus Blast", "Solar Beam"],
        carries: "Cynthia (Mawile via Focus Blast, mirror Sceptile/Milotic)",
      },
      {
        species: "Volcarona",
        type1: "Bug", type2: "Fire",
        role: "Quiver Dance + Sunny Heal sweep",
        evo: [
          { name: "Larvesta", at: "Floaroma Meadow wild" },
          { name: "Volcarona", at: "Lv 35" },
        ],
        catch: "Floaroma Meadow tall grass.",
        moves: ["Quiver Dance", "Fiery Dance", "Bug Buzz", "Giga Drain"],
        carries: "Aaron · Gardenia · Candice · Lucian",
      },
      {
        species: "Garchomp",
        type1: "Dragon", type2: "Ground",
        role: "Anchor · Rock counter",
        evo: [
          { name: "Gible", at: "Route 219 wild" },
          { name: "Gabite", at: "Lv 20" },
          { name: "Garchomp", at: "Lv 46" },
        ],
        catch: "Route 219 — non-weather anchor for Roark / Volkner / Flint.",
        moves: ["Earthquake", "Outrage", "Stone Edge", "Crunch"],
        carries: "Roark · Volkner · Flint · Bertha",
      },
    ],
  },
  {
    id: "rain",
    name: "Storm Surge — Rain Team",
    style: "Drizzle + Swift Swim",
    legendary: false,
    typeChart: "redux",
    blurb:
      "Rotom permanently sets rain (Drizzle) — every Water move hits 50% harder, every Thunder is 100% accurate, and three Swift Swim sweepers double their Speed. Ridiculous offensive ceiling.",
    why: [
      "Rotom in this hack has Drizzle as its primary ability and is grabbable mid-game.",
      "Swift Swim mons (Sharpedo, Gyarados, Milotic) all double their Speed — outpacing nearly every boss.",
      "Magnezone's Thunder hits 100% under rain — Wake / Volkner-bait dies on switch-in.",
    ],
    members: [
      {
        species: "Rotom",
        type1: "Electric", type2: "Ghost",
        role: "Rain setter · special pivot",
        evo: [
          { name: "Rotom", at: "Old Chateau (Paranormal Room) — single-stage" },
        ],
        catch: "Old Chateau — interact with the TV in the back room.",
        moves: ["Thunder", "Shadow Ball", "Volt Switch", "Will-O-Wisp"],
        carries: "Sets rain · Maylene · Wake (Ghost on Water? neutral) · Lucian",
      },
      {
        species: "Sharpedo",
        type1: "Water", type2: "Dark",
        role: "Swift Swim physical glass cannon",
        evo: [
          { name: "Carvanha", at: "Valley Windworks wild" },
          { name: "Sharpedo", at: "Lv 28" },
        ],
        catch: "Valley Windworks tall grass — also Paranormal Room (Old Chateau).",
        moves: ["Waterfall", "Crunch", "Ice Fang", "Earthquake"],
        carries: "Roark · Flint · Fantina · Lucian",
      },
      {
        species: "Gyarados",
        type1: "Water", type2: "Dragon",
        role: "Dragon Dance setup sweeper",
        evo: [
          { name: "Magikarp", at: "Valley Windworks wild" },
          { name: "Gyarados", at: "Lv 30" },
        ],
        catch: "Valley Windworks fishing — easy with an Old Rod.",
        moves: ["Waterfall", "Dragon Dance", "Earthquake", "Crunch"],
        carries: "Roark · Flint · Bertha · Cynthia (post-DD)",
      },
      {
        species: "Milotic",
        type1: "Water", type2: "Dragon",
        role: "Swift Swim special wall + sweeper",
        evo: [
          { name: "Feebas", at: "Route 203 wild / Bicycle Shop egg" },
          { name: "Milotic", at: "Lv 30 (per romhack data)" },
        ],
        catch: "Route 203 — Feebas is rare so be patient. Egg version simpler.",
        moves: ["Surf", "Dragon Pulse", "Ice Beam", "Recover"],
        carries: "Bertha · Flint · Roark · Candice (Ice STAB)",
      },
      {
        species: "Magnezone",
        type1: "Electric", type2: "Steel",
        role: "Thunder spammer · Levitate",
        evo: [
          { name: "Magnemite", at: "Ravaged Path wild" },
          { name: "Magneton", at: "Lv 22" },
          { name: "Magnezone", at: "Lv 45" },
        ],
        catch: "Ravaged Path tall grass — also Twinleaf egg from Jasmine's House.",
        moves: ["Thunder", "Flash Cannon", "Volt Switch", "Substitute"],
        carries: "Wake · Volkner (mirror) · Aaron",
      },
      {
        species: "Crobat",
        type1: "Poison", type2: "Flying",
        role: "Hurricane never-miss · speed pivot",
        evo: [
          { name: "Zubat", at: "Oreburgh Mine wild" },
          { name: "Golbat", at: "Lv 15" },
          { name: "Crobat", at: "Lv 34" },
        ],
        catch: "Oreburgh Mine — Hurricane is 100% accuracy under rain.",
        moves: ["Hurricane", "Cross Poison", "Roost", "U-turn"],
        carries: "Aaron · Gardenia · Maylene · Cynthia (Cross Poison)",
      },
    ],
  },
  {
    id: "darkghost",
    name: "Goth Mode — Dark/Ghost Squad",
    style: "Themed · Cool Factor",
    legendary: false,
    typeChart: "redux",
    blurb:
      "Six members all rocking Dark or Ghost typing. Looks edgy, plays mean. This hack gives Ghost 2× into Fighting and adds Dark to Hippowdon and Mismagius — Maylene's gym becomes a joke and Cynthia's Sceptile/Milotic/Altaria die to Weavile Ice Punch.",
    why: [
      "Ghost hits Fighting 2× in this hack — Gengar / Mismagius walk through Maylene.",
      "Hippowdon picks up Dark as a secondary type and Mismagius is now Ghost/Dark.",
      "Weavile (Dark/Ice) clears Sceptile (Ice 4×) and Altaria (Ice 2×) — but Milotic's Water typing makes Ice neutral, so Hydreigon Dragon Pulse is the cleanup.",
    ],
    members: [
      {
        species: "Hydreigon",
        type1: "Dragon", type2: "Dark",
        role: "Special wall · Levitate",
        evo: [
          { name: "Deino", at: "Oreburgh wild / Twinleaf egg (Jasmine's)" },
          { name: "Zweilous", at: "Lv 20" },
          { name: "Hydreigon", at: "Lv 48" },
        ],
        catch: "Oreburgh tall grass — early Dark/Dragon access.",
        moves: ["Dark Pulse", "Dragon Pulse", "Flamethrower", "Roost"],
        carries: "Fantina · Lucian · Cynthia (Mawile)",
      },
      {
        species: "Tyranitar",
        type1: "Rock", type2: "Dark",
        role: "Sand Stream wallbreaker",
        evo: [
          { name: "Larvitar", at: "Oreburgh Tunnel wild" },
          { name: "Pupitar", at: "Lv 20" },
          { name: "Tyranitar", at: "Lv 47" },
        ],
        catch: "Oreburgh Tunnel — also egg from Creators House (Sandgem).",
        moves: ["Stone Edge", "Crunch", "Earthquake", "Dragon Dance"],
        carries: "Aaron · Fantina · Candice · Lucian",
      },
      {
        species: "Hippowdon",
        type1: "Ground", type2: "Dark",
        role: "Sand Stream tank · physical wall",
        evo: [
          { name: "Hippopotas", at: "Mt. Coronet wild / Wayward Cave" },
          { name: "Hippowdon", at: "Lv 32" },
        ],
        catch: "Mt. Coronet tall grass.",
        moves: ["Earthquake", "Crunch", "Slack Off", "Stealth Rock"],
        carries: "Roark · Volkner · Flint · Cynthia (Mawile)",
      },
      {
        species: "Gengar",
        type1: "Ghost", type2: "Poison",
        role: "Special speedster · Levitate",
        evo: [
          { name: "Gastly", at: "Oreburgh Mine wild / Sandgem egg" },
          { name: "Haunter", at: "Lv 16" },
          { name: "Gengar", at: "Lv 42" },
        ],
        catch: "Oreburgh Mine — also Creators House egg.",
        moves: ["Shadow Ball", "Sludge Bomb", "Focus Blast", "Hex"],
        carries: "Maylene (Ghost 2×) · Fantina · Cynthia (Sludge Bomb on dragons)",
      },
      {
        species: "Mismagius",
        type1: "Ghost", type2: "Dark",
        role: "Special pivot · taunt + nasty plot",
        evo: [
          { name: "Misdreavus", at: "Old Chateau wild" },
          { name: "Mismagius", at: "Lv 32" },
        ],
        catch: "Old Chateau — also Wayward Cave Palmer trigger.",
        moves: ["Shadow Ball", "Dark Pulse", "Nasty Plot", "Taunt"],
        carries: "Maylene · Fantina · Lucian (Dark Pulse)",
      },
      {
        species: "Weavile",
        type1: "Dark", type2: "Ice",
        role: "Cynthia killer · priority Ice Shard",
        evo: [
          { name: "Sneasel", at: "Eterna Pond wild / Twinleaf egg" },
          { name: "Weavile", at: "Lv 34" },
        ],
        catch: "Eterna Pond tall grass.",
        moves: ["Ice Punch", "Knock Off", "Ice Shard", "Low Kick"],
        carries: "Cynthia (Sceptile 4×, Altaria 2×) · Bertha · Aaron",
      },
    ],
  },
  {
    id: "type-diversity",
    name: "Type Diversity",
    style: "Balanced · 6 Distinct Cores",
    legendary: false,
    typeChart: "redux",
    blurb:
      "Six members, six completely different defensive profiles. No two share a primary type, every gym has a hard counter, and Cynthia eats Sludge Bomb / Dragon Pulse / Ice from three different angles.",
    why: [
      "Ampharos picks up Dragon as a secondary type in this hack — a unique Electric/Dragon special bulker.",
      "Mismagius (Ghost/Dark) and Tyranitar (Rock/Dark) double-cover Lucian and Fantina without redundancy.",
      "Roserade Sludge Bomb + Mismagius Dark Pulse = full coverage on Cynthia's Dragon spam.",
    ],
    members: [
      {
        species: "Infernape",
        type1: "Fire", type2: "Fighting",
        role: "Mixed sweeper · Mach Punch priority",
        evo: [
          { name: "Chimchar", at: "Lv 5 (Trainers School gift)" },
          { name: "Monferno", at: "Lv 16" },
          { name: "Infernape", at: "Lv 40" },
        ],
        catch: "Trainers School gift — pick Chimchar.",
        moves: ["Close Combat", "Flare Blitz", "Earthquake", "Mach Punch"],
        carries: "Byron · Candice · Maylene Coalossal · Cynthia (Mawile)",
      },
      {
        species: "Swampert",
        type1: "Water", type2: "Ground",
        role: "Bulky pivot · Stealth Rock setter",
        evo: [
          { name: "Mudkip", at: "Trainers School egg / Oreburgh Tunnel wild" },
          { name: "Marshtomp", at: "Lv 16" },
          { name: "Swampert", at: "Lv 40" },
        ],
        catch: "Trainers School egg — also wild in Oreburgh Tunnel.",
        moves: ["Earthquake", "Waterfall", "Ice Punch", "Stealth Rock"],
        carries: "Roark · Volkner · Flint · Cynthia (Mawile)",
      },
      {
        species: "Tyranitar",
        type1: "Rock", type2: "Dark",
        role: "Sand Stream · physical wallbreaker",
        evo: [
          { name: "Larvitar", at: "Oreburgh Tunnel wild / Sandgem egg" },
          { name: "Pupitar", at: "Lv 20" },
          { name: "Tyranitar", at: "Lv 47" },
        ],
        catch: "Oreburgh Tunnel — also egg from Creators House.",
        moves: ["Stone Edge", "Crunch", "Earthquake", "Dragon Dance"],
        carries: "Aaron · Fantina · Candice · Lucian",
      },
      {
        species: "Ampharos",
        type1: "Electric", type2: "Dragon",
        role: "Special bulk · unique typing",
        evo: [
          { name: "Mareep", at: "Jubilife City wild / Sandgem egg" },
          { name: "Flaaffy", at: "Lv 14" },
          { name: "Ampharos", at: "Lv 36" },
        ],
        catch: "Jubilife City tall grass — also Eterna Forest.",
        moves: ["Thunderbolt", "Dragon Pulse", "Focus Blast", "Cotton Guard"],
        carries: "Wake · Volkner · Cynthia (anti-Dragon Dragon)",
      },
      {
        species: "Mismagius",
        type1: "Ghost", type2: "Dark",
        role: "Special pivot · Nasty Plot setup",
        evo: [
          { name: "Misdreavus", at: "Old Chateau wild" },
          { name: "Mismagius", at: "Lv 32" },
        ],
        catch: "Old Chateau — also Wayward Cave.",
        moves: ["Shadow Ball", "Dark Pulse", "Nasty Plot", "Taunt"],
        carries: "Maylene (Ghost 2× vs Fighting) · Fantina · Lucian Exeggutor (Dark Pulse for Girafarig — Shadow Ball is 0×)",
      },
      {
        species: "Roserade",
        type1: "Grass", type2: "Poison",
        role: "Special wall · anti-Dragon",
        evo: [
          { name: "Roselia", at: "Valley Windworks wild" },
          { name: "Roserade", at: "Lv 25" },
        ],
        catch: "Valley Windworks — also egg from Bicycle Shop.",
        moves: ["Sludge Bomb", "Energy Ball", "Sleep Powder", "Extrasensory"],
        carries: "Cynthia (Sceptile/Milotic/Altaria) · Bertha · Wake",
      },
    ],
  },
  {
    id: "wallbreaker",
    name: "Wallbreaker Core",
    style: "Balanced · Aggressive",
    legendary: false,
    typeChart: "redux",
    blurb:
      "Pure offensive pressure with no dead weight. Every member can switch into something safe and threaten an OHKO. Heracross + Houndoom fold Lucian, Alakazam + Gengar shred Maylene, Gyarados sweeps post-DD.",
    why: [
      "Heracross has No Guard — Megahorn / Stone Edge always hit, brutal vs Lucian Exeggutor and Aaron's bug squad.",
      "Houndoom and Alakazam together cover every Psychic/Ghost/Steel boss.",
      "Gyarados (Water/Dragon) is a one-mon answer to Roark, Flint, and Bertha.",
    ],
    members: [
      {
        species: "Torterra",
        type1: "Grass", type2: "Ground",
        role: "Physical bulk · Stealth Rock",
        evo: [
          { name: "Turtwig", at: "Trainers School gift / Oreburgh Gate wild" },
          { name: "Grotle", at: "Lv 16" },
          { name: "Torterra", at: "Lv 40" },
        ],
        catch: "Trainers School gift — pick Turtwig.",
        moves: ["Wood Hammer", "Earthquake", "Stone Edge", "Stealth Rock"],
        carries: "Roark · Volkner · Wake · Bertha",
      },
      {
        species: "Heracross",
        type1: "Bug", type2: "Fighting",
        role: "No Guard physical nuke",
        evo: [
          { name: "Heracross", at: "Lake Verity wild (single-stage)" },
        ],
        catch: "Lake Verity tall grass — also Trade Snowpoint.",
        moves: ["Megahorn", "Close Combat", "Stone Edge", "Knock Off"],
        carries: "Lucian (Exeggutor) · Aaron · Cynthia (Mawile via CC)",
      },
      {
        species: "Houndoom",
        type1: "Dark", type2: "Fire",
        role: "Special wallbreaker · Drought option",
        evo: [
          { name: "Houndour", at: "Route 207 wild" },
          { name: "Houndoom", at: "Lv 29" },
        ],
        catch: "Route 207 tall grass — also Old Chateau Paranormal Room.",
        moves: ["Fire Blast", "Dark Pulse", "Sucker Punch", "Nasty Plot"],
        carries: "Aaron · Fantina · Lucian · Cynthia (Mawile)",
      },
      {
        species: "Gengar",
        type1: "Ghost", type2: "Poison",
        role: "Special speedster · Levitate",
        evo: [
          { name: "Gastly", at: "Oreburgh Mine wild / Sandgem egg" },
          { name: "Haunter", at: "Lv 16" },
          { name: "Gengar", at: "Lv 42" },
        ],
        catch: "Oreburgh Mine — also Creators House egg.",
        moves: ["Shadow Ball", "Sludge Bomb", "Focus Blast", "Hex"],
        carries: "Maylene (Ghost 2×) · Fantina · Cynthia dragons (Sludge Bomb)",
      },
      {
        species: "Gyarados",
        type1: "Water", type2: "Dragon",
        role: "Dragon Dance setup sweeper",
        evo: [
          { name: "Magikarp", at: "Valley Windworks wild" },
          { name: "Gyarados", at: "Lv 30" },
        ],
        catch: "Valley Windworks fishing/wild.",
        moves: ["Waterfall", "Dragon Dance", "Earthquake", "Crunch"],
        carries: "Roark · Flint · Bertha · Cynthia (post-DD)",
      },
      {
        species: "Alakazam",
        type1: "Psychic", type2: "Fire",
        role: "Magic Guard special nuke",
        evo: [
          { name: "Abra", at: "Oreburgh Mine wild / Twinleaf egg" },
          { name: "Kadabra", at: "Lv 18" },
          { name: "Alakazam", at: "Lv 38" },
        ],
        catch: "Oreburgh Mine — also egg from Jasmine's House.",
        moves: ["Psychic", "Fire Blast", "Focus Blast", "Calm Mind"],
        carries: "Maylene · Fantina (Psy 2× vs Ghost) · Aaron · Lucian",
      },
    ],
  },
  {
    id: "bulky",
    name: "Bulky Balance",
    style: "Balanced · Defensive Lean",
    legendary: false,
    typeChart: "redux",
    blurb:
      "For players who like to pivot, status, and grind out wins. Every member has 100+ in at least one defensive stat, and the team has answers to every E4 member without ever needing to set up.",
    why: [
      "Snorlax has Thick Fat — half damage from Fire and Ice. Eats Candice and Flint for breakfast.",
      "Togekiss's Proficiency (Serene Grace reskin) doubles flinch chance on Air Slash — Cynthia's slow dragons get griefed.",
      "Vaporeon is Water/Poison in this hack — Sludge Bomb + Scald + Wish makes it the team's anchor.",
    ],
    members: [
      {
        species: "Snorlax",
        type1: "Normal", type2: "Grass",
        role: "Bulky pivot · Thick Fat",
        evo: [
          { name: "Snorlax", at: "Lake Valor wild (single-stage)" },
        ],
        catch: "Lake Valor — also Acuity Cavern (postgame).",
        moves: ["Body Slam", "Earthquake", "Crunch", "Rest"],
        carries: "Candice · Flint · Lucian (Crunch on Ghost-types)",
      },
      {
        species: "Hippowdon",
        type1: "Ground", type2: "Dark",
        role: "Sand Stream · physical wall",
        evo: [
          { name: "Hippopotas", at: "Mt. Coronet wild / Wayward Cave" },
          { name: "Hippowdon", at: "Lv 32" },
        ],
        catch: "Mt. Coronet tall grass.",
        moves: ["Earthquake", "Crunch", "Slack Off", "Stealth Rock"],
        carries: "Roark · Volkner · Flint · Fantina",
      },
      {
        species: "Togekiss",
        type1: "Psychic", type2: "Flying",
        role: "Special bulk · Air Slash flinch hax",
        evo: [
          { name: "Togepi", at: "Route 203 wild / Bicycle Shop egg" },
          { name: "Togetic", at: "Lv 14" },
          { name: "Togekiss", at: "Lv 36 (per romhack data)" },
        ],
        catch: "Route 203 — easier than vanilla. Also wild at Lake Acuity.",
        moves: ["Air Slash", "Aura Sphere", "Nasty Plot", "Roost"],
        carries: "Maylene · Aaron · Gardenia · Lucian (mirror)",
      },
      {
        species: "Lucario",
        type1: "Fighting", type2: "Steel",
        role: "Adaptability nuke · Bullet Punch priority",
        evo: [
          { name: "Riolu", at: "Eterna City wild / Bicycle Shop egg" },
          { name: "Lucario", at: "Lv 34" },
        ],
        catch: "Eterna City tall grass.",
        moves: ["Close Combat", "Bullet Punch", "Extreme Speed", "Earthquake"],
        carries: "Roark · Byron · Candice · Cynthia (Mawile)",
      },
      {
        species: "Vaporeon",
        type1: "Water", type2: "Poison",
        role: "Special wall · anti-Dragon",
        evo: [
          { name: "Eevee", at: "Floaroma Meadow wild / Dawn's House egg" },
          { name: "Vaporeon", at: "Water Stone" },
        ],
        catch: "Floaroma Meadow — Water Stone is the only evolution requirement.",
        moves: ["Scald", "Sludge Bomb", "Wish", "Protect"],
        carries: "Roark · Flint · Cynthia (Sludge Bomb 2× on dragons)",
      },
      {
        species: "Magnezone",
        type1: "Electric", type2: "Steel",
        role: "Levitate · special pivot",
        evo: [
          { name: "Magnemite", at: "Ravaged Path wild / Twinleaf egg" },
          { name: "Magneton", at: "Lv 22" },
          { name: "Magnezone", at: "Lv 45" },
        ],
        catch: "Ravaged Path tall grass.",
        moves: ["Thunderbolt", "Flash Cannon", "Volt Switch", "Substitute"],
        carries: "Wake · Volkner (mirror) · Aaron",
      },
    ],
  },
  {
    id: "gen6-speed",
    name: "Speed Clear (Gen 6)",
    style: "Fastest Path · Vanilla Chart",
    legendary: false,
    typeChart: "gen6",
    blurb:
      "What I'd actually pick to clear the game without grinding, assuming the vanilla Gen 6 type chart. Six powerhouses, every one available before Eterna, every evolution timing lines up with E4 levels.",
    why: [
      "Mamoswine's Ice STAB hits Cynthia's Sceptile (Dragon/Grass) for 4× — the cleanest Cynthia answer in the vanilla chart.",
      "Lucario's Adaptability Close Combat is 4× into Mawile (Dark/Steel) — one of the highest-damage moves in the game.",
      "Gengar's Shadow Ball is 2× on Fantina's Dusclops/Marowak/Haunter — but Vigoroth (Normal) is immune, so use Sludge Bomb on her.",
      "Garchomp Earthquake is 2× on Roark's Rocks again (Ground vs Rock 2× in vanilla, nerfed to 1× in Redux).",
    ],
    members: [
      {
        species: "Empoleon",
        type1: "Water", type2: "Steel",
        role: "Bulky pivot · special attacker",
        evo: [
          { name: "Piplup", at: "Lv 5 (Trainers School gift)" },
          { name: "Prinplup", at: "Lv 16" },
          { name: "Empoleon", at: "Lv 40" },
        ],
        catch: "Trainers School (Jubilife) — pick Piplup as your gift.",
        moves: ["Surf", "Ice Beam", "Flash Cannon", "Grass Knot"],
        carries: "Roark · Bertha · Candice · Flint",
      },
      {
        species: "Garchomp",
        type1: "Dragon", type2: "Ground",
        role: "Physical sweeper · broad coverage",
        evo: [
          { name: "Gible", at: "Route 219 wild (very early)" },
          { name: "Gabite", at: "Lv 20" },
          { name: "Garchomp", at: "Lv 46" },
        ],
        catch: "Route 219 tall grass — get one before Oreburgh.",
        moves: ["Earthquake", "Outrage", "Stone Edge", "Swords Dance"],
        carries: "Roark (EQ 2×) · Volkner · Flint · Cynthia (Outrage on dragons)",
      },
      {
        species: "Lucario",
        type1: "Fighting", type2: "Steel",
        role: "Adaptive Close Combat nuke",
        evo: [
          { name: "Riolu", at: "Eterna City wild / Bicycle Shop egg" },
          { name: "Lucario", at: "Lv 34" },
        ],
        catch: "Eterna City tall grass.",
        moves: ["Close Combat", "Bullet Punch", "Extreme Speed", "Meteor Mash"],
        carries: "Roark · Byron · Candice · Cynthia (CC 4× on Mawile)",
      },
      {
        species: "Mamoswine",
        type1: "Ice", type2: "Ground",
        role: "Cynthia killer · priority Ice Shard",
        evo: [
          { name: "Swinub", at: "Oreburgh Mine wild" },
          { name: "Piloswine", at: "Lv 20" },
          { name: "Mamoswine", at: "Lv 45" },
        ],
        catch: "Oreburgh Mine — also Twinleaf egg from Jasmine's House.",
        moves: ["Earthquake", "Icicle Crash", "Ice Shard", "Stone Edge"],
        carries: "Cynthia (Sceptile 4×, Altaria 2×) · Bertha · Flint",
      },
      {
        species: "Gengar",
        type1: "Ghost", type2: "Poison",
        role: "Special speedster · Fantina killer",
        evo: [
          { name: "Gastly", at: "Oreburgh Mine wild / Sandgem egg" },
          { name: "Haunter", at: "Lv 16" },
          { name: "Gengar", at: "Lv 42" },
        ],
        catch: "Oreburgh Mine — Levitate (immune to Ground).",
        moves: ["Shadow Ball", "Sludge Bomb", "Focus Blast", "Hex"],
        carries: "Fantina (Ghost vs Ghost 2× in vanilla — Sludge Bomb the Vigoroth) · Maylene Coalossal (Focus Blast) · Lucian Exeggutor",
      },
      {
        species: "Crobat",
        type1: "Poison", type2: "Flying",
        role: "Speed pivot · Fly HM mule",
        evo: [
          { name: "Zubat", at: "Oreburgh Mine wild" },
          { name: "Golbat", at: "Lv 15" },
          { name: "Crobat", at: "Lv 34" },
        ],
        catch: "Oreburgh Mine — also Old Chateau later.",
        moves: ["Brave Bird", "Cross Poison", "Roost", "U-turn"],
        carries: "Aaron · Gardenia (Flying 2× back) · Maylene Hakamo-O",
      },
    ],
  },
  {
    id: "gen6-balanced",
    name: "Balanced (Gen 6)",
    style: "Stable Story Clear · Vanilla Chart",
    legendary: false,
    typeChart: "gen6",
    blurb:
      "Bulky balanced team for the vanilla type chart. Every gym has at least two hard counters, Cynthia's dragons fold to Mamoswine and Garchomp Outrage, and you never need to set up to win.",
    why: [
      "Roserade is here for utility (Sleep Powder + Energy Ball) — not the Sludge Bomb anti-Cynthia trick (Poison vs Dragon = 0.5× in vanilla).",
      "Volcarona's Quiver Dance + Fiery Dance is weather-independent firepower for the second half of the game.",
      "Mamoswine + Garchomp + Volcarona means Cynthia 1 and most rematches die to one of three angles.",
    ],
    members: [
      {
        species: "Empoleon",
        type1: "Water", type2: "Steel",
        role: "Bulky pivot · Stealth Rock setter",
        evo: [
          { name: "Piplup", at: "Lv 5 (Trainers School gift)" },
          { name: "Prinplup", at: "Lv 16" },
          { name: "Empoleon", at: "Lv 40" },
        ],
        catch: "Trainers School gift.",
        moves: ["Surf", "Ice Beam", "Flash Cannon", "Stealth Rock"],
        carries: "Roark · Bertha · Candice · Flint",
      },
      {
        species: "Garchomp",
        type1: "Dragon", type2: "Ground",
        role: "Physical sweeper",
        evo: [
          { name: "Gible", at: "Route 219 wild" },
          { name: "Gabite", at: "Lv 20" },
          { name: "Garchomp", at: "Lv 46" },
        ],
        catch: "Route 219 tall grass.",
        moves: ["Earthquake", "Outrage", "Stone Edge", "Crunch"],
        carries: "Roark · Volkner · Flint · Cynthia (Outrage)",
      },
      {
        species: "Lucario",
        type1: "Fighting", type2: "Steel",
        role: "Adaptability nuke",
        evo: [
          { name: "Riolu", at: "Eterna City wild / Bicycle Shop egg" },
          { name: "Lucario", at: "Lv 34" },
        ],
        catch: "Eterna City tall grass.",
        moves: ["Close Combat", "Bullet Punch", "Extreme Speed", "Crunch"],
        carries: "Roark · Byron · Candice · Cynthia (Mawile)",
      },
      {
        species: "Mamoswine",
        type1: "Ice", type2: "Ground",
        role: "Cynthia answer · sand counter",
        evo: [
          { name: "Swinub", at: "Oreburgh Mine wild" },
          { name: "Piloswine", at: "Lv 20" },
          { name: "Mamoswine", at: "Lv 45" },
        ],
        catch: "Oreburgh Mine.",
        moves: ["Earthquake", "Icicle Crash", "Ice Shard", "Superpower"],
        carries: "Cynthia (Sceptile 4×) · Volkner · Flint · Bertha",
      },
      {
        species: "Roserade",
        type1: "Grass", type2: "Poison",
        role: "Special utility · Sleep Powder",
        evo: [
          { name: "Roselia", at: "Valley Windworks wild" },
          { name: "Roserade", at: "Lv 25" },
        ],
        catch: "Valley Windworks tall grass.",
        moves: ["Energy Ball", "Sleep Powder", "Sludge Bomb", "Toxic Spikes"],
        carries: "Bertha · Wake · stall in tough fights",
      },
      {
        species: "Volcarona",
        type1: "Bug", type2: "Fire",
        role: "Late-game sweeper (Quiver Dance)",
        evo: [
          { name: "Larvesta", at: "Floaroma Meadow wild" },
          { name: "Volcarona", at: "Lv 35" },
        ],
        catch: "Floaroma Meadow tall grass.",
        moves: ["Quiver Dance", "Fiery Dance", "Bug Buzz", "Giga Drain"],
        carries: "Aaron · Gardenia · Candice (post-QD) · Lucian Exeggutor",
      },
    ],
  },
  {
    id: "gen6-mixed",
    name: "Mixed Power (Gen 6)",
    style: "Physical + Special Mix · Vanilla Chart",
    legendary: false,
    typeChart: "gen6",
    blurb:
      "Three physical, three special — every boss has the right tool. Tyranitar's Sand Stream nukes Pupitar/Hippowdon's defenses, Heracross blasts through Lucian, and Togekiss handles the random Fairy/Fighting threats.",
    why: [
      "Heracross Megahorn (with No Guard) is a guaranteed OHKO on Lucian's Exeggutor (Bug 2× × Grass 2× = 4×).",
      "Togekiss handles Maylene's Hakamo-O (Air Slash 2× via Fighting weakness) and Cynthia's dragons via Dazzling Gleam — but use Aura Sphere on Mawile (Steel resists Fairy → only 1× Gleam).",
      "Tyranitar's sand chip + Stone Edge wrecks Aaron, Fantina ghost types, and Candice's Ice/Flying line.",
    ],
    members: [
      {
        species: "Infernape",
        type1: "Fire", type2: "Fighting",
        role: "Mixed sweeper · Mach Punch priority",
        evo: [
          { name: "Chimchar", at: "Lv 5 (Trainers School gift)" },
          { name: "Monferno", at: "Lv 16" },
          { name: "Infernape", at: "Lv 40" },
        ],
        catch: "Trainers School gift.",
        moves: ["Close Combat", "Flare Blitz", "Earthquake", "Mach Punch"],
        carries: "Byron · Candice · Maylene Coalossal · Cynthia (Mawile)",
      },
      {
        species: "Garchomp",
        type1: "Dragon", type2: "Ground",
        role: "Physical sweeper",
        evo: [
          { name: "Gible", at: "Route 219 wild" },
          { name: "Gabite", at: "Lv 20" },
          { name: "Garchomp", at: "Lv 46" },
        ],
        catch: "Route 219 tall grass.",
        moves: ["Earthquake", "Outrage", "Stone Edge", "Swords Dance"],
        carries: "Roark · Volkner · Flint · Cynthia",
      },
      {
        species: "Heracross",
        type1: "Bug", type2: "Fighting",
        role: "No Guard physical breaker",
        evo: [
          { name: "Heracross", at: "Lake Verity wild (single-stage)" },
        ],
        catch: "Lake Verity tall grass — also Trade Snowpoint.",
        moves: ["Megahorn", "Close Combat", "Stone Edge", "Knock Off"],
        carries: "Lucian (Exeggutor 4×) · Aaron · Cynthia Mawile via CC",
      },
      {
        species: "Tyranitar",
        type1: "Rock", type2: "Dark",
        role: "Sand Stream wallbreaker",
        evo: [
          { name: "Larvitar", at: "Oreburgh Tunnel wild / Sandgem egg" },
          { name: "Pupitar", at: "Lv 20" },
          { name: "Tyranitar", at: "Lv 47" },
        ],
        catch: "Oreburgh Tunnel.",
        moves: ["Stone Edge", "Crunch", "Earthquake", "Dragon Dance"],
        carries: "Aaron · Fantina · Candice · Lucian",
      },
      {
        species: "Mamoswine",
        type1: "Ice", type2: "Ground",
        role: "Cynthia killer · Ice Shard priority",
        evo: [
          { name: "Swinub", at: "Oreburgh Mine wild" },
          { name: "Piloswine", at: "Lv 20" },
          { name: "Mamoswine", at: "Lv 45" },
        ],
        catch: "Oreburgh Mine.",
        moves: ["Earthquake", "Icicle Crash", "Ice Shard", "Superpower"],
        carries: "Cynthia (all 3 dragons) · Bertha · Flint",
      },
      {
        species: "Togekiss",
        type1: "Psychic", type2: "Flying",
        role: "Special bulk · Dazzling Gleam Fairy STAB",
        evo: [
          { name: "Togepi", at: "Route 203 wild / Bicycle Shop egg" },
          { name: "Togetic", at: "Lv 14" },
          { name: "Togekiss", at: "Lv 36" },
        ],
        catch: "Route 203 — also wild at Lake Acuity later.",
        moves: ["Air Slash", "Dazzling Gleam", "Aura Sphere", "Roost"],
        carries: "Maylene Hakamo-O (Air Slash 2×) · Aaron · Cynthia (Mawile via Aura Sphere — Gleam is 1× through Steel)",
      },
    ],
  },
];

export async function render(params, root) {
  if (params && params.id) return renderDetail(params.id, root);
  return renderList(root);
}

const CHART_KEY = "platinum-redux-parties-chart";

function getChartPref() {
  try {
    const v = localStorage.getItem(CHART_KEY);
    return v === "gen6" ? "gen6" : "redux";
  } catch { return "redux"; }
}
function setChartPref(v) {
  try { localStorage.setItem(CHART_KEY, v); } catch {}
}

function chartBadge(chart) {
  const cls = chart === "gen6" ? "party-card__tag--gen6" : "party-card__tag--redux";
  const label = chart === "gen6" ? "Gen 6 Chart" : "Redux Chart";
  return `<span class="party-card__tag ${cls}">${label}</span>`;
}

function renderCard(p) {
  const memberSprites = p.members
    .map((m) => `<div class="party-card__sprite">${spriteImg(m.species, m.species)}</div>`)
    .join("");
  const tags = [
    `<span class="party-card__tag">${escape(p.style)}</span>`,
    chartBadge(p.typeChart),
    p.legendary
      ? `<span class="party-card__tag party-card__tag--leg">Legendary</span>`
      : `<span class="party-card__tag party-card__tag--free">No Legendary</span>`,
  ].join("");
  return `
    <a class="party-card" href="#/parties/${escape(p.id)}">
      <div class="party-card__head">
        <h3 class="party-card__name">${escape(p.name)}</h3>
        <div class="party-card__tags">${tags}</div>
      </div>
      <div class="party-card__sprites">${memberSprites}</div>
      <p class="party-card__blurb">${escape(p.blurb)}</p>
      <div class="party-card__cta">View team →</div>
    </a>`;
}

function renderList(root) {
  setTitle("Parties");
  let activeChart = getChartPref();

  function paint() {
    const filtered = PARTIES.filter((p) => p.typeChart === activeChart);
    const cards = filtered.map(renderCard).join("");

    const reduxCount = PARTIES.filter((p) => p.typeChart === "redux").length;
    const gen6Count = PARTIES.filter((p) => p.typeChart === "gen6").length;

    const reduxNote = `
      <li>Redux chart changes — <strong>Poison hits Dragon 2×</strong>, <strong>Ghost hits Fighting 2×</strong>, <strong>Steel's defensive resists got cut</strong>. These teams abuse those rules.</li>
      <li>Boss species types are reshuffled (Mawile = Dark/Steel, Milotic = Dragon/Water, Altaria = Psychic/Dragon) — that part stays no matter which chart you use.</li>
      <li>All "No Legendary" teams are buildable before the E4 — locations and evolution levels are taken from the v3.3 data.</li>`;
    const gen6Note = `
      <li>Vanilla Gen 6 type chart — Ice 2× on Dragon, Ghost 2× on Ghost, Psychic 0× on Ghost. <strong>Cynthia answer is Mamoswine</strong>, not Roserade.</li>
      <li>Boss species types still follow the romhack (Sceptile = Dragon/Grass, etc.) — meaning Mamoswine Ice STAB hits Sceptile for 4× in vanilla.</li>
      <li>These six-mon teams clear the story without grinding past Lv 50.</li>`;

    const root2 = root.querySelector(".parties-root");
    if (root2) {
      root2.innerHTML = `
        <h1 class="h-title">PARTIES</h1>
        <div class="party-disclaimer">
          ⚠ <strong>Demo / reference only.</strong> These are surface-level team ideas to spark inspiration, not deeply playtested builds. Move suggestions and matchup notes are heuristic — verify against your own runs and adjust as you go.
        </div>
        <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .75rem;">
          ${filtered.length} curated teams · each member has catch location, evolution levels, role, and a recommended moveset
        </p>
        <div class="party-toggle" role="tablist" aria-label="Type chart">
          <button class="party-toggle__btn ${activeChart === "redux" ? "is-active" : ""}" data-chart="redux" role="tab" aria-selected="${activeChart === "redux"}">
            Redux Chart <span class="party-toggle__count">${reduxCount}</span>
          </button>
          <button class="party-toggle__btn ${activeChart === "gen6" ? "is-active" : ""}" data-chart="gen6" role="tab" aria-selected="${activeChart === "gen6"}">
            Gen 6 Chart <span class="party-toggle__count">${gen6Count}</span>
          </button>
        </div>
        <p class="party-toggle__hint">
          ${activeChart === "redux"
            ? "Showing teams built around the romhack's modified type chart."
            : "Showing teams built for the vanilla Gen 6 type chart (the in-game toggle option)."}
        </p>
        <div class="party-list">${cards}</div>
        <section class="frame frame--soft" style="margin-top:1.5rem;padding:1rem;">
          <h2 class="h-section" style="margin-top:0;">Why these picks?</h2>
          <ul style="margin:.4rem 0 0;padding-left:1.2rem;line-height:1.5;">
            ${activeChart === "redux" ? reduxNote : gen6Note}
          </ul>
        </section>
      `;

      // Wire up toggle buttons
      root2.querySelectorAll(".party-toggle__btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const chart = btn.dataset.chart;
          if (chart === activeChart) return;
          activeChart = chart;
          setChartPref(chart);
          paint();
        });
      });
    }
  }

  root.innerHTML = `<div class="parties-root"></div>`;
  paint();
}

async function renderDetail(id, root) {
  const party = PARTIES.find((p) => p.id === id);
  if (!party) {
    root.innerHTML = `
      <a class="back-link" href="#/parties">← Parties</a>
      <div class="empty">— Party "${escape(id)}" not found —</div>`;
    return;
  }
  setTitle(`Party · ${party.name}`);

  // Resolve final-form local IDs once (for Pokédex deep links)
  const finalIds = await Promise.all(party.members.map((m) => pkmnIdFromName(m.species)));

  const memberCards = party.members.map((m, i) => {
    const localId = finalIds[i];
    const link = localId ? `#/pokemon/${localId}` : null;
    const evoChain = m.evo
      .map((step, idx) => {
        const isLast = idx === m.evo.length - 1;
        const stepHtml = `
          <div class="party-evo__step">
            <div class="party-evo__sprite">${spriteImg(step.name, step.name)}</div>
            <div class="party-evo__name">${escape(step.name)}</div>
            <div class="party-evo__at">${escape(step.at)}</div>
          </div>`;
        return isLast ? stepHtml : `${stepHtml}<div class="party-evo__arrow">▶</div>`;
      })
      .join("");

    const moves = m.moves.map((mv) => `<li>${escape(mv)}</li>`).join("");

    const head = `
      <div class="party-mem__head">
        <div class="party-mem__sprite">${spriteImg(m.species, m.species)}</div>
        <div class="party-mem__title">
          <h3 class="party-mem__name">${escape(m.species)}</h3>
          <div class="party-mem__types">${typeChips(m.type1, m.type2)}</div>
          <div class="party-mem__role">${escape(m.role)}</div>
        </div>
      </div>`;

    return `
      <article class="party-mem">
        ${link ? `<a class="party-mem__link" href="${link}" aria-label="Open ${escape(m.species)} in Pokédex">${head}</a>` : head}
        <div class="party-mem__body">
          <div class="party-mem__row">
            <span class="party-mem__label">Catch</span>
            <span>${escape(m.catch)}</span>
          </div>
          <div class="party-mem__row">
            <span class="party-mem__label">Carries vs</span>
            <span>${escape(m.carries)}</span>
          </div>
          <div class="party-mem__section">
            <span class="party-mem__label">Evolution</span>
            <div class="party-evo">${evoChain}</div>
          </div>
          <div class="party-mem__section">
            <span class="party-mem__label">Recommended moves</span>
            <ul class="party-mem__moves">${moves}</ul>
          </div>
        </div>
      </article>`;
  }).join("");

  const reasons = party.why.map((w) => `<li>${escape(w)}</li>`).join("");

  root.innerHTML = `
    <a class="back-link" href="#/parties">← Parties</a>
    <h1 class="h-title">${escape(party.name)}</h1>
    <div class="party-disclaimer party-disclaimer--compact">
      ⚠ Demo / reference — heuristic recommendation, not a tested build.
    </div>
    <div class="party-detail__tags">
      <span class="party-card__tag">${escape(party.style)}</span>
      ${chartBadge(party.typeChart)}
      ${party.legendary
        ? `<span class="party-card__tag party-card__tag--leg">Legendary</span>`
        : `<span class="party-card__tag party-card__tag--free">No Legendary</span>`}
    </div>
    <p class="party-detail__blurb">${escape(party.blurb)}</p>
    <section class="frame frame--soft party-detail__why">
      <h2 class="h-section" style="margin-top:0;">Why this works</h2>
      <ul>${reasons}</ul>
    </section>
    <div class="party-mem-list">${memberCards}</div>
  `;
}
