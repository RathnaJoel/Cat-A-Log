-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2026 at 07:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `catalogue_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(180) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `email`, `password`, `created_at`) VALUES
(1, 'admin@catalog.com', '$2y$12$gyoDH9XqXcQKluhhMsn4quW3Jh8wd/UyteUNxqFZiX4WUya8Vxtgq', '2026-04-18 09:03:39');

-- --------------------------------------------------------

--
-- Table structure for table `characters`
--

CREATE TABLE `characters` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'assets/images/placeholder.jpg',
  `description` text NOT NULL,
  `age` varchar(40) NOT NULL DEFAULT 'Unknown',
  `abilities` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `characters`
--

INSERT INTO `characters` (`id`, `name`, `image`, `description`, `age`, `abilities`, `created_at`) VALUES
(1, 'Sunless', 'assets\\images\\Characters\\Sunless.jpg', 'Sunless (or Sunny), is the main character of Shadow Slave. Growing up in the outskirts and leading a life of deceit and focusing on his own survival, he initially has a bleak outlook on life, even resigning himself to his fate when he was infected by the Nightmare Spell. But then, inside his First Nightmare, he resolved to himself that he must survive, no matter what.', '28', 'Lord of Shadows, Flame of Divinity, Blood Weave, Bone Weave, Soul Weave, Onyx Shell, Jade Shell, Fateless, Flesh Weave, Mind Weave, Curse, Spirit Weave.', '2026-04-17 22:04:55'),
(2, 'Gaius Julius Caesar', 'assets\\images\\characters\\gaiusjuliuscaesar.jpg', 'A brilliant Roman general and statesman who played a critical role in the demise of the Roman Republic and the rise of the Roman Empire, eventually becoming dictator for life.', '55', 'Military strategy, Political acumen, Oratory, Charismatic leadership, Historical writing', '2026-04-18 16:04:20'),
(3, 'Walter White', 'assets/images/characters/walterwhite.jpg', 'A mild-mannered high school chemistry teacher who transforms into a ruthless methamphetamine kingpin known as \"Heisenberg\" to secure his family\'s financial future.', '52', 'Genius-level intellect, Master chemist, Strategic planning, Manipulation, Deception', '2026-04-18 16:11:06'),
(4, 'Anakin Skywalker', 'assets/images/characters/anakinskywalker.jpg', 'A prophesied Jedi Knight of immense potential who tragically falls to the dark side of the Force, eventually becoming the feared Sith Lord Darth Vader.', '22', 'Master lightsaber combatant, Force telekinesis, Force choke, Expert pilot, Mechanical engineering', '2026-04-18 16:13:18'),
(5, 'Spider-Man', 'assets/images/characters/spiderman.jpg', 'A witty, brilliant high school student who balances his everyday life with protecting New York City as a web-slinging superhero.', '18', 'Superhuman strength, Superhuman agility, Wall-crawling, Spidey-sense (danger precognition), Web-shooting', '2026-04-18 16:17:28'),
(6, 'Moana', 'assets/images/characters/moana.jpg', 'The courageous and strong-willed daughter of a Polynesian village chief, chosen by the ocean itself to embark on an epic journey to restore the heart of Te Fiti.', '16', 'Master wayfinding, Ocean affinity, Strong leadership, Athleticism, Courage', '2026-04-18 16:23:00'),
(7, 'Blade', 'assets/images/characters/blade.jpg', 'A stoic swordsman who abandoned his original body to become a living weapon. He is a member of the Stellaron Hunters, cursed with a terrifying immortality.', 'Unknown (Immortal)', 'Immortality, Master swordsmanship, Self-healing, Superhuman pain tolerance, Wind combat skills', '2026-04-18 16:29:41'),
(8, 'Napoléon Bonaparte', 'assets/images/characters/napoleonbonaparte.jpg', 'A brilliant French military and political leader who rose to prominence during the French Revolution and crowned himself Emperor of the French.', '51', 'Genius military strategy, Artillery mastery, Charismatic leadership, Political administration, Tactical adaptation', '2026-04-18 16:32:52'),
(9, 'Cadis Etrama Di Raizel', 'assets/images/characters/cadisetramadiraizel.jpg', 'The Noblesse, an incredibly powerful, ancient, and elegant vampire-like noble who awakens in the modern world after an 820-year slumber.', '2000+', 'Mind control, Blood field manipulation, Telekinesis, Superhuman speed, Aura manipulation', '2026-04-18 16:35:19'),
(10, 'Daenerys Targaryen', 'assets/images/characters/daenerystargaryen.jpg', 'The Mother of Dragons, a determined royal exile of the Targaryen dynasty seeking to reclaim her family\'s throne in Westeros.', '22', 'Dragon riding, Fire resistance, Charismatic leadership, Multilingualism, Strategic conquest', '2026-04-18 16:37:30'),
(11, 'Optimus Prime', 'assets/images/characters/optimusprime.jpg', 'The noble, wise, and compassionate leader of the Autobots, dedicated to protecting all sentient life across the universe from the evil Decepticons.', 'Millions of years old', 'Transformation (Semi-truck), Superhuman strength, Master tactician, Energy weaponry combat, Inspiring leadership', '2026-04-18 16:40:20'),
(12, 'Big P', 'assets/images/characters/pennywise.jpg', 'An ancient, shape-shifting cosmic evil that awakens every 27 years to prey upon the children of Derry, Maine, typically manifesting as a dancing clown.', 'Billions of years old', 'Shapeshifting, Reality warping, Fear manipulation, Illusion casting, Telepathy', '2026-04-18 16:43:18'),
(13, 'Triple T', 'assets/images/characters/triplet.jpg', 'A chaotic manifestation of pure 3 AM internet brainrot, this deep-fried entity exists solely to shatter eardrums with max-volume, bass-boosted nonsense and absolutely destroy your sleep schedule.', 'Unknown (Brainrot Entity)', 'Deep-fried audio projection, Aura stealing, Brain cell depletion, Bass-boosted shockwaves, Negative rizz generation', '2026-04-18 16:47:02'),
(14, 'Satoru Gojo', 'assets/images/characters/satorugojo.jpg', 'A special grade jujutsu sorcerer, widely recognized as the strongest in the world, who casually protects humanity while teaching the next generation at Tokyo Jujutsu High.', '28', 'Limitless cursed technique, Six Eyes, Domain Expansion (Unlimited Void), Hollow Purple, Master hand-to-hand combat', '2026-04-18 16:50:33'),
(15, 'Guy sItting on a chair', 'assets/images/characters/fangyuan.jpg', 'A completely ruthless and pragmatic Gu Master who will resort to absolutely any means necessary, including demonic paths, to achieve his singular goal of true eternal life.', '500+ (Mental age)', 'Gu manipulation, Mastermind-level intellect, Unshakeable willpower, Time travel (via Spring Autumn Cicada), Ruthless pragmatism', '2026-04-18 16:53:24'),
(16, 'Rohan Kishibe', 'assets/images/characters/rohankishibe.jpg', 'A highly skilled, eccentric, and somewhat arrogant mangaka living in Morioh, dedicated to seeking out \"reality\" above all else to use as inspiration for his hit manga.', '20', 'Heaven\'s Door Stand (Reading and rewriting people like books), Superhuman drawing speed, Artistic genius, Incredible observational skills', '2026-04-18 16:55:53'),
(17, 'Rick Grimes', 'assets/images/characters/rickgrimes.jpg', 'A former sheriff\'s deputy who awakens from a coma to find the world overrun by zombies, eventually becoming the hardened and fiercely protective leader of a group of survivors.', '40', 'Expert marksman, Hand-to-hand combat, Tactical leadership, Survival skills, Indomitable willpower', '2026-04-18 16:58:30'),
(18, 'Percy Jackson', 'assets/images/characters/percyjackson.jpg', 'A troubled teen who discovers he is a demigod—the son of Poseidon—and is thrust into a hidden world of Greek monsters and gods, where he must embark on quests to save Olympus.', '16 (By the end of the original series)', 'Hydrokinesis (water manipulation), Water-based healing, Underwater breathing, Master swordsmanship (Riptide), Enhanced battle reflexes', '2026-04-18 17:02:12'),
(19, 'Michael Scofield', 'assets/images/characters/michaelscofield.jpg', 'A brilliant structural engineer who intentionally gets himself incarcerated in a maximum-security prison to execute a meticulously tattooed escape plan and save his innocent brother from death row.', '31', 'Genius-level intellect, Structural engineering, Mastermind strategic planning, Low latent inhibition, Manipulation', '2026-04-18 17:04:14'),
(20, 'Cristiano Ronaldo', 'assets/images/characters/cristianoronaldo.jpg', 'The greatest football players in history, known for his relentless work ethic, incredible goal-scoring records, and unparalleled athleticism on the pitch.', '41', 'Elite goal scoring, Superhuman athleticism, Free-kick mastery, Header specialist, High-pressure performance', '2026-04-18 17:07:57'),
(21, 'Batman', 'assets/images/characters/batman.jpg', 'A billionaire vigilante who, after witnessing his parents\' murder, trained himself to the absolute peak of physical and intellectual perfection to wage a one-man war on crime in Gotham City.', '40', 'Genius-level intellect, Master martial artist, World\'s greatest detective, Stealth mastery, Advanced gadgetry application', '2026-04-18 17:10:33'),
(22, 'Rust Cohle', 'assets/images/characters/rustcohle.jpg', 'A highly intelligent but deeply cynical and philosophical homicide detective whose obsessive, pessimistic nature drives him to solve a decades-spanning, ritualistic serial killer case.', '48', 'Master detective, Psychological profiling, Interrogation tactics, Eidetic memory, Undercover infiltration', '2026-04-18 17:13:26'),
(23, 'Mordret', 'assets/images/characters/mordret.jpg', 'Known as the Prince of Nothing, he is a dangerously cunning, terrifyingly patient, and ruthless Divine Aspect wielder who was imprisoned by his own lineage and will use anyone to achieve his revenge.', 'Early 20s', 'Reflection manipulation, Body possession, Soul combat, Master manipulator, Tactical genius', '2026-04-18 17:17:56'),
(24, 'Lightning McQueen', 'assets/images/characters/lightningmcqueen.jpg', 'A hotshot racing car who learns the true meaning of friendship, humility, and sportsmanship after getting stranded in the forgotten town of Radiator Springs.', 'Adult (Car)', 'Extreme speed, Precision driving, Drifting, Drafting, Piston Cup Champion', '2026-04-18 17:27:13'),
(25, 'John Cena', 'assets/images/characters/johncena.jpg', 'A legendary professional wrestler, actor, and pop culture icon, famous for his \"Hustle, Loyalty, Respect\" mantra and his supposedly being completely invisible.', '48', 'Superhuman strength, Attitude Adjustment (finisher), Invisibility (\"You can\'t see me\"), STF submission, Masterful promo skills', '2026-04-18 17:28:54'),
(26, 'Randy Orton', 'assets/images/characters/randyorton.jpg', 'A ruthless, calculating third-generation professional wrestler known as \"The Viper\" and \"The Apex Predator\" for his vicious and sudden attacks in the ring.', '46', 'RKO (out of nowhere), Punt kick, Ring psychology, Tactical striking, High pain tolerance', '2026-04-18 17:31:31'),
(27, 'FlightReacts', 'assets/images/characters/flightreacts.jpg', 'A highly energetic live streamer and YouTuber, famous for his iconic dolphin laugh, exaggerated basketball reactions, and intensely passionate gaming rage moments.', '30', 'Dolphin laugh, Extreme hype generation, Controller destruction, Unpredictable basketball takes, Infinite streaming stamina', '2026-04-18 17:33:53'),
(28, 'Dante', 'assets/images/characters/dante.jpg', 'A legendary, wisecracking demon hunter and private investigator. As a half-human, half-demon, he uses his immense power and stylish combat skills to protect the human world from demonic threats.', '40s', 'Devil Trigger transformation, Master swordsmanship (Rebellion), Expert dual-wielding marksmanship (Ebony & Ivory), Superhuman regeneration, Demonic strength', '2026-04-18 17:38:17');

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

CREATE TABLE `places` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'assets/images/placeholder.jpg',
  `description` text NOT NULL,
  `location` varchar(200) NOT NULL,
  `climate` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
