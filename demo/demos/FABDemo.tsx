import InfoIcon from '@iconify-icons/mdi/information'
import EditIcon from '@iconify-icons/mdi/pencil'
import PlusIcon from '@iconify-icons/mdi/plus'
import { createSignal } from 'solid-js'
import { containerTransform, FAB } from '../../src'
import { DemoSection } from './DemoSection'
import { ExpandedCardOverlay } from './ExpandedCardOverlay'

export function FABDemo() {
	const [isExpanded, setIsExpanded] = createSignal(false)
	const [isAnimating, setIsAnimating] = createSignal(false)

	let fabRef: HTMLButtonElement | undefined
	let cardRef: HTMLButtonElement | undefined

	const expandFAB = () => {
		if (isAnimating() || !fabRef) return

		setIsAnimating(true)
		setIsExpanded(true)

		requestAnimationFrame(() => {
			if (fabRef && cardRef) {
				containerTransform(fabRef, cardRef, {
					duration: 400,
					onComplete: () => setIsAnimating(false),
				})
			}
		})
	}

	const collapseFAB = () => {
		if (isAnimating() || !cardRef || !fabRef) return false

		setIsAnimating(true)
		containerTransform(cardRef, fabRef, {
			duration: 400,
			onComplete: () => {
				setIsExpanded(false)
				setIsAnimating(false)
			},
		})
	}

	return (
		<>
			<DemoSection title="Floating Action Buttons">
				<div
					style={{
						display: 'flex',
						'flex-wrap': 'wrap',
						gap: '1rem',
						'align-items': 'center',
					}}
				>
					<div>
						<p
							style={{
								'margin-bottom': '0.5rem',
								'font-size': '0.875rem',
								color: 'var(--m3c-on-surface-variant)',
							}}
						>
							Sizes
						</p>
						<div
							style={{ display: 'flex', gap: '1rem', 'align-items': 'center' }}
						>
							<FAB icon={PlusIcon} size="small" />
							<FAB icon={PlusIcon} size="normal" />
							<FAB icon={PlusIcon} size="medium" />
							<FAB icon={PlusIcon} size="large" />
						</div>
					</div>

					<div>
						<p
							style={{
								'margin-bottom': '0.5rem',
								'font-size': '0.875rem',
								color: 'var(--m3c-on-surface-variant)',
							}}
						>
							Colors
						</p>
						<div
							style={{ display: 'flex', gap: '1rem', 'align-items': 'center' }}
						>
							<FAB icon={PlusIcon} color="primary" />
							<FAB icon={PlusIcon} color="secondary" />
							<FAB icon={PlusIcon} color="tertiary" />
							<FAB icon={PlusIcon} color="primary-container" />
							<FAB icon={PlusIcon} color="secondary-container" />
							<FAB icon={PlusIcon} color="tertiary-container" />
						</div>
					</div>

					<div>
						<p
							style={{
								'margin-bottom': '0.5rem',
								'font-size': '0.875rem',
								color: 'var(--m3c-on-surface-variant)',
							}}
						>
							Elevations
						</p>
						<div
							style={{ display: 'flex', gap: '1rem', 'align-items': 'center' }}
						>
							<FAB icon={PlusIcon} elevation="normal" />
							<FAB icon={PlusIcon} elevation="lowered" />
							<FAB icon={PlusIcon} elevation="none" />
						</div>
					</div>

					<div>
						<p
							style={{
								'margin-bottom': '0.5rem',
								'font-size': '0.875rem',
								color: 'var(--m3c-on-surface-variant)',
							}}
						>
							Extended FAB
						</p>
						<div
							style={{ display: 'flex', gap: '1rem', 'align-items': 'center' }}
						>
							<FAB icon={EditIcon} text="Create" />
							<FAB icon={EditIcon} text="Compose" color="secondary-container" />
						</div>
					</div>

					<div>
						<p
							style={{
								'margin-bottom': '0.5rem',
								'font-size': '0.875rem',
								color: 'var(--m3c-on-surface-variant)',
							}}
						>
							Container Transform
						</p>
						<div
							style={{ display: 'flex', gap: '1rem', 'align-items': 'center' }}
						>
							<FAB
								ref={fabRef}
								icon={InfoIcon}
								text="Details"
								color="tertiary"
								onClick={expandFAB}
								style={{ visibility: isExpanded() ? 'hidden' : 'visible' }}
							/>
						</div>
					</div>
				</div>
			</DemoSection>
			<ExpandedCardOverlay
				ref={cardRef}
				onClose={collapseFAB}
				title="FAB"
				description="This is an example of a Floating Action Button transforming into an expanded card view using the Container Transform animation."
				open={isExpanded()}
				variant="filled"
			/>
		</>
	)
}
