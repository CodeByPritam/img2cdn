-- Create Img2Cdn Assets Table --
CREATE TABLE IF NOT EXISTS i2c_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  linkgid TEXT NOT NULL,
  assetid TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  r2key TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  kind TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT NULL,

  -- Create References
  FOREIGN KEY (linkgid) REFERENCES i2c_groups(gid) ON DELETE CASCADE
);