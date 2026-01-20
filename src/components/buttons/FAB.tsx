import { mergeProps, Show, splitProps } from 'solid-js'
import { mergeClasses } from '../../utils'
import { Icon } from '../Icon'
import styles from './FAB.module.css'
import type { IconifyIcon } from '@iconify/types'
import type { Component, JSX, JSXElement } from 'solid-js'

type FABSize = 'small' | 'normal' | 'medium' | 'large'
type FABColor =
	| 'primary-container'
	| 'secondary-container'
	| 'tertiary-container'
	| 'primary'
	| 'secondary'
	| 'tertiary'
type FABElevation = 'normal' | 'lowered' | 'none'

export interface FABProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: IconifyIcon
	text?: JSXElement
	size?: FABSize
	color?: FABColor
	elevation?: FABElevation
}

const getIconSize = (size: FABSize) => {
	switch (size) {
		case 'large':
			return 36
		case 'medium':
			return 28
		default:
			return 24
	}
}

export const FAB: Component<FABProps> = props => {
	const merged = mergeProps(
		{
			size: 'normal' as FABSize,
			color: 'primary' as FABColor,
			elevation: 'normal' as FABElevation,
		},
		props,
	)
	const [local, others] = splitProps(merged, [
		'icon',
		'text',
		'size',
		'color',
		'elevation',
		'class',
	])

	const classNames = () =>
		mergeClasses(
			'm3-container',
			'm3-ripple',
			styles.container,
			styles[`size-${local.size}`],
			styles[`color-${local.color}`],
			styles[`elevation-${local.elevation}`],
			local.class,
		)

	return (
		<button type="button" class={classNames()} {...others}>
			<Show when={local.icon}>
				<Icon icon={local.icon!} size={getIconSize(local.size)} />
			</Show>
			<Show when={local.text}>{local.text}</Show>
		</button>
	)
}
