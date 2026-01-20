import ContentCopyIcon from '@iconify-icons/mdi/content-copy'
import ContentCutIcon from '@iconify-icons/mdi/content-cut'
import ContentPasteIcon from '@iconify-icons/mdi/content-paste'
import DeleteIcon from '@iconify-icons/mdi/delete'
import { createSignal } from 'solid-js'
import { Menu, MenuItem } from '../../src'
import { DemoSection } from './DemoSection'

export function MenuDemo() {
	const [lastAction, setLastAction] = createSignal('')

	return (
		<DemoSection title="Menu">
			<div style={{ display: 'flex', 'flex-wrap': 'wrap', gap: '2rem' }}>
				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Basic Menu
					</p>
					<Menu>
						<MenuItem
							icon={ContentCutIcon}
							onClick={() => setLastAction('Cut')}
						>
							Cut
						</MenuItem>
						<MenuItem
							icon={ContentCopyIcon}
							onClick={() => setLastAction('Copy')}
						>
							Copy
						</MenuItem>
						<MenuItem
							icon={ContentPasteIcon}
							onClick={() => setLastAction('Paste')}
						>
							Paste
						</MenuItem>
					</Menu>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						With Disabled Items
					</p>
					<Menu>
						<MenuItem
							icon={ContentCopyIcon}
							onClick={() => setLastAction('Copy')}
						>
							Copy
						</MenuItem>
						<MenuItem icon={ContentPasteIcon} disabled>
							Paste
						</MenuItem>
						<MenuItem icon={DeleteIcon} onClick={() => setLastAction('Delete')}>
							Delete
						</MenuItem>
					</Menu>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Without Icons
					</p>
					<Menu>
						<MenuItem onClick={() => setLastAction('New')}>New File</MenuItem>
						<MenuItem onClick={() => setLastAction('Open')}>Open...</MenuItem>
						<MenuItem onClick={() => setLastAction('Save')}>Save</MenuItem>
						<MenuItem onClick={() => setLastAction('Save As')}>
							Save As...
						</MenuItem>
					</Menu>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Last action: {lastAction() || 'None'}
					</p>
				</div>
			</div>
		</DemoSection>
	)
}
