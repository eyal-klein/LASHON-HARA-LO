DROP INDEX `idx_cc_book_chapter` ON `chofetz_chaim_content`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` MODIFY COLUMN `section` enum('lashon_hara','rechilut') NOT NULL;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` ADD `klal` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` ADD `seif` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` ADD `chunk_index` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` ADD `content` text NOT NULL;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` ADD `embedding` json;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` ADD `source_url` text;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_cc_section_klal` ON `chofetz_chaim_content` (`section`,`klal`);--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `book`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `chapter`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `paragraph`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `hebrewText`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `transliteration`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `englishTranslation`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `summary`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `topics`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_content` DROP COLUMN `updatedAt`;