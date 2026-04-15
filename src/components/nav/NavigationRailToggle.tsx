import MenuIcon from '@iconify-icons/mdi/menu'
import MenuOpenIcon from '@iconify-icons/mdi/menu-open'
import { splitProps } from 'solid-js'
import { mergeClasses } from '../../utils'
import { Button } from '../buttons/Button'
import styles from './NavigationRailToggle.module.css'
import type { Component, JSX } from 'solid-js'
import type { ButtonProps } from '../buttons/Button'

export type NavigationRailToggleMode = 'detached' | 'inline' | 'inline-detached'

export interface NavigationRailToggleProps
	extends Omit<
		Extract<ButtonProps, JSX.HTMLAttributes<HTMLButtonElement>>,
		'iconType' | 'onChange'
	> {
	open: boolean
	onChange: (open: boolean) => void
	mode?: NavigationRailToggleMode
}

export const NavigationRailToggle: Component<
	NavigationRailToggleProps
> = props => {
	const [local, others] = splitProps(props, [
		'open',
		'onChange',
		'mode',
		'class',
	])

	const mode = () => local.mode ?? 'detached'

	const shouldHaveId = () => {
		if (mode() === 'detached') return !local.open
		if (mode() === 'inline-detached') return local.open
		return true // 'inline'
	}

	return (
		<Button
			variant="text"
			size="m"
			icon={local.open ? MenuOpenIcon : MenuIcon}
			iconType="only"
			id={shouldHaveId() ? 'm3-navigationtoggle' : undefined}
			class={mergeClasses(
				styles.toggle,
				mode() !== 'inline' && styles.detached,
				mode() === 'inline-detached' && styles.inline,
				local.open && styles.open,
			)}
			aria-haspopup="true"
			aria-controls="menu"
			onClick={() => local.onChange(!local.open)}
			{...others}
		/>
	)
}
