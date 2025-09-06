import { buttonVariants } from '../components/ui/Button/variants/index'

export interface NobleButton {
    variant?: keyof typeof buttonVariants
    disabled?: boolean
    size?: ButtonSize
    color?: ButtonColor
    type?: HTMLButtonElement['type']
}

export type ButtonSize = 'medium' | 'small' | 'mini'
export type ButtonColor = 'warning' | 'success' | 'default'
