import AddIcon from '@iconify-icons/mdi/plus'
import { Button } from '../../src'
import { DemoSection } from './DemoSection'

export const ButtonsDemo = () => {
	return (
		<DemoSection title="Buttons">
			<div class="button-row">
				<Button variant="filled">Filled Button</Button>
				<Button variant="elevated">Elevated Button</Button>
				<Button variant="tonal">Tonal Button</Button>
				<Button variant="outlined">Outlined Button</Button>
				<Button variant="text">Text Button</Button>
				<Button variant="filled" disabled>
					Disabled
				</Button>
				<Button variant="tonal" icon={AddIcon}>
					With Icon
				</Button>
				<Button variant="filled" icon={AddIcon} iconType="only" />
			</div>
		</DemoSection>
	)
}
