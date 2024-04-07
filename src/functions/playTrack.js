const { sources } = require("../constants");

module.exports = {
  name: "$playTrack",
  info: {
    usage: "$playTrack[query:any;source:string | sources (../constants)]", 
    description: "pauses the current track in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [query, source = "youtube"] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "No player found.");

    const res = await player.search({ query: query, source: sources[source.toLowerCase()] }, d.author);
    if (!res || !res.tracks?.length) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "No tracks found.");

    await player.queue.add(res.loadType === "playlist" ? res.tracks : res.tracks[0]);

    if (!player.playing)
      await player.play({
        volume: d.client.lavalinkClient?.config.defaultVolume,
        paused: false
      });

    return {
      code: d.util.setCode(data)
    };
  }
};
