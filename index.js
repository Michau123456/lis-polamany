const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client(); 
const ms = require('ms')
const moment = require('moment')
const { name, version, author } = require('./package.json')
const avatar = ("https://i.imgur.com/TKXrUnv.jpg")

//Informacja czy bot jest włączony i działa 
client.once('ready', () => {
	console.log(`Zalogowano jako ${client.user.tag}`)
})

//Statystyki serwera
const serverStats = {
		guildID: '701728683433656380', //Serwer
		memberCountID: '704650868917796924', //MEMBERS
		newestCountID: '704652573390667796', //NEWEST
		welcomeChannelID: '', //POWITANIE
		onlineChannelID: '704651959520591962',//ONLINE
		
		logsChannelID: '704654897039015977', //Kanał z logami
}

//Statystyki serwera - jak ktoś wejdzie
client.on('guildMemberAdd', member => {
	
	if (member.guild.id !== serverStats.guildID) return;
	

	client.channels.cache.get(serverStats.totalUsersID).setName(`» All: ${member.guild.memberCount}`); //ALL
	client.channels.cache.get(serverStats.memberCountID).setName(`» Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`); //MEMBER
	client.channels.cache.get(serverStats.newestCountID).setName(`» Newest: ${member.displayName}`); //NEWEST

});
client.on('presenceUpdate', (oldMember, newMember) => {

    if (newMember.guild.id !== serverStats.guildID) return;

    client.channels.cache.get(serverStats.onlineChannelID).setName(`» Online: ${newMember.guild.members.cache.filter(m => m.presence.status === 'online').size}`) //ONLINE


})


//Statystyki serwera - jak ktoś wyjdzie
client.on('guildMemberRemove', member => {
	
	if (member.guild.id !== serverStats.guildID) return;

	client.channels.cache.get(serverStats.totalUsersID).setName(`» All: ${member.guild.memberCount}`); //ALL
	client.channels.cache.get(serverStats.memberCountID).setName(`» Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`); //MEMBER

});


//Aktywności wykonywane przez bota - W grze...
const activities_list = [ 
	` `,
	`🦊 Autor: ${author}`, 
	`❗ prefix "${prefix}"`,
	`🎥 Ogląda DOLINE POLAMANYCH LISOW!`,
	`❓ ${prefix}pomoc - Pomoc`,
	`💥 wersja: ${version}`,
	`📆 ${moment().format("DD.MM.YYYY")} `,

    ];


	client.on('ready', () => {
		setInterval(() => {
			const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
			client.user.setActivity(activities_list[index]);
		}, 5000); 
	});
	

//Wiadomość powitalna
client.on('guildMemberAdd', member => {

	const channel = member.guild.channels.cache.get(serverStats.welcomeChannelID)
	if(!channel) return;

	channel.send(`Siemano! ${member}, Witaj na serwerze **DOLINA POLAMANYCH LISOW!**!`)

});

//Wiadomość pożegnalna
client.on('guildMemberRemove', member => {

	const channel = member.guild.channels.cache.get(serverStats.welcomeChannelID)
	if(!channel) return;

	channel.send(`Żegnaj! **${member.displayName}**, będziemy tęsknić! :C`)

});

