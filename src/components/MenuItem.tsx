import { Show, splitProps } from 'solid-js'
import { mergeClasses } from '../utils'
import { Icon } from './Icon'
import styles from './MenuItem.module.css'
import type { IconifyIcon } from '@iconify/types'
import type { ComponentProps, ParentComponent } from 'solid-js'

export interface MenuItemProps extends ComponentProps<'button'> {
	icon?: IconifyIcon | 'space'
}

export const MenuItem: ParentComponent<MenuItemProps> = props => {
	const [local, others] = splitProps(props, ['icon', 'children', 'class'])

	return (
		<button
			type="button"
			class={mergeClasses(
				styles.item,
				'm3-focus-inward',
				'm3-ripple',
				local.class,
			)}
			{...others}
		>
			<Show when={local.icon === 'space'}>
				<span class={styles.icon}></span>
			</Show>
			<Show when={local.icon && local.icon !== 'space'}>
				<span class={styles.icon}>
					<Icon icon={local.icon as IconifyIcon} size={24} />
				</span>
			</Show>
			{local.children}
		</button>
	)
}
