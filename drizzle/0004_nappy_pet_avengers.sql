CREATE TABLE `product_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description` text,
	`imageUrl` text,
	`parentId` int,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`productCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_categories_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `idx_product_categories_slug` UNIQUE(`slug`)
);
--> statement-breakpoint
DROP INDEX `idx_products_category` ON `products`;--> statement-breakpoint
ALTER TABLE `products` ADD `categoryId` int;--> statement-breakpoint
CREATE INDEX `idx_product_categories_active` ON `product_categories` (`isActive`);--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_product_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `product_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_products_published` ON `products` (`isPublished`);--> statement-breakpoint
CREATE INDEX `idx_products_category` ON `products` (`categoryId`);--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `category`;