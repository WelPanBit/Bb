const {
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} = require("discord.js");
const settings = require("../settings");
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  // code

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
       if (interaction.commandName == "setup") {
        // code
        let ticketChannel = interaction.guild.channels.cache.get(
          settings.ticketChannel
          
        );
        if (!ticketChannel) return;
        let embed = new MessageEmbed()
          .setColor("#6A545A")
          .setTitle(`Заявка в город.`)
          .setDescription(`> Нажми на кнопку чтобы кинуть заявку в город.`);

        let btnrow = new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("ticket_create")
            .setStyle("SECONDARY")
            .setLabel(`Подать Заявку`)
            .setEmoji("🎟️"),
        ]);
        await ticketChannel.send({
          embeds: [embed],
          components: [btnrow],
        });

        interaction.reply({
          content: `Ticket System Setup in ${ticketChannel}`,
        });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId == "ticket_create") {
        const ticket_modal = new Modal()
          .setTitle("Ticket System")
          .setCustomId("ticket_modal");

        const user_name = new TextInputComponent()
          .setCustomId("ticket_username")
          .setLabel(`Ваш ник на сервере:`.substring(0, 45))
          .setMinLength(3)
          .setMaxLength(50)
          .setRequired(true)
          .setStyle("SHORT");

        const user_reason = new TextInputComponent()
          .setCustomId("ticket_reason")
          .setLabel(`Напишите немного о себе, в чём вы хороши ...`.substring(0, 45))
          .setMinLength(3)
          .setMaxLength(100)
          .setRequired(true)
          .setStyle("PARAGRAPH");

        const row_username = new MessageActionRow().addComponents(user_name);
        const row_user_reason = new MessageActionRow().addComponents(
          user_reason
        );
        ticket_modal.addComponents(row_username, row_user_reason);

        await interaction.showModal(ticket_modal);
      } else if (interaction.customId == "ticket_delete") {
        let ticketname = `ticket-${interaction.user.id}`;
        let oldChannel = interaction.guild.channels.cache.find(
          (ch) => ch.name == ticketname
        );
        if (!oldChannel) return;
        interaction.reply({
          content: `> Ваша заявка удалится через несколько секунд...`,
        });
        setTimeout(() => {
          oldChannel.delete().catch((e) => {});
        }, 5000);
      } else if (interaction.customId == "ticket_accept") {
        let ticketname = `ticket-${interaction.user.id}`;
        let oldChannel = interaction.guild.channels.cache.find(
          (ch) => ch.name == ticketname
        );
      if (!oldChannel) return;
      interaction.reply({
          content: `> Игрок - был принят в город.`,
          
        });

      }
    }

    if (interaction.isModalSubmit()) {
      const ticket_username =
        interaction.fields.getTextInputValue("ticket_username");
      const ticket_user_reason =
        interaction.fields.getTextInputValue("ticket_reason");

      let ticketname = `ticket-${interaction.user.id}`;
      await interaction.guild.channels
        .create(ticketname, {
          type: "GUILD_TEXT",
          topic: `Заявка игрока ${interaction.user.tag}`,
          parent: settings.ticketCategory || interaction.channel.parentId,
          permissionOverwrites: [
            {
              id: interaction.guildId,
              deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            },
            {
              id: interaction.user.id,
              allow: [
                "VIEW_CHANNEL",
                "SEND_MESSAGES",
                "READ_MESSAGE_HISTORY",
                "EMBED_LINKS",
                "ATTACH_FILES",
                "MANAGE_CHANNELS",
                "ADD_REACTIONS",
                "USE_APPLICATION_COMMANDS",
              ],
            },
            {
              id: ('1005544293294932158'), 
              allow: [
               "ADMINISTRATOR",
               "MANAGE_CHANNELS",
               "VIEW_CHANNEL",
               "SEND_MESSAGES",
               "READ_MESSAGE_HISTORY",
               "EMBED_LINKS",
               "ATTACH_FILES",
               "MANAGE_CHANNELS",
               "ADD_REACTIONS",
               "USE_APPLICATION_COMMANDS",
              ],
            },
            {
              id: client.user.id, 
              allow: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
            },
          ],
        })
        .then(async (ch) => {
          let embed = new MessageEmbed()
            .setColor("#6A545A")
            .setTitle(`Заявка игрока ${interaction.user.username}`)
            .addFields([
              {
                name: `Ник игрока:`,
                value: `> ${ticket_username}`,
              },
              {
                name: `Информация:`,
                value: `> ${ticket_user_reason}`,
              },
            ]);

          let btnrow = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`ticket_delete`)
              .setStyle("DANGER")
              .setLabel(`Удалить`),
            new MessageButton()
              .setCustomId(`ticket_accept`)
              .setStyle("SUCCESS")
              .setLabel(`Принять`),
             
        ]);
          ch.send({
            content: `${interaction.member} || ${settings.ticketRoles.map(
              (r) => `<@&${r}>`
            )}`,
            embeds: [embed],
            components: [btnrow],
          });
          interaction.reply({
            content: `> Ваша Заявка в канале: ${ch}`,
            ephemeral: true,
          });
        })
        .catch((e) => {
          interaction.reply({
            content: `Error \n \`${e.message}\``,
            ephemeral: true,
          });
       });
    }
  });
};
