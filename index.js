const { Client, Permissions } = require("discord.js");
const { token, guildId } = require("./settings");

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

client.on("ready", async () => {
  console.log(`${client.user.username} is Online`);
  let guild = client.guilds.cache.get(guildId);
  if (guild) {
    await guild.commands.set([
      {
        name: "setup",
        description: `setup ticket system`,
        type: "CHAT_INPUT",
		Permissions: Permissions.FLAGS.ADMINISTRATOR,
      },
    ]);
  }
  // loading ticket system
  require("./events/ticket_system")(client);
  require("./events/welcome")(client);

});

client.login(token);

