import { Client } from 'pioucord';
import { func } from "./utils/functions.js";
import * as fs from 'node:fs';
import config from './config/config.json' assert { type: 'json' };

export const client = new Client({     
	intents: ['Guilds', 'GuildMembers'],
});

for(const collection of ['commands']) {
    client[collection] = new Map();
};

for (const handler of ['EventUtil', 'CommandUtil']) {
    const handlerFile = await import(`./utils/handlers/${handler}.js`)
    handlerFile.default(client, fs, config, func);
};

process.on('exit', code => {
    console.log(`EXIT: ${code}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(`UNHANDLED_REJECTION: ${reason} \n`, promise);
});

process.on('uncaughtException', error => {
    console.log(`UNCAUGHT_EXCEPTION: ${error}`);
});

client.login(config.client.TOKEN);
