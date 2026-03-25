-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExerciseRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExerciseRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExerciseRecord_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExerciseRecord" ("answeredAt", "exerciseId", "id", "isCorrect", "userId") SELECT "answeredAt", "exerciseId", "id", "isCorrect", "userId" FROM "ExerciseRecord";
DROP TABLE "ExerciseRecord";
ALTER TABLE "new_ExerciseRecord" RENAME TO "ExerciseRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
