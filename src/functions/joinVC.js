module.exports = {
  name: "$joinVC",
  info: {
    usage: "$joinVC[voiceID:snowflake;selfDeaf?:boolean;selfMute?:boolean]",
    description: "joins a voice channel",
    version: "0.1.0"
  },
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);

    const [voiceID, selfDeaf = "true", selfMute = "false"] = data.inside.splits;

    const channel = d.util.getChannel(d, voiceID);

    const oldPlayer = d.client.lavalinkClient.getPlayer(channel.guildId);

    if (oldPlayer) await oldPlayer.destroy();

    const player = await d.client.lavalinkClient.createPlayer({
      guildId: channel.guildId,
      voiceChannelId: voiceID,
      textChannelId: d.channel.id,
      selfDeaf: selfDeaf === "true",
      selfMute: selfMute === "true",
      instaUpdateFiltersFix: true,
      applyVolumeAsFilter: false
    });

    await player.connect();

    return {
      code: d.util.setCode(data)
    };
  }
};
