module.exports = {
  name: "$clearQueue",
  info: {
    usage: "$clearQueue",
    description: "clears the queue of the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    await player.stopPlaying(true, player.get("autoplay") == "true");

    return {
      code: d.util.setCode(data)
    };
  }
};
