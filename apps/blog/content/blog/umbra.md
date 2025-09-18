## 🌟 Why UmbraJS?

Imagine this: you're a junior dev. Fresh out the bootcamp womb, still sticky with optimism. You don't know shit about fuck, but you do know this: **colors are cool**. And the way you put colour on a website is with hex codes, baby.

```ts
html {   
  background: #121212;   
  color: #545454; 
}
```

You’re shaping photons. You are Prometheus, handing fire to the masses via `#545454`. Feels good.

Then you add a button.
```ts
button {   
  background: #000;   
  color: #999; 
}
```

::UmbraSiteTest
::

And maybe a card.
```ts
.CoolCard {   
  background: #493923;   
  color: #999; 
}
```

Ugly? Absolutely. But it _works_. You feel like a wizard whose spells technically compile.

Then you want to change colors. Maybe you want a dark mode. A light mode. A morally ambiguous purple mode. And suddenly you realize: you've scattered hex codes across your entire codebase like glitter at a toddler's birthday party. You’re never getting that shit out.

So you ascend. You graduate. You migrate to variables:
```css
:root {
  --background: #ffffff;
  --text: #000000;
  --button-primary-background: #ff0000;
  --button-primary-text: #ffffff;
}

html {
 background: var(--background);
 color: var(--text);
}
```

Congrats! You’ve just invented _design tokens_. Welcome to the cult. Every design system rediscovers this like an ancient religion. And, like all religions, the dogma soon becomes unbearable.

You add hover states. Active states. Disabled states. Outrageously bold states. States so nuanced you question your own state of mind. Every possible permutation gets a variable.

```css
:root {
  --background: #ffffff;
  --text: #000000;
  
  --button-primary-background: #ff0000;
  --button-primary-background-sublte: #550000
  --button-primary-background-hovered: #ff2200;
  --button-primary-background-active: #ffff00;
  --button-disabled-background: #333333;
  --button-disabled-text: #ffffff;
  --button-primary-text: #ffffff;
  
  ...(75 other tokens)
}
```

It’s messy, its your little fragile kingdom of tokens. You’re building A System™. Complexity is the cost of sophistication. And besides, you're getting paid now. Good job, king.

Then bossman says:

> "What if… the _clients_ picked the colors?"

🎉 Welcome to custom theming. 
🎉 Welcome to satan's rainbow river.

## 🫠 The Fall of Token Rome

You build the UI to let clients tweak your 50+ tokens. People clap. You feel clever.

Then the bugs start rolling in.

Invisible text. Low contrast buttons. Blinding hover states. Backgrounds that look like migraine aura. All because someone picked a red that wasn’t red enough, or a gray that was basically a depression hex.

How does this happen? We just need a better processes? More QA! Well, guess we better start by understanding how it happens:

Dev A builds a component. It looks fine with the defaults. Client B picks a theme colour that looks semi competent on the colour settings page. But once you go to some other page it looks like hot garbage. It's full of issues. Text thats now invisible due to a poor combination of colour tokens being changed.   
  
Dev A doesn’t know. Even if he tested his code using 3 different themes he cant possibly check his work against every possible change someone does using the colour tokens once you give that access to the user. QA misses it for the same reason. And you - you poor bastard - you get to fix it. Again. And again.

Meanwhile, the client is overwhelmed. Change one token and suddenly 30 others look off. They can’t preview every page in real time. They’re not designers. They just want their brand colour. Instead, they’ve opened a cursed Pandora’s palette. Guess it opens up the philosophical question of - what does it mean to say that something is possible? Is it actually possible to change our theme if doing so is so impractical that the user would rather not? We gained flexibility but we have not yet gained practicality and without it the flexibility hardly matters. In fact it might be hurting us more than helping. 

The problem only compounds over time. Every time the bossman comes in and says "let them change the colour of this section as well" - 50 new tokens need to get added. The UI to let users manipulate all these tokens is getting more out of hand than the inside of an boing airplane cockpit.

And that’s when the existential dread kicks in. Because deep down, you realize:

> This system is not just messy. It's fundamentally unscalable. We have dug a shit hole on the wrong side of the house. How do you move a hole already dug?

## 🤝 Tokens Are Not Relationships

Alright girls, it's back to the drawing board. If we discard all our thoughts and empty our heads we can re-imagine the problem. The core issue is simple:

We assigned colors to _components_. But components live on _pages_, and pages have _layers_, and contrast is not a property of a single colour - it’s the _relationship between two_.

Design tokens don’t understand relationships.

You say `--button-text: #fff` and hope for the best. But if the button’s background becomes light, hope turns to despair. And how do you track and manage this relationship between colors living next to each other?

_We need a new model._  
One that understands relationships. 
One that doesn't make you its emotional support janitor.

## 🧠 From Tokens to Ranges

In painting we think in terms of contrast. Foreground -> Background = Depth.

Maybe we can build a system like that. A colour range, where one end is your darkest tone and the other is your lightest. Shades that flow from background to foreground, gradually increasing in contrast.

So instead of painting with arbitrary element tokens, we’re painting with _relationships_. Clients no longer change individual colors - they tweak the range - and the contrast relationships stay consistent across the board. Suddenly, we have _structure_. This smells like sanity.

```css
--background-1: #0c0915;
--background-2: #201c26;
--background-3: #484349;

--foreground-3: #d4d6cd;
--foreground-2: #e1e3da;
--foreground-1: #eef0e7;
```

Let's start small and only add more as we find out what we need to encompass. So we give the foreground and the background ranges 3 colors each. A strong, a standard, and a subtle variant. We define the difference between strong and subtle by how close to its polar opposite end of the colour range it is. So foreground 3 is a subtle foreground, because it's far away from its strongest starting position which is 1.

You show this to the designers. But they are a bit confused. Foreground and background are such abstract concepts compared to the much more immediately obvious button-primary-text type pattern that they are used to. And why do we only have 3 colors in each range? They ask. That’s almost nothing to work with.

You try to explain that it's not just 3 colours, it’s more like 6. Arguably these are not 2 ranges but 2 areas in one range. But it’s not quite hitting them. Desperately you try to explain: Look, the important part is simply that as long as you put a foreground colour next to a background colour, then the contrast will be great! But as you say it, and put it down on the page, you realize something. You're wrong.

The weakest foreground colour and the weakest background colour, 3 and 3, will naturally be very close to each other. While you might get away with a foreground 1 on a background 3, this is not true of every combination of foreground and background. Which sort of puts a big bump in the road for the entire dream of presenting a simple mental model of contrast.

But you still believe in this direction. There's gold here, you can smell it. You just need to push further. Let’s introduce a middle ground between foreground and background. A sort of no-man’s land to create some inherent degree of separation between them.

```css
--background-1: #0c0915;
--background-2: #201c26;
--background-3: #484349;

--middleground-1: #615e64;
--middleground-2: #6e6c70;
--middleground-3: #8d8d8d;

--foreground-1: #d4d6cd;
--foreground-2: #e1e3da;
--foreground-3: #eef0e7;
```

Cool. With this range we can describe a website in terms that ensure some basic level of contrast no matter what—as long as the tokens keep their relationship to each other across the colour range.

Actually, a single range isn't going to cut it. It's enough to make a website usable, but not particularly interesting. Apps have brands and personalities. There needs to be colors. Some sections need some hues and other sections need others. Success, warning, info, etc.

Let’s use the same range pattern to describe a range of flavour colors. Let's call them something generic that highlights their use, like accents.

```css
--accent-background-1: #0c0915;
--accent-background-2: #201c26;
--accent-background-3: #484349;

--accent-middleground-1: #615e64;
--accent-middleground-2: #6e6c70;
--accent-middleground-3: #8d8d8d;

--accent-foreground-3: #d4d6cd;
--accent-foreground-2: #e1e3da;
--accent-foreground-1: #eef0e7;
```

Then, if you have an accent colour that has a specific intention beyond brand, like success, you just name it that. We can call these "named accent colors."

```css
--success-background-1: #0c0915;
--success-background-2: #201c26;
--success-background-3: #484349;

--success-middleground-1: #615e64;
--success-middleground-2: #6e6c70;
--success-middleground-3: #8d8d8d;

--success-foreground-3: #d4d6cd;
--success-foreground-2: #e1e3da;
--success-foreground-1: #eef0e7;
```

Okay, that works. But one thing bothering me is that the numbers make it seem like these are 3 separate ranges. The designers are confused about what I'm doing and I'm experiencing a struggle when trying to explain it to them. They don't understand why there are these generic colour ranges. Some count up and the other counts down.

Again I try to explain: actually, it’s just a single range. But I'm starting to sound delusional. Fair enough. I understand it's a bit confusing to them seeing that they have not been on my journey. Let’s try to number them in a way that makes it more clear what I am trying to accomplish. A consistent numbering that makes it clear that these groups form a single range.

```css
--accent-background-1: #0c0915;
--accent-background-2: #201c26;
--accent-background-3: #484349;

--accent-middleground-4: #615e64;
--accent-middleground-5: #6e6c70;
--accent-middleground-6: #8d8d8d;

--accent-foreground-7: #d4d6cd;
--accent-foreground-8: #e1e3da;
--accent-foreground-9: #eef0e7;
```

The more I talk, the more their eyes glaze over. I sound like that red-string conspiracy guy from the meme. “It’s all one range, Carol, can’t you see?!” I am not okay.

And as I reflect on it, I now need to remember that the middle-ground colors start at 4. And what if I change the amount of shades in the range? Suddenly, everything you memorized is wrong. And you’re stuck renaming 27 tokens because Past You got cute with a number scheme. You start to wonder if the problem is the range, or just your sanity.
## a new dawn

Alright. Lets open our minds and consider a new angle. What if we drop the foreground -background naming entirely. I notice that I have grown too attached to this idea. Its become my darling. So lets try to apply the same idea, but in a different way.

 Lets drop the explicit grouping for a a unified range, and then we let the grouping exist implicitly as a sort of methodology that you teach people about the ranges instead. That way the fundamental wisdom that we are trying to construct gets to live through the system while it also looks familiar enough that anyone can look at it at a glance and sort of get the basics immediately. 

Something like this:

```css
--accent-1: #0c0915; // background
--accent-2: #201c26;
--accent-3: #484349;
--accent-4: #615e64; // middle ground
--accent-5: #6e6c70;
--accent-6: #cacbc4;
--accent-7: #d4d6cd; // foreground
--accent-8: #e1e3da;
--accent-9: #d5c9c1; 
```

Okay, that kinds works for the accent range. But only because the accent has a generic name. Now the base range needs a generic name as well. Guess base works? 

```css
--base-1: #0c0915;
--base-2: #201c26;
--base-3: #524f56;
--base-4: #615e64;
--base-5: #8d8d8d;
--base-6: #cacbc4;
--base-7: #e1e3da;
--base-8: #eef0e7;
--base-9: #d5c9c1;
```

Okay! Cool. And I think the designers are starting to catch on now. They are starting to believe 😎 We are getting more people onboard, its all about designing themes in terms of ranges rather than individual tokens. 

But since we gave up the explicit clarity of foreground - background groupings, that also means that we could do with some real, solid documentation and clarity around what the sections in the range mean. So I decide to do some heavy thinking. And then some research. Others have done similar things. And their knoweldge will help guide you. That's when I found Radix colors. 

Radix colors is simply a library for manually predefined colour swatches laid out in ranges. And their docs lay out what is clearly some deep thoughts on how each swatch in the range fits onto the page. 

Radix Colors use a 12-step scale for each colour palette, where each step is carefully tuned for specific UI roles.

### **Steps 1–2: App & Surface Backgrounds**

Used for canvas or background layers. Step 1 is typically your main background in dark mode. Step 2 adds a subtle shift for things like cards or table stripes.

### **Steps 3–5: UI Component Backgrounds**

- **Step 3**: Default state
- **Step 4**: Hover state
- **Step 5**: Active/Pressed state  
    Use for buttons, inputs, menus, etc.

### **Steps 6–8: Borders**

- **Step 6**: Non-interactive separators (cards, tables)
- **Step 7**: UI element borders & focus rings
- **Step 8**: Stronger outlines, especially for interactive states

### **Steps 9–10: Solid Backgrounds**

- **Step 9**: Most vibrant/pure chroma, ideal for solid fills and accents
- **Step 10**: Hover/active variant of Step 9  
    Can also be used for badges, overlays, section highlights.
    
### **Steps 11–12: Text**

- **Step 11**: Low-contrast text (e.g., placeholder, helper text)
- **Step 12**: High-contrast primary text

I was really impressed with the detail and thought that they had put into their system. Additionally I wanted people to be able to use the pre-made radix colour swatches alongside the umbra colors. And we are pretty much on the same path anyway - so not much has to change for that. Really, we just need to increase our colour swatches from 9 to 12 and we are there. So, fuck it, we ball. Let's add some swatches.

```css
--base-1: #0c0915;
--base-2: #201c26;
--base-3: #524f56;
--base-4: #615e64;
--base-5: #8d8d8d;
--base-6: #cacbc4;
--base-7: #e1e3da;
--base-8: #eef0e7;
--base-9: #d5c9c1;
--base-10: #8d8d8d;
--base-11: #0c0915;
--base-12: #201c26;
```

Well, that was inspiring. So I kept combing through the internet and trying to take in the teachings of those who came before me. I of course looked at tailwind, and noticed they number their colors weirdly. They don't do 1, 2, 3. They do 50, 100, 200, etc. How come? Curiosity is the mother of all wisdom. 

 Numbers like `50`, `100`, `200`, etc. are spaced out to leave room for **custom values** in between. For example, you could add a `tailwind.config.js` extension with a `brand-175`shade that can exist as an exception in between two other shades without disrupting the overall scale.

This approach is actually borrowed from design systems like **Material Design**, which use similar increments to describe tonal palettes. Meaning that its actually sort of a recognized pattern in a broader way. 

But tailwind and material design only has 10 swatches in their range while we have 12. And and though they increment by 100 by one exception they start at 50. That way they avoid turning the 100 magnitude. 50 - 900, which never gets into 4 digits. 

But we have 12 swatches, and if we want to stick with that to align with radix colors then we get this weird thing where our last swatches are in the thousands. 1100, 1200. Its not that its so impossible to use, but its starting to get a bit to many digits to type out when realistically you  only ever have 12 colors to use. 

 So let's settle in the middle, and increment by just one order of magnitude instead of 2. Ergo, 10, 20, 30, instead of 100, 200, 300. 9 extra places for intermediate shades in between any 2 colors is still more than enough and that way the end of the scale is still only 3 digits, 10-120. Theres even plenty of space to extend our range before we get into 4 digits. 

```css
--base-10: #0c0915;
--base-20: #201c26;
--base-30: #524f56;
--base-40: #615e64;
--base-50: #8d8d8d;
--base-60: #cacbc4;
--base-70: #e1e3da;
--base-80: #eef0e7;
--base-90: #d5c9c1;
--base-100: #8d8d8d;
--base-110: #0c0915;
--base-120: #201c26;
```

Great. Things are really starting to come togheter. Now lets get back to the product. Well, bossman says the user needs to be able to pick their colors. Okay, fair, cool. We can now do that. We just use the colour ranges. Let them change them. Well, they might want to change the colour of the buttons specifically. No worries, we can make a set of alias tokens on-top of our range tokens. An alias token, being a token that refers to another token. Something like this:

```css
--button-background: var(--accent-40);
--button-text: var(--accent-120)
```
This way only the ranges actually contain colour information. Those ranges dictate the full breath of all the page. But these alias tokens can help to make consistent rules for elements relationship to some part of that range. 

Cool, and we can take advantage of the cascading in CSS here to do some really powerfull stuff aswell. What if the client wants to change the colors in one section of the page? Say, for instance, the footer should be black background with white text, instead of white with black text. We could just manually use the same range backwards on the footer. Like this:

```css
footer {
  background: var(--base-120)
  colour: var(--base-10)
}
```

But the problem with that is that this would then make this pattern true of every client. Maybe most clients dont want that. Can we give clients the flexibility to change the colors in diffirent areas of the page? As a matter of fact, we can do that somewhat trivially. We have a unified range that we are using everywhere. lets just set the same range on a DOM element and it will overwrite the colors on every part of that section. Like this. 

```css
.DarkTheme {
 --base-10: #0c0915;
 --base-20: #201c26;
 --base-30: #524f56;
 --base-40: #615e64;
 --base-50: #8d8d8d;
 --base-60: #cacbc4;
 --base-70: #e1e3da;
 --base-80: #eef0e7;
 --base-90: #d5c9c1;
 --base-100: #8d8d8d;
 --base-110: #0c0915;
 --base-120: #201c26;
}
```
```html
<footer class="DarkTheme">
```

There, now, any element that has the .DarkTheme class will appear the opposite polarisation of the rest of the page. And we can make those kinds of changes available wherever we feel like it. Any request the bossman, or the client has, we can do now. Oh, you want to be able to pick the colors for the cards? Cool. Lets make a .CardTheme class and let you pick a unique colour range for that class. 

Nice. Well, what if the user changes a colour in the range then? Should work better now? Since now we have these tokens and aliases that the devs can use to make a site look good and readable and then be able to trust that the relationships between colors stays, at least somewhat, consistent no matter what colors the client picks? Right? Well... only if they pick colors that actually follow the rules of the range. If they change the order of contrast along the range then the entire thing blows up in their face. 

Alright, well we could go the route that radix colours goes. We could predefine some colour ranges and let them pick those predefined ranges rather than picking individual colors. But then that causes some problem. Because the fact of the matter is, some brands are incredibly particular about their exact colour. Coca cola wont accept a shade of red that is "almost" their shade of red. Coca cola wants the coca cola red or nothing. 

Oof. Hard one. Well, we barley have any customers atm. So, why dont we just start with some predefined ranges that we let them pick from. If some client wants a specific range we can just make it for them ourselves and make sure its all in order. Great! That works. And it fits with our general mantra of "do things that dont scale." Meaning, take advantage of the shortcuts that are available to us while we are still small. Not to mention that it will buy us time to explore and think about it some more. Nice. 

So we settle with that for a while. And. Well. You know. Theres a second problem as well. Or, not so much of a problem as just an inconvenience. Even if you know what you are doing, when there's this many colors. 12 colors per range. 3-5 ranges at least. God knows how many alias tokens on-top of that, and then these element scoped ranges as well. Thats a lot to manage even when you manage it all correctly. 

For instance, if I want to switch our accent range from a linear purple to a coca cola red, I need to spend at minimum an hour, carefully adjusting every single colour in the range around that colour change. All the colors have a relationship - so there is no such thing as "let me just change this one colour." Every single change will immediately turn into 50 changes and multiple iterations as-well, as you will rarely ever manage to make the correct adjustments first try. 

And its not just a matter of extra time. Since making colour changes across such a comprehensive theme solution is so time consuming - that means that the bar for experimenting with colors is very high. You dont get to do that sort of careless, childlike experimentation that gives birth to gold. The best way to find something great is by just trying a bunch of shit out. Well, if trying just one thing out takes the rest of your day then you aren't going to approach building that way in the first place. You will experiment in your mind, make theories and predictions, and only once you think you have a good guess do you start to try it out. Well that limits a lot of creativity to how power full and accurate your brains RAM is. Even if you have the best brain RAM on planet earth thats sure to sap some energy out of you anyway- thats on top of the time it takes to adjust all of it, which no amount of brain RAM can resolve.  

Now, I am not saying this to be negative. What we have so far is miles ahead of where we started. I am only setting up these problems as a platform for a solution I have been planning, and scheming for since the very beginning. A solution which makes it trivial to experiment and which might very well solve our other problem of letting users trivially pick their exact colors theme selves. 

Here comes the birth of UmbraJS. A theme generator function. Simply pass in as much or as little of the theme ranges as you want and watch the function spit out the missing colors in the correct pattern. Why has nobody dont that before? Well, because its hard. In fact the tailwind docs have a specific section where they explicitly said that they abandoned this approach because they dont believe its possible with the current tooling. 

Well then, what makes me so confident I can do what they cant? Nothing. They are right. It cant be done. The insight I have that they dont, is not that I have some superior way to solve it, its simply that unlike them I'm fine with the result being flawed. Because to me, its not about generating the ranges as some user service, its first and foremost about speeding up the task for my own gain. If it can just do that part then its a success. If its good enough to also give to users then thats simply an added bonus. 

Auto generation 50 tokens and adjusting what fails manually is still faster than adjusting 50 tokens from some, wildly off, starting point. And unlike the tailwind team, I have all the youth and stupidity to just focus on this one piece and seeing how far I can take it. Well, there you have it. This is why I made the umbra colour generation function. Now, in the next segment lets look at how it works and how making it work further evolved my token ranges. 

## How UmbraJS?

Well so, heres the API we want. To understand it, lets start with some terms I came up with. Colour stops, and colour shades. A stop is a user defined colour, while a shade is an automatically generated colour. 

So in this example, all the colors defined here are colour stops. 
```ts
umbra({
  foreground: #000000,
  background: #111111,
  accents: [#990000]
})
```

The background and foreground stops are the most important once. They define the start and end of the base range. Each colour automatically generated between them is a colour shade. Once this base range has been set, the accents only needs 1 colour stop. Because an accent range is created by taking the base range, figuring out which shade in that range has the least amount of contrast to the picked accent colour. Replacing that shade with the accent. Then using that accent like a third stop. So you get the start stop, which generates its shades, one by one, towards the next stop, which is the accent. Until it hits the accent index. Then it takes the accent stop colour, and mixes it towards the next stop which is the foreground stop - one after another until it completes the range.  

This way you can calculate a range using as many or as few stops as you want. If you want to take full control of the range just turn every singe step into a colour stop. We need a way to express that in the api though. Suppose theres a number of things we would want to tell the umbra function about how we want the ranges generated. So that might call for a settings object. Like so: 

```ts
umbra({
  foreground: #000000,
  background: #111111,
  accents: [#990000],
  settings: {
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25]
  }
})
```

The numbers in the shades array represents the shades. Each number tells umbra how much that colour should move towards the next stop as a percentage. So, 100, would mean, take the last shade, and mix it 100% towards the next stop. This lets us make a nonlinear curve of shade mixing that suits the given range. More on that later. 

Anyway, if you write in a colour instead of a number that then becomes a colour stop in the range. Like so: 
```ts
  shades: [5, 5, 5, 5, 15, 10, "#448811", 25, 30, 25, 25, 25]
```
This way, if the generator is giving you a result you dont like, you can simply take control of the parts you aren't quite happy with and let the other shades automatically fit themselves around your choices. In the case where you need full control, you just turn every shade in the array into a colour hex. 

You get the benefit of a massive speed boost when iterating and experimenting, couples with 100% flexibility and control of the final output. Neat! 

Now, this settings object is neat for the base range and everything. But what about the accent ranges? How does that work here? For one thing, the accent is just a single colour stop. And an accent colour is usually some brand colour, which will almost never be a colour that fits at the start or at the end of a range anyway. And even if it did what other colour should the range stretch from or towards? 

Well, if we think about it, an accent range actually needs 3 colour stops. A start and an end, and the actual brand colour somewhere in between. But the start should probably be the same as the start of the base, since we trying to make the accent fit into the rest of the page. So mixing it gradually into that same starting point makes sense. And the same for the end. So basically, the foreground and background sets the start and end stops for every range, not just the base. 

In that case the accent only needs to define 1 colour, the third colour in the middle. If we want control of the accent colour range we can modify our API to work like this: 

```ts
umbra({
  foreground: #000000,
  background: #111111,
  accents: [{
    shades: [5, 5, 5, 5, 15, 10, '#ff6b6b', 25, 30, 25, 25, 25]
  }],
})
```

Here, rather than providing a colour as a string into the array, we provide an object with its ow shades array. Nice! And we can use this object to configure the individual accent range aswell. Like, if you want a named accent range, something like success, or error, etc. We just provide a name property. 

```ts
const errorAccent: Accent = {
  name: "error",
  shades: [5, 5, 5, 5, 15, 10, 25, 25, "#ff0000", 25, 25, 25]
}
```

This should not output: 
```css
--error-10: #0c0915;
--error-20: #201c26;
--error-30: #484349;
--error-40: #524f56;
--error-50: #615e64;
--error-60: #6e6c70;
--error-70: #8d8d8d;
--error-80: #cacbc4;
--error-90: #d4d6cd;
--error-100: #e1e3da;
--error-110: #eef0e7;
--error-120: #d5c9c1;
```

Since the accent range always needs 3 colour stops its a bit unique from the base range though. For the base range theres a very obvious place where the 2 stops should be placed in the range. The beginning and the end. But its not as obvious where the colour stop in in between the start and the end should be placed. In fact the answer is probably often different. A dark brand colour should probably be towards the darker end of the range and a lighter brand colour should be towards the lighter end. 

We could just pick a place, and try to make a standard around where exactly in the range the brand stop should be. But theres no way to standardise such a thing without basically dictating the polarisation of a brand colour. That kind of limitation would mean that umbra would be out of the question for many products. 

Well, given that the shades array lets you put the accent stop anywhere you want - that sorts out that problem anyway. But what happens when you dont provide an array? Well, what happens is that it takes the base range, which is always generated first anyway, and which has the same start and end. And it just finds the shade in that range with the least amount of contrast against the provided accent colour. And thats the place in the range where the accent colour fits. 

If you want to provide a name, but also let umbra figure out this placing on its own then you just provide a colour property like this:

```ts
const errorAccent: Accent = {
  name: "error",
  color: "#ff0000",
}
```

Which also works if you want to provide the shades range as well. 

```ts
const errorAccent: Accent = {
  name: "error",
  color: "#ff0000",
  shades: [5, 5, 5, 5, 15, 10, 25, 25, 25, 25, 25, 25]
}
```

### 14 shades
Now, those of you with eagle eyes might have noticed something off. The shades array has 12 colors. Which maps onto our prior pattern of 12 swatches. We picked 12 to align with radix colors - so that works out. But every range needs a start and an end, which cant be a shade. They have to be a defined colour stop. These fundamental stops - the background and foreground, dont actually show up int the shader array. So, that means that actually our range is now 14 colors not 12. 2 colour stops, and 12 colour shades in between them. We could reduce our shade array down to 10 shades, then the 2 stops aligns it with 12 exactly. But in our system, the start and end stops are the exact same for every range. Because the start and stop are dictated by the base range. Now, if you look at the ranges in radix colors you will see that it sort of follows the same thing. Even though their ranges are a bit weird.

For instance you can see that the contrast between 11 and 8 is less than between 11 and 10. Doesn't make much sense for our system since we are very concerned that the amount of contrast should continue to grow in one direction. But another ting of note, is that if you look at the radix colour ranges they dont end at black. They end at some dark version of their coloured swatch thats not quite as dark as they could go. It says that 12 is for text, but effectively a lot of times you might be reaching for 12 of the grayscale for text, to get perfect black and the highest contrast. This effectively means that in radix colors there full range of colours in terms of describing a range of contrast is actually 14. Their coloured range plus the starting white and ending black in their gray range. 

This is fundamentally how the umbra system works as-well. So by making sure the shades stay at 12 length, you can trivially insert the radix colors range into it, and get the darkest and lightest caps around that range to arrive at a 14 length range of colors. It would look like this: 

```ts
import { tomato } from '@radix-ui/colors'

const warningAccent: Accent = {
  name: "warning",
  shades: tomato
}
```

Which comes out like this:

```css
:root {
  --base: #0c0915; // Base background color stop
  --base-10: #201c26;
  --base-20: #484349;
  --base-30: #524f56;
  --base-40: #615e64;
  --base-50: #6e6c70;
  --base-60: #8d8d8d;
  --base-70: #ababa8;
  --base-80: #bdbdb8;
  --base-90: #cacbc4;
  --base-100: #d4d6cd;
  --base-110: #e1e3da;
  --base-120: #eef0e7;
  --base-text: #d5c9c1; // Base foreground color stop
}
```

Now we can distinguish between, numbered swatches, and named swatches. Named swatches being the start and end, which are are not generated, and reserved to say something about the generation. Typically what the start and end is. As you can see the start is just the plain name of the range, --base, --error, --accent. While the end is named -text - denoting that its reserved for the highest possible amount of contrast from the start of the range.  

The fact that the beginning and end of every range is identical might seem a bit weird. But it also gives us some nice, reserved keys that we can use to solve another problem. 

Earlier I noted that if you dont tell the system where to put the accent stop, then it will just automatically put it where it fits. Thats all well and good. But if you then want to use the exact colour the user inputed for a specific, brand sensitive part of the UI you might be a bit fucked. Because --brand-80 might be where the exact brand colour lives in the range for coca cola. But maybe for pepsi its more like --brand-30. Well, wince --brand would be the same as --base anyway. Why dont we reserve the named swatch in the accent ranges to mean "the exact original colour." Ergo, in an accent range the exact colour you pick will show up twice. Once as a numbered swatch in the range that keeps its promise of scaling contrast. And then another time as the named starting swatch --accent. Notice the duplicated colour value in this range: 

```css
:root {
	--accent: #9999ff;
	--accent-10: #1b1828;
	--accent-20: #201d31;
	--accent-30: #25223a;
	--accent-40: #2a2743;
	--accent-50: #39365c;
	--accent-60: #423f6b;
	--accent-70: #4a4779;
	--accent-80: #5d5a99;
	--accent-90: #6e6cb7;
	--accent-100: #9999ff;
	--accent-110: #b2affb;
	--accent-120: #c3c0f7;
	--accent-text: #d5c9c1;
}
```

So the pattern, or rule, to understand will be this: 

Shader range: for the shader range, ergo the numbered swatches 10 - 120, you can guarantee that the next token in the range will have a greater contrast to the start than the previous. 

Base range: The cap stops (start and end) in the range follows the same increasing contrast pattern as the rest of the shader range. 

Accent range: The start swatch is the exact accent chosen. The end swatch is the same as the end swatch in the base range. And thats about it. Thats now, in full how the umbra colour token pattern works. 

Now just for how the umbra function lets you interact with it. 

TODO - Missing sections:
- a section explaining what APCA is. APCA vs wcag. This contrast algorithm is used to make sure the background stop and the foreground stop has enough distance between each other based on the readability setting. If they dont then we will push the foreground colour away from the background color, by picking either white or black depending on which has the most contrast with the background, and then mixinng the foreground towards that multiple times until it reaches the readability threshold or runs out of tries. The best way to test how this works is by trying to call the umbra function with the exact same background and foreground color. That way you can see how much it had to change the foreground to get to the minimum allowed contrast. 
- A section talking about theme polarisation, ergo, dark light, using the inversed property, the inverse function. Needs to explain how these works - could be similar to the docs. 
- A section going over the umbra function and how it works. generate, format, attack. Element scoped themes, how the default is to generate a stylesheet, possibly something funny about the easter egg, etc. What the shape of the data returned from the format function is and how it could be usefull for iterating over the values, etc.
