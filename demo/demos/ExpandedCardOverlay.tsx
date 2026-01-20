import { createEffect, on, Show } from 'solid-js'
import { Button, Card } from '../../src'

interface ExpandedCardOverlayProps {
	open: boolean
	variant: 'filled' | 'elevated' | 'outlined'
	title: string
	description: string
	onClose: () => boolean | void
	ref: HTMLDivElement | HTMLButtonElement | undefined
}

export const ExpandedCardOverlay = (props: ExpandedCardOverlayProps) => {
	let backdrop!: HTMLDivElement

	const close = () => {
		if (props.onClose() === false) return

		backdrop.animate(
			{
				opacity: [1, 0],
			},
			{ duration: 200, fill: 'forwards' },
		)
	}

	createEffect(
		on(
			() => props.open,
			open => {
				if (open)
					backdrop.animate(
						{
							opacity: [0, 1],
						},
						{ duration: 200, fill: 'forwards' },
					)
				else close()
			},
			{
				defer: true,
			},
		),
	)

	return (
		<Show when={props.open}>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: It's a demo! */}
			<div
				ref={backdrop}
				class="expanded-overlay"
				style={{ display: 'flex' }}
				onClick={e => {
					if (e.target === e.currentTarget) {
						close()
					}
				}}
			>
				<Card
					ref={props.ref}
					variant={props.variant}
					class="expanded-card"
					style={{ visibility: 'hidden', 'min-width': '70vw' }}
				>
					<h2>{props.title} - Expanded</h2>
					<p>{props.description}</p>
					<p>This is the expanded view with more detailed content!</p>
					<p>
						The container transform animation creates a seamless transition from
						the compact card to this expanded state.
					</p>
					<div style="margin-top: 1rem;">
						<Button variant="filled" onClick={close}>
							Close
						</Button>
					</div>
				</Card>
			</div>
		</Show>
	)
}
