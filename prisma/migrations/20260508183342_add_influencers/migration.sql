-- CreateTable
CREATE TABLE "Influencer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'INSTAGRAM',
    "handle" TEXT,
    "followers" INTEGER,
    "engagementRate" REAL,
    "niche" TEXT,
    "ratePerPost" REAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
