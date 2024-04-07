module.exports = {
  name: "$stopPlayer",
  info: {
    usage: "$stopPlayer", 
    description: "stops the player and clears the queue",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    await player.destroy();

    return {
      code: d.util.setCode(data)
    };
  }
};
