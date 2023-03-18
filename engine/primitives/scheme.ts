// import tinycolor from 'tinycolor2'
// import { 
//   converseLuminance,
//   isDark
// } from './color'
// import { rootScheme } from '..'

// export const converseScheme = (scheme, generated, setDarkTheme) => {
//   Returns a scheme which is themed in the opposite way from the passed scheme. 
//   Ergo, dark theme = light theme, light theme = dark theme
//   var bg = tinycolor(generated.background?.color)
//   var fg = tinycolor(generated.foreground?.color)
//   let bgDark = bg.isDark()
//   let fgDark = fg.isDark()

//   if (bgDark === fgDark) {
//     setDarkTheme(!bgDark)
//     return {
//       ...scheme,
//       background: converseLuminance(bg.toHexString()),
//       foreground: converseLuminance(fg.toHexString()),
//     }
//   } else {
//     setDarkTheme(!bgDark)
//     return {
//       ...scheme,
//       background: fg.toHexString(),
//       foreground: bg.toHexString(),
//     }
//   }
// }

// export const themeIsDark = (scheme) => {
//   return isDark(rootScheme(scheme)?.background?.color)
// }

export {}