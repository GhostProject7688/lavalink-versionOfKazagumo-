module.exports = {
  name: "$clearFilters",
  info: {
    usage: "$clearFilters",
    description: "clears all filters from the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    await player.filterManager.clearEQ();

    return {
      code: d.util.setCode(data)
    };
  }
};
