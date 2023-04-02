import tinycolor from 'tinycolor2'
import { GenScheme, Myriad } from '../store/types'
import { foreground } from '../adjust'
import { moveUntil } from './color'

function isGenerated(scheme: GenScheme | Myriad) {
  return scheme.hasOwnProperty('origin') 
}

function schemeCleaner(scheme: GenScheme | Myriad) {
  return isGenerated(scheme)
    ? (scheme as GenScheme).origin 
    : (scheme as Myriad)
}


function inverseValidator(scheme: Myriad) {
  const fgDark = tinycolor(scheme.foreground).isDark()
  const bgDark = tinycolor(scheme.background).isDark()

  if (fgDark !== bgDark) return {}
  const fg = foreground(scheme)
  if(fg.isDark() !== bgDark) {
    return {
      background: fg.toHexString(),
      foreground: scheme.background
    }
  }

  //Both are same, so we need to adjust something or return a failure of some kind
  console.log("same");

  function createInvertedFlippingReadability() {
    const background = tinycolor(scheme.background)
    const foreground = tinycolor(scheme.foreground)
    const oppositeLightEnd = background.isDark() ? tinycolor('white') : tinycolor('black')
    const currentLightEnd = background.isDark() ? tinycolor('black') : tinycolor('white')
    const readability = tinycolor.readability(background, currentLightEnd)

    return moveUntil({
      color: background,
      contrast: foreground,
      condition: (c) => {
        const diff = tinycolor.readability(c, oppositeLightEnd)
        const within = diff < readability
        return within
      },
    }).toHexString()
  }
  
  return {
    background: createInvertedFlippingReadability(),
    foreground: scheme.foreground
  }
}

function basicInverse(scheme: Myriad): Myriad {
  return {
    ...scheme, 
    background: scheme.foreground,
    foreground: scheme.background,
  }
}

function makeInverse(scheme: Myriad): Myriad {
  const inversed = basicInverse(scheme)
  record.inverse = inversed
  return {...inversed,
    ...inverseValidator(scheme)
  }
}

const record: { scheme?: Myriad, inverse?: Myriad } = {
  scheme: undefined,
  inverse: undefined
}

export const inverse = (scheme: Myriad) => {
  //const cleanScheme = schemeCleaner(scheme)
  record.scheme = scheme

  // //if new scheme === either old/inverse schemes, toggle between them
  // if(record.inverse) {

  //   const isOldScheme = record.scheme === scheme
  //   const isInverseScheme = record.inverse === scheme

  //   const schemeExists = isOldScheme || isInverseScheme

  //   console.log('rex: ', {
  //     isOldScheme,
  //     isInverseScheme,
  //     schemeExists
  //   });
    
  //   // if(record.inverse === cleanScheme) {
  //   //   console.log('toggle scheme: old');
  //   //   return record.scheme
  //   // }
  //   // if(record.scheme === cleanScheme) {
  //   //   console.log('toggle sheme: inverse');
  //   //   return record.inverse
  //   // }
  // }

  //console.log('create sheme: inverse');
  //else generate new inverse scheme

  const output = makeInverse(scheme)

  // console.log('rex i: ', {
  //   output,
  //   scheme
  // });
  
  // console.log('rex i: ', {
  //   inversed: i.foreground,
  //   generated: scheme.foreground,
  // });

  return output
}

export const isDark = (scheme: GenScheme | Myriad) => {
  const origin = schemeCleaner(scheme)
  return tinycolor(origin.background).isDark()
}