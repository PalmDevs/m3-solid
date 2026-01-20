import { createEffect, createSignal, onCleanup } from 'solid-js'
import { Button, CircularProgress, LinearProgress } from '../../src'
import { DemoSection } from './DemoSection'

export function ProgressDemo() {
	const [progress, setProgress] = createSignal(0)
	const [running, setRunning] = createSignal(true)

	createEffect(() => {
		if (!running()) return

		const interval = setInterval(() => {
			setProgress(p => {
				if (p >= 100) return 0
				return p + 2
			})
		}, 100)

		onCleanup(() => clearInterval(interval))
	})

	return (
		<DemoSection title="Progress Indicators">
			<div style={{ display: 'flex', 'flex-direction': 'column', gap: '2rem' }}>
				<div>
					<p
						style={{
							'margin-bottom': '1rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Linear Progress (Determinate) - {progress()}%
					</p>
					<LinearProgress percent={progress()} />
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '1rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Circular Progress (Determinate) - {progress()}%
					</p>
					<div
						style={{ display: 'flex', gap: '1rem', 'align-items': 'center' }}
					>
						<CircularProgress percent={progress()} size={32} />
						<CircularProgress percent={progress()} size={48} />
						<CircularProgress percent={progress()} size={64} thickness={6} />
					</div>
				</div>

				<div>
					<Button onClick={() => setRunning(!running())}>
						{running() ? 'Pause' : 'Resume'}
					</Button>
				</div>
			</div>
		</DemoSection>
	)
}
