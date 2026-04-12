import { mergeProps, Show, splitProps } from 'solid-js'
import { mergeClasses } from '../utils'
import styles from './Chip.module.css'
import { Icon } from './Icon'
import type { IconifyIcon } from '@iconify/types'
import type { Component, JSX } from 'solid-js'

type ChipVariant = 'input' | 'assist' | 'general'

export interface ChipProps {
	variant?: ChipVariant
	icon?: IconifyIcon
	trailingIcon?: IconifyIcon
	elevated?: boolean
	selected?: boolean
	href?: string
	labelFor?: string
	onClick?: () => void
	disabled?: boolean
	class?: string
	children?: JSX.Element
}

export const Chip: Component<ChipProps> = props => {
	const merged = mergeProps({ variant: 'general' as ChipVariant }, props)
	const [local] = splitProps(merged, [
		'variant',
		'icon',
		'trailingIcon',
		'elevated',
		'selected',
		'href',
		'labelFor',
		'children',
		'class',
		'onClick',
		'disabled',
	])

	const classNames = () =>
		mergeClasses(
			styles.container,
			'm3-ripple',
			styles[`variant-${local.variant}`],
			'm3-focus-inward',
			local.elevated && styles.elevated,
			local.selected && styles.selected,
			local.class,
		)

	const content = (
		<>
			<Show when={local.icon}>
				<span class={styles.icon}>
					<Icon icon={local.icon!} size={18} />
				</span>
			</Show>
			<span class={styles.label}>{local.children}</span>
			<Show when={local.trailingIcon}>
				<span class={styles.trailingIcon}>
					<Icon icon={local.trailingIcon!} size={18} />
				</span>
			</Show>
		</>
	)

	return (
		<Show
			when={local.href}
			fallback={
				<Show
					when={local.labelFor}
					fallback={
						<button
							type="button"
							class={classNames()}
							onClick={local.onClick}
							disabled={local.disabled}
						>
							{content}
						</button>
					}
				>
					<label class={classNames()} for={local.labelFor}>
						{content}
					</label>
				</Show>
			}
		>
			<a href={local.href} class={classNames()}>
				{content}
			</a>
		</Show>
	)
}
