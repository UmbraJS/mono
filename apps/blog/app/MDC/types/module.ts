import type {
  BundledLanguage,
  BundledTheme,
  LanguageRegistration,
  ThemeRegistrationAny,
} from 'shiki'
import type { MdcThemeOptions } from './highlighter'

export interface UnistPlugin {
  src?: string
  options?: Record<string, any>
}

export interface ModuleOptions {
  /**
   * A map of remark plugins to be used for processing markdown.
   */
  remarkPlugins?: Record<string, UnistPlugin | false>
  /**
   * A map of remark plugins to be used for processing markdown.
   */
  rehypePlugins?: Record<string, UnistPlugin | false>

  highlight?:
    | {
        /**
         * The highlighter to be used for highlighting code blocks.
         *
         * Set to `custom` to provide your own highlighter function in `mdc.config.ts`.
         * Set to `shiki` to use the builtin highlighter based on Shiki.
         * Or provide the path to your own highlighter module with the default export.
         *
         * @default 'shiki'
         */
        highlighter?: 'shiki' | 'custom' | string

        /**
         * Default theme that will be used for highlighting code blocks.
         */
        theme?: MdcThemeOptions

        /**
         * Languages to be bundled loaded by Shiki
         *
         * All languages used has to be included in this list at build time, to create granular bundles.
         *
         * Unlike the `preload` option, when this option is provided, it will override the default languages.
         *
         * @default ['js','jsx','json','ts','tsx','vue','css','html','bash','md','mdc','yaml']
         */
        langs?: (BundledLanguage | LanguageRegistration)[]

        /**
         * Additional themes to be bundled loaded by Shiki
         */
        themes?: (BundledTheme | ThemeRegistrationAny)[]

        /**
         * Engine to be used for Shiki
         *
         * Note that the `javascript` engine still in experimental, use with caution.
         *
         * @see https://shiki.style/guide/regex-engines
         * @default 'oniguruma'
         */
        shikiEngine?: 'oniguruma' | 'javascript'

        /**
         * Preloaded languages that will be available for highlighting code blocks.
         *
         * @deprecated use `langs` instead.
         */
        preload?: string[]

        /**
         * Inject background color to code block wrapper
         *
         * @default false
         */
        wrapperStyle?: boolean | string

        noApiRoute?: boolean
      }
    | false

  headings?: {
    anchorLinks?:
      | {
          [heading in 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6']?: boolean
        }
      | boolean
  }

  keepComments?: boolean

  components?: {
    prose?: boolean
    map?: Record<string, string>
  }
}
