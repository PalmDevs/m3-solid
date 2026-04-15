import { mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js'
import { mergeClasses } from '../../utils'
import styles from './NavigationRail.module.css'
import { NavigationRailToggle } from './NavigationRailToggle'
import type { ComponentProps, JSXElement, ParentComponent } from 'solid-js'

export interface NavigationRailProps
	extends Omit<ComponentProps<'nav'>, 'onChange'> {
	open: boolean
	onChange: (open: boolean) => void
	collapse?: 'normal' | 'full' | 'no' | boolean
	modal?: boolean
	alignment?: 'top' | 'center'
	iconType?: 'left' | 'full'
	fill?: boolean
	fab?: (open: boolean) => JSXElement
}

export const NavigationRail: ParentComponent<NavigationRailProps> = props => {
	const merged = mergeProps(
		{
			collapse: 'normal' as const,
			modal: false,
			alignment: 'top' as const,
			iconType: 'left' as const,
			fill: false,
		},
		props,
	)

	const [local, others] = splitProps(merged, [
		'open',
		'onChange',
		'collapse',
		'modal',
		'alignment',
		'iconType',
		'fill',
		'fab',
		'children',
		'class',
	])

	const showCollapse = () => local.collapse !== 'no' && local.collapse !== false
	const isFull = () => local.collapse === 'full'

	const handleKeydown = (e: KeyboardEvent) => {
		if (local.modal && local.open && e.key === 'Escape') {
			e.preventDefault()
			local.onChange(false)
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown)
		onCleanup(() => window.removeEventListener('keydown', handleKeydown))
	})

	return (
		<div class={mergeClasses('m3-container', styles.wrapper)}>
			<nav
				class={mergeClasses(
					styles.rail,
					local.open && styles.open,
					local.alignment === 'center' && styles.centered,
					isFull() && styles.collapse,
					local.iconType === 'full' && styles.icon,
					local.modal && styles.modal,
					local.class,
				)}
				data-rail-open={String(local.open)}
				data-rail-icon={String(local.iconType === 'full')}
				data-rail-fill={String(local.fill)}
				{...others}
			>
				<Show when={showCollapse() || local.fab}>
					<div class={styles.top}>
						<Show when={showCollapse()}>
							<NavigationRailToggle
								mode={isFull() ? 'inline-detached' : 'inline'}
								open={local.open}
								onChange={local.onChange}
							/>
						</Show>
						<Show when={local.fab}>
							<div>{local.fab!(local.open)}</div>
						</Show>
					</div>
				</Show>

				<div
					class={styles.items}
					role="menu"
					aria-labelledby="m3-navigationtoggle"
				>
					{local.children}
				</div>
			</nav>

			<Show when={local.modal}>
				<div
					aria-hidden="true"
					class={styles.backdrop}
					onClick={() => local.onChange(false)}
				/>
			</Show>
		</div>
	)
}
