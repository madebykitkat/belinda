if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const keep_alive = require("./keep_alive.js")
const cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;
const botToken = process.env.BOT_TOKEN;
const anniversaryDate = new Date('2024-03-23T00:00:00');
const timezone = 'Asia/Manila';

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
        .setColor(0xffa500)
        .addFields(
            { name: 'Anniversary', value: `Our original anniversary is on March 23, 2024. That's in **${daysUntilAnniversary} days**! 🥳`, inline: true },
            { name: 'Next Monthsary', value: `Our next monthsary is in **${daysUntilMonthsary} days**! 🎉`, inline: true },
        )
        .setThumbnail('https://i.imgur.com/ToYJ8sQ.jpg')
        .setFooter({ text: `Today's Date: ${today}`, iconURL: 'https://i.imgur.com/O5jJt2A.jpg' })
        .setURL('https://retrovers3.github.io/luvukate/')
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
        if (message.content === '!testReminder') {
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                const embed = createReminderEmbed();
                channel.send({ content: '@everyone', embeds: [embed] });
            }
        }
    });
});

client.login(botToken);
