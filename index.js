if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: ['CHANNEL'] });

const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;
const botToken = process.env.BOT_TOKEN;
const anniversaryDate = new Date('2024-03-23T00:00:00');
const timezone = 'Asia/Manila';

const boyfriendId = '703218396052848680';
const girlfriendId = '899807711821189202';

function getDaysUntilNextMonthsary() {
    const now = new Date();
    const anniversaryThisMonth = new Date(now.getFullYear(), now.getMonth(), anniversaryDate.getDate());

    if (now < anniversaryThisMonth) {
        return Math.ceil((anniversaryThisMonth - now) / (1000 * 60 * 60 * 24));
    } else {
        const nextAnniversary = new Date(now.getFullYear(), now.getMonth() + 1, anniversaryDate.getDate());
        return Math.ceil((nextAnniversary - now) / (1000 * 60 * 60 * 24));
    }
}

function getDaysUntilAnniversary() {
    const now = new Date();
    const nextAnniversary = new Date(now.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());

    if (now > nextAnniversary) {
        nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
    }

    const diffTime = Math.abs(nextAnniversary - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function createReminderEmbed() {
    const daysUntilMonthsary = getDaysUntilNextMonthsary();
    const daysUntilAnniversary = getDaysUntilAnniversary();
    const today = new Date().toLocaleDateString('en-US', { timeZone: timezone });

    return new EmbedBuilder()
        .setTitle('💖 Anniversary and Monthsary Reminders 💖')
        .setDescription(`Our special dates are coming up! Here are the details:`)
        .setColor(0x9F2B68)
        .addFields(
            { name: 'Anniversary', value: `Our original anniversary is on March 23, 2024. That's in **${daysUntilAnniversary} days**! 🥳`, inline: true },
            { name: 'Next Monthsary', value: `Our next monthsary is in **${daysUntilMonthsary} days**! 🎉`, inline: true },
        )
        .setThumbnail('https://i.imgur.com/ToYJ8sQ.jpg')
        .setFooter({ text: `Today's Date: ${today}`, iconURL: 'https://i.imgur.com/O5jJt2A.jpg' })
        .setURL('https://retrovers3.github.io/luvukate/')
        .setTimestamp();
}

function createDmReminderEmbed(initiatorId) {
    const recipientId = initiatorId === boyfriendId ? girlfriendId : boyfriendId;
    const recipientName = initiatorId === boyfriendId ? 'Girlfriend' : 'Boyfriend';
    const initiatorName = initiatorId === boyfriendId ? 'Boyfriend' : 'Girlfriend';

    return new EmbedBuilder()
        .setTitle('🌟 Mood Reminder 🌟')
        .setDescription(`Hey <@${recipientId}>, your ${recipientName} is feeling down. Please talk to them.`)
        .setColor(0xffa500)
        .setThumbnail('https://example.com/your_thumbnail_image.png')
        .setFooter({ text: `Reminder initiated by: ${initiatorName}`, iconURL: 'https://example.com/your_footer_icon.png' })
        .setTimestamp();
}

client.once('ready', () => {
    console.log(`Belinda is now awake`);

    cron.schedule('0 9 1 * *', () => {
        const channel = client.channels.cache.get(channelId);
        if (channel) {
            const embed = createReminderEmbed();
            channel.send({ content: '@everyone', embeds: [embed] });
        }
    }, {
        timezone: timezone
    });

    client.on('messageCreate', message => {
        // Handle DMs
        if (message.guild === null) { // Message is a DM
            if (message.author.id === boyfriendId || message.author.id === girlfriendId) {
                if (message.content.toLowerCase() === '!moodreminder') {
                    const initiatorId = message.author.id;
                    const recipientId = initiatorId === boyfriendId ? girlfriendId : boyfriendId;
                    const embed = createDmReminderEmbed(initiatorId);

                    client.users.fetch(recipientId).then(user => {
                        user.send({ embeds: [embed] });
                        message.author.send('Your reminder has been sent.');
                    }).catch(err => {
                        message.author.send('There was an error sending the reminder.');
                        console.error(err);
                    });
                }
            }
        } else if (message.content === '!reminder') { // Message is in a guild
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                const embed = createReminderEmbed();
                channel.send({ content: '@everyone', embeds: [embed] });
            }
        }
    });
});

client.login(botToken);
