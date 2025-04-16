# Umbra

> **Warning**
> Project Umbra is still in early development and is not yet ready for production use. In fact its not even ready for development use. The API is still changing and the documentation is still being written. If you want to help out or just want to know when its ready, please star the repo and follow me on twitter [@MorkSamuel](https://twitter.com/MorkSamuel)

- :kissing_cat: **Simple** - Just a simple JS function that lets you define your theme
- :muscle: **Flexible** - Flexible primitives underneath that let you build your own logic
- :telescope: **Typesafe** - Written fully in typescript giving you great auto completion even if you dont use TypeScript
- :hammer_and_wrench: **Maintainable** - Enforces a single source of truth for your entire color system
- :man_in_manual_wheelchair: **Accessible** - Lets you control readability scores, enforce good readability or just help monitor
- :sunrise_over_mountains: **Noncommital** - If at any point you want to divorce yourself from this dependency all you have to do is just copy paste the output. Then you can delete the entire library without problem and take over the theming however you want from there. Youre never locked into this library.

UmbraJS is a flexible theme managment library that allows you to create semantic color themes based on the Umbra pattern. This pattern defines the relationship between colors as opposed to focusing on the elements the colors belong to. Its a simpler way to ensure readability and consistency across a wide range of themes. By following this convention and taking advantge of the powefull color generator and its underlying color primitives, you can generate both light and dark themes, as well as any other theme in between, with ease.

## :alembic: How it works

- :muscle: **Manage** - UmbraJS assumes a strict but very simple pattern. Foreground, background, accent. It takes this scheme, adjusts the colors in relationship to each other to ensure reusability. Then it generates a bunch of sub colors in each category - mostly diffirent shades of each color. Then it distributes these colors by assigning them to CSS variables that it attaches to the HTML by default or a given element if passed.
- :fireworks: **Update** - To update the theme simply rerun the function and it will reassign the CSS variables across the entire page.
- :sunrise_over_mountains: **Scale** - To create more complex themes simply run multiple umbra theme functions on diffirent elements. This lets you infinetly scale up your theme complexity at any point without having to change any of the color assignments becuase all you need to change is the context by reassigning the color variables with new values at the given element scope.

#### :test_tube: Benefits of this approach

This approach lets you easily adjust or completely change your entire theme from a single place and at a moments notice, making it ideal for both highly dynamic and less dynamic theme requirements. The Umbra pattern also enables you to predict and dictate readability scores and even auto-generate themes or parts of themes. Umbra S provides a highly customizable and scalable approach to color systems that can accommodate any color theme without the need to change any color assignments.

## :package: Installation

```bash
npm install @umbrajs/core
```

## :crystal_ball: Most Common Usage

Simple example

```ts
import { umbra } from '@umbrajs/core'

umbra({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074']
}).apply()
```

Outputted CSS inserted into :root as a stylesheet

```css
:root {
  --base: #ffffff;
  --base-10: #a6a6a6;
  --base-20: #8c8c8c;
  --base-30: #737373;
  --base-40: #595959;
  --base-50: #404040;
  --base-60: #262626;
  --base-foreground: #000000;

  --accent: #a94d94;
  --accent-10: #e1c1da;
  --accent-20: #d8afcf;
  --accent-30: #a94d94;
  --accent-40: #3b1b34;
  --accent-50: #2a1325;
  --accent-60: #190c16;
  --accent-foreground: #ffffff;
}
```

These variables are available everywhere. Heres an example of how to use them.

```css
.card {
  background-color: var(--base-20);
  color: var(--base-120);
}
```

> **Note**
> If you're unfamiliar with CSS variables [heres the docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for them

## :crystal_ball: Take more control

```ts
import { umbra } from '@umbrajs/core'

umbra({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074']
}).apply(document.body)
```

The apply function is just a shorthand. Under the hood it chains togheter two other functions. The format and the attach. The format function takes the colors and formats them however you want. It formats it to hex colors by default . The attach function takes that string and attaches it to the given element.

```ts
import { umbra } from '@umbrajs/core'

umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#a94d94']
})
  .format(color => color.toHslString())
  .attach()
```

The format function takes the colors and formats them however you want. It formats it to hex colors by default. But heres an example of how to format it to HSL colors instead. You could do whatever you want with the value. Whatever you return from this function will be passed to the attach function and be attached as the value of the CSS variables.

```ts
import { umbra } from '@umbrajs/core'

umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#a94d94']
})
  .format()
  .attach(document.querySelector('.header'))
```

The attach function takes the formated color strings and attaches them it to the given element. By default it just makes a new stylesheet for the colors but if you pass an element to the attach function it will attach the colors to that element instead. This is useful if you want to scope the colors to a specific element.

The apply shorthand can also take the element and the formater as passed props.

```ts
import { umbra } from '@umbrajs/core'

umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#a94d94']
}).apply(document.querySelector('.header'))

umbra({
  background: 'pink',
  foreground: 'black',
  accents: ['#a94d94']
}).apply(document.querySelector('.cards'))

umbra({
  background: 'black',
  foreground: 'white',
  accents: ['#a94d94']
}).apply(document.querySelector('.footer'))
```

By using multiple umbra functions like this you can create really complex themes. You can attribute diffirent themes to diffirent sections/elements. That way you can infinetly scale. Because you can just keep adding more and more themes to diffirent elements and they will all work together without any of the underlying css tokens having to be changed. Scale up the amount of complexity at any time without having to change any of the color assignments. Or scale down just the same.

Client suddenly wants the sidebar colors to be customisable? No problem. Takes you 5 min to add a new umbra function that attaches to the sidebar. Now you can change the background, foreground, accents, and shades of the sidebar. Next step is just to figure out where to store the themes for the sidebar - that part is up to you to figure out.

## :crystal_ball: Details

The umbra function is the main function that handles everything. It takes a scheme and a settings object, both of which are optional and whos paramaters all have defaults.

```ts
umbra(scheme, settings)
```

In other words, both the scheme and the settings can have as many or as few of the available parameters on it and the function will fill in the holes with defaults or auto generated values based on what you did passed into it. In this example we are only passing a schema and the scheme only has a foreground color. The rest is left for the system to fill out. This lets you very easily create themes with as few parameters as you have and take more and more control of the theme as you add more parameters.

```ts
umbra({ foreground: '#ffffff' })
```

## :crystal_ball: Settings

```ts
 settings: {
  element?: HTMLElement
  readability?: number
  iterations?: number
  foreground?: {shade: number[]}
  background?: {shade: number[]}
  accents?: {shade: number[]}
 }
```

### Element

The element the CSS variables should apply to. Defaults to the HTML element

### Readability

The minimum readability score that the system should aim for best it can. Some cases might be impossible, but it will push the foreground color as much as it can to create the desired score. The max score possible is 21, and the reccomended score for small text is 12

### Iterations

The number of times it should try to nudge the colors towards the readability score. A highern number means lower performance. Defaults to 20.

### Foreground, Background, Accent settings

The next three settings properties have thes same type and work the same. These let you pass an object of settings for each color to adhere to. Currently the only setting available is the shade range.

This shade property is just an array of numbers. The shades of each color are all generated by mixing towards either the foreground or the background depending on contrast. The amount of numbers in the array dictates the amount of shades. And the value of the number dictates the % of mixture towards its respective contrast color. Bellow is an example.

> **Note** Defaults to 2 shades for each color. Avoid adding more shades than needed. The default of 2 shades is almost guaranteed to be more than enough.

Input

```js
foreground: {
  shade: [12, 50, 60]
}
```

Output

```css
--foreground: #d5c9c1;
--foreground-10: #bdb2ac;
--foreground-20: #a59b98;
--foreground-30: #857c7c;
```

This lets you control the "depth" of colors in your theme by setting how far appart each generated shade should be and how many shades should be used. I reccomend keeping the number of colors as small as possible as this helps keep it simpler for you to manage. The library can handle as much as you are eevr likley to throw at it however.

> **Note**
> Notice however that regardless of the shade value the outputted CSS variables will still be counted 10, 20, 40 etc. This is because the purpose of the CSS variable naming is to count the fractions of shades and to keep this naming consistent and easy to modify. Imagine for instance if you named the CSS variables after the exact percentage, assigned these variables all over the place and then wanted to change it? Your theme would break. Keeping the CSS variable naming simple and independent of color percentages allows you to change themes and have multiple temes without anything breaking as long as you keep using the same amount of shades, the value of the shades wont matter.

```ts
import { umbra } from '@umbraj/core'

umbra({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074']
})
```

## :dna: Primitives

...
