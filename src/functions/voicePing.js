module.exports = {
  name: "$voicePing",
  info: {
    usage: "$voicePing[type:string | ws | lavalink]",
    description: "returns the voice ping of the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [type = "ws"] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);
    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    if (type === "ws") {
      data.result = player.ping.ws;
    } else if (type === "lavalink") {
      data.result = player.ping.lavalink;
    } else {
      d.aoiError.fnError(d, "custom", {}, "Invalid type, use 'ws' or 'lavalink'");
    }

    return {
      code: d.util.setCode(data)
    };
  }
};
