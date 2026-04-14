import HomeIcon from '@iconify-icons/mdi/home'
import SearchIcon from '@iconify-icons/mdi/magnify'
import BookmarkIcon from '@iconify-icons/mdi/bookmark'
import SettingsIcon from '@iconify-icons/mdi/cog'
import AddIcon from '@iconify-icons/mdi/plus'
import { createSignal } from 'solid-js'
import { Button, FAB, Switch } from '../../src'
import { NavigationRail } from '../../src/components/nav/NavigationRail'
import { NavigationRailItem } from '../../src/components/nav/NavigationRailItem'
import { DemoSection } from './DemoSection'

const NAV_ITEMS = [
	{ label: 'Home', icon: HomeIcon, value: 'home' },
	{ label: 'Search', icon: SearchIcon, value: 'search' },
	{ label: 'Bookmarks', icon: BookmarkIcon, value: 'bookmarks' },
	{ label: 'Settings', icon: SettingsIcon, value: 'settings' },
]

export const NavigationRailDemo = () => {
	const [activeItem, setActiveItem] = createSignal('home')
	const [open, setOpen] = createSignal(false)
	const [modal, setModal] = createSignal(false)
	const [fill, setFill] = createSignal(false)
	const [collapse, setCollapse] = createSignal<'normal' | 'full' | 'no'>(
		'normal',
	)
	const [alignment, setAlignment] = createSignal<'top' | 'center'>('top')
	const [iconType, setIconType] = createSignal<'left' | 'full'>('left')
	const [showFab, setShowFab] = createSignal(false)

	return (
		<DemoSection
			title="Navigation Rail"
			note={
				<p>
					The rail below is embedded inline. Toggle <strong>Open</strong> to
					expand it, or switch <strong>Collapse</strong> mode to{' '}
					<code>full</code> to hide it entirely until opened.
					<br />• <strong>Fill</strong> stretches the active indicator to the
					full container width (drawer style).
					<br />• Default hugs the icon and label text.
				</p>
			}
		>
			<div
				style={{
					display: 'flex',
					'flex-direction': 'column',
					gap: '1.5rem',
				}}
			>
				{/* Controls */}
				<div
					style={{
						display: 'flex',
						'flex-wrap': 'wrap',
						gap: '1rem',
						'align-items': 'center',
					}}
				>
					<label class="switch-item">
						<Switch checked={open()} onChange={setOpen} icons="both" />
						<span>Open: {open() ? 'Yes' : 'No'}</span>
					</label>

					<label class="switch-item">
						<Switch checked={modal()} onChange={setModal} icons="both" />
						<span>Modal: {modal() ? 'Yes' : 'No'}</span>
					</label>

					<label class="switch-item">
						<Switch checked={fill()} onChange={setFill} icons="both" />
						<span>Fill: {fill() ? 'Yes' : 'No'}</span>
					</label>

					<label class="switch-item">
						<Switch
							checked={alignment() === 'center'}
							onChange={v => setAlignment(v ? 'center' : 'top')}
							icons="both"
						/>
						<span>Alignment: {alignment()}</span>
					</label>

					<label class="switch-item">
						<Switch
							checked={iconType() === 'full'}
							onChange={v => setIconType(v ? 'full' : 'left')}
							icons="both"
						/>
						<span>Icon type: {iconType()}</span>
					</label>

					<label class="switch-item">
						<Switch checked={showFab()} onChange={setShowFab} icons="both" />
						<span>FAB: {showFab() ? 'Yes' : 'No'}</span>
					</label>

					<div style={{ display: 'flex', gap: '0.5rem' }}>
						{(['normal', 'full', 'no'] as const).map(mode => (
							<Button
								variant={collapse() === mode ? 'filled' : 'outlined'}
								onClick={() => setCollapse(mode)}
							>
								{mode}
							</Button>
						))}
					</div>
					<span
						style={{
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Collapse
					</span>
				</div>

				{/* Demo stage */}
				<div
					style={{
						display: 'flex',
						height: '400px',
						'border-radius': 'var(--m3-shape-large)',
						overflow: 'hidden',
						border: '1px solid var(--m3c-outline-variant)',
						position: 'relative',
					}}
				>
					<NavigationRail
						open={open()}
						onChange={setOpen}
						collapse={collapse()}
						modal={modal()}
						alignment={alignment()}
						iconType={iconType()}
						fill={fill()}
						fab={
							showFab()
								? railOpen => (
										<FAB
											icon={AddIcon}
											size="normal"
											color="tertiary-container"
											elevation="none"
											style={{ width: 'min(100%, fit-content)' }}
											text={railOpen ? 'Compose' : undefined}
										/>
									)
								: undefined
						}
					>
						{NAV_ITEMS.map(item => (
							<NavigationRailItem
								label={item.label}
								icon={item.icon}
								active={activeItem() === item.value}
								onClick={() => setActiveItem(item.value)}
							/>
						))}
					</NavigationRail>

					<div
						style={{
							flex: 1,
							display: 'flex',
							'flex-direction': 'column',
							'align-items': 'center',
							'justify-content': 'center',
							gap: '0.5rem',
							color: 'var(--m3c-on-surface-variant)',
							'background-color': 'var(--m3c-surface)',
							padding: '2rem',
						}}
					>
						<span style={{ 'font-size': '2rem' }}>
							{NAV_ITEMS.find(i => i.value === activeItem())?.label}
						</span>
						<span style={{ 'font-size': '0.875rem' }}>
							Active: <code>{activeItem()}</code>
						</span>
					</div>
				</div>
			</div>
		</DemoSection>
	)
}
