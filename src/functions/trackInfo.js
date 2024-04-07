module.exports = {
  name: "$trackInfo",
  info: {
    usage: "$trackInfo[query?:string;position?:number]",
    description: "returns the track info of a track in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const [query = "title", position = "1"] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "No player found.");

    let trackInfo;

    try {
      if (position == 1) {
        trackInfo = player.queue.current?.info;
      } else if (position == 0) {
        trackInfo = player.queue.previous[0]?.info;
      } else {
        trackInfo = player.queue.tracks[position - 2]?.info;
      }

      data.result = trackInfo[query.toLowerCase()];
    } catch {
      data.result = null;
    }

    return {
      code: d.util.setCode(data)
    };
  }
};
