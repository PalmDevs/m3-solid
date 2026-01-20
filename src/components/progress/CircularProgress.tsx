import { mergeProps, splitProps } from 'solid-js'
import styles from './CircularProgress.module.css'
import type { Component, JSX } from 'solid-js'

export interface CircularProgressProps
	extends JSX.SvgSVGAttributes<SVGSVGElement> {
	percent: number
	size?: number
	thickness?: number
}

export const CircularProgress: Component<CircularProgressProps> = props => {
	const merged = mergeProps({ size: 48, thickness: 4 }, props)
	const [local, others] = splitProps(merged, ['percent', 'size', 'thickness'])

	const r = () => local.size / 2 - local.thickness / 2
	const circumference = () => Math.PI * r() * 2

	return (
		<svg
			width={local.size}
			height={local.size}
			viewBox={`0 0 ${local.size} ${local.size}`}
			xmlns="http://www.w3.org/2000/svg"
			class={styles.container}
			role="progressbar"
			aria-valuenow={merged.percent}
			aria-valuemin={0}
			aria-valuemax={100}
			{...others}
		>
			<circle
				cx={local.size / 2}
				cy={local.size / 2}
				r={r()}
				stroke="var(--m3-circular-progress-track-color, var(--m3c-surface))"
				stroke-width={local.thickness}
				fill="none"
			/>
			<circle
				cx={local.size / 2}
				cy={local.size / 2}
				r={r()}
				stroke="var(--m3-circular-progress-active-indicator-color, var(--m3c-primary))"
				stroke-width={local.thickness}
				stroke-dasharray={`${circumference()} ${circumference()}`}
				stroke-dashoffset={
					(local.percent / -100) * circumference() + circumference()
				}
				stroke-linecap="round"
				fill="none"
				class={styles.progressCircle}
			/>
		</svg>
	)
}
