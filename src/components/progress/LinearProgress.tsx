import { mergeProps } from 'solid-js'
import { mergeClasses } from '../../utils'
import styles from './LinearProgress.module.css'
import type { Component } from 'solid-js'

export interface LinearProgressProps {
	percent?: number
	height?: number
	class?: string
}

export const LinearProgress: Component<LinearProgressProps> = props => {
	const merged = mergeProps({ percent: 0, height: 4 }, props)

	return (
		<div
			class={mergeClasses(styles.container, merged.class)}
			style={{ height: `${merged.height}px` }}
			role="progressbar"
			aria-valuenow={merged.percent}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div
				class={styles.bar}
				style={{ width: `${Math.min(100, Math.max(0, merged.percent))}%` }}
			/>
		</div>
	)
}
