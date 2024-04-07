module.exports = {
  name: "$queue",
  info: {
    usage: "$queue[page?:number;limit?:number;format?:string;separator?:string]", 
    description: "returns the queue of the player in a formatted way",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    let [page = "1", limit = "10", format = "{title} by {author}", separator = "\n"] = data.inside.splits;

    page = parseInt(page);
    limit = parseInt(limit);

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);
    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    try {
      const queue = player.queue.tracks;

      const startIndex = (page - 1) * limit;

      const currentTracks = queue.slice(startIndex, startIndex + limit);

      let formatted = [];
      for (let i = 0; i < currentTracks.length; i++) {
        const track = currentTracks[i];
        let tracks = format
          .replaceAll("{title}", track.info.title)
          .replaceAll("{author}", track.info.author)
          .replaceAll("{position}", i + 1 + startIndex)
          .replaceAll("{duration}", track.info.duration)
          .replaceAll("{uri}", track.info.uri)
          .replaceAll("{sourceName}", track.info.sourceName)
          .replaceAll("{artworkUrl}", track.info.artworkUrl);

        formatted.push(tracks);
      }

      data.result = formatted.join(separator);
    } catch (err) {
      data.result = null;
    }

    return {
      code: d.util.setCode(data)
    };
  }
};