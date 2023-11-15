<script lang="ts" setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const hero = ref<HTMLElement>()
const logo = ref<HTMLElement>()
const circle = ref<HTMLElement>()
const content = ref<HTMLElement>()

onMounted(() => {
  if (!process.client) return

  if (!hero.value) return
  gsap.to(hero.value, {
    y: 400,
    scrollTrigger: {
      trigger: hero.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  if (!logo.value) return
  gsap.to(logo.value, {
    rotate: 360,
    width: '80rem',
    scrollTrigger: {
      trigger: hero.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  if (!circle.value) return
  gsap.to(circle.value, {
    y: 400,
    scrollTrigger: {
      trigger: hero.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  if (!content.value) return
  gsap.to(content.value, {
    y: -700,
    scrollTrigger: {
      trigger: hero.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
})
</script>

<template>
  <div ref="circle" class="circle" />
  <div ref="hero" class="hero">
    <div ref="logo" class="umbra-logo">
      <Logo />
    </div>
    <div ref="content" class="content">
      <ProseH1>Umbra</ProseH1>
      <ProseP>A theme management library to rule them all</ProseP>
      <ProseP>
        Makes it easy to modify and manage your theme. Switch between themes. Change theme.
        Automatic dark/light mode. Monitor theme accessibility with the cutting edge standards of
        APCA. Perfect parity with radix-colors.
      </ProseP>
      <ProseP>
        Start simple and scale theme complexity infinitely without any friction. You can decide to
        theme every element on your site differently at a moments notice without any need to
        reorganize anything at all. Just plug and play. Scale to infinity.
      </ProseP>
      <ProseP>
        Boss-man randomly wants to be able to dynamically change the color of that one card? Done.
        Need more extreme variant in theming customisations? Then use a color alias layer that lets
        you get as complex as you want.
      </ProseP>
      <ProseP>
        Or keep it all super simple, umbra lets you manage it all from a single source and very
        quickly. Change a color and watch the other colors adjust themselves to your change instead
        of having to manually shift everything every time you need to change something.
      </ProseP>
      <ProseP>
        It's more than just a theme generator, its a theme manager. The generation part is just the
        backdrop that makes adjustments quick and easy to do. You can can manually dictate
        everything yourself if and when you need to.
      </ProseP>
      <ProseP>
        Start simple, get as complex as you want, scale infinitely. And if you decide you no longer
        want Umbra, removing it is as easy as copying the output and pasting it yourself. You are
        never locked into this library. This way Umbra will always be a safe bet for the future.
      </ProseP>
    </div>
  </div>
</template>

<style scoped>
.umbra-logo {
  width: 8rem;
}

.circle {
  position: absolute;
  left: 0px;
  top: -87vw;
  height: 100vw;
  width: 100vw;
  background: var(--background);
  border-radius: 60rem;
  box-shadow: 0px 100px 160px 27px var(--background);
}
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding-bottom: 12rem;
  height: 100vh;
}
</style>
