import type { Ref } from 'vue'
import { gsap } from 'gsap'

export function nearestSnapPoint(value: number, snapPoints: number[]) {
  if (snapPoints.length === 0) return value
  return snapPoints.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a))
}

export function switchPoint(value: number, snapPoints: number[], add = 1) {
  const index = snapPoints.indexOf(value)
  const direction = add < 0 ? -1 : 1
  const newPoint = snapPoints[index + direction]
  if (newPoint === undefined) return value
  return newPoint
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function remap(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin
}

interface gsapTo {
  value: Ref<number>
  to: number
}

export function gsapTo({ value, to }: gsapTo) {
  gsap.to(value, {
    value: to,
    duration: 0.2,
    ease: 'power2.inOut'
  })
}
