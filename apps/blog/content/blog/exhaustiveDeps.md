# 😵‍💫 I'm Exhausted of Exhaustive-Deps

In the world of React, we have the infamous `useEffect` hook.

Infamous because it's often the butt of the joke. It's the footgun by your bedside table. The cyanide in your dogshit sandwich.

But hey, we’ve all been there, wielding it like a sword you're not supposed to have at your level. Swinging it around with varying degrees of success, overzealousness, regret. I’m not here to throw more gasoline on that fire. I’m not even here to talk about hooks. We should avoid useEffect, we are in agreement. That's not where I'm fixing to grind my ax. My ax is hungry for the dependency array, and more specifically the linter.

### Exhibit A: My Code

Take a look at this code. This is a real comment that I wrote. I forget what the effect even did. I screenshotted the comment many years ago for twitter points. I have had to write similar comments since - though none quite as funny.

```ts
	// Don’t add more dependencies to the array unless you know what you are doing. The linter is lying to you
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [spaces]);
```

I do remember the circumstances in which I wrote it though. What had happened was that our new project manager was getting into the code base and making PRs. Something that was very cool of him to do. He noticed that we had some linter warnings and took it upon himself to fix all of them - seeing that it's a quick win he can help with, without bothering the other devs. 

I don't remember how it got past code review, I guess adding dependencies to an array didn't ring anyones alarm-bells. It was merged. About a week later someone noticed that some part of the app was unusually slow. We quickly realised it was a result of a hidden infinite render loop. A few hours of brute-force debugging later and I tracked the loop down to this effect, looked at the change history and realised what had happened. 

And so I fixed it, and agreed with the team that from now on, if we don't fill out the dependency array, for any reason, we should comment that reason next to the array and add an eslint ignore. Admittedly the above code is not a good example of such a comment because it's not actually explaining why - but it is the funnies example and that's more important I think. 

The warning my PO originally saw probably looked something like this:

```ts
useEffect(() => {
	...
}, [spaces]); // ← 🚨 React Hook useEffect has missing dependencies: 'flattenArray' and 'items'
```

And there it is. The linter. `exhaustive-deps`. That joyless ghost, whispering: "you forgot something. You missed a spot." I dont blame my PO for thinking he could just add the dependency. It's what the linter was telling him to do after all. If there's a lint rule for it then surely it must be somewhat safe to follow. 

But it's not. And yet it remains. Like nails on a chalkboard. Like a toddler yelling _"why?"_ for the thousandth time. It touches a nerve otherwise unbothered.

This rule haunts me at my most vulnerable moments. Warning me to include all dependencies. Gaslighting me in the moments when I know it's bullshit. I know the things it wants me to include either does not matter for the timing of the effect, and in some convoluted cases will just straight up bomb the entire app à la render loop.

Still it begs me to light the rag, even as I stare at the cocktail. And yes, I **know** the sermon by heart:

> “Just restructure your state.”  
> “Just avoid `useEffect`.”  

Yes, I’ve heard it. I’ve said it. I’ve done the work. I’ve lifted the state. I’ve composed the components. I’ve walked through the valley of effectless React and feared no re-render.

But we need to get past this denial stage and admit: **`useEffect` is not a fluke**.

It’s not legacy. It’s not failure. It’s a tool. One that exists for a reason. Every real-world codebase I’ve worked in has effects—because _reacting to change_ is part of building UIs. And sometimes, an effect is the right answer.

Take this one:
```ts
useEffect(() => {   
  // Set height after render   
  if (!intersectionRef.current || !isVisible) return;   
  placeholderHeight.current = intersectionRef.current.offsetHeight; 
}, [isVisible]);
```

Virtualisation. We wait for something to render, check if it's visible, and update a placeholder’s height. That’s an **imperative side effect**, not a state calculation. No amount of “lifting state” makes this cleaner.

Or this one:

