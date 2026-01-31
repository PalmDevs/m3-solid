import { splitProps } from 'solid-js'
import type { IconifyIcon } from '@iconify/types'
import type { Component, ComponentProps } from 'solid-js'

export interface IconProps extends ComponentProps<'svg'> {
	icon: IconifyIcon
	size?: number
}

export const Icon: Component<IconProps> = props => {
	const [local, others] = splitProps(props, ['icon', 'size'])

	return (
		<svg
			aria-hidden="true"
			width={local.size || '1em'}
			height={local.size || '1em'}
			viewBox={`0 0 ${local.icon.width} ${local.icon.height}`}
			xmlns="http://www.w3.org/2000/svg"
			style={{ 'flex-shrink': 0, overflow: 'visible' }}
			innerHTML={local.icon.body}
			{...others}
		/>
	)
}
