import {
	createEffect,
	createSignal,
	For,
	mergeProps,
	onMount,
	splitProps,
} from 'solid-js'
import { mergeClasses } from '../../utils'
import styles from './Tabs.module.css'
import type { Component, JSXElement } from 'solid-js'

export interface TabLinkItem {
	label: JSXElement
	href: string
}

export interface TabsLinkProps {
	tabs: TabLinkItem[]
	activeHref?: string
	scrollable?: boolean
	class?: string
}

export const TabsLink: Component<TabsLinkProps> = props => {
	const merged = mergeProps({ scrollable: false }, props)
	const [local] = splitProps(merged, [
		'tabs',
		'activeHref',
		'scrollable',
		'class',
	])

	const [selectedIndex, setSelectedIndex] = createSignal(0)
	let containerRef: HTMLDivElement | undefined
	let barRef: HTMLSpanElement | undefined

	// Find selected index from activeHref prop
	createEffect(() => {
		if (local.activeHref) {
			const idx = local.tabs.findIndex(t => t.href === local.activeHref)
			if (idx >= 0) {
				setSelectedIndex(idx)
				updateBarPosition(idx)
			}
		}
	})

	const getBarKeyframeOptions = (): KeyframeAnimationOptions => {
		return {
			duration: 350,
			easing: getComputedStyle(barRef!).getPropertyValue(
				'transition-timing-function',
			),
			fill: 'forwards',
		}
	}

	const updateBarPosition = (index: number, animate = true) => {
		if (containerRef && barRef) {
			if (local.scrollable) {
				const links = containerRef.querySelectorAll('a')
				const link = links[index] as HTMLElement
				if (link) {
					if (animate) {
						barRef.animate(
							{ left: `${link.offsetLeft}px`, width: `${link.offsetWidth}px` },
							getBarKeyframeOptions(),
						)
					} else {
						barRef.style.left = `${link.offsetLeft}px`
						barRef.style.width = `${link.offsetWidth}px`
					}
				}

				containerRef.scrollTo({
					behavior: 'smooth',
					left:
						link.offsetLeft -
						containerRef.clientWidth / 2 +
						link.clientWidth / 2,
				})
			} else {
				const tabWidth = 100 / local.tabs.length
				if (animate) {
					barRef.animate(
						{ left: `${index * tabWidth}%` },
						getBarKeyframeOptions(),
					)
				} else {
					barRef.style.left = `${index * tabWidth}%`
					barRef.style.width = `${tabWidth}%`
				}
			}
		}
	}

	onMount(() => {
		updateBarPosition(selectedIndex(), false)
	})

	return (
		<div
			ref={containerRef}
			class={mergeClasses(
				'm3-container',
				local.scrollable ? styles.containerScrollable : styles.container,
				local.class,
			)}
			style={{ '--tab-count': local.tabs.length }}
			role="tablist"
		>
			<For each={local.tabs}>
				{(tab, index) => (
					<a
						href={tab.href}
						class={mergeClasses(
							'm3-ripple',
							styles.tab,
							selectedIndex() === index() && styles.selected,
						)}
						style={{ '--i': index() }}
						role="tab"
						aria-selected={selectedIndex() === index()}
					>
						{tab.label}
					</a>
				)}
			</For>
			<span
				ref={barRef}
				class={local.scrollable ? styles.barScrollable : styles.bar}
			/>
		</div>
	)
}
