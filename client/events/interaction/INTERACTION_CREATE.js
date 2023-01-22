export default {
    name: 'INTERACTION_CREATE',
    once: false,
    async execute(client, config, functions, interaction) {
        const { found, check } = {
             check(cmd) {
                if (!cmd) return found();
                cmd.runInteraction(client, interaction, functions, config);
            },
            found() {
                return functions.reply(interaction, {embeds: [{title: "Error", description: "This command doesn't exist!"}]});
            }
        };

        if (interaction.data.type === 1) return check(client.commands.get(interaction.data.name));
    },
};