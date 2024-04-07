// sources
const sources = [
  { name: "youtube", source: "ytsearch" },
  { name: "youtubemusic", source: "ytmsearch" },
  { name: "soundcloud", source: "scsearch" },
  { name: "deezer", source: "dzsearch" },
  { name: "spotify", source: "spsearch" },
  { name: "applemusic", source: "amsearch" },
  { name: "local", source: "local" }
];

const events = [
  "playerCreate",
  "playerDestroy",
  "playerDisconnect",
  "playerMove",
  "playerSocketClosed",
  "trackStart",
  "trackStuck",
  "trackError",
  "trackEnd",
  "queueEnd",
  "playerUpdate"
]

module.exports = { sources, events };
