module.exports = {
  name: "$autoPlay",
  info: {
    usage: "$autoPlay[enable?:boolean;returnState?:boolean]",
    description: "enables/disables autoplay for the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const [enable = "true", returnState = "false"] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "No player found.");

    await player.set("autoplay", enable === "true");

    data.result = returnState === "true" ? player.get("autoplay") : null;

    return {
      code: d.util.setCode(data)
    };
  }
};
