import { Client } from 'pioucord';
import { func } from "./utils/functions.js";
import * as fs from 'node:fs';
import config from './config/config.json' assert { type: 'json' };
import Database from 'better-sqlite3';
const db = new Database('config/db/trusty.db');
db.prepare(`CREATE TABLE IF NOT EXISTS Account(server_id INTEGER PRIMARY KEY, owner_id TEXT, password TEXT)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS Captcha(user_id INTEGER PRIMARY KEY, server_id TEXT, captcha TEXT, time INT)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS User(user_id INTEGER PRIMARY KEY, pass INT, failed INT)`).run();
db.close();

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
