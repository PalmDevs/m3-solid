import { mergeProps, Show, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { mergeClasses } from '../../utils'
import { Icon } from '../Icon'
import styles from './Button.module.css'
import type { IconifyIcon } from '@iconify/types'
import type { ComponentProps, ParentComponent } from 'solid-js'

export type ButtonVariant =
	| 'elevated'
	| 'filled'
	| 'tonal'
	| 'outlined'
	| 'text'
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'
export type IconType = 'left' | 'only'

interface CommonButtonProps {
	variant?: ButtonVariant
	size?: ButtonSize
	icon?: IconifyIcon
	/**
	 * - `left`: Icon on the left side of the button text
	 * - `only`: Icon only button
	 */
	iconType?: IconType
	square?: boolean
}

export type ButtonProps =
	| (CommonButtonProps &
			ComponentProps<'button'> & {
				href?: undefined
			})
	| (CommonButtonProps &
			ComponentProps<'a'> & {
				href: string
			})

const getButtonIconSize = (size: ButtonSize) => {
	switch (size) {
		case 'xs':
			return 20
		case 's':
			return 20
		case 'm':
			return 24
		case 'l':
			return 32
		case 'xl':
			return 40
	}
}

const getButtonTextSize = (size: ButtonSize) => {
	switch (size) {
		case 'xs':
			return 'm3-label-large'
		case 's':
			return 'm3-label-large'
		case 'm':
			return 'm3-title-medium'
		case 'l':
			return 'm3-headline-small'
		case 'xl':
			return 'm3-headline-large'
	}
}

// TODO: On-by-default prop for corner radius change effect on tap
export const Button: ParentComponent<ButtonProps> = props => {
	const merged = mergeProps(
		{
			variant: 'filled' as ButtonVariant,
			size: 's' as ButtonSize,
			square: false,
		} satisfies Partial<ButtonProps>,
		props,
	)

	const [local, others] = splitProps(merged, [
		'variant',
		'size',
		'icon',
		'iconType',
		'square',
		'href',
		'type',
		'children',
		'class',
	])

	const classNames = () =>
		mergeClasses(
			'm3-container',
			'm3-ripple',
			getButtonTextSize(local.size),
			styles.container,
			styles[local.size],
			styles[local.variant],
			local.iconType !== 'left' && styles[`icon-${local.iconType}`],
			local.square && styles.square,
			local.class,
		)

	return (
		// @ts-expect-error: Too lazy
		<Dynamic
			component={props.href ? 'a' : 'button'}
			type={props.href ? undefined : local.type || 'button'}
			href={local.href}
			class={classNames()}
			{...others}
		>
			<Show when={local.iconType !== 'left' && local.icon}>
				<Icon icon={local.icon!} size={getButtonIconSize(local.size)} />
			</Show>
			{local.children}
		</Dynamic>
	)
}
