import { createSignal } from 'solid-js'
import { Tabs, TabsLink } from '../../src'
import { DemoSection } from './DemoSection'

export function TabsDemo() {
	const [selectedTab, setSelectedTab] = createSignal('tab1')
	const [scrollableTab, setScrollableTab] = createSignal('scroll1')

	const basicTabs = [
		{ label: 'Tab 1', value: 'tab1' },
		{ label: 'Tab 2', value: 'tab2' },
		{ label: 'Tab 3', value: 'tab3' },
	]

	const manyTabs = [
		{ label: 'Home', value: 'scroll1' },
		{ label: 'Products', value: 'scroll2' },
		{ label: 'Services', value: 'scroll3' },
		{ label: 'About Us', value: 'scroll4' },
		{ label: 'Contact', value: 'scroll5' },
		{ label: 'Blog', value: 'scroll6' },
		{ label: 'Support', value: 'scroll7' },
	]

	const linkTabs = [
		{ label: 'Overview', href: '#overview' },
		{ label: 'Features', href: '#features' },
		{ label: 'Pricing', href: '#pricing' },
	]

	const manyLinkTabs = [
		{ label: 'Dashboard', href: '#dashboard' },
		{ label: 'Analytics', href: '#analytics' },
		{ label: 'Reports', href: '#reports' },
		{ label: 'Settings', href: '#settings' },
		{ label: 'Profile', href: '#profile' },
		{ label: 'Notifications', href: '#notifications' },
	]

	return (
		<DemoSection title="Tabs">
			<div style={{ display: 'flex', 'flex-direction': 'column', gap: '2rem' }}>
				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Fixed Tabs
					</p>
					<Tabs
						tabs={basicTabs}
						value={selectedTab()}
						onChange={setSelectedTab}
					/>
					<p style={{ 'margin-top': '0.5rem', 'font-size': '0.875rem' }}>
						Selected: {selectedTab()}
					</p>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Scrollable Tabs
					</p>
					<div style={{ 'max-width': '400px' }}>
						<Tabs
							tabs={manyTabs}
							value={scrollableTab()}
							onChange={setScrollableTab}
							scrollable
						/>
					</div>
					<p style={{ 'margin-top': '0.5rem', 'font-size': '0.875rem' }}>
						Selected: {scrollableTab()}
					</p>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Fixed Link Tabs
					</p>
					<TabsLink tabs={linkTabs} activeHref="#overview" />
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Scrollable Link Tabs
					</p>
					<div style={{ 'max-width': '400px' }}>
						<TabsLink tabs={manyLinkTabs} activeHref="#dashboard" scrollable />
					</div>
				</div>
			</div>
		</DemoSection>
	)
}