//Logi usuniętej wiadomości
client.on("messageDelete", async message => {

	if (message.guild.id !== serverStats.guildID) return;
	
	const logsembed = new Discord.MessageEmbed()
	.setTitle('**Nowa usunięta wiadomość!**')
	.addField("Wiadomość użytkownika:", '`' + message.author.tag + '`')
	.addField("Treść wiadomości:", message.content)
	.addField("Usunięta w:", message.channel)
	.setColor(0xf14aa2)
	.setThumbnail(avatar)
	.setFooter("DOLINA POLAMANYCH LISOW!")
	.setTimestamp()

	const channel =  message.guild.channels.cache.get(serverStats.logsChannelID)

	channel.send(logsembed)
	

});
//logi edytowanej wiadmosci
client.on("messageUpdate", async(oldMessage, newMessage) => {

    if (oldMessage.guild.id !== serverStats.guildID) return;
    if (oldMessage.author.bot) return;

    if(oldMessage.content === newMessage.content) return;

    const avatar = client.user.avatarURL()
    const logsembed = new Discord.MessageEmbed()
    .setTitle('**Nowa edytowana wiadomość!**')
    .addField("**Wiadomość użytkownika:**", '`' + oldMessage.author.tag + '`')
    .addField("**ID:**", oldMessage.author.id, true)
    .addField("Przed edycją:", oldMessage.content)
    .addField("**Po edycji:**", newMessage.content, true)
    .addField("**Edytowana w:**", oldMessage.channel)
    .setColor(0xffe776)
    .setThumbnail(avatar)
    .setFooter("DOLINA POLAMANYCH LISOW na posterunku!")
    .setTimestamp()

    const channel =  oldMessage.guild.channels.cache.get(serverStats.logsChannelID)

    channel.send(logsembed)
});

