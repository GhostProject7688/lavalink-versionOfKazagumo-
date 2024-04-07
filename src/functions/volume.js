module.exports = {
  name: "$volume",
  info: {
    usage: "$voicePing[volume?:number | get]",
    description: "sets the volume of the player or returns the current volume of the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const [volume = "get"] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    if (volume === "get") {
      data.result = player.volume;
    } else {
      await player.setVolume(volume);
    }

    return {
      code: d.util.setCode(data)
    };
  }
};
