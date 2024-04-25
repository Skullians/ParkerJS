const SQLite = require("better-sqlite3");
const sql = new SQLite("./data.sqlite");
const log = require("../logging/generalLogging").loggingManager;

function initialiseDatabase() {
    log.log("Initialising SQLite.")

    const blacklistTables = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' and NAME = 'blacklistTable';").get();
    if (!blacklistTables['count(*)']) {
        log.log("SQLite Table blacklistTable did not exist, creating.")
        sql.prepare("CREATE TABLE blacklistTable (id TEXT PRIMARY KEY);").run();
        log.log("Created blacklistTable.")
    }
}

async function blacklistUser(user) {
    try {
        console.log(`[ParkerJS] `.green + `Blacklisting user [`.red + `${user}`.yellow + "] from receiving support.".red)
        log.log(`Blacklisting ${user} from recieving support.`)

        if (sql.prepare(`SELECT id FROM blacklistTable WHERE id = ?`).get(user)) return false;

        sql.prepare("INSERT OR REPLACE INTO blacklistTable (id) VALUES (?);").run(user)

        console.log(`[ParkerJS] `.green + `Successfully blacklisted user [`.red + `${user}`.yellow + "] from receiving support.".red)
        log.log(`${user} has been blacklisted from recieving support.`)

        return true; // essentially a successful blacklist
    } catch (error) {
        log.error(`An error occurred when blacklisting user [${user}]: ${error}`)
        console.log(`An unexpected error occurred when blacklisting user [${user}]: \n${error}`.red);

        return false; // unsuccessful blacklist
    }
}

async function removeBlacklist(user) {
    try {
        console.log(`[ParkerJS] `.green + `Removing blacklist of user [`.red + `${user}`.yellow + `].`.red)
        log.log(`Removing ${user.username} from the blacklist.`)

        if (!sql.prepare(`SELECT id FROM blacklistTable WHERE id = ?`).get(user)) return false;

        sql.prepare("DELETE FROM blacklistTable WHERE id = ?").run(user);

        console.log(`[ParkerJS] `.green + `Successfully removed [`.gray + `${user}`.yellow + `] from the blacklist.`.gray);
        log.log(`Removed [${user}] from the blacklist.`);

        return true; // successful blacklist removal
    } catch (error) {
        log.log(`An error occurred when removing [${user}] from the blacklist: ${error}`)
        console.log(`An unexpected error occurred when removing [${user}] from the blacklist: \n${error}`.red);

        return false; // unsuccessful blacklist removal
    }
}

async function isBlacklisted(userId) {
    try {
        return sql.prepare(`SELECT id FROM blacklistTable WHERE id = ?`).get(userId);
    } catch (error) {
        log.log(`An error occurred when checking if user ID [${userId}] was blacklisted: ${error}`);
        console.log(`An unexpected error occurred when checking if user ID [${userId}] was blacklisted: \n${error}`);

        return false;
    }
}

module.exports = { initialiseDatabase, blacklistUser, removeBlacklist, isBlacklisted };