module.exports = {
  name: "$pauseTrack",
  info: {
    usage: "$pauseTrack[clearQueue?:boolean;executeAutoplay?:boolean]", 
    description: "pauses the current track in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const [clearQueue = "false", executeAutoplay = "false"] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    if (executeAutoplay) player.set("autoplay", true);

    await player.stopPlaying(clearQueue === "true", executeAutoplay === "true");

    return {
      code: d.util.setCode(data)
    };
  }
};
