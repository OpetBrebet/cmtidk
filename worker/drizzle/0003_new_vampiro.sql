PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_document_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`document_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'viewer' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_document_shares`("id", "name", "document_id", "user_id", "role", "created_at") SELECT "id", "name", "document_id", "user_id", "role", "created_at" FROM `document_shares`;--> statement-breakpoint
DROP TABLE `document_shares`;--> statement-breakpoint
ALTER TABLE `__new_document_shares` RENAME TO `document_shares`;--> statement-breakpoint
PRAGMA foreign_keys=ON;