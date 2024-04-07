module.exports = {
  name: "$seek",
  info: {
    usage: "$seek[time:number | ms]", 
    description: "seeks to a specific time in the current track in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [time] = data.inside.splits;

    if (!time) return d.aoiError.fnError(d, "custom", {}, "Time was not provided.");

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    if (time > player.queue.current.info.duration || time < 0) {
      await player.skip();
    } else {
      await player.seek(Number(time));
    }

    return {
      code: d.util.setCode(data)
    };
  }
};
