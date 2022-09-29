const {wrole, wch } = require("../settings");
module.exports = async (client) => {
    client
    .on("guildMemberAdd", function (member) {
        member.roles.add(wrole); //Роль при воходе
        const { MessageEmbed } = require("discord.js");
        const embed = new MessageEmbed()
        embed
          .setTitle("Новый пользователь!")
          .setColor("#6A545A") //Цвет полоски
          .setDescription(
            "**› Приветствую вас, " +
              `**${member.user}**` +
              ".\n› Не забудьте заполнить заявку в канале:\n› <#1018537975782580375>**"
          )
          .setThumbnail(member.user.avatarURL());
        const channel = member.guild.channels.cache.get(wch); //канал для отправки
        channel.send({ embeds: [embed] });
    });
}