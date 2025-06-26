# 😵‍💫 I'm Exhausted of Exhaustive-Deps

In the world of React, we have the infamous `useEffect` hook.

Infamous because it's often the butt of the joke. It's the footgun by your bedside table. The cyanide in your dogshit sandwich.

But hey, we’ve all been there, wielding it like a sword you're not supposed to have at your level. Swinging it around with varying degrees of success, overzealousness, regret. I’m not here to throw more gasoline on that fire. I’m not even here to talk about hooks. We should avoid useEffect, we are in agreement. That's not where I'm fixing to grind my ax. My ax is hungry for the dependency array, and more specifically the linter.

### Exhibit A: My Code

Take a look at this code. I wrote it. It's shit.

```ts
useEffect(() => {
	...
	// Don’t add more dependencies to the array unless you know what you are doing. The linter is lying to you
}, [spaces]); // ← 🚨 React Hook useEffect has missing dependencies: 'flattenArray' and 'items'
```

And there it is. The linter. `exhaustive-deps`. That joyless ghost, whispering: "you forgot something. You missed a spot."

Like nails on a chalkboard. Like a toddler yelling _"why?"_ for the thousandth time. It touches a nerve otherwise pure and unbothered - whose ignorance of such things ought to have remained a virgin to the depravity of a broken world.

This rule haunts me at my most vulnerable moments. Warning me to include all dependencies. Gaslighting me. Because I know it's bullshit. I know the things it wants me to include either does not matter for the timing of the effect, or will just straight up bomb the entire app à la render loop.

Still it begs me to light the rag, even as I stare at the cocktail.

So I do the unthinkable. In the deep dark corners of my private chamber, I pull out the forbidden jutsu.

```
// eslint-disable-next-line react-hooks/exhaustive-deps
```

Finally. Peace. And the sun sets on my kingdom like a warm blanket. But theres a pea under my mattress. I hate myself for having left a lint ignore comment. And it bugs me. It's ugly. It feels wrong. I need a shower. But as I shut my eyes to finish off the day, an even darker desire grows inside me. Yet again I feel my soul fractured by the corruption of my sinful ways. Quickly I wake up in a sweat.

> "Can't we just disable the entire rule?!"

My team, which is always loyally gathered around my bed, says: \_“No… don’t go that far.”

Alas... why must we live only to suffer?

We compromise: eslint-ignore is allowed, as long as there’s a comment explaining _why_.

Reasonable.

A junior dev, trying to make an impression chimes in:

> “Maybe we should restructure our data flow?”

I nod politely, discreetly marking them for re-education. They haven’t seen what I’ve seen. Even though they might be right - these are the words of someone unsullied by the weight of life in the trenches. The world is not always as rosey as the wise docs would have you believe. The path ahead requires the effect. Sometimes the data flow do be like that. And like the flow of water, sometimes you must become the bowl.

Even so, I concede to the compromise: working in a team means you don’t always get what you want. Maybe the lint rule is right, like sacred guidance from the holy tome of the react team. From the lingering spirit of Dan Abramov, peace be upon him. So maybe the rule makes sense. Maybe… I start googling for conversion therapy camps near me. I try to move on, and just when I think I’m free… That new Copilot code review feature my PO insisted on enabling drops an elbow from the top ropes.

> "Suppressing exhaustive-deps can mask missing dependencies. Consider including cleanupObject, resetProcess, and showSnackbar in the dependency array or wrapping them in useCallback to ensure they're up to date."

NO! That’s it. That’s the last straw. I will be silent no more. This is just a shit rule. Now let me rant about why.

## The actual article: It's everyone else who is wrong! Not me!

Let’s break down that Copilot example. Those dependencies mentioned are all functions. These functions are either stable, in which case, including them in the dependency array is just noise, or they're unstable, in which case they change on every render. That makes tracking them either a pointless exercise in recalculating your effects… or worse, a fast track to an infinite loop.

In the world of the dependency array. Stable functions are noise. Unstable ones are poison. And fuck me I guess?

Yes, there _are_ rare cases where a function is intentionally swapped or stored, but that’s either a code smell, or a super intentional choice. And if it’s intentional, the author already knows it belongs in the dependency array (if it does). Whatever they are working on is clearly an incredibly specific beast. The linter doesn’t need to hold their hand - leave them alone to it.

### React, The Bad Parts