```ts
useEffect(() => {  
  if (!editor) return;  
  if (content === editor.getHTML()) return;
  editor.commands.setContent(content || '');   
  // eslint-disable-next-line react-hooks/exhaustive-deps 
}, [content]);
```

Here, I’m syncing external state into a non-React-controlled text editor. I want the component to stay focused, and I want to _deliberately_ control when that content gets pushed in. But the linter? It wants me to add `editor`, `setContent`, probably my blood type. It doesn’t understand intent.

Another:
```ts
useEffect(() => {   
  const controller = new AbortController();   
  const signal = controller.signal;    
  
  const handleUp = () => setSelected(undefined);
  
  window.addEventListener('mouseup', handleUp, { signal });
  window.addEventListener('touchend', handleUp, { signal });
  return () => controller.abort(); 
}, []);
```

In this case, I’m setting up and tearing down global event listeners. It’s deliberate. It’s scoped. It's needed because react rendering is a wacky concept buts also exactly what effects are for. 

And finally, the spiciest one:

```ts
useEffect(() => {   
  if (!resources || !authors || !areas) return;
  callback(generateMetadata(formData));   
  // eslint-disable-next-line react-hooks/exhaustive-deps 
}, [resources, authors, areas]);
```

This is a carefully tuned trigger. I want this block to fire only when certain external values change. The `formData` and `callback` are ambient. They live outside the triggering concern. I know that. But the linter? It doesn’t.

> "You referenced something!"  
> "You missed a spot!"

So I do the unthinkable. In the deep dark corners of my private chamber, I pull out the forbidden jutsu:

```
// eslint-disable-next-line react-hooks/exhaustive-deps
```

Finally. Peace. And the sun sets on my kingdom like a warm blanket.

But at night, I feel a pea forming under my mattress. I hate myself for leaving a lint ignore. It’s ugly. It’s wrong. I need a shower. I feel like I am not getting something. I'm in the wrong somehow. 

I shut my eyes.

But something darker grows inside me.

I jolt awake—

> “Can’t we just disable the rule?!”

My team, loyally gathered around my bed as always, murmurs:  
_“No… don’t go that far.”_

Alas... why must we live only to suffer?

A junior dev, wide-eyed and innocent, offers:

> “Maybe we should restructure the data flow?”

I nod politely, discreetly marking them for re-education. They haven’t seen what I’ve seen. They don’t know yet, but **sometimes the data flow do be like that**. And like the flow of water, sometimes you must become the bowl.

So I accept the compromise: comment and ignore if you must - but explain yourself.

Hesitation in me lingers. Maybe I am wrong about all of this? Maybe the lint rule is right. Maybe it's sacred guidance from the holy tome of the React docs. From the lingering spirit of Dan Abramov, peace be upon him.

TkDoto told me as much. Years ago. "Stale closures," he warned. "They will sneak up on you and murder your family."

And I respect him. I respect all my sage elders.

But still - when, even after getting over the lint ignore, the Copilot code review feature my PO insisted on enabling drops an elbow from the top ropes:

> “Suppressing exhaustive-deps can mask missing dependencies. Consider including cleanupObject, resetProcess, and showSnackbar…”

I admit theres a part of me that wants to burn it all down. 

## If You Loved Me, You’d Include Me

I want to take a moment and zoom in on a particularly _common_ kind of false positive. I'm talking about function dependencies here. Let’s go back to that Copilot code review from earlier, the one that kicked off my descent into madness:

> "Suppressing exhaustive-deps can mask missing dependencies. Consider including cleanupObject, resetProcess, and showSnackbar..."

Those are all functions. And here’s the problem:

- If those functions are **stable**, including them in the dependency array changes nothing—except now your array is bloated with noise.
    
- If they’re **unstable**, they change on every render. So adding them guarantees the effect runs _every_ render, which makes it pointless—or worse, launches you straight into render loop hell.

In other words:

> A stable functions is the girlfriend who insists on tagging along wherever you go for no reason - even if you're just going to the bathroom. An unstable function is the girlfriend who flips the table because your phone buzzed. Stable functions are **noise.** Unstable ones are **poison.** And fuck me I guess?

