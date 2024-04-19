require("colors");

module.exports = async (client) => {
    console.log(`[ParkerJS] `.green + `${client.user.username} is online.`.blue);
}