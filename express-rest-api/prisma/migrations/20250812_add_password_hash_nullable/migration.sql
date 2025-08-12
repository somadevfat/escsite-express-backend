-- Add password_hash column as nullable to existing users table
ALTER TABLE `users`
  ADD COLUMN `password_hash` VARCHAR(191) NULL;


