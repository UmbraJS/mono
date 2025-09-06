<script setup lang="ts">
import { Button } from '@nobel/core'
import { unified, type Processor } from 'unified'
import type { MDCRoot } from '@nuxtjs/mdc'
import remarkParse from 'remark-parse'
import remarkMdc, { stringifyFrontMatter } from 'remark-mdc'

import remarkRehype from 'remark-rehype'

// import rehype from 'rehype'
import gfm from 'remark-gfm'

import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import stringify from 'remark-stringify'
import { h, createApp } from 'vue'
import { mdcRemark } from '../MDC/mdc-remark'

function createStringifyProcessor() {
  return unified()
    .use(function jsonParser(this: Processor) {
      this.parser = function (root: string) {
        return JSON.parse(root)
      }
    })
    .use(mdcRemark)
    .use(gfm)
    .use(remarkMdc)
    .use(stringify, {
      bullet: '-',
      emphasis: '*',
      rule: '-',
      listItemIndent: 'one',
      fence: '`',
      fences: true,
    })
}

function createMarkdownStringifier() {
  const processor = createStringifyProcessor()

  async function stringify(value: any, data: Record<string, any> = {}): Promise<string> {
    const result = await processor.process({ value: JSON.stringify(value) })

    // Stringify front matter returns empty string if no data is provided
    if (Object.keys(data).length) {
      return stringifyFrontMatter(data, result.value as string)
    }

    return result.value as string
  }

  return stringify
}

async function stringifyMarkdown(MDCAst: MDCRoot, data: Record<string, any>) {
  const processor = createMarkdownStringifier()
  if (!MDCAst) return null
  return await processor(MDCAst, data)
}

// Function to parse and transform MDC
async function parseMDC(md: string) {
  const processor = await unified()
    .use(remarkParse)
    .use(remarkMdc)
    .use(rehypeRaw)
    .use(stringify, {
      bullet: '-',
      emphasis: '*',
      rule: '-',
      listItemIndent: 'one',
      fence: '`',
      fences: true,
    })
    .process(md)

  return processor
}

async function pmdc(md: string) {
  const file = await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(md)
  return file
}

// Function to render the parsed MDC with provided components
function renderMDC(md: string) {
  const parsed = parseMDC(md)

  // Create a Vue component to render the parsed MDC
  // const RenderComponent = {
  //   render() {
  //     return h('div', {}, parsed)
  //   },
  // }
}

// function renderApp() {
//       // Create a Vue app with the provided components
//   const app = createApp(RenderComponent);
//   Object.entries(components).forEach(([name, component]) => {
//     app.component(name, component);
//   });

//   // Mount the app to a DOM element
//   const container = document.createElement('div');
//   app.mount(container);

//   return container.innerHTML;
// }

async function onClick() {
  const file = parseMDC('# Hello, world!')
  const processor = createStringifyProcessor()
  const mmd = await processor.process('# Hello, world!')
  console.log('rex: ', mmd)
}
</script>

<template>
  <Button @click="onClick">click parse</Button>
</template>

<style lang="scss"></style>
