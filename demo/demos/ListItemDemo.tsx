/** biome-ignore-all lint/a11y/noSvgWithoutTitle: It's a demo! */

import DemoIcon from '@iconify-icons/mdi/account-circle'
import TrailingIcon from '@iconify-icons/mdi/chevron-right'
import { Icon } from '../../src/components/Icon'
import { ListItem } from '../../src/components/ListItem'
import { DemoSection } from './DemoSection'
import type { Component } from 'solid-js'

export const ListItemDemo: Component = () => {
	return (
		<DemoSection title="List Items">
			<ul style={{ 'list-style': 'none', padding: 0, margin: 0 }}>
				<ListItem headline="Single line item" />
				<ListItem headline="Two line item" supporting="Supporting text" />
				<ListItem
					label
					overline="Overline"
					headline="Three line item"
					supporting="Supporting text"
				/>
				<ListItem
					leading={<Icon icon={DemoIcon} />}
					headline="With leading icon"
				/>
				<ListItem
					headline="With trailing icon"
					trailing={<Icon icon={TrailingIcon} />}
				/>
				<ListItem
					leading={<Icon icon={DemoIcon} />}
					headline="Clickable item"
					supporting="Click me"
					trailing={<Icon icon={TrailingIcon} />}
					onClick={() => alert('Clicked!')}
				/>
				<ListItem
					leading={<Icon icon={DemoIcon} />}
					headline="Link item"
					supporting="Navigate somewhere"
					trailing={<Icon icon={TrailingIcon} />}
					href="#demo"
				/>
			</ul>
		</DemoSection>
	)
}
