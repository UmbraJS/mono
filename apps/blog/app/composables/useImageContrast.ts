import { ref, watch } from 'vue'

// Function to calculate luminance from RGB values
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Function to determine if image bottom is light or dark
function analyzeImageBottom(img: HTMLImageElement): boolean {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return false

    // Sample a small area from the bottom quarter of the image
    const sampleHeight = Math.floor(img.height / 4)
    canvas.width = img.width
    canvas.height = sampleHeight

    ctx.drawImage(
      img,
      0, img.height - sampleHeight, // source x, y (bottom quarter)
      img.width, sampleHeight,      // source width, height
      0, 0,                          // dest x, y
      img.width, sampleHeight        // dest width, height
    )

    // Get average color of the sampled area
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let r = 0, g = 0, b = 0, count = 0

    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i]
      g += pixels[i + 1]
      b += pixels[i + 2]
      count++
    }

    r = Math.floor(r / count)
    g = Math.floor(g / count)
    b = Math.floor(b / count)

    const luminance = getLuminance(r, g, b)
    return luminance > 0.5 // true if light, false if dark
  } catch (error) {
    console.warn('Could not analyze image due to CORS:', error)
    return false
  }
}

export function useImageContrast(imageEl: Ref<HTMLImageElement | null>) {
  const umbra = useUmbra()
  const contrastColor = ref<string>('var(--base-text)')

  function calculateContrastColor(img: HTMLImageElement) {
    const imageIsLight = analyzeImageBottom(img)
    const isDarkTheme = umbra.isDark

    // Logic: text should contrast with image bottom
    if (isDarkTheme) {
      contrastColor.value = imageIsLight ? 'var(--base)' : 'var(--base-text)'
    } else {
      contrastColor.value = imageIsLight ? 'var(--base-text)' : 'var(--base)'
    }
  }

  function setupImageAnalysis() {
    if (!imageEl.value) return

    const img = imageEl.value

    // Set crossorigin to avoid CORS issues
    if (!img.crossOrigin) {
      img.crossOrigin = 'anonymous'
      // If image is already loaded, reload it with crossOrigin set
      if (img.complete) {
        const src = img.src
        img.src = ''
        img.src = src
        img.addEventListener('load', () => {
          calculateContrastColor(img)
        }, { once: true })
        return
      }
    }

    // Wait for image to load before analyzing
    if (img.complete) {
      calculateContrastColor(img)
    } else {
      img.addEventListener('load', () => calculateContrastColor(img))
    }
  }

  // Watch for theme changes and recalculate
  watch(() => umbra.isDark, () => {
    if (!imageEl.value) return
    calculateContrastColor(imageEl.value)
  })

  // Watch for image element changes
  watch(imageEl, (newImg) => {
    if (!newImg) return
    setupImageAnalysis()
  }, { immediate: true })

  return {
    contrastColor,
    setupImageAnalysis
  }
}
