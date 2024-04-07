module.exports = {
  name: "$leaveVC",
  info: {
    usage: "$leaveVC[guildID:snowflake]", 
    description: "leaves a voice channel in a guild",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildId = d.guild?.id] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(guildId);

    if (!player) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "No player found.");

    await player.destroy();

    return {
      code: d.util.setCode(data)
    };
  }
};
