module.exports = {
  name: "$resumeTrack",
  info: {
    usage: "$resumeTrack", 
    description: "resumes the current track in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    if (player.paused) await player.resume();

    return {
      code: d.util.setCode(data)
    };
  }
};
