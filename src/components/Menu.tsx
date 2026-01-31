import { mergeClasses } from '../utils'
import styles from './Menu.module.css'
import type { ComponentProps, ParentComponent } from 'solid-js'

export interface MenuProps extends ComponentProps<'div'> {}

export const Menu: ParentComponent<MenuProps> = props => {
	return (
		<div
			class={mergeClasses('m3-container', styles.container, props.class)}
			{...props}
		>
			{props.children}
		</div>
	)
}
