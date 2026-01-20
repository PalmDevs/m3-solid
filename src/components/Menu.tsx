import { mergeClasses } from '../utils'
import styles from './Menu.module.css'
import type { JSX, ParentComponent } from 'solid-js'

export interface MenuProps extends JSX.HTMLAttributes<HTMLDivElement> {}

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