Sure, there are rare cases where a function is _intentionally_ dynamic - maybe it's passed down through props, or stored in state somewhere weird, or crafted in the fires of Mount Doom. But when that happens, the dev probably _already knows_ they’re doing something spicy. After all, if you’re writing code like that, you’re clearly piloting some kind of cybernetic hydra and don’t need ESLint to hold your hand. First-base with ESlint when you're already balls deep comes off as a bit naive.

This is where the linter completely loses the plot. Because it’s not reasoning. It’s just scanning for identifiers and screaming when it sees one - like my girlfriend scrolling through my instagram feed looking for other women.

The problem isn’t that it warns me about dependencies. The problem is that **it doesn’t know which dependencies matter** - and I do. Babe. Just because I follow Beyonce doesn't mean she matters to me like you do 😌

### The Real There - There

In the old world of class based components you would frequently use the the "this" keyword. ***This*** can be awkward, sigh, because it's often not clear what ***it*** refers to. It's a keyword that demands you pay attention to context to decipher what it does. It also means that some code gets more easily tangled together. Because referring to ***this*** means ***its*** tied to a very specific context. Whereas referring to variables outside of a functions scope carries with it less weight. It's easier to move along some variables than a full scope. It's also easier to move a few variables into a prop than a scope. 

Anyway, this isn't about OOP vs FP. The point here is that when this move was made, ***this*** criticism of the old way became popular. And with it, the remaining defenders or holdout skeptics, looking to counter the narrative would like to try to turn the tables back around by making fun of how the new functional approach, while getting rid of the ***this*** concern introduced a world more prone to **stale closures.** 

I don't know the full behind the scenes history here. Delving deep into the mines of Moria for all the knowledge about what the react team and co are truly worried about that makes them so eager to push for things like the exhaustive deps rule. It feel s like it's fundamentally a reaction to this criticism. Perhaps from others - or perhaps from the internal sceptic inside themselves. Though I'm just guessing here. 

In any case, ***this*** worry around stale closures seem like it's the real fundamental meat of why things are the way they are. So we will need to tackle ***this*** subject as well or we will have failed to prove that we understand why things are the way they are. Without proving this knowledge any ascriptions about how thing should be would be arrogant and stupid. 

So lets delve into it. 

### Closure? I Hardly Know Her!

Let’s align on what “stale closures” actually are. Whenever a function is created it encapsulates some closure. This is a reference to the box that the function represents and how the creation of that box captures any outside references made from inside that function/box. 


```ts
let count = 0;

function boxClosure() {   
  console.log(count); // external reference enclosed by the creation of the box
}

boxClosure() // 0
count++
boxClosure() // 1
```

Notice that count gets logged predictably. It logs what the current value of variable. So, you might wonder what this enclosure even does then. Well, its important to understand what its enclosing. Its enclosing a reference to that piece of memory labeled count. Such a reference is called a binding, and such a space for a value to exist in memory is called a slot. Ergo, the value the binding points to can change, and any reference to that slot will show that changed value. 


```ts
let count = 0;

function logCount() {   
	console.log(count); // reads the live binding 
}  

document.addEventListener("mousedown", () => {   
	count++;   
	logCount(); // 1, 2, 3, ... not stuck at 0 
});
```

Each click logs the updated count. No staleness, because we never created a snapshot. Staleness only appears when you _do_ take a snapshot, e.g. via a local copy, default param, or IIFE:


```ts
// default param snapshot 
let count = 0; 
function makeLogger(snapshot = count) {
	return () => console.log(snapshot);
} 
const log = makeLogger(); // snapshot = 0 count = 10; 

log(); // 0 - stale by design
```

or:


```ts
// IIFE snapshot 
let count = 0; 
const log = (() => {   
	const snapshot = count; // 0 captured now   
	return () => console.log(snapshot); 
})(); 

count = 3; 

log(); // 0
```

That’s “stale closure” in the wild: not because closures freeze, but because _you_ froze something.

