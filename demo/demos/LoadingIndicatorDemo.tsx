import { createEffect, createSignal } from 'solid-js'
import { CircularProgress } from '../../src/components/progress/CircularProgress'
import { LoadingIndicator } from '../../src/components/progress/LoadingIndicator'
import { DemoSection } from './DemoSection'
import type { Component } from 'solid-js'

export const LoadingIndicatorDemo: Component = () => {
	const [progress, setProgress] = createSignal(0)

	createEffect(() => {
		const interval = setInterval(() => {
			setProgress(p => (p >= 100 ? 0 : p + 1))
		}, 50)

		return () => clearInterval(interval)
	})

	return (
		<>
			<DemoSection title="Loading Indicator">
				<div
					style={{
						display: 'flex',
						'flex-direction': 'column',
						gap: '2rem',
						'align-items': 'center',
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: '2rem',
							'align-items': 'center',
							'flex-wrap': 'wrap',
							'justify-content': 'center',
						}}
					>
						<LoadingIndicator size={48} />
						<LoadingIndicator size={64} />
						<LoadingIndicator size={80} />
						<LoadingIndicator size={96} />
					</div>

					<div
						style={{
							display: 'flex',
							gap: '2rem',
							'align-items': 'center',
							'flex-wrap': 'wrap',
							'justify-content': 'center',
						}}
					>
						<LoadingIndicator size={48} container />
						<LoadingIndicator size={64} container />
						<LoadingIndicator size={80} container />
						<LoadingIndicator size={96} container />
					</div>
				</div>
			</DemoSection>

			<DemoSection title="Circular Progress">
				<div
					style={{
						display: 'flex',
						'flex-direction': 'column',
						gap: '2rem',
						'align-items': 'center',
					}}
				>
					<div
						style={{ display: 'flex', gap: '2rem', 'align-items': 'center' }}
					>
						<CircularProgress percent={progress()} />
						<div>Progress: {progress()}%</div>
					</div>

					<div
						style={{ display: 'flex', gap: '2rem', 'align-items': 'center' }}
					>
						<CircularProgress percent={25} size={64} thickness={6} />
						<CircularProgress percent={50} size={64} thickness={6} />
						<CircularProgress percent={75} size={64} thickness={6} />
						<CircularProgress percent={100} size={64} thickness={6} />
					</div>

					<div
						style={{ display: 'flex', gap: '1rem', 'align-items': 'center' }}
					>
						<CircularProgress percent={66} size={32} thickness={3} />
						<CircularProgress percent={66} size={48} thickness={4} />
						<CircularProgress percent={66} size={64} thickness={5} />
						<CircularProgress percent={66} size={80} thickness={6} />
					</div>
				</div>
			</DemoSection>
		</>
	)
}
