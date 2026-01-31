import CheckIcon from '@iconify-icons/mdi/check'
import CloseIcon from '@iconify-icons/mdi/close'
import { createSignal, onCleanup, onMount, Show, splitProps } from 'solid-js'
import { mergeClasses } from '../utils'
import { Icon } from './Icon'
import styles from './Switch.module.css'
import type { ComponentProps, ParentComponent } from 'solid-js'

export interface SwitchProps
	extends Omit<ComponentProps<'input'>, 'type' | 'onChange'> {
	checked?: boolean
	onChange?: (checked: boolean) => void
	icons?: 'checked' | 'both' | 'none'
}

export const Switch: ParentComponent<SwitchProps> = props => {
	const [local, others] = splitProps(props, [
		'checked',
		'onChange',
		'disabled',
		'icons',
		'class',
	])
	const [startX, setStartX] = createSignal<number | undefined>()

	const handleMouseUp = (e: MouseEvent) => {
		const start = startX()
		if (start === undefined) return

		const distance = e.clientX - start
		if (distance > 16 && !local.checked) {
			local.onChange?.(true)
		}
		if (distance < -16 && local.checked) {
			local.onChange?.(false)
		}
		setStartX(undefined)
	}

	onMount(() => {
		window.addEventListener('pointerup', handleMouseUp)

		onCleanup(() => {
			window.removeEventListener('pointerup', handleMouseUp)
		})
	})

	return (
		<div
			role="none"
			class={mergeClasses(styles.container, local.class)}
			onPointerDown={e => {
				if (!local.disabled) {
					setStartX(e.clientX)
				}
			}}
			onDragStart={e => {
				e.preventDefault()
			}}
		>
			<input
				type="checkbox"
				role="switch"
				aria-checked={local.checked}
				disabled={local.disabled}
				checked={local.checked}
				onChange={e => local.onChange?.(e.currentTarget.checked)}
				{...others}
				onKeyDown={e => {
					if (e.code === 'Enter') local.onChange?.(!local.checked)
					if (e.code === 'ArrowLeft') local.onChange?.(false)
					if (e.code === 'ArrowRight') local.onChange?.(true)
				}}
			/>
			<div class={styles.handle}>
				<Show when={local.icons !== 'none'}>
					<Icon icon={CheckIcon} size={16} class={styles.iconChecked} />
				</Show>
				<Show when={local.icons === 'both'}>
					<Icon icon={CloseIcon} size={16} class={styles.iconUnchecked} />
				</Show>
			</div>
			<div class={styles.hover}></div>
		</div>
	)
}
