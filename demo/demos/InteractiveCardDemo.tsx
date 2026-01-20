import { Card } from '../../src'
import { DemoSection } from './DemoSection'

export const InteractiveCardDemo = () => {
	return (
		<DemoSection title="Interactive Card">
			<div class="card-row">
				<Card variant="filled" onClick={() => alert('Card clicked!')}>
					<h3>Interactive Card</h3>
					<p>Click me! I have ripple effects.</p>
				</Card>
			</div>
		</DemoSection>
	)
}
