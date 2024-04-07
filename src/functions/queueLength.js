module.exports = {
  name: "$queueLength",
  info: {
    usage: "$queueLength", 
    description: "returns the length of the queue in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);
    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    data.result = player.queue.tracks?.length || 0;

    return {
      code: d.util.setCode(data)
    };
  }
};
