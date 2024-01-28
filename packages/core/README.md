Todo ListS
2 - Add APCA color contrast

# Umbra
- :kissing_cat: ***Simple*** - Just a simple JS function that lets you define your theme
- :muscle: ***Flexible*** - Flexible primitives underneath that let you build your own logic
- :telescope: ***Typesafe*** - Written fully in typescript giving you great auto completion even if you dont use TypeScript
- :hammer_and_wrench: ***Maintainable*** - Enforces a single source of truth for your entire color system
- :man_in_manual_wheelchair: ***Accessible*** - Lets you control readability scores, enforce good readability or just help monitor

UmbraJS is a flexible theme managment library that allows you to create semantic color themes based on the Umbra pattern. This pattern defines the relationship between colors as opposed to focusing on the elements the colors belong to. Its a simpler way to ensure readability and consistency across a wide range of themes. By following this convention and taking advantge of the powefull color generator and its underlying color primitives, you can generate both light and dark themes, as well as any other theme in between, with ease.

Test it out yourself. Head over to [UmbraX](https://umbrax.netlify.app/) to get an idea of whats possible and feel out the performance. 

## :alembic: How it works
 - :muscle: ***Manage*** - UmbraJS assumes a strict but very simple pattern. Foreground, background, accent. It takes this scheme, adjusts the colors in relationship to each other to ensure reusability. Then it generates a bunch of sub colors in each category - mostly diffirent shades of each color. Then it distributes these colors by assigning them to CSS variables that it attaches to the HTML by default or a given element if passed. 
 - :fireworks: ***Update*** - To update the theme simply rerun the function and it will reassign the CSS variables across the entire page. 
 - :sunrise_over_mountains: ***Scale*** - To create more complex themes simply run multiple umbra theme functions on diffirent elements. This lets you infinetly scale up your theme complexity at any point without having to change any of the color assignments becuase all you need to change is the context by reassigning the color variables with new values at the given element scope.

#### :test_tube: Benefits of this approach
This approach lets you easily adjust or completely change your entire theme from a single place and at a moments notice, making it ideal for both highly dynamic and less dynamic theme requirements. The Umbra pattern also enables you to predict and dictate readability scores and even auto-generate themes or parts of themes. Umbra S provides a highly customizable and scalable approach to color systems that can accommodate any color theme without the need to change any color assignments.

## :package: Installation
```bash
npm install @umbrajs/core
```
## :crystal_ball: Most Common Usage
Simple example
```ts
  import { umbra } from "@umbrajs/core"

  umbra({
    background: '#0c0915',
    foreground: '#c0aea3',
    accents: ['#c97074'],
  })
```
Outputted CSS attached to the HTML element
```css
  --background: #0c0915;
  --background-10: #201c26;
  --background-20: #484349;
  
  --foreground: #d5c9c1;
  --foreground-10: #ada39f;
  --foreground-20: #71696b;
  
  --accent: #e6bebf;
  --accent-contrast: #0c0915;
  --accent-10: #ba9a9d;
  --accent-20: #79646a;
```

These variables are available everywhere as long as the element is inside the HTML tag. Heres an example of how to use them. 
```css
  .card {
    background-color: var(--base-20);
    color: var(--base-120);
  }
```

> **Note**
> if youre unfamiliar with CSS variables [heres the docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for them

## :crystal_ball: Details

The umbra function is the main function that handles everything. It takes a scheme and a settings object, both of which are optional and whos paramaters all have defaults.
```ts
  umbra(scheme, settings)
```

In other words, both the scheme and the settings can have as many or as few of the avilable parameters on it and the function will fill in the holes with defaults or auto generated values based on what you did passed into it. In this example we are only passing a schema and the scheme only has a foreground color. The rest is left for the system to fill out. This lets you very easily create themes with as few parameters as you have and take more and more control of the theme as you add more parameters. 

```ts
  umbra({
   foreground: "#ffffff"
  })
```
## :crystal_ball: Scheme
The scheme itself has multiple color parameters which can be though of in terms of groups. Theres the main color parameters background foreground and accents. The additional custom colors. And subscemes.

```ts 
  scheme: {
   background: '#090233',
   foreground: '#ff5555',
   accents: ['#5200ff'],
   custom: {
     foo: '#00ff00',
     bar: '#ff0000',
   },
   subSchemes: {}
  }
```
These main colors dictate the entire scheme, and more consisley the main focus should be the foreground and the background. These two colors must have some contrast and the umbra system willl ensure this. They effectgivley dictate the available range of colors to be generated. All additional shades get generated as a mix in this range. It is though thinking aboiut colors as background vs foreground that the system manages to understand color readability and context. The accent colors can be though of commonly as brand colors. They are the additional splash of pink, or red, or blue that

```ts 
  scheme: {
   background: '#090233',
   foreground: '#ff5555',
   accents: ['#5200ff'],
  }
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
Notice however that regardless of the shade value the outputted CSS variables will still be counted 10, 20, 40 etc. This is because the purpose of the CSS variable naming is to count the fractions of shades and to keep this naming consistent and easy to modify. Imagine for instance if you named the CSS variables after the exact percentage, assigned these variables all over the place and then wanted to change it? Your theme would break. Keeping the CSS variable naming simple and independent of color percentages allows you to change themes and have multiple temes without anything breaking as long as you keep using the same amount of shades, the value of the shades wont matter.

```ts
  import { umbra } from "@umbraj/core"

  umbra({
    background: '#0c0915',
    foreground: '#c0aea3',
    accents: ['#c97074'],
  })
```

## :dna: Primitives
...
