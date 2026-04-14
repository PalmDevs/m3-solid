import { onCleanup, onMount, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { mergeClasses } from '../../utils'
import { Icon } from '../Icon'
import styles from './NavigationRailItem.module.css'
import type { IconifyIcon } from '@iconify/types'
import type { ComponentProps } from 'solid-js'

interface NavigationRailItemBaseProps {
	label: string
	icon: IconifyIcon
	active?: boolean
}

export type NavigationRailItemProps =
	| (NavigationRailItemBaseProps &
			ComponentProps<'button'> & { href?: undefined })
	| (NavigationRailItemBaseProps & ComponentProps<'a'> & { href: string })

export const NavigationRailItem = (props: NavigationRailItemProps) => {
	const [local, others] = splitProps(props, [
		'label',
		'icon',
		'active',
		'class',
		'href',
	])

	let ref: HTMLAnchorElement | HTMLButtonElement | undefined
	let pill: HTMLDivElement | undefined

	const isLink = () => local.href !== undefined

	onMount(() => {
		const triggerPill = () => pill?.click()

		ref?.addEventListener('click', triggerPill)
		onCleanup(() => ref?.removeEventListener('click', triggerPill))
	})

	return (
		// @ts-expect-error: Dynamic component with conditional tag
		<Dynamic
			ref={ref}
			component={isLink() ? 'a' : 'button'}
			type={isLink() ? undefined : 'button'}
			href={local.href}
			class={mergeClasses(
				'm3-container',
				styles.inner,
				local.active && styles.active,
				local.class,
			)}
			role="menuitem"
			{...others}
		>
			<div
				ref={pill}
				aria-hidden="true"
				class={mergeClasses(styles.pill, 'm3-ripple')}
			/>
			<div class={styles.icon}>
				<Icon icon={local.icon} />
			</div>
			<span class={mergeClasses(styles.labelCollapsed, 'm3-label-medium')}>
				{local.label}
			</span>
			<span
				class={mergeClasses(styles.labelExpanded, 'm3-label-large')}
				aria-hidden="true"
			>
				{local.label}
			</span>
		</Dynamic>
	)
}
