# Myriad
MyriadJS is a flexible theme managment library that allows you to create semantic color themes based on the Myriad pattern. This pattern defines the relationship between colors as opposed to focusing on the elements the colors belong to. Its a simpler way to ensure readability and consistency across a wide range of themes. By following this convention and taking advantge of the powefull color generator and its underlying color primitives, you can generate both light and dark themes, as well as any other theme in between, with ease.

Test it out yourself. Head over to [MyriadX](https://myriadx.netlify.app/) to get an idea of whats possible and feel out the performance. 

## :alembic: How it works
 - > Managing: It assumes a strict but very simple pattern. Foreground, background, accent. It takes this scheme, adjusts the colors in relationship to each other to ensure reusability. Then it generates a bunch of sub colors in each category - mostly diffirent shades of each color. Then it distributes these colors by assigning them to CSS variables that it attaches to the HTML by default or a given element if passed. 
 - > Updating: To update the theme simply rerun the function and it will reassign the CSS variables across the entire page. 
 - > Scale: To create more complex themes simply run multiple myriad theme functions on diffirent elements. This lets you infinetly scale up your theme complexity at any point without having to change any of the color assignments becuase all you need to change is the context by reassigning the color variables with new values at the given element scope.

- :kissing_cat: ***Simple*** - Just a simple JS function that lets you define youre theme. Nothing more
- :muscle: ***Flexible*** - Flexible primitives underneath that let you build your own logic
- :telescope: ***Typesafe*** - Written fully in typescript giving you great auto completion even if you dont use TypeScript
- :hammer_and_wrench: ***Maintainable*** - Enforces a single source of truth for your entire color system
- :man_in_manual_wheelchair: ***Accessible*** - Lets you control readability scores, enforce good readability or just help monitor

#### :test_tube: Benefits of this approach
This approach lets you easily adjust or completely change your entire theme from a single place and at a moments notice, making it ideal for both highly dynamic and less dynamic theme requirements. The Myriad pattern also enables you to predict and dictate readability scores and even auto-generate themes or parts of themes. MyriadJS provides a highly customizable and scalable approach to color systems that can accommodate any color theme without the need to change any color assignments.

## :package: Installation
```bash
npm install @myriadjs/core
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