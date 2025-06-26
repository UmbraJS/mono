# Hello Edge

A minimal [Nuxt](https://nuxt.com) starter deployed on the Edge using [NuxtHub](https://hub.nuxt.com).

https://hello.nuxt.dev

<a href="https://hello.nuxt.dev">
<img src="https://github.com/nuxt-hub/hello-edge/assets/904724/99d1bd54-ef7e-4ac9-83ad-0a290f85edcf" alt="Hello World template for NuxtHub" />
</a>

## Features

- Server-Side rendering on Cloudflare Workers
- ESLint setup
- Ready to add a database, blob and KV storage
- One click deploy on 275+ locations for free

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

You can update the main text displayed by creating a `.env`:

```bash
NUXT_PUBLIC_HELLO_TEXT="Hello my world!"
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

## Deploy

Deploy the application on the Edge with [NuxtHub](https://hub.nuxt.com) on your Cloudflare account:

```bash
npx nuxthub deploy
```

Then checkout your server logs, analaytics and more in the [NuxtHub Admin](https://admin.hub.nuxt.com).

You can also deploy using [Cloudflare Pages CI](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci).

# Project

Tech Stack:

Vue, Nuxt, NuxtHub, Cloudflare, GSAP, VueUse.

Genre:
Customisable, Open world, Strategy, Extraction, Recursive Rougelite, Card Game.

Setting:
Its set in a sort of pseudo-medieval fantasy setting.

Pitch:
What if The Bazaar and CK3 had a baby

Concept:

✴️ Effects — The Dynamic Triggers of Battle

Effects define what happens, to whom, and when during a battle or interaction. They are the heart of your game's simulation engine — modular behaviours that allow cards to react, respond, and influence the battlefield in intricate and emergent ways.

You can think of an Effect as a small logic statement:

“When [trigger] happens, do [action] to [target].”

🎯 Example Effects

"When this card activates, increase attack of all adjacent Aquatic cards by 10% for 3 seconds."

"When any shield is gained by this card, add poison equal to 25% of its current shield to the opponent."

"At the start of battle, freeze all Mechanical cards on the opponent's board for 4 seconds."

"When this card is destroyed, trigger the cooldown of all sibling cards immediately."

🧬 Aspects — The Core of Customisation & Scaling

Aspects represent the essence or material nature of a card — what it's made of, what it's imbued with, or what abstract qualities define it. They are a key component in crafting, upgrading, and specialising in cards, giving deep mechanical identity to everything from a sword to a spell to a character.

Think of aspects as both modifiers and identifiers that affect how a card behaves, how it grows, and how it interacts with other systems.

🧱 What an Aspect Does

Each aspect:

Modifies stat scaling — Determines how well upgrades "stick" when applied.

Adds conditional bonuses — Specific interactions may be triggered based on what aspect is present.

Interacts with card effects — Effects may trigger only if a card has a certain aspect or combination.

Gates crafting and proficiency — Players need to specialise in certain aspects to use them effectively.

Cards themselves may also have special interactions with aspects. For instance a sword card may say that if you forge it with silver then it gains 3 poison damage, but if you forge it with light then it reduces its cooldown by 2 seconds. When upgrading a card, different aspects may have a bigger impact on your upgrade. For instance, a steel aspect might have a bigger impact when increasing damage or shields, while a cotton aspect may have a bigger impact when upgrading healing. Impacts are not added togheter. Typically the aspect with the higher impact on this particular stat is the one that counts, but if impact is identical then its the aspect with the lowest returns that is priorities.

Cards. A card can represent nearly anything. A character, an item, a building, a technique, an action. And each card will have tags which describe this. A card may have a cooldown which describes how often it triggers during battle. If it does not have a cooldown that means that it has to be triggered some other way. Probably its effects will be triggered by something happening on the board. It may have effects. It will always have at least one aspect. It may itself also have a level and a proficiency. The level increases its stats and the players proficiency with the card dictates how much as a percentage of the cards stats actually comes through. For instance, a player with a 10% proficiency in a card may only get 10% of the damage through, and their cooldown may be reduced by 90%. Proficiency with the card and with its aspects are not related to each other. That way you can have a player thats really good at swinging a sword but not at forging swords. The stats of the card are organised by the BASH system - which I will describe in its own section.

Board. In a battle/interaction there are always 2 boards. The opponents board and the players board. A board contains the deck, which are all the card slots and the cards in them. But a board also represents a central filter that all the actions go through. So for instance. A player character may have an effect that adds 5 damage to the board. What this means is that whenever any card in the players deck does damage, when that damage is sent out it first passes through the board and has 5 extra damage applied.

Field. A field is a specific type of card that must be some sort of location, place, building, etc. These fields can be inserted into slots in a section of land. But they can also be brought along in a deck. However, you don't typically put a field onto the board with the other cards. Instead the field card has its own slot on the deck. This field slot describes the preferred home-field for your deck. The field will grant some effects and other bonuses to any card in either decks. And when you encounter a battle the battle will come with some field outside of your choice. But some cards can change the field and thats when your field slot comes into play. Because a card may steadily increase some knock-back value. And once knock-back hits 100 then the field gets changed to your preferred field. This represents a moment in battle where you physically push the opponent into a more favorable location. The field card also helps outside of battle. For instance, when standing in a section you may get a bonus each turn from your field. Maybe thats a chance for an event, or some health, or some minor resource.

Character. A character is a specific type of card that must be some type that aligns with being a thinking being. Character card can be used as regular cards during battle. But a character card may also go into the players character slots. A player must always have at least one character in the character slot since this represents who you are playing as. A character typically does not have a cooldown. Instead they provide effects to the board or to other cards. A player also has up to 3 side character slots. These slots allow the player to have more than one character modifying their board. The total health pool of the players side will be all these characters health pool added togheter. The amount of card slots in their deck will be all their card slots added togheter. But any card slot will now also belong to the character that provided it. And the health bar will have markers that represents which part of the health pool belongs to which character. When the health pool dips below one of these markers the associated character will get put out of play. Getting put out of play means their effects stop applying and all their card slots become disabled. That way having a party of character gives you lots of advantages for early gains but it also limits you. Healing back past the marker will bring the character, their effects and cards back into play.

Army. An army is a specific card that must be a type that aligns with a large group of beings. These cards are special. They typically take up more than one card slot. And depending on how many slots it takes up they can themselves have their own cards inside themselves. They also have their own health pool a and they also have a counter. The counter represents how big that army is. The health pool gets added as a buffer to the player health once for each counter. Each instance of this pool that gets added comes with a marker. Each marker when passed reduces the counter. When the counter hits zero then the army cards and their effects are no longer in play. This counter also persists when the battle is over. So the player has to maintain and refill their army counters. Healing back up the markers before the battle ends is another way to prevent troop loses.

Mount. A mount is a specific card that has a type that would fit for a character to sit on. The player has a mount slot. And this mount slot gets triggered when the player moves around the map. It can help with how far the player can move in a round, over which terrain or obstacle. Getting a mount is hard and getting proficient enough with a mount to use it is time consuming. Therefore it will often make sense to forgo getting a mount to focus on specialising in other things.

Events. Events/Interactions can either play out like an AI driven CRPG, with dice rolls modified based on your stats and the scenario, or it can play our like an actual card battle simulation in the style of The Bazaar. A "battle" is often representing a physical battle against a foe - where the point is to reduce the enemy health to 0 - but the same system could also represent other challenges or interactions. Like going on a date with a character, in which the cards are actions you are taking, and the bar is the amount of attraction the other feels towards you. Or a food challenge where the cards are food or banter helping you to party, and the bar is amount of food or fun you need to have for it to be a successful feast.

BASH. The cards in these "battles" use a unique set of distinct values. The system is called BASH. Which stands for Banter, Attack, Shield, Heal. Attack, is pretty straight forward, it represents a cards ability enact destructive force on the board. It could be a weapon hurting an enemy. Heal represents a cards ability to recover you health bar. It could be a bandage or a tasty food. Shield represents a cards ability to block damage. Shield gets reduced instead of health being reduced, but shield also decreases towards zero on its own. Lastly, banter is basically buffing and debuffing. If a card has a positive banter value then it adds to a morale value for your side of the board. High morale adds crit chance and buffs all card actions. If a card has negative banter it causes terror to the opponents board. Terror reduces morale. A negative morale will debuff card actions. All cards might have uniqe buff/debuff interactions. So some cards might be more or less influenced by banter. A banter card might be funny side character that keeps everyone spirit up. Or a terrifying demon that terrorises the opponent.

Description:
You play on an open world map. The land is divided up into small sections. You walk from section to section and can encounter events when you do so. You gather resources which you can use to make and improve, cards, aspects, effects, characters, etc. You can also use resources to claim a section for your own. Starting as a camp, outpost, settlement, village, town, city, mega city. Each such developed section has a number of slots that you can insert cards into. These cards generate resources, help enable gameplay - like improving your cards, aspects, effects or enabling events. When the section grows you start to develop a culture, an ideology, a religion and a governance. You choose which to focus on and you will end up specialising in one or two. What cards you put in your slots will enforce this. For instance a temple card might give you more ways to evolve your religion.

A region is a larger collection of sections. And a region will also have some slots. Region slots modify available cards in that area. Meaning which cards can be gained through events. Slots may have cards that describe what factions exist here. What those factions have in terms of cards. What the tech level of this section is, which is described using a tech tree. Some cards describe buildings and equipment - tech level will dictate which of these available to be found at what level. For instance, an undeveloped region may only have straw huts. A more developed one may have castles, and towers, and walls.

As you unlock these aspects of a section it gives you additional character slots as well. You have to develop your relationships to characters by bringing them along with you for adventures. When you hit a high enough relationship with them and complete their unique quest you can give them a positions/jobs in your settlement. Some special job slots might be unlocked by first inserting a card. Like a tavern card might unlock a barkeep character slot with special modifiers.

You will regularly leave your settlement to go on adventures. When doing so you will encounter random events, journey to special areas that have their own dedicated card pools to draw from, and fight battles. More specifically you are looking for quests. A quest is a special event that unlocks a series of minigame within the game. The minigame works more like classical The Bazaar. You move round to round and try to survive. But you can pull out at any point. If you dont pull out and you die you might lose all your treasure. But if you complete the quest you get a special reward. This is the extraction aspect of the game.

While doing all these things you are developing a character, the cards for that character, his aspects, his effects, his relationships, his religion, his ideology, his hometown, his history, his secrets, etc. Eventually when enough rounds have passed your character starts to encounter more and more dangerous problems which will eventually lead to his death of old age. You can try to hold it off as much as possible, and there will be special, rare cards in the game that let you become immortal as well. But when you die you get to start over. But this time you start over in a reimagined world where the last character you played is now a character you encounter and possibly rival in the open world game. The city you made is now a place you can visit. The cards you made are now cards you can acquire. Aspects, effects, religions, governance, etc.

Just having a card doesn't mean you can use it effectively. Your characters have D&D stats and proficiency stats. Which both play a role in which cards you can play effectively. That way you must specialise. Make cards that make sense for your specialisation. And when you find those cards you must grind their proficiency to take advantage of them.

The player character themselves also has CRPG stats that they use outside of battle to make rolls on decisions. A full run could last as long as the player survives navigating the world. A player could just travel around like a vagabond, doing quests and gathering the best cards for what they want to do. Or they could start their own settlement or town and try to grow it. Managing these settlements works a bit like a combination of ogame and ck3. Ogame because you pick things to develop and the tech trees to unlock, and you gather resources for that goal, except time proceeds on a round based fashion. 4 hours in every day, morning, day, afternoon, night. And you have other characters that you manage as part of your settlement just like CK3. These might be your stewards, your diplomats, your priest, etc.

These characters are also cards, or characters that you can use or play as if you unlock them through their quests. Cards which are also characters will have AI generated quests, inline with their described personalities. Each character also has a log of all the notable things they know about. Which includes notable things about you. You can try to affect this log for each character which will change peoples impression of you and how the world remembers you. When the player eventually dies they have to restart. But then in the next run the previous run now exists as a character in that world and the actions you took and the way the world was shaped now changes your next game.

Additionally you can slowly build the experience on your character to let them make their own cards. By analysing the BASH values of a card a rarity and cost can be put on it. Which represents how hard it is to find, how expensive it is to buy, and how skilled a character has to be to use that card. Making these cards is very hard and requires you to focus on specific types of cards for each run. So for instance you might do a run as a character thats a blacksmith, and try to make a really good sword. When you die this sword now exists in the game world and the history of what it is and where it came from now flavours the world.

Cards also have effects, which can be made. So maybe you do a round where you play as a scientist and you come up with a burning metal effect. Then the next run you play as some sort of soldier trying to develop a new sword using the sword that exists and adding the burning metal effect to it. A card also has aspects. Which are some attribute or material of that item/character. For instance the sword could be made using the metal aspect. Which would then influence the stats, the stat scaling, what resources are required to build it, etc. Or it could be made with a much more valuable titanium aspect. Or an aspect could be something more abstract. A child character might have an aspect called "hope" which simply represents their reliance on hope. This aspect might make them more susceptible to banter, negative or positive.

All this put togheter I hope to make a user driven open-world, bazaar-like, rougelite. Where every run is uniqe. You can talk to other NPCs using a chat box and have them answer using AI and their answers actually mean something, like the right words might help you get something or complete a quest. Like "convince the king to lower taxes." These AI interactions will be affected by your CRPG stats, your logged history with these characters, any other leverage you might have, what the AI finds believable, etc. This interaction is where the BG3 inspiration comes from.

Underlying the game, the battles are built on a simulation system. Because the player cant make any decisions during a battle, any battle is therefore deterministic. So a battle will run its course in seconds on the server. Then a timeline of all the things that happened and in what order will be sent to the client. The client can then replay that timeline for the player. And the player will be able to pause, play, reverse, slow down, speed up or share the replay. RNG can be deterministic using seeds. This allows for high performance, stability and flexible timeline replays.

Each card will also be built to have an array of images that represents different states. There might be an image of the character dying, being sad, celebrating, etc. These images get shown in various events and circumstances. For instance, during battle, if the player board has a high terror value then the card images might change to show them being scared. If they dont have images for that then just stick to the default. And users can add images themselves. Image packs can be bough that add more flavour. This is how we monetize the game. Through these highly customisable flavour packs. Which are sets of images of the same characters in different situations.
