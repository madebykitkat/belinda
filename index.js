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

const boyfriendId = '703218396052848680';
const girlfriendId = '899807711821189202';

let activeMoodReminder = false; // Variable to track if mood reminder is active
let moodReminderInitiator = null; // Variable to store who initiated the mood reminder

function createReminderEmbed(initiator) {
    const today = new Date().toLocaleDateString('en-US', { timeZone: timezone });

    return new EmbedBuilder()
        .setTitle('🌟 Mood Reminder 🌟')
        .setDescription(`Hey <@${initiator}>, please talk to your partner. They're feeling down.`)
        .setColor(0x9F2B68)
        .setFooter({ text: `Reminder initiated by: ${moodReminderInitiator}`})
        .setTimestamp();
}

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

function createReminderEmbed(initiator) {
    const today = new Date().toLocaleDateString('en-US', { timeZone: timezone });
    const recipient = initiator === boyfriendId ? girlfriendId : boyfriendId;

    return new EmbedBuilder()
        .setTitle('🌟 Mood Reminder 🌟')
        .setDescription(`Hey <@${recipient}>, please talk to your partner. They're feeling down.`)
        .setColor(0x9F2B68)
        .setFooter({ text: `Reminder initiated by: <@${initiator}>`})
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
    // Command to initiate mood reminder
       client.on('messageCreate', message => {
        if (message.content.toLowerCase() === '!moodReminder') {
            moodReminderInitiator = message.author.id; // Store who initiated the mood reminder
            activeMoodReminder = true; // Activate mood reminder
            const embed = createReminderEmbed(moodReminderInitiator);
            message.channel.send({ content: '@everyone', embeds: [embed] });
        }

    client.on('messageCreate', message => {
        if (message.content === '!reminder') {
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                const embed = createReminderEmbed();
                channel.send({ content: '@everyone', embeds: [embed] });
            }
        }
    });
});

client.login(botToken);
