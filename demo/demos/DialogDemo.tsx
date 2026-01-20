/** biome-ignore-all lint/a11y/noLabelWithoutControl: It's a demo! */
import { createSignal } from 'solid-js'
import { Button, Dialog, Switch } from '../../src'
import { DemoSection } from './DemoSection'

export const DialogDemo = () => {
	const [dialogOpen, setDialogOpen] = createSignal(false)
	const [quick, setQuick] = createSignal(false)
	const [closeByAny, setCloseByAny] = createSignal(true)

	const closeDialog = () => setDialogOpen(false)

	return (
		<DemoSection title="Dialog">
			<div class="button-row">
				<Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
				<label class="switch-item">
					<Switch checked={quick()} onChange={setQuick} />
					<span>Quick: {quick() ? 'On' : 'Off'}</span>
				</label>
				<label class="switch-item">
					<Switch checked={closeByAny()} onChange={setCloseByAny} />
					<span>
						Closed by: {closeByAny() ? 'any (click outside)' : 'none'}
					</span>
				</label>
			</div>
			<Dialog
				quick={quick()}
				closedBy={closeByAny() ? 'any' : 'none'}
				headline="Dialog"
				open={dialogOpen()}
				onOpenChange={setDialogOpen}
				actions={
					<>
						<Button variant="text" onClick={closeDialog}>
							Cancel
						</Button>
						<Button variant="filled" onClick={closeDialog}>
							Confirm
						</Button>
					</>
				}
			>
				<p>
					A dialog is a modal window that appears in front of app content to
					provide critical information or ask for a decision. Dialogs disable
					all app functionality when they appear, and remain on screen until
					confirmed, dismissed, or a required action has been taken.
				</p>
				<p>
					Dialogs are purposefully interruptive, so they should be used
					sparingly. A less disruptive alternative is to use a dropdown menu,
					which provides options without interrupting a user’s experience.
				</p>
			</Dialog>
		</DemoSection>
	)
}
