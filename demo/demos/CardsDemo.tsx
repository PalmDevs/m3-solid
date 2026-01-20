import { createMemo, createSignal } from 'solid-js'
import { Card, containerTransform, easeEmphasized } from '../../src'
import { DemoSection } from './DemoSection'
import { ExpandedCardOverlay } from './ExpandedCardOverlay'

const CARD_DATA = [
	{
		title: 'Card 1',
		desc: 'Click to expand with container transform!',
		variant: 'filled' as const,
	},
	{
		title: 'Card 2',
		desc: 'Watch the smooth morphing animation.',
		variant: 'elevated' as const,
	},
	{
		title: 'Card 3',
		desc: 'Material Design 3 motion principles.',
		variant: 'outlined' as const,
	},
]

export const CardsDemo = () => {
	const [selectedCard, setSelectedCard] = createSignal<number | null>(null)
	const [isAnimating, setIsAnimating] = createSignal(false)

	const cardRefs: Array<HTMLDivElement | HTMLButtonElement | undefined> = []
	let expandedRef: HTMLDivElement | HTMLButtonElement | undefined

	const selectedCardData = createMemo(() => {
		const index = selectedCard()
		return index !== null ? CARD_DATA[index] : null
	})

	const animateTransform = (
		from: HTMLElement,
		to: HTMLElement,
		onComplete: () => void,
	) => {
		containerTransform(from, to, {
			duration: 400,
			easing: easeEmphasized,
			onComplete,
		})
	}

	const expandCard = (index: number) => {
		if (isAnimating()) return

		const cardRef = cardRefs[index]
		if (!cardRef) return

		setIsAnimating(true)
		setSelectedCard(index)

		if (expandedRef && cardRef) {
			animateTransform(cardRef, expandedRef, () => setIsAnimating(false))
		}
	}

	const closeExpanded = () => {
		if (isAnimating() || !expandedRef) return false

		const index = selectedCard()
		if (index === null) return false

		const cardRef = cardRefs[index]
		if (!cardRef) return false

		setIsAnimating(true)
		animateTransform(expandedRef, cardRef, () => {
			setSelectedCard(null)
			setIsAnimating(false)
		})
	}

	return (
		<>
			<DemoSection
				title="Cards"
				note={
					<p>
						<strong>
							Tap each card to run a container transform animation
						</strong>
						<br />• Uses the{' '}
						<code>containerTransform(startEl, endEl, options?)</code> API
						<br />• Interpolates background colors, borders, and dimensions
					</p>
				}
			>
				<div class="card-row">
					{CARD_DATA.map((card, index) => (
						<Card
							ref={el => (cardRefs[index] = el)}
							variant={card.variant}
							onClick={() => expandCard(index)}
							style={{
								visibility: selectedCard() === index ? 'hidden' : 'visible',
							}}
						>
							<h3>{card.title}</h3>
							<p>{card.desc}</p>
						</Card>
					))}
				</div>
			</DemoSection>

			<ExpandedCardOverlay
				open={selectedCard() !== null}
				variant={selectedCardData()?.variant ?? 'filled'}
				title={selectedCardData()?.title ?? ''}
				description={selectedCardData()?.desc ?? ''}
				onClose={closeExpanded}
				ref={expandedRef}
			/>
		</>
	)
}
