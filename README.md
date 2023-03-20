# Myriad
MyriadJS is a powerful and flexible JavaScript library that allows you to create semantic color themes based on the Myriad pattern. This pattern defines the relationship between colors as opposed to focusing on the elements the colors belong to. Its a simpler way to ensure readability and consistency across a wide range of themes. By following this convention and taking advantge of the powefull color generator and its underlying color primitives, you can generate both light and dark themes, as well as any other theme in between, with ease.

Test it out yourself. Head over to [MyriadX](https://myriadx.netlify.app/) to get an idea of whats possible and feel out the performance. 

## :alembic: How it works
> It assumes a strict but very simply pattern. Foreground, background, accent. It takes this scheme, adjusts the colors in relationship to each other to ensure reasability. Then it generates a bunch of sub colors in each category - mostly diffirent shades of each color. Then it distributes these colors by attatching them to CSS variables that it attaches to the HTML by default. 

- :kissing_cat: ***Simple*** - Just a simple JS function that lets you define youre theme. Nothing more
- :muscle: ***Flexible*** - Flexible primitives underneath that let you build your own logic
- :telescope: ***Typesafe*** - Written fully in typescript 
- :hammer_and_wrench: ***Maintainable*** - HTML stays descriptive of content letting canvas images flows with the HTML elements
- :man_in_manual_wheelchair: ***Accessible*** - Let's control readability scores. Enforce good readability or just help monitor

#### :test_tube: Benefits of this approach
This approach lets you easily adjust or completely change your entire theme from a single place and at a moments notice, making it ideal for both highly dynamic and less dynamic theme requirements. The Myriad pattern also enables you to predict and dictate readability scores and even auto-generate themes or parts of themes. MyriadJS provides a highly customizable and scalable approach to color systems that can accommodate any color theme without the need to change any color assignments.

## :package: Installation
```bash
npm install @myriadjs/core
```

## :building_construction: Setup
You can inject GLSL as a string but if you want to actually use it you're going to want to store GLSL in files that you can import. In order to do that you need to let Vite know how to handle GLSL files though. Import the [vite-plugin-glsl](https://github.com/UstymUkhman/vite-plugin-glsl) package and register it as a plugin in your vite.config file.

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [vue(), glsl()],
})
```

## :crystal_ball: Usage
Simple example
```ts
  import { myriad } from "@myriadj/core"

  myriad({
    background: '#0c0915',
    foreground: '#c0aea3',
    accents: ['#c97074'],
  })
```

## :dna: Primitives
...