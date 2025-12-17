CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`shortDescription` varchar(300),
	`type` enum('distribution','workshop','exhibition','campaign','event','school_program') NOT NULL,
	`imageUrl` text,
	`galleryImages` json,
	`date` timestamp,
	`endDate` timestamp,
	`location` varchar(200),
	`participantCount` int,
	`isPublished` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdBy` int,
	CONSTRAINT `activities_id` PRIMARY KEY(`id`),
	CONSTRAINT `activities_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `idx_activities_slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `chofetz_chaim_commentary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int NOT NULL,
	`commentaryType` enum('beer_mayim_chaim','mekor_hachaim','hagahot','modern_explanation') NOT NULL,
	`hebrewText` text NOT NULL,
	`englishTranslation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chofetz_chaim_commentary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chofetz_chaim_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`book` enum('hilchot_lashon_hara','hilchot_rechilut','shmirat_halashon') NOT NULL,
	`chapter` int NOT NULL,
	`section` int,
	`paragraph` int,
	`hebrewText` text NOT NULL,
	`transliteration` text,
	`englishTranslation` text,
	`summary` text,
	`topics` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chofetz_chaim_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chofetz_chaim_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`hebrewName` varchar(100) NOT NULL,
	`description` text,
	`parentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chofetz_chaim_topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `chofetz_chaim_topics_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `commitments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`phone` varchar(15) NOT NULL,
	`email` varchar(320) NOT NULL,
	`receiveUpdates` boolean NOT NULL DEFAULT false,
	`ipAddress` varchar(45),
	`userAgent` text,
	`source` varchar(50) DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`confirmedAt` timestamp,
	CONSTRAINT `commitments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(15),
	`subject` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`isArchived` boolean NOT NULL DEFAULT false,
	`priority` enum('low','normal','high') DEFAULT 'normal',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	`readBy` int,
	`repliedAt` timestamp,
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`section` varchar(50) NOT NULL,
	`title` varchar(200),
	`subtitle` varchar(300),
	`content` text,
	`imageUrl` text,
	`buttonText` varchar(50),
	`buttonUrl` varchar(500),
	`metadata` json,
	`isPublished` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updatedBy` int,
	CONSTRAINT `content_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_key_unique` UNIQUE(`key`),
	CONSTRAINT `idx_content_key` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stripePaymentIntentId` varchar(100),
	`stripeCustomerId` varchar(100),
	`stripeSubscriptionId` varchar(100),
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'ILS',
	`frequency` enum('one_time','monthly') NOT NULL,
	`status` enum('pending','processing','completed','failed','refunded','cancelled') NOT NULL DEFAULT 'pending',
	`donorName` varchar(100),
	`donorEmail` varchar(320),
	`donorPhone` varchar(15),
	`dedicatedTo` text,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`receiptUrl` text,
	`receiptNumber` varchar(50),
	`notes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`refundedAt` timestamp,
	CONSTRAINT `donations_id` PRIMARY KEY(`id`),
	CONSTRAINT `donations_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `email_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('commitment_confirmation','newsletter','donation_receipt','contact_notification','partnership_notification') NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(200) NOT NULL,
	`status` enum('pending','sent','failed','bounced') NOT NULL DEFAULT 'pending',
	`sendgridMessageId` varchar(100),
	`errorMessage` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `email_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`thumbnailUrl` text,
	`category` enum('ambassadors','events','schools','partners','campaigns','workshops') NOT NULL,
	`personName` varchar(100),
	`personRole` varchar(100),
	`eventDate` timestamp,
	`location` varchar(200),
	`isPublished` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdBy` int,
	CONSTRAINT `gallery_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('ambassador','financial','school','inspiration') NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(15) NOT NULL,
	`organization` varchar(200),
	`role` varchar(100),
	`message` text,
	`status` enum('pending','reviewing','approved','rejected','contacted') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`handledBy` int,
	`handledAt` timestamp,
	CONSTRAINT `partnerships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rag_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sources` json,
	`feedback` enum('helpful','not_helpful'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rag_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(100),
	`status` enum('pending','active','unsubscribed') NOT NULL DEFAULT 'pending',
	`confirmToken` varchar(64),
	`unsubscribeToken` varchar(64) NOT NULL,
	`source` varchar(50) DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`confirmedAt` timestamp,
	`unsubscribedAt` timestamp,
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(15);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chofetz_chaim_commentary` ADD CONSTRAINT `chofetz_chaim_commentary_contentId_chofetz_chaim_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `chofetz_chaim_content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contact_messages` ADD CONSTRAINT `contact_messages_readBy_users_id_fk` FOREIGN KEY (`readBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content` ADD CONSTRAINT `content_updatedBy_users_id_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_items` ADD CONSTRAINT `gallery_items_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partnerships` ADD CONSTRAINT `partnerships_handledBy_users_id_fk` FOREIGN KEY (`handledBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rag_conversations` ADD CONSTRAINT `rag_conversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_activities_type_published` ON `activities` (`type`,`isPublished`);--> statement-breakpoint
CREATE INDEX `idx_activities_date` ON `activities` (`date`);--> statement-breakpoint
CREATE INDEX `idx_commentary_content` ON `chofetz_chaim_commentary` (`contentId`);--> statement-breakpoint
CREATE INDEX `idx_commentary_type` ON `chofetz_chaim_commentary` (`commentaryType`);--> statement-breakpoint
CREATE INDEX `idx_cc_book_chapter` ON `chofetz_chaim_content` (`book`,`chapter`);--> statement-breakpoint
CREATE INDEX `idx_topics_parent` ON `chofetz_chaim_topics` (`parentId`);--> statement-breakpoint
CREATE INDEX `idx_commitments_email` ON `commitments` (`email`);--> statement-breakpoint
CREATE INDEX `idx_commitments_created` ON `commitments` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_contact_is_read` ON `contact_messages` (`isRead`);--> statement-breakpoint
CREATE INDEX `idx_contact_created` ON `contact_messages` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_content_section` ON `content` (`section`);--> statement-breakpoint
CREATE INDEX `idx_donations_status` ON `donations` (`status`);--> statement-breakpoint
CREATE INDEX `idx_donations_created` ON `donations` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_donations_email` ON `donations` (`donorEmail`);--> statement-breakpoint
CREATE INDEX `idx_email_type_status` ON `email_logs` (`type`,`status`);--> statement-breakpoint
CREATE INDEX `idx_email_created` ON `email_logs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_gallery_category_published` ON `gallery_items` (`category`,`isPublished`);--> statement-breakpoint
CREATE INDEX `idx_gallery_sort` ON `gallery_items` (`sortOrder`);--> statement-breakpoint
CREATE INDEX `idx_gallery_featured` ON `gallery_items` (`isFeatured`);--> statement-breakpoint
CREATE INDEX `idx_partnerships_type_status` ON `partnerships` (`type`,`status`);--> statement-breakpoint
CREATE INDEX `idx_partnerships_created` ON `partnerships` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_rag_session` ON `rag_conversations` (`sessionId`);--> statement-breakpoint
CREATE INDEX `idx_rag_user` ON `rag_conversations` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_subscribers_status` ON `subscribers` (`status`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);