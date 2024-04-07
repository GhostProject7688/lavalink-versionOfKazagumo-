module.exports = {
  name: "$skipTrack",
  info: {
    usage: "$skipTrack", 
    description: "skips the current track in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    await player.skip(0, false);

    return {
      code: d.util.setCode(data)
    };
  }
};
