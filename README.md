# Styles
We use CSS entirely. No tailwind or SCSS. Vue has a great unified approach to scoping natural CSS to components - so we will use that approach to improve CSS organization in tailwinds place. 
Tailwind is great for teams because it allows us to drop cascading and enforce a standard that's impossible to deviate from. But we are going to be taking advantage of cascading and make our own design systems in CSS that needs lots of flexibility. We also want to stay as close to the style language as possible to guarantee that we can quickly take advantage of all the new CSS stuff - in particular we are planning on taking advantage of the new CSS functions and mixins. This will allow us to make our own style systems that give us lots of flexibility and power.

# CSS Conventions
Our approach to CSS is a sort of modified CUBE/BEM approach. Each element can have two types of classes. Firstly, an element name, and secondly abstracted classes.

## Element Names
- Always PascalCase.
- Should be used to dictate how a particular UI element looks

Example:
```html
  <button class="CounterButton">Count: 0</button>
```

The purpose of an element class is both A - to turn the DOM into a map of the code and B - to control how a UI element looks. A class name should be specific and verbose enough to not be confused with any other element.

## Abstracted Classes
- Always lowercase.
- Should be used to describe more abstract concepts rather than elements. Rounded, border, etc.

Example:
```html
  <div class="UserChip rounded border">User 01</div>
```

The purpose of an abstract class is to act as a sort of shorthand for a common group of CSS properties. But it could also point to 1 proprety - the point is mostly that these should be easily mixed and matched to help build design systems that stay consistent.

## Abstract Mods
- Always camelCase.
- Should be used to modify abstract classes. roundedLg, borderThick, etc.

Example:
```html
  <div class="button buttonMedium buttonText buttonHover buttonActive buttonFocus">User 01</div>
```

The purpose of an abstract mod is to modify an abstract class. They allow you to extend and build on an abstract class with additional optional properties. The clearest example of this, and the birthplace of the consept, is the button. 
The button class is an abstract class which describes an interactable element. This could be a button element but it might be a link or an input, etc. Thats why making it an abstract class makes sense. From here we can group CSS properties related to the states or variants of that button class. Like buttonText, buttonHover, buttonActive, buttonFocus. This allows us to build a design system for buttons that is consistent and easy to use where you can easily reuse the same styles for interaction while also picking and choosing which part of that style you want or don't want. For instance, maybe a chip should look like a button but without the hover or active states because the interaction with that chip happens at the right section of the chip. So you can just leave those classes off the while chip and only add them to the button inside the chip.
These mods don't just describe state, they can also describe size or color scheme. For instance, buttonText describes the text style of buttons, which allows you to use just the button syles but not button text styles - usefull for inputs for instance. Inputs should look like buttons but the internal text is different. Or buttonMedium, buttonSmall, buttonMini - these describe the size of the button. Or buttonPrimary, buttonSecondary, buttonBase - these modify the CSS of the button to describe different variants that denote how important the button is in the context of the UI.

## Token Conversions
We build everything on top of tokens. For the color ranges we also have token inversions that let us redefine one token into another. For instance base-accent takes all the --base colors and assigns them to --accent colors. This gives you a quick way to switch the colors of an entire element or section. 

- Always kebab-case.
- Should be used to convert one token range to another.
Example:
```html
  <div class="card base-warning">
    <h2 class="heading">Warning Card Title</h2>
    <p class="body">Warning Card body text</p>
    <button class="button buttonMedium buttonPrimary">Warning Action</button>
  </div>
```
