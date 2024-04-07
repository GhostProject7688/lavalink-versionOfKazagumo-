module.exports = {
  name: "$skipTo",
  info: {
    usage: "$skipTo[time;throwError:boolean]", 
    description: "skips to a specific track in the queue of the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [to, throwError = "false"] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    await player.skip(to, throwError === "true");

    return {
      code: d.util.setCode(data)
    };
  }
};
