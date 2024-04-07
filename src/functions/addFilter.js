const { EQList } = require("lavalink-client");

module.exports = {
  name: "$addFilter",
  info: {
    usage: "$addFilter[filter1:string;filter2:string;...]",
    description: "adds a filter to the player",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...filters] = data.inside.splits;

    const player = d.client.lavalinkClient.getPlayer(d.guild?.id || d.channel?.guildId);

    if (!player) return d.aoiError.fnError(d, "custom", {}, "No player found.");

    const EList = Object.keys(EQList);

    for (const filter of filters) {
      if (EList.includes(filter)) {
        await player.filterManager.setEQ(EQList[filter]);
      } else {
        d.aoiError.fnError(d, "custom", {}, `Invalid filter '${filter}', use the following: ${EList.join(", ")} `);
        break;
      }

      if (filter.toLowerCase() === "clear") {
        await player.filterManager.clearEQ();
      }
    }

    return {
      code: d.util.setCode(data)
    };
  }
};