Now, React enters and scrambles our intuitions. Components re-run on state changes, so functions defined during render get redefined often. That means many closures feel perpetually “fresh.” But the moment you schedule something to run later - timers, event listeners, async callbacks - it can fire with variables from an older render. That’s the React-flavored stale closure.

Bad version:


```ts
function Counter() {   
	const [count, setCount] = useState(0);    
	useEffect(() => {    
		const id = setInterval(() => {       
			// uses 'count' from the render that created this effect       
			setCount(count + 1); // stale if deps are []     
		}, 1000);     
		return () => clearInterval(id);   
	}, []); // count isn't in deps, so interval sees the initial count 
}
```

Good version - prefer functional updates:

```ts
function Counter() {   
	const [count, setCount] = useState(0);    
	useEffect(() => {     
		const id = setInterval(() => {       
			setCount(c => c + 1); // always uses the latest c     
		}, 1000);     
		return () => clearInterval(id);   
	}, []); 
}
```

Same idea with global listeners. Don’t attach them on every render, and don’t capture stale state:


```ts
function Example() {   
	const [selected, setSelected] = useState<string | undefined>();    
	// always read latest state with a functional update or a ref   
	const onUp = useCallback(() => setSelected(undefined), []);    
	useEffect(() => {     
		const opts = { passive: true as const };     
		window.addEventListener("mouseup", onUp, opts);
		window.addEventListener("touchend", onUp, opts);     
		return () => {       
			window.removeEventListener("mouseup", onUp, opts);
			window.removeEventListener("touchend", onUp, opts);     
		};   
	}, [onUp]); 
}
```

So here’s the punchline:

- In plain JS, closures are live by default. You only get “stale” if you _snapshot_ something.
    
- In React, closures are per-render. Anything that runs later can see an older render’s values. Fix it by either:
    
    - using functional updates (`setX(x => ...)`), or
        
    - reading “ambient” stuff via refs, while keeping your dependency array aligned with the actual triggers.

### Effects Are Not Equations You Dumb Bitch
To spoil my entire point upfront, I will be arguing that all functions are either equations or effects. The difference is in whether the function returns a value or not. A function that returns a value, and which main purpose is to resolve this value, is fundamentally an equation. 

$E=mc2$

```ts
function energy(mass: number, c = 299_792_458) {
  return mass * c ** 2;
}
```

While a function which does not resolve a result, by definition, cannot be an equation. Because where the fuck do you put the equal sign in this code? 

```ts
function shitHappensBro() {
  waveCount++
  if(waveCount > 1) console.log(`${waveCount} rad waves!`)
}

const broWtfAreYouDoing = shitHappensBro()
```

This function is not an equation. It's more like an effect. By which I mean that stuff happens when you execute it. Stuff which may or may not affect other stuff outside itself. But whatever it does, the more important part is what it doesn't do, and what it doesn't do is resolve fuck all. It exists, and it does stuff, but to it, the equal sign is more of a suggestion than an assignment. 

### Issac Newtons Stale Equations

Effects dont have stale enclosures unless you are artificially making the executed code temporally detached. 

Only hooks that resolve to a value create stale closure problems because the the point of those hooks is a resolved value not the timing of an effect. 
### React, The Bad Parts

To zoom out and get some perspective on how we got here and why this matters: React has a unique take on rendering that sets it apart from every other framework. Nobody else does this “rerun the entire component on every change” thing. In this world, effects quickly become side-effects. You lose track of intentionality in the flow of state really fast.

useEffect is your one escape hatch - your one chance to be explicit about what changes actually matter. So why not be selective? Why treat the dependency array like a diff of the outer scope instead of a deliberate contract? Yes, it's very funny that useEffect is so deeply inexplicit in what it does and also the best tool we have to be explicit about which changes we react to and more specifically which changes we dont react to. But that's just life and we have to live it. 

