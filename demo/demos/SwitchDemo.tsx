/** biome-ignore-all lint/a11y/noLabelWithoutControl: It's a demo! */
import { createSignal } from 'solid-js'
import { Switch } from '../../src'
import { DemoSection } from './DemoSection'

export const SwitchDemo = () => {
	const [switchChecked, setSwitchChecked] = createSignal(false)
	const [switchBoth, setSwitchBoth] = createSignal(true)
	const [switchNone, setSwitchNone] = createSignal(false)
	const [switchDisabled, setSwitchDisabled] = createSignal(true)

	return (
		<DemoSection title="Switch">
			<div class="switch-demo">
				<label class="switch-item">
					<Switch
						checked={switchBoth()}
						onChange={setSwitchBoth}
						icons="both"
					/>
					<span>Both icons: {switchBoth() ? 'On' : 'Off'}</span>
				</label>
				<label class="switch-item">
					<Switch
						checked={switchChecked()}
						onChange={setSwitchChecked}
						icons="checked"
					/>
					<span>Checked icon only: {switchChecked() ? 'On' : 'Off'}</span>
				</label>
				<label class="switch-item">
					<Switch
						checked={switchNone()}
						onChange={setSwitchNone}
						icons="none"
					/>
					<span>No icons: {switchNone() ? 'On' : 'Off'}</span>
				</label>
				<label class="switch-item">
					<Switch
						checked={switchDisabled()}
						onChange={setSwitchDisabled}
						disabled
						icons="both"
					/>
					<span>Disabled: {switchDisabled() ? 'On' : 'Off'}</span>
				</label>
			</div>
		</DemoSection>
	)
}
