import CheckIcon from '@iconify-icons/mdi/check'
import CloseIcon from '@iconify-icons/mdi/close'
import StarIcon from '@iconify-icons/mdi/star'
import { createSignal } from 'solid-js'
import { Chip } from '../../src'
import { DemoSection } from './DemoSection'

export function ChipDemo() {
	const [selectedChips, setSelectedChips] = createSignal<string[]>(['Option 1'])

	const toggleChip = (chip: string) => {
		setSelectedChips(prev =>
			prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip],
		)
	}

	return (
		<DemoSection title="Chip">
			<div
				style={{ display: 'flex', 'flex-direction': 'column', gap: '1.5rem' }}
			>
				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Input Chips
					</p>
					<div style={{ display: 'flex', gap: '0.5rem', 'flex-wrap': 'wrap' }}>
						<Chip variant="input" icon={CheckIcon}>
							Selected
						</Chip>
						<Chip variant="input" trailingIcon={CloseIcon}>
							Removable
						</Chip>
						<Chip variant="input">Plain</Chip>
					</div>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Assist Chips
					</p>
					<div style={{ display: 'flex', gap: '0.5rem', 'flex-wrap': 'wrap' }}>
						<Chip variant="assist" icon={StarIcon}>
							Starred
						</Chip>
						<Chip variant="assist">Assist Action</Chip>
						<Chip variant="assist" elevated>
							Elevated
						</Chip>
					</div>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						General Chips (Filter/Choice)
					</p>
					<div style={{ display: 'flex', gap: '0.5rem', 'flex-wrap': 'wrap' }}>
						<Chip
							variant="general"
							selected={selectedChips().includes('Option 1')}
							onClick={() => toggleChip('Option 1')}
						>
							Option 1
						</Chip>
						<Chip
							variant="general"
							selected={selectedChips().includes('Option 2')}
							onClick={() => toggleChip('Option 2')}
						>
							Option 2
						</Chip>
						<Chip
							variant="general"
							selected={selectedChips().includes('Option 3')}
							onClick={() => toggleChip('Option 3')}
						>
							Option 3
						</Chip>
					</div>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						Elevated & Selected
					</p>
					<div style={{ display: 'flex', gap: '0.5rem', 'flex-wrap': 'wrap' }}>
						<Chip elevated>Elevated</Chip>
						<Chip selected>Selected</Chip>
						<Chip elevated selected>
							Both
						</Chip>
					</div>
				</div>

				<div>
					<p
						style={{
							'margin-bottom': '0.5rem',
							'font-size': '0.875rem',
							color: 'var(--m3c-on-surface-variant)',
						}}
					>
						As Link
					</p>
					<div style={{ display: 'flex', gap: '0.5rem', 'flex-wrap': 'wrap' }}>
						<Chip href="#chip-link">Link Chip</Chip>
					</div>
				</div>
			</div>
		</DemoSection>
	)
}