To zoom out and get some perspective on how we got here and why this matters: React has a unique take on rendering that sets it apart from every other framework. Nobody else does this “rerun the entire component on every change” thing. In this world effects quickly become side-effects. You lose track of intentionality in the flow of state really fast.

useEffect is your one escape hatch - your one chance to be explicit about what changes actually matter. So why not be selective? Why treat the dependency array like a diff of the outer scope instead of a deliberate contract? Yes, it's very funny that useEffect is so deeply inexplicit in what it does and also the best tool we have to be explicit about which changes we react to and more specifically which changes we dont react to. But that's just life and we have to live it.

I sort of get the mindset though: an effect is like an equation - if any variable in that equation changes, the result might change, so you recalculate it. But unlike something like computed in Vue, useEffect can't return anything so it's actually a bit weird to treat it as an equation. In that sense an effect is actually not like an equation at all.

```ts
// Example of a "hook" that actually behaves like an equation and therefore probably should recalculate any time any of its references change.

const speed = computed(() => {
  if (time.value === 0)
    return 0
  return distance.value / time.value // km/h
})
```

By contrast, you should not really use an effect in react to sync a single result, and it's not particularly ergonomic for that anyway. You literally can't return a value from it. So it kinda does not make sense to recalculate every single time the output might change. Because the concern of an effect isn't a discrete output. It's an effect - it does things to other things when some thing triggers it. Usually when something **specific** triggers it - and thats my point.

```ts
useEffect(() => {
  const key = `theme:${username}:${date}`
  localStorage.setItem(key, theme)
}, [theme]) // <- Why the fuck would I rerun this when username or date changes?

// - I just care about theme changing. I'm just checking what the username and date references are at that specific time when that change occurs.
```

This makes effects distinctly different from an equation. So they ought to behave more like a watcher in Vue. Explicitly watching one, possibly 2, in rare occasions 3 other values - and then triggering an effect in that case. That effect may include many other references that aren't being watched but not every reference should trigger the effect because the effect isn't computing a result like an equation does.

```ts
// Notice how the vue watcher fills the same role as the useEffect but with zero expectation from the linter that you should list every single reference.

watch(theme, (newTheme) => {
  const key = `theme:${username.value}:${date.value}`
  localStorage.setItem(key, newTheme)
})
```

In an equation, every variable has equal semantic weight because context and intent doesn't matter to the equation, only the variables do. An equation is concerned with the result, and every variable changes the result so every variable change is important. But an effect is causing something to happen - in a sense all effects are side effects. The timing and intent of when that effect happens is much more dependent on intention than the output of an equation is. In my mental model, some values define when the effect should run, and others are just ambient context.

### The Little Linter That Can't

[dep01, dep02]

- Dep01: (intent specific dependency) A prop I care about as a trigger to the effect
- Dep02: (Ambient context) A prop I happen to reference when a trigger triggers

The linter tries to help by reminding me to list both dependencies, but it’s like a well-meaning roommate who "helps" by organising my bookshelf by colour instead of genre. The intent and context that the person who has to deal with the bookshelf understands is lost on them. To the linter it's just dep01 and dep02. To make it clearer using another analogy:

> If I want to calculate how fast a car will go down a road, I need the engine, the wheels, the weight. But the _timing_ of when I need that info is very specific: when the car enters the road. My effect only needs to know those things when the car is entering - it doesn’t need to listen for every time the engine is tuned or the tires are rotated.

Okay, maybe it’s a bad analogy. Because that’s also a case where I probably should be using a function instead. There's a trivial event for me to place it alongside and I likely want to return that value like an equation.

But stretch it a bit: Imagine a road system where I can’t observe the moment the car enters the road - but I _do_ need to react once it has. Maybe I dont even know or control what will enter. It could be a car, a truck or a tank. And when something enters, I need to know how fast it will reach the mid point of this road so I can trigger the lights at the crossing in the right order, or send a car down another lane, etc.

That’s what `useEffect` is for. It's for setting up a side effect that needs to trigger on some state change. But side-effects are scary, so to limit them I want to write the minimum set of dependencies that intentionally trigger that effect. Ergo the car entering the road, not the engine being tuned.

### A Cheesy Problem and a Novel Idea

But, I hear you yelling about the elephant in the room - because who's to say I don't mistakenly think that a variable is just an engine being tuned when actually it's a lane switch? Or, in more grounded terms, what if I missed a dependency I should have added?

