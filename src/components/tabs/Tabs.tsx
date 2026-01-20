import {
	createEffect,
	createSignal,
	createUniqueId,
	For,
	mergeProps,
	onMount,
	splitProps,
} from 'solid-js'
import { mergeClasses } from '../../utils'
import styles from './Tabs.module.css'
import type { ParentComponent } from 'solid-js'

// TODO: Icon

export interface TabItem {
	label: string
	value: string
}

export interface TabsProps {
	tabs: TabItem[]
	value?: string
	onChange?: (value: string) => void
	scrollable?: boolean
	name?: string
	class?: string
}

export const Tabs: ParentComponent<TabsProps> = props => {
	const merged = mergeProps({ scrollable: false }, props)
	const [local, _others] = splitProps(merged, [
		'tabs',
		'value',
		'onChange',
		'scrollable',
		'name',
		'class',
		'children',
	])

	const groupName = local.name || createUniqueId()
	const [selectedIndex, setSelectedIndex] = createSignal(0)
	let containerRef: HTMLDivElement | undefined
	let barRef: HTMLSpanElement | undefined

	// Find selected index from value prop
	createEffect(() => {
		if (local.value) {
			const idx = local.tabs.findIndex(t => t.value === local.value)
			if (idx >= 0) setSelectedIndex(idx)
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

	const handleChange = (value: string, index: number) => {
		setSelectedIndex(index)
		local.onChange?.(value)

		if (containerRef && barRef) {
			const buttons = containerRef.querySelectorAll('label')
			const button = buttons[index] as HTMLElement
			if (button) {
				if (local.scrollable) {
					barRef.animate(
						{
							left: `${button.offsetLeft}px`,
							width: `${button.offsetWidth}px`,
						},
						getBarKeyframeOptions(),
					)
				} else {
					const tabWidth = 100 / local.tabs.length
					barRef.animate(
						{ left: `${index * tabWidth}%` },
						getBarKeyframeOptions(),
					)
				}
			}

			containerRef.scrollTo({
				behavior: 'smooth',
				left:
					button.offsetLeft -
					containerRef.clientWidth / 2 +
					button.clientWidth / 2,
			})
		}
	}

	onMount(() => {
		if (containerRef && barRef) {
			if (local.scrollable) {
				const buttons = containerRef.querySelectorAll('label')
				const button = buttons[selectedIndex()] as HTMLElement
				if (button) {
					barRef.style.left = `${button.offsetLeft}px`
					barRef.style.width = `${button.offsetWidth}px`
				}
			} else {
				const tabWidth = 100 / local.tabs.length
				barRef.style.left = `${selectedIndex() * tabWidth}%`
				barRef.style.width = `${tabWidth}%`
			}
		}
	})

	return (
		<div
			ref={containerRef}
			class={mergeClasses(
				'm3-container',
				local.scrollable ? styles.containerScrollable : styles.container,
				local.class,
			)}
			role="tablist"
		>
			<For each={local.tabs}>
				{(tab, index) => (
					<label
						class={mergeClasses(
							'm3-ripple',
							styles.tab,
							selectedIndex() === index() && styles.selected,
						)}
						style={{ '--i': index() }}
					>
						<input
							type="radio"
							name={groupName}
							value={tab.value}
							checked={selectedIndex() === index()}
							onChange={() => handleChange(tab.value, index())}
							class={styles.input}
						/>
						{tab.label}
					</label>
				)}
			</For>
			<span
				ref={barRef}
				class={local.scrollable ? styles.barScrollable : styles.bar}
			/>
		</div>
	)
}
