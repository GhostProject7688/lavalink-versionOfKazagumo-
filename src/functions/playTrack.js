//const { sources } = require("../constants");

module.exports = {
  name: "$playTrack",
  info: {
    usage: "$playTrack[string | sources (../constants)]", 
    description: "pauses the current track in the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [] = data.inside.splits;

    const player = manager.players.get(d.guild!.id);
    if (!player) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "No player found.");

    const result = await player.search(value, { requester: message.author });
    const tracks = result.tracks;

    if (!result.tracks.length) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "No tracks found.");

    if (result.type === "PLAYLIST")
      for (let track of tracks) player.queue.add(track);
    else if (player.playing && result.type === "SEARCH")
      player.queue.add(tracks[0]);
    else if (player.playing && result.type !== "SEARCH")
      for (let track of tracks) player.queue.add(track);
    else player.play(tracks[0]);
    if (!player.playing)
      await player = await client.manager.createPlayer({
        guildId: d.guild!.id,
        voiceId: d.member!.voice.channel!.id,
        textId: d.channel.id,
        deaf: true,
      });
    return {
      code: d.util.setCode(data)
    };
  }
};
