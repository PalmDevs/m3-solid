# M3 Solid

Material Design 3 components for SolidJS.

## Installation

TODO.

## Usage

```tsx
import { Button, Card, Switch, Dialog } from 'm3-solid';
import { createSignal } from 'solid-js';
import 'm3-solid/styles.css';
import 'm3-solid/themes/default.css';
// or bring your own theme

function App() {
  const [checked, setChecked] = createSignal(false);
  const [open, setOpen] = createSignal(false);

  return (
    <div>
      <Button variant="filled" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>

      <Card variant="elevated">
        <h3>Card Title</h3>
        <p>Card content goes here</p>
      </Card>

      <label>
        <Switch
          checked={checked()}
          onChange={setChecked}
          icons="both"
        />
        <span>Toggle</span>
      </label>

      <Dialog
        headline="Dialog Title"
        open={open()}
        onOpenChange={setOpen}
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={() => setOpen(false)}>OK</Button>
          </>
        }
      >
        <p>Dialog content</p>
      </Dialog>
    </div>
  );
}
```

## Design Tokens

The library includes all Material Design 3 design tokens:

- Elevation levels (0-5)
- Shape tokens (extra-small, small, medium, large, extra-large, full)
- Typography scale (display, headline, title, label, body)
- Easing functions (emphasized, standard, fast, slow, spatial)

## Color Theming

You can define your color scheme using CSS custom properties. See [themes/default.css](./src/themes/default.css) for an example.

```css
:root {
  --m3c-primary: #6750A4;
  --m3c-on-primary: #FFFFFF;
  --m3c-secondary: #625B71;
  --m3c-on-secondary: #FFFFFF;
  --m3c-surface: #FEF7FF;
  --m3c-on-surface: #1C1B1F;
  /* ... and more */
}
```

## Development

```bash
# Install dependencies
bun install

# Run demo
bun dev

# Build library
bun run build
```

## License

Apache-2.0 OR GPL-3.0-only

## Attribution

Ported from [m3-svelte](https://github.com/KTibow/m3-svelte) by KTibow.

<sub>Assistance from LLMs were used in this project.</sub>
