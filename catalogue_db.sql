-- ============================================================
--  Cat-A-Log! — Database Schema & Sample Data
--  Database: catalogue_db
--  Compatible: MySQL 5.7+ / MariaDB (XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS catalogue_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE catalogue_db;

-- ------------------------------------------------------------
--  TABLE: characters
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS characters (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120)     NOT NULL,
  image       VARCHAR(255)     NOT NULL DEFAULT 'assets/images/placeholder.jpg',
  description TEXT             NOT NULL,
  age         VARCHAR(40)      NOT NULL DEFAULT 'Unknown',
  abilities   TEXT             NOT NULL,
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO characters (name, image, description, age, abilities) VALUES
('Aria Stormcaller',  'assets/images/characters/aria.jpg',
 'A fierce elemental mage who commands lightning and wind from the high peaks of Valdara.',
 '27',
 'Electrokinesis, Wind Manipulation, Storm Sight, Levitation'),

('Doran Ashveil',     'assets/images/characters/doran.jpg',
 'A veteran shadow-rogue trained by the Silent Guild; master of infiltration and deception.',
 '34',
 'Shadow Step, Dual Wield, Poison Craft, Disguise Mastery'),

('Lena Brightforge',  'assets/images/characters/lena.jpg',
 'A half-dwarf artificer whose mechanical inventions blur the line between magic and science.',
 '22',
 'Rune Crafting, Golem Binding, Explosives Engineering, Mechano-Sight'),

('Kai Emberborn',     'assets/images/characters/kai.jpg',
 'A dragon-blooded warrior carrying the ancient flame of the Emberborn lineage within his veins.',
 '19',
 'Dragonfire Breath, Scales of Fortitude, Rage of the Ancients, Heat Immunity'),

('Seraphine Vale',    'assets/images/characters/seraphine.jpg',
 'A celestial healer descended from moon-touched priests who serve the goddess Lunara.',
 '31',
 'Divine Healing, Moonbeam, Barrier of Light, Resurrection'),

('Theron Coldmere',   'assets/images/characters/theron.jpg',
 'An arctic ranger bonded with a dire wolf companion; hunter of the frozen wastes.',
 '40',
 'Arctic Tracking, Ice Arrow, Beast Bond, Survival Instinct');

-- ------------------------------------------------------------
--  TABLE: places
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS places (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120)     NOT NULL,
  image       VARCHAR(255)     NOT NULL DEFAULT 'assets/images/placeholder.jpg',
  description TEXT             NOT NULL,
  location    VARCHAR(200)     NOT NULL,
  climate     VARCHAR(120)     NOT NULL,
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO places (name, image, description, location, climate) VALUES
('Valdara Peaks',        'assets/images/places/valdara.jpg',
 'Soaring mountain ranges that pierce the clouds. Home to storm mages and wind riders who have lived above the world for centuries.',
 'Northern Continent, Valdara Range', 'Alpine / Stormy'),

('Ashveil Forest',       'assets/images/places/ashveil.jpg',
 'A perpetually misty ancient forest where shadows move independently. The Silent Guild maintains hidden caches throughout.',
 'Eastern Midlands, Ashveil Basin', 'Temperate / Misty'),

('Brightforge City',     'assets/images/places/brightforge.jpg',
 'A sprawling steampunk metropolis carved into a dormant volcano. Gears, pipes and runic circuits power everything here.',
 'Central Highlands, Forge Caldera', 'Industrial / Warm'),

('Emberpeak Wastes',     'assets/images/places/emberpeak.jpg',
 'A vast semi-arid badland scorched by ancient dragon wars. Obsidian formations jut from cracked red earth.',
 'Southern Continent, Char Desert', 'Arid / Scorching'),

('Lunara Sanctum',       'assets/images/places/lunara.jpg',
 'A floating island sanctuary that orbits the world's moon-side. Moonflowers bloom eternally under silver light.',
 'High Orbit above the Pale Sea', 'Celestial / Ethereal'),

('Coldmere Tundra',      'assets/images/places/coldmere.jpg',
 'Endless frozen plains dotted with ice spires and deep-blue glaciers. Dire beasts roam freely across the permafrost.',
 'Far North, Polar Crown', 'Arctic / Frozen');

-- ------------------------------------------------------------
--  TABLE: monuments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monuments (
  id                     INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name                   VARCHAR(120)  NOT NULL,
  image                  VARCHAR(255)  NOT NULL DEFAULT 'assets/images/placeholder.jpg',
  description            TEXT          NOT NULL,
  location               VARCHAR(200)  NOT NULL,
  historical_significance TEXT         NOT NULL,
  created_at             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO monuments (name, image, description, location, historical_significance) VALUES
('The Stormgate Arch',   'assets/images/monuments/stormgate.jpg',
 'A colossal stone archway atop Valdara Peak, crackling with perpetual lightning. Pilgrims climb for three days to touch it.',
 'Valdara Peaks, Northern Continent',
 'Built by the First Storm-Callers 2,000 years ago as a conduit between the mortal world and the storm realm.'),

('The Whispering Obelisk','assets/images/monuments/obelisk.jpg',
 'A pitch-black obsidian spire in Ashveil Forest that murmurs secrets to those who press their ear against it.',
 'Ashveil Forest, Eastern Midlands',
 'Erected by the Silent Guild founder to store the stolen memories of a thousand kings.'),

('The Gearheart Engine',  'assets/images/monuments/gearheartengine.jpg',
 'A city-block-sized clockwork machine at the center of Brightforge City that has run without stopping for 800 years.',
 'Brightforge City, Central Highlands',
 'Designed by Artificer Lira Dunn to power the entire city; its blueprints have never been fully deciphered.'),

('Scar of the Ancients',  'assets/images/monuments/scar.jpg',
 'A five-kilometre crater in the Emberpeak Wastes, glowing faintly orange at night — remnant of the last dragon war.',
 'Emberpeak Wastes, Southern Continent',
 'Site of the Battle of the First Flame (Year 0), marking the end of dragon dominance over the mortal races.'),

('The Moonwell',          'assets/images/monuments/moonwell.jpg',
 'A perfectly circular pool on Lunara Sanctum filled with liquid moonlight. Those who drink gain visions of the future.',
 'Lunara Sanctum, High Orbit',
 'Said to be a tear shed by the goddess Lunara when she was banished from the mortal world.'),

('The Frost Colossus',    'assets/images/monuments/frostcolossus.jpg',
 'A 90-metre statue of a kneeling warrior carved entirely from glacier ice. It never melts, even in summer.',
 'Coldmere Tundra, Far North',
 'Memorial to the Coldmere Hundred — warriors who sacrificed themselves to seal the Frost Rift in the Age of Ice.');

-- ------------------------------------------------------------
--  Quick sanity check (optional)
-- ------------------------------------------------------------
-- SELECT 'characters' AS tbl, COUNT(*) AS rows FROM characters
-- UNION ALL SELECT 'places',   COUNT(*) FROM places
-- UNION ALL SELECT 'monuments',COUNT(*) FROM monuments;
