'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql("CREATE TABLE `youtube_result` ( `id` INT NOT NULL AUTO_INCREMENT, `etag` VARCHAR(145) NULL, `video_id` VARCHAR(45) NULL, `published_at` DATETIME NULL, `title` VARCHAR(5000) NULL, PRIMARY KEY (`id`))");
};

exports.down = function(db) {
  return db.runSql("DROP TABLE `youtube_result`");
};

exports._meta = {
  "version": 1
};
