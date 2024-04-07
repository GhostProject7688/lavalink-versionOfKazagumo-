const { sources } = require("../constants");

module.exports = {
  name: "$search",
  info: {
    usage: "$search[query:any;source:string | sources (../constants);format:string;list:number;separator:string]", 
    description: "searches for a track and returns the results in a formatted way",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [query, source = "youtube", format = "{title} by {artist}", list = "10", separator = ", "] = data.inside.splits;

    const player = d.client.lavalinkClient.createPlayer({
      guildId: d.guild?.id ?? ""
    });
    const res = await player.search({ query, source: sources[source.toLowerCase()] }, d.author);

    const allTracks = res.tracks.slice(0, Number(list));

    const tracks = allTracks.map((x) => {
      let keys = format;
      for (let key in x.info) {
        keys = keys.replace(`{${key}}`, x.info[key]);
      }
      return keys;
    });

    data.result = tracks.join(separator);

    return {
      code: d.util.setCode(data)
    };
  }
};
