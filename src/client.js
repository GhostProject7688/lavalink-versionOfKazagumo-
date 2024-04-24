const { Kazagumo } = require("kazagump");
const AoiError = require("aoi.js/src/classes/AoiError");
const { version } = require("../package.json");
const { readdirSync } = require("fs");
const { join } = require("path");
const autoPlay = require("./autoPlay.js");
class Kazagumo {
  constructor(client, options) {
    this.client = client;
    this.options = options;
    this.events = {};
    this.cmds = new Map();
    this.connect();
  }

  addEvent(eventName, options) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    options.type = eventName;
    this.events[eventName].push(options);
  }

  async connect() {
    // Wait for the client to be ready
    await new Promise((resolve) => {
      this.client.once("ready", () => {
        setTimeout(() => {
          resolve();
        }, 1e3);
      });
    });
    const Nodes = [{
    host: this.options.host,
          port: this.options.port,
          auth: this.options.password || "",
          secure: this.options.secure || false
    }]
const manager = new Kazagumo(
      {
        defaultSearchEngine: this.options.defaultSearchEngine,
        // MAKE SURE YOU HAVE THIS
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
        plugins: this.config.lavalink.SPOTIFY.enable
          ? [
            /*  new Spotify({
                clientId: this.config.lavalink.SPOTIFY.id,
                clientSecret: this.config.lavalink.SPOTIFY.secret,
                playlistPageLimit: 1, // optional ( 100 tracks per page )
                albumPageLimit: 1, // optional ( 50 tracks per page )
                searchLimit: 10, // optional ( track search limit. Max 50 )
                searchMarket: "US", // optional || default: US ( Enter the country you live in. [ Can only be of 2 letters. For eg: US, IN, EN ] )//
              }),*/
              new Deezer(),
              new Nico({ searchLimit: 10 }),
              new Plugins.PlayerMoved(manager),
            ]
          : [
              new Deezer(),
              new Nico({ searchLimit: 10 }),
              new Plugins.PlayerMoved(manager),
            ],
      }, new Connectors.DiscordJS(manager), Nodes);
      
    

    this.client.Kazagumo = Kazagumo;
    this.client.Kazagumo.events = this.events;
    this.client.Kazagumo.cmds = this.cmds;

  //  this.client.on("raw", (d) => manager.sendRawData(d));

    //config
    manager.config = {};
    manager.config.defaultVolume = this.options?.defaultVolume || 100;
    manager.config.logging = this.options?.lavalinkLogs || true;
    manager.config.debug = this.options?.debug || false;

    if (manager.config.logging == true) {
      manager.nodeManager.on("connect", (node) => {
        AoiError.createCustomBoxedMessage(
          [
            {
              text: `Successfully connected to Node: ${node.id}`,
              textColor: "white"
            },
            {
              text: `Installed on v${version}`,
              textColor: "green"
            }
          ],
          "white",
          { text: " aoi.lavalink   ", textColor: "cyan" }
        );
      });

      manager.shoukaku.on("error", (node, error, payload) => {
        console.error(getTimestamp(), `The Lavalink Node ${node.id} errored:\n\r`, error);
        console.error(getTimestamp(), `Error-Payload:`, payload);
      });

      manager.shoukaku.on("destroy", (node) => {
        console.error(getTimestamp(), `The Lavalink Node ${node.id} was destroyed.`);
      });

      manager.nodeManager.on("reconnecting", (node) => {
        console.error(getTimestamp(), `Attempting to reconnect to node ${node.id}.`);
      });
    }

    if (manager.config.debug == true) {
      console.log(getTimestamp(), "The debug option is set to true.");

      

      manager.nodeManager.on("connect", (node) => {
        console.log(getTimestamp(), `Lavalink Version: ${node.version}`);
        console.log(getTimestamp(), `sourceManagers: ${node.info.sourceManagers.join(", ")}`);
        console.log(getTimestamp(), `plugins: ${JSON.stringify(node.info.plugins || {})}`);
      });
    }

    for (const eventName in this.events) {
      manager.on(eventName, async (player, node, payload) => {
        for (const event of this.events[eventName]) {
          const channel = this.client.channels.cache.get(event.channel) || this.client.channels.cache.get(player.textChannelId) || undefined;
          const guild = this.client.guilds.cache.get(player.guildId) || undefined;

          await this.client.functionManager.interpreter(
            this.client,
            {
              guild: guild,
              author: player.queue?.current?.requester || undefined,
              channel: channel
            },
            [],
            { name: event.name, code: event.code },
            this.client.db,
            false,
            channel,
            {},
            channel,
            true
          );
        }
      });
    }

    await manager.init({ ...this.client.user });

    this.createFunctions(this.client);
  }

  async createFunctions() {
    const functions = readdirSync(join(__dirname, "./functions")).filter((file) => file.endsWith(".js"));
    const files = [];
    for (const file of functions) {
      const func = require(join(__dirname, `./functions/${file}`));
      if (func.name && func.code && func.type) {
        if (this.options.debug) files.push(file);
        await this.client.functionManager.createFunction(func);
      }
    }
    if (this.options.debug) console.log(getTimestamp(), `Loaded functions: ${files.map((f) => f.replace(".js", "")).join(", ")}`);
  }
}

module.exports = { Kazagumo };

function getTimestamp(type = "default") {
  const now = new Date();
  const time = now.toTimeString().split(" ")[0];
  let message;

  switch (type) {
    case "default":
      message = `${time} [aoi.lavalink] |`;
      break;
    case "none":
      message = `${time} |`;
      break;
  }

  return message;
}