So here comes my novel wisdom, born from experience and much headache: we have totally oversold the problem. Because the issues that arises from missing dependencies is obvious... The effect doesn’t run when I expected it to. Boom. Easy to catch.

The feedback loop is tight. I'll probably see it during dev. Because an effect not running when it should means there's an expectation not being met when I use it. If somehow I don't catch that then QA catches it. Or worst case: a user catches it, reports it, and it's still trivial to track down and fix. It's just a missing dependency.

> Ah, of course - I just forgot about the lane switch. I'll add the dependency and have it fixed in 5 min.

But, if by default, you include all references, in every dependency array, that don’t actually matter - you over-subscribe to dependencies - you connect more parts than needs connecting, then you risk subtle, silent bugs: performance issues, unnecessary re-renders, and tangled render loops.

And when they do surface, they’re extremely hard to trace - often buried under a web of effects and state changes subtly triggering each other. These bugs surface months later. Deep inside a maze of state and side effects subtly ping-ponging across renders.

To continue the analogy - maybe someone suddenly realises that the car factory down the road keeps randomly sending cars down the wrong lane whenever someone changes the engine oil at the factory (I realize the analogy is turning into a Salvador Dali painting).

That problem just wasn't obvious when the feature was originally built because we weren't changing the oil before and now we are. It took us a week to realise that this is why our cars keep randomly changing lanes. It's a mess of unpredictability born out of a culture of subscribing to shit that were never important indicators of when to trigger the effect in the first place.

The novel idea I am communicating here is that the issue we are trying to prevent with the overzealous linter rule is overstated, and the chaos of reacts reactivity approach is understated.

> It's actually good to start with too few dependencies, run into issues, and move upwards until you hit the perfect amount.

A more honest reframing of what makes reacts philosophy hard to work with would allow us a more mature culture of how to organize state. We are missing a mature understanding of all the ways in which an effect is not reducible to an equation. And missing a dependency is not something the linter needs to prevent for me.

> “But re-rendering is fast, so dont worry about it!”

Sure. But that’s not the point. This isn’t about milliseconds. It’s about predictability, debuggability, and causality. It’s about clarity and control.

Keep in mind that in React, you don’t opt into rendering - it just happens. What useEffect gives you is a chance to opt out. That’s why being precise and intentional in your dependency array is valuable.

If there's anything I want you to take away from what I am saying it's that your instinct to think of effects as opting into reactivity is wrong. You should instead think of effects as a way let a block of code in your component be selective about reactivity in a environment thats otherwise not selective at all. So be selective. Be minimal. That's what useEffect lets you do and I am arguing it's what the linter should encourage as well. It's a mistake that it isn't.

## The Dance of Simplicity and Flexibility

Let's switch gears a bit and then land this bicycle. From a birds eye view I want the simplest possible way for data to flow through my app.

But simplicity and flexibility are often enemies. And I care about flexibility as well - or more accurately, my users do. Sometimes that feature, in that context, needs an effect.

So I need to give some room for flexibility at the sacrifice of simplicity and my philosophy to manage this can be described such:

> As simple as possible, but as flexible as necessary.

When flexibility increases, we must wrestle with clarity. To our deaths if required. Causality must be mapped as simply as possible. You need to know what triggers what. Simple ways to reason about the growing chain of causality in our components becomes the difference between following the rhythm or stepping on my partners toes.

In this dance, I need effects to be minimal contracts of change. Or more simply, islands of explicit change in the sea of implicit change that is react. So the dependency array should reflect intent, not passive lexical inclusion. That's why I don't like the exhaustive-deps rule.

Because the rule creates an environment where the dependency array conveys nothing except a list of all the references inside the effect.

> The dependency array should be a contract not a confession.

Where all other code may run at unpredictable times, this block will not. Anything more than this promise is noise, anything less is a lie.

The linter trains you to include everything. But a dependency array full of everything communicates nothing. If you understand what your effect is doing and when it needs to run, then trust your judgment over the linter.

Or at least trust that you will be proven wrong fast, and the fix is simple. The correct collection of dependencies will grow more naturally into its perfect state by starting at too few dependencies and moving up towards the ideal. Rather than starting at too many and staying at too many until something blows up, and after about 72 hours of debugging, you get to remove 1 out of 21 other dependencies you could remove.

In short, the effect should run when you need the result, not whenever the result changes. And thats that, I've said my peace and maybe father sleep will finally allow me to rest.

Sweet dreams,
Samuel M. Bednarz