I sort of get the mindset though: an effect is like an equation - if any variable in that equation changes, the result might change, so you recalculate it. But unlike something like computed in Vue, useEffect can't return anything so it's actually a bit weird to treat it as an equation. In that sense an effect is actually not like an equation at all. 

```ts
// Example of a "hook" that actually behaves like an equation and therefore probably should recalculate any time any of its references change. 

const speed = computed(() => {
  if (time.value === 0) return 0
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

In an equation, every variable has equal semantic weight because context and intent doesn't matter to the equation, only the variables do. An equation is concerned with the result, and every variable changes the result so every variable change is important. But an effect is causing something to happen - all effects are side effects. The timing and intent of when that effect happens is much more dependent on intention than the output of an equation is. An equation is a set of dependent variables that resolve to a result. Any of the dependencies changing affects the result and should therefore justify redoing the equation. But an effect doesn't resolve to anything. It literally cant return a value at all. 

### The Little Linter That Can't 

In my mental model, some values define when the effect should run, and others are just ambient context. 

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

> It's actually good to start with too few dependencies, run into issues, and increment your dependency array upwards until you hit the perfect amount.

A more honest reframing of what makes reacts philosophy hard to work with would allow us a more mature culture of how to organize state. We are missing a mature understanding of all the ways in which an effect is not reducible to an equation. And missing a dependency is not something the linter needs to prevent for me. 

> “But re-rendering is fast, so dont worry about it!”

Sure. But that’s not the point. This isn’t about milliseconds. It’s about predictability, debuggability, and causality. It’s about clarity and control. 

Keep in mind that in React, you don’t opt into rendering - it just happens. What useEffect gives you is a chance to opt out. That’s why being precise and intentional in your dependency array is valuable. 

If there's anything I want you to take away from what I am saying it's that your instinct to think of effects as opting into reactivity is wrong. You should instead think of effects as a way let a block of code in your component be selective about reactivity in a environment thats otherwise not selective at all. So be selective. Be minimal. That's what useEffect lets you do and I am arguing it's what the linter should encourage as well. It's a mistake that it isn't. 

## The Dance of Simplicity and Flexibility

Let's switch gears a bit and then land this bicycle. From a birds eye view I want the simplest possible way for data to flow through my app.

But simplicity and flexibility are often enemies. And I care about flexibility as well - or more accurately, my users do. Sometimes that feature, in that context, needs an effect. 

So I need to give some room for flexibility at the sacrifice of simplicity and my philosophy to manage this can be described such:

>As simple as possible, but as flexible as necessary.

When flexibility increases, we must wrestle with clarity. To our deaths if required. Causality must be mapped as simply as possible. You need to know what triggers what. Simple ways to reason about the growing chain of causality in our components becomes the difference between following the rhythm or stepping on my partners toes. 

In this dance, I need effects to be minimal contracts of change. Or more simply, islands of explicit change in the sea of implicit change that is react. So the dependency array should reflect intent, not passive lexical inclusion. To end my long rant, this is the point that I have been trying to sell. This is why I don't like the exhaustive-deps rule.

Because the rule creates an environment where the dependency array conveys nothing except a list of all the references inside the effect. 

>The dependency array should be a contract not a confession. 

Where all other code may run at unpredictable times, this block will not. Anything more than this promise is noise, anything less is a lie.

The linter trains you to include everything. But a dependency array full of everything communicates nothing. If you understand what your effect is doing and when it needs to run, then trust your judgment over the linter. 

Or at least trust that you will be proven wrong fast, and the fix is simple. The correct collection of dependencies will grow more naturally into its perfect state by starting at too few dependencies and moving up towards the ideal. A bottom up approach to settling into a mature state, rather than a top down. Rather than starting at too many and staying at too many until something blows up, and after about 72 hours of debugging, you get to remove 1 out of 21 other dependencies you could remove. 

In short, the effect, unlike an equation, should run when you need the result, not whenever the result changes. And thats that, I've said my peace and maybe father sleep will finally allow me to rest. 

Sweet dreams, 
Samuel M. Bednarz
