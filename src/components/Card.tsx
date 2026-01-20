import { splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { mergeClasses } from '../utils'
import styles from './Card.module.css'
import type { JSX, ParentComponent } from 'solid-js'

export interface CardProps {
	variant: 'elevated' | 'filled' | 'outlined'
	onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
	ref?:
		| HTMLDivElement
		| HTMLButtonElement
		| ((el: HTMLDivElement | HTMLButtonElement) => void)
	class?: string
	style?: JSX.CSSProperties | string
}

export const Card: ParentComponent<CardProps> = props => {
	const [local, others] = splitProps(props, [
		'variant',
		'onClick',
		'class',
		'children',
		'ref',
		'style',
	])

	return (
		<Dynamic
			component={local.onClick ? 'button' : 'div'}
			type={local.onClick ? 'button' : undefined}
			class={mergeClasses(
				'm3-container',
				styles.container,
				styles[local.variant],
				local.onClick && 'm3-ripple',
				local.class,
			)}
			onClick={local.onClick}
			style={local.style}
			ref={props.ref as any}
			{...others}
		>
			{local.children}
		</Dynamic>
	)
}
