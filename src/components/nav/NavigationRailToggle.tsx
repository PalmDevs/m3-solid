import iconMenuOpen from '@iconify-icons/mdi/menu-open'
import iconMenu from '@iconify-icons/mdi/menu'
import { mergeClasses } from '../../utils'
import { Icon } from '../Icon'
import styles from './NavigationRailToggle.module.css'
import type { Component } from 'solid-js'

export type NavigationRailToggleMode = 'detached' | 'inline' | 'inline-detached'

export interface NavigationRailToggleProps {
	open: boolean
	onChange: (open: boolean) => void
	mode?: NavigationRailToggleMode
}

export const NavigationRailToggle: Component<
	NavigationRailToggleProps
> = props => {
	const mode = () => props.mode ?? 'detached'

	const shouldHaveId = () => {
		if (mode() === 'detached') return !props.open
		if (mode() === 'inline-detached') return props.open
		return true // 'inline'
	}

	return (
		<button
			class={mergeClasses(
				styles.toggle,
				mode() !== 'inline' && styles.detached,
				mode() === 'inline-detached' && styles.inline,
				props.open && styles.open,
			)}
			id={shouldHaveId() ? 'm3-navigationtoggle' : undefined}
			title={props.open ? 'Close menu' : 'Open menu'}
			type="button"
			aria-haspopup="true"
			aria-controls="menu"
			onClick={() => props.onChange(!props.open)}
		>
			<Icon icon={props.open ? iconMenuOpen : iconMenu} size={24} />
		</button>
	)
}