//Wszystkie komendy
client.on('message', message => {

	let args = message.content.substring(prefix.length).split(" ")
	if (!message.content.startsWith(prefix)) return;

	switch(args[0]){

		//Pokazuje Listę kopmend oraz ich wyjaśnienia
		case 'pomoc': 
			const embed3 = new Discord.MessageEmbed()
			.setTitle('**Komendy Bota**')
			.addField(`${prefix}` + '**pomoc**', 'Pokazuje Listę komend')
			.addField(`${prefix}` + '**kick `@użytkownik`**', 'Wyrzuca osobę z serwera')
			.addField(`${prefix}` + '**ban `@użytkownik`**', 'Banuje osobę na serwerze')
			.addField(`${prefix}` + '**clear `liczba`**', 'Usuwa daną liczbę wiadomości (max 100 na raz)')
			.addField(`${prefix}` + '**mute `@użytkownik` `czas`**', 'Wycisza użytkownika na określony czas')
			.addField(`${prefix}` + '**unmute `@użytkownik`**', 'Usuwa wyciszenie użytkownika')
			.addField(`${prefix}` + '**avatar `@użytkownik`**', 'Pokazuje avatar oznaczonego użytkownika')
			.addField(`${prefix}` + '**zaproszenie**', 'Wysyła zaproszenie na serwer **DOLINA POLAMANYCH LISOW**')
			.addField(`${prefix}` + '**info**', 'Wyświetla informacje o bocie')
			.addField(`${prefix}` +'**ping**', 'Ping Pong')
			.addField(`${prefix}` +'**userinfo**', 'Wyświetla informacje o użytkowniku')
			.addField(`${prefix}` +'**say**', 'Bot powtarza to co napiszesz')
			.addField(`${prefix}` +'**yabadabadoo**', 'YABADABABADOO')
			.addField(`${prefix}` +'**ankieta**', 'Bot wysyła ankiete')
			.addField(`${prefix}` +'**serverinfo**', 'Info o serwerze')
			.setColor(0xb3ecb1)
			.setThumbnail(avatar)
			.setFooter('Mam nadzieję że miło spędzisz tu czas!')
			.setTimestamp()
			message.channel.send(embed3)
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			break;

		//Pokazuje własny avatar lub oznaczonej osoby
		case 'avatar':
			if(args[1]){
			var user = message.mentions.users.first();
				if(user){
				const embed2 = new Discord.MessageEmbed()
				.setTitle('Avatar ' + '`' + `${user.username}` + '`')
				.setAuthor(`${message.author.username}`)
				.setImage(user.displayAvatarURL())
				.setColor(0x777bb8)
				.setTimestamp()
				message.channel.send(embed2)
				}else (message.reply("Aby zobaczyć kogoś avatar, musisz go oznaczyć!"))
			}else (message.reply("Aby zobaczyć swój avatar, oznacz samego siebie!"))
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			break;

		//Pokazuje Informacje o Bocie
		case 'info':
			const channel = message.guild.channels.cache.get(serverStats.welcomeChannelID)
			let invite2 = channel.createInvite({maxAge: 0,}).then((invite2) => {
			const embed = new Discord.MessageEmbed()
			.setTitle('**Informacje o bocie**')
			.addField('**Nazwa Bota**', name)
			.addField('**Wersja**', version)
			.addField('**Serwer**', message.guild.name)
			.addField('**Autor**', '`' + author + '`')
			.addField('**Zaproszenie na Serwer!**', `${invite2}`)
			.setColor(0xc87ee9)
			.setThumbnail(avatar)
			.setFooter('Mam nadzieję że miło spędzisz tu czas!')
			.setTimestamp()
			message.channel.send(embed)
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			})
			break;

		//Wysyła na czat zaproszenie na serwer
		case 'zaproszenie':
			let invite = message.channel.createInvite({maxAge: 86400,}).then((invite) => {
				message.reply(`Łapaj Zapke!: ${invite}`);
				console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			})
			break;

		//Czyści określoną ilość wiadomości na czacie
		case 'clear':
			if (message.member.hasPermission('MANAGE_MESSAGES')) {
			if(!args[1]) return message.reply('Podaj liczbę wiadomości do usunięcia!')
			message.channel.bulkDelete(args[1]);
			message.channel.send("Usunięto **" + args[1] + "** Wiadomości").then(m => m.delete({ timeout: 3000}));
			}else (message.channel.send("Nie masz wystarczających uprawnień!"))
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			break;

		//Wycisza użytkownika
		case 'mute':
			if (message.member.hasPermission('MANAGE_MESSAGES')) {
				if(!args[1]) {return message.reply("Nie znaleziono użytkownika!");}	
				let person = message.guild.member(message.mentions.users.first())
				if (!person) {return message.reply("Nie znaleziono użytkownika!");}	

				let muterole = message.guild.roles.cache.find(role => role.name === "Muted");

				if(!muterole) return message.reply("Nie znaleziono roli!");

				let time = args[2];

				if(!time){
					return message.reply("Nie określiłeś czasu wyciszenia!")
				}

				person.roles.add(muterole.id);

				

				const command = args.splice(0, 3);

                const sayMessage = args.join(" ");

                const channel =  message.guild.channels.cache.get(serverStats.logsChannelID)
                const embed = new Discord.MessageEmbed()
                .setAuthor(person.user.tag, person.user.avatarURL())
                .setTitle(`Wyciszono użytkownika ** ${person.displayName} **!`)
                .setDescription(`z powodu: **${sayMessage}** na **${ms(ms(time))}**, przez ${message.author}!`)
                .setColor(0xf14aa2)
                .setThumbnail(avatar)
                .setFooter("DOLINA POLAMANYCH LISOW na posterunku!")
                .setTimestamp()
                channel.send(embed)
                message.channel.send(embed)

				setTimeout(function(){
			
					person.roles.remove(muterole.id)
					message.channel.send(`@${person.user.tag} Został odciszony!`)
				}, ms(time));


			}else (message.channel.send("Nie masz wystarczających uprawnień!"))
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			break;

		//Wyłącza wyciszenie użytkownika
		case 'unmute':
			if (message.member.hasPermission('MANAGE_MESSAGES')) {
				if(!args[1]) {return message.reply("Nie znaleziono użytkownika!");}	
				let person = message.guild.member(message.mentions.users.first())
				if (!person) {return message.reply("Nie znaleziono użytkownika!");}	

				let muterole = message.guild.roles.cache.find(role => role.name === "Muted");

				if(!muterole) return message.reply("Nie znaleziono roli!");

				person.roles.remove(muterole.id);
				person.roles.add(mainrole.id);

				const channel =  message.guild.channels.cache.get(serverStats.logsChannelID)

                const embed = new Discord.MessageEmbed()
                .setAuthor(person.user.tag, person.user.avatarURL())
                .setTitle(`Odciszono użytkownika **${person.displayName}**!`)
                .setColor(0xb3ecb1)
                .setThumbnail(avatar)
                .setFooter("DOLINA POLAMANYCH LISOW na posterunku!")
                .setTimestamp()
                message.channel.send(embed)
                channel.send(embed)

			}else (message.channel.send("Nie masz wystarczających uprawnień!"))
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			break;
		
		//Wyrzuca użytkownika z serwera
		case 'kick':
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if(!args[1]) {return message.reply("Nie znaleziono użytkownika!");}	
				let person = message.guild.member(message.mentions.users.first())
				if (!person) {return message.reply("Nie znaleziono użytkownika!");}	

				const command = args.splice(0, 2);

                const sayMessage = args.join(" ");

                const channel =  message.guild.channels.cache.get(serverStats.logsChannelID)
                const embed = new Discord.MessageEmbed()
                .setAuthor(person.user.tag, person.user.avatarURL())
                .setTitle(`Wyrzucono użytkownika ** ${person.displayName} **!`)
                .setDescription(`Z powodu: **${sayMessage}**, przez ${message.author}`)
                .setColor(0x777bb8)
                .setThumbnail(avatar)
                .setFooter("DOLINA POLAMANYCH LISOW na posterunku!")
                .setTimestamp()
                person.kick()
                message.channel.send(embed)
                channel.send(embed)

			}else (message.channel.send("Nie masz wystarczających uprawnień!"))
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			break;
		
		//Banuje użytkownika na serwerze
		case 'ban':
			if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
				if(!args[1]) {return message.reply("Nie znaleziono użytkownika!");}	
				let person = message.guild.member(message.mentions.users.first())
				if (!person) {return message.reply("Nie znaleziono użytkownika!");}	

				const command = args.splice(0, 2);

                const sayMessage = args.join(" ");
                
                const channel =  message.guild.channels.cache.get(serverStats.logsChannelID)
                const embed = new Discord.MessageEmbed()
                .setAuthor(person.user.tag, person.user.avatarURL())
                .setTitle(`Zbanowano użytkownika ** ${person.displayName} **!`)
                .setDescription(`Z powodu: **${sayMessage}**, przez ${message.author}`)
                .setColor(0xc87ee9)
                .setThumbnail(avatar)
                .setFooter("DOLINA POLAMANYCH LISOW na posterunku!")
                .setTimestamp()
                person.ban()
                message.channel.send(embed)
                channel.send(embed)

			}else (message.channel.send("Nie masz wystarczających uprawnień!"))
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
			break;

			
	 		//koemnda Ping
		case 'ping':
			const embed5 = new Discord.MessageEmbed()
			.setTitle('Ping Pong')
			.addField('Pong', ':ping_pong:')
			.setColor(0xf14aa2)
			.setFooter('Mam nadzieję że miło spędzisz tu czas!')
			.setTimestamp()
			message.channel.send(embed5)
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
		break;

//komenda User INFO
case 'userinfo':
            console.log(`WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)

            let person = message.mentions.users.first() || message.author;  
            let personNick = message.guild.member(message.mentions.users.first() || message.author) 
			moment.locale("PL");
			
			if (person.presence.status === 'dnd') person.presence.status = "`🔴` Nie Przeszkadzać"
            if (person.presence.status === 'idle') person.presence.status = "`🟡` Zaraz Wracam"
            if (person.presence.status === 'offline') person.presence.status = "`⚫` Niedostępny"
            if (person.presence.status === 'online') person.presence.status = "`🟢` Dostępny"

            const userInfo = new Discord.MessageEmbed()
            .setAuthor(person.tag, person.avatarURL())
            .setDescription(person)
             .addFields(
                    { name: 'Nick:', value: '`'+ `${person.tag}` + '`', inline: true },
                    { name: '\u200B', value: '\u200B', inline: true},
                    { name: 'Pseudonim', value: personNick.nickname || 'Brak pseudonimu', inline: true },)
            .addFields(
                    { name: 'Status:', value: person.presence.status, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true},
                    { name: 'Najwyższa ranga', value: personNick.roles.highest, inline: true },)
            .addField("Dołączył na serwer:", moment(message.guild.members.cache.get(person.id).joinedAt).format("DD MMMM YYYY, hh:mm a"), true)
            .addField('\u200B', '\u200B', true)
            .addField("Stworzył konto:", moment(person.createdAt).format("DD MMMM YYYY, hh:mm a"), true)
            .setColor(0xb3ecb1)
            .setThumbnail(person.avatarURL())
            .setFooter('Mam nadzieję że miło spędzisz tu czas!')
            .setTimestamp()
            message.channel.send(userInfo);
			break;
//koemnda Ping
		case 'yabadabadoo':
			const embed6 = new Discord.MessageEmbed()
			.setTitle('YABDABADOO')
			.addField('**Smażę babola z moim gangiem, Zapierdalam furą albo kurwa dunozaurem** ', '**Dino pizga szczura kiedy niunie pukam w wannie, Na mnie szata i krawacik suko to designer**')
			.setColor(0x777bb8)
			.setFooter('YABADABADOO!')
	     	.setTimestamp()
			message.channel.send(embed6)
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
		break;
	//ankieta
		case 'ankieta':

            if(!args[1]) {return message.reply("Wprowadź treść ankiety!");}    
            const command3 = args.splice(0, 1);
                
            const sayMessage1 = args.join(" ");
            
            const ankieta = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL())
            .addField("Treść ankiety:", sayMessage1)
            .setColor(0xc87ee9)
            .setThumbnail(avatar)
            .setFooter('Na co czekasz? Głosuj!')
            .setTimestamp()
            
            message.delete().catch();

            message.channel.send(ankieta).then(messageReaction => {
                messageReaction.react("✔")
                messageReaction.react("❌")
            })
			console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
            break;
	 
			 //Pokazuje informacje o serwerze
			 case 'serverinfo':
				console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
	
				moment.locale("PL");
				const serverInfo = new Discord.MessageEmbed()
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setTitle(message.guild.name)
				.addField('Właściciel', message.guild.owner, true)
				.addField('\u200B', '\u200B', true)
				.addField('ID', message.guild.id, true)
				.addField('Członkowie', message.guild.memberCount, true)
				.addField('\u200B', '\u200B', true)
				.addField('Boty', message.guild.members.cache.filter(m => m.user.bot).size, true)
				.addField('Data Stworzenia Serwera', moment(message.guild.createdAt).format("DD MMMM YYYY, hh:mm a"))
				.setColor(0x777bb8)
				.setThumbnail(message.guild.iconURL())
				.setFooter('Mam nadzieję że miło spędzisz tu czas!')
				.setTimestamp()
				message.channel.send(serverInfo);
	
				break;

				if(message.author.bot) return;

					//koemnda SAY
					 
					case 'say':
					
						const command = args.splice(0, 1)
								
						const sayMessage = args.join(" ")
						
						message.delete().catch();
								
						message.channel.send(`${sayMessage}`)
						console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)		
					break;
					//koemnda Ping
					case 'kacperkoldej':
						const embed7 = new Discord.MessageEmbed()
						.setTitle('konto na tikotoku - https://www.tiktok.com/@kacperkoldej?lang=pl')
						.addField('**Imie i Nazwisko: Kacper Kołdej ** ', '**Wzrost: 182cm, Wiek: 17**')
						.setColor(0x777bb8)
						.setFooter('KACPERKOLDEJ!')
						 .setTimestamp()
						message.channel.send(embed7)
						console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
					break;

										case 'lissvv':
						const embed9 = new Discord.MessageEmbed()
						.setTitle('konto na tiktoku - https://www.tiktok.com/@lissvv?lang=pl')
						.addField('**Imie i Nazwisko: Dominik Lisowski ** ', '**Wzrost: 179cm, Wiek: 17**')
						.setColor(0x777bb8)
						.setFooter('LISSVV!')
						 .setTimestamp()
						message.channel.send(embed9)
						console.log(`USUNIĘTA WIADOMOŚĆ Z KOMENDY || ${message.author.username} || TREŚĆ: ${message.content} || ID: ${message.author} || Kanał ${message.channel.name}`)
					break;

	
	}


})


//Logowanie się do bota - wpisywanie tokenu
client.login(token);