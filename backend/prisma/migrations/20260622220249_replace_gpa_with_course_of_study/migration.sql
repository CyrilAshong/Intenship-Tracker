/*
  Warnings:

  - You are about to drop the column `gpa` on the `student_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "gpa",
ADD COLUMN     "courseOfStudy" TEXT;
