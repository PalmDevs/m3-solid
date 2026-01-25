import { easeEmphasized } from './easing'

const getAnimationContainer = (): HTMLElement => {
	let container = document.querySelector('m3-animation-container')
	if (!container) {
		container = document.createElement('m3-animation-container')
		document.body.appendChild(container)
	}
	return container as HTMLElement
}

if (typeof document !== 'undefined') {
	// Initialize animation container
	getAnimationContainer()
}

export const parseSize = (size: string) =>
	(size.endsWith('px')
		? +size.slice(0, -2)
		: size.endsWith('rem')
			? +size.slice(0, -3) * 16
			: null) || 0

export const parseDuration = (duration: string): number => {
	const trimmed = duration.trim()
	if (trimmed.endsWith('ms')) return parseFloat(trimmed)
	if (trimmed.endsWith('s')) return parseFloat(trimmed) * 1000
	console.warn(`Unable to parse duration: ${duration}`)
	return 0
}

type RGBA = [number, number, number, number]

export const parseColor = (color: string): RGBA => {
	// rgba/rgb
	let m = color.match(
		/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/,
	)
	if (m) return [+m[1]!, +m[2]!, +m[3]!, m[4] ? +m[4] : 1]

	// oklab (including relative color syntax)
	m = color.match(
		/oklab\((?:from\s+[^)]+\s+)?([\d.]+%?)\s+([+-]?[\d.]+)\s+([+-]?[\d.]+)(?:\s*\/\s*([\d.]+%?))?\)/,
	)
	if (m) {
		let L = +m[1]!,
			a = +m[2]!,
			b = +m[3]!,
			alpha = m[4] ? +m[4] : 1
		if (m[1]!.includes('%')) L /= 100
		if (m[4]?.includes('%')) alpha /= 100
		// oklab to linear RGB
		const l_ = L + 0.3963377774 * a + 0.2158037573 * b
		const m_ = L - 0.1055613458 * a - 0.0638541728 * b
		const s_ = L - 0.0894841775 * a - 1.291485548 * b
		const l = l_ * l_ * l_,
			n = m_ * m_ * m_,
			s = s_ * s_ * s_
		const lin2srgb = (x: number) =>
			x <= 0.0031308 ? x * 12.92 : 1.055 * x ** (1 / 2.4) - 0.055
		const clamp = (x: number) =>
			Math.round(Math.max(0, Math.min(255, lin2srgb(x) * 255)))
		return [
			clamp(4.0767416621 * l - 3.3077115913 * n + 0.2309699292 * s),
			clamp(-1.2684380046 * l + 2.6097574011 * n - 0.3413193965 * s),
			clamp(-0.0041960863 * l - 0.7034186147 * n + 1.707614701 * s),
			alpha,
		]
	}

	// color(srgb ...)
	m = color.match(
		/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)/,
	)
	if (m) {
		let alpha = m[4] ? +m[4] : 1
		if (m[4]?.includes('%')) alpha /= 100
		return [
			Math.round(+m[1]! * 255),
			Math.round(+m[2]! * 255),
			Math.round(+m[3]! * 255),
			alpha,
		]
	}

	return [0, 0, 0, 0]
}

export interface ParsedBoxShadow {
	inset: boolean
	offsetX: number
	offsetY: number
	blur: number
	spread: number
	color: RGBA
}

const EMPTY_SHADOW: ParsedBoxShadow = {
	inset: false,
	offsetX: 0,
	offsetY: 0,
	blur: 0,
	spread: 0,
	color: [0, 0, 0, 0],
}

export const parseBoxShadow = (boxShadow: string): ParsedBoxShadow[] => {
	if (!boxShadow || boxShadow === 'none') return []
	return boxShadow.split(/,(?![^(]*\))/).map(part => {
		const s = part.trim()
		const colorMatch = s.match(
			/(?:rgba?\([^)]+\)|oklab\([^)]+\)|color\([^)]+\))/,
		)
		const nums =
			s
				.replace(colorMatch?.[0] || '', '')
				.match(/-?[\d.]+(?=px)/g)
				?.map(Number) || []
		return {
			inset: s.includes('inset'),
			offsetX: nums[0] || 0,
			offsetY: nums[1] || 0,
			blur: nums[2] || 0,
			spread: nums[3] || 0,
			color: colorMatch ? parseColor(colorMatch[0]) : [0, 0, 0, 0],
		}
	})
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpColor = (a: RGBA, b: RGBA, t: number): RGBA =>
	[0, 1, 2, 3].map(i => lerp(a[i]!, b[i]!, t)) as RGBA

export const interpolateBoxShadow = (
	start: ParsedBoxShadow[],
	end: ParsedBoxShadow[],
	t: number,
): string => {
	const len = Math.max(start.length, end.length)
	if (!len) return 'none'
	return Array.from({ length: len }, (_, i) => {
		const s = start[i] || EMPTY_SHADOW,
			e = end[i] || EMPTY_SHADOW
		const c = lerpColor(s.color, e.color, t)
		const inset = (t > 0.5 ? e : s).inset ? 'inset ' : ''
		return `${inset}${lerp(s.offsetX, e.offsetX, t).toFixed(1)}px ${lerp(s.offsetY, e.offsetY, t).toFixed(1)}px ${lerp(s.blur, e.blur, t).toFixed(1)}px ${lerp(s.spread, e.spread, t).toFixed(1)}px rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(3)})`
	}).join(', ')
}

const getBackgroundColor = (node: Element, defaultColor?: string): string => {
	if (!defaultColor) {
		const tmp = document.createElement('div')
		document.body.appendChild(tmp)
		defaultColor = getComputedStyle(tmp).backgroundColor
		tmp.remove()
	}
	const color = getComputedStyle(node).backgroundColor
	if (color !== defaultColor) return color
	return node.parentElement
		? getBackgroundColor(node.parentElement, defaultColor)
		: defaultColor
}

export interface AnimationOptions {
	delay?: number
	duration?: number
	easing?: (t: number) => number
}

export interface SharedAxisOptions extends AnimationOptions {
	direction: 'X' | 'Y' | 'Z'
	rightSeam?: boolean
	leaving?: boolean
}

// TODO: shared axis transitions
const _getSharedAxisStyles = (
	progress: number,
	options: SharedAxisOptions,
): string => {
	const t = (options.easing || easeEmphasized)(progress)
	const u = 1 - t
	const opacity = Math.max(0, (t - 0.35) * (1 / 0.35))
	if (options.direction === 'Z') {
		const factor = options.leaving ? u * 0.1 + 1 : t * 0.2 + 0.8
		return `transform: scale(${factor.toFixed(3)});${options.leaving ? '' : ` opacity: ${opacity.toFixed(3)};`}`
	}
	const factor = u * (options.rightSeam ? -30 : 30)
	return `transform: translate${options.direction}(${factor.toFixed(3)}px); opacity: ${opacity.toFixed(3)}`
}

/**
 * Animate a value from 0 to 1 over a duration
 */
export const animate = (
	callback: (progress: number) => void,
	options: AnimationOptions & { onComplete?: () => void } = {},
): (() => void) => {
	const {
		duration = 500,
		delay = 0,
		easing = easeEmphasized,
		onComplete,
	} = options
	let startTime: number | null = null,
		rafId: number | null = null,
		cancelled = false

	const tick = (time: number) => {
		if (cancelled) return
		startTime ??= time
		const elapsed = time - startTime - delay
		if (elapsed < 0) return void (rafId = requestAnimationFrame(tick))
		const progress = Math.min(1, elapsed / duration)
		callback(easing(progress))
		if (progress < 1) rafId = requestAnimationFrame(tick)
		else onComplete?.()
	}
	rafId = requestAnimationFrame(tick)
	return () => {
		cancelled = true
		if (rafId) cancelAnimationFrame(rafId)
	}
}

export interface ContainerTransformOptions extends AnimationOptions {
	bgContainerZ?: number
	fgContainerZ?: number
	/**
	 * From 0 to 1, fraction of the duration to delay the start element fade out
	 */
	startElementFadeDelay?: number
	/**
	 * From 0 to 1, fraction of the duration to delay the end element fade in
	 */
	endElementFadeDelay?: number
	onComplete?: () => void
}

/**
 * Animates a smooth morph between two elements
 *
 * This creates clones of both elements and animates them in an overlay,
 * similar to how Android's Material Design container transform works.
 *
 * @example
 * ```tsx
 * let startEl: HTMLElement, endEl: HTMLElement;
 *
 * // When transitioning:
 * const cleanup = containerTransform(startEl, endEl, {
 *   duration: 500,
 *   onComplete: () => { ... }
 * });
 * ```
 */
export const containerTransform = (
	startElement: HTMLElement,
	endElement: HTMLElement,
	options: ContainerTransformOptions = {},
): (() => void) => {
	const {
		duration = 500,
		easing = easeEmphasized,
		bgContainerZ = 1000,
		fgContainerZ = 1001,
	} = options
	startElement.style.visibility = endElement.style.visibility = 'hidden'

	const startRect = startElement.getBoundingClientRect()
	const endRect = endElement.getBoundingClientRect()
	const startStyle = getComputedStyle(startElement)
	const endStyle = getComputedStyle(endElement)

	const startClone = startElement.cloneNode(true) as HTMLElement
	const endClone = endElement.cloneNode(true) as HTMLElement
	startClone.querySelectorAll('m3-ripple').forEach(el => el.remove())
	endClone.querySelectorAll('m3-ripple').forEach(el => el.remove())

	const startWrapper = document.createElement('div')
	const endWrapper = document.createElement('div')
	startWrapper.appendChild(startClone)
	endWrapper.appendChild(endClone)

	const setPos = (el: HTMLElement, z: number) =>
		Object.assign(el.style, {
			position: 'fixed',
			top: `${startRect.top}px`,
			left: `${startRect.left}px`,
			width: `${startRect.width}px`,
			height: `${startRect.height}px`,
			margin: '0',
			pointerEvents: 'none',
			overflow: 'hidden',
			zIndex: z,
		})
	setPos(startWrapper, fgContainerZ)
	setPos(endWrapper, fgContainerZ + 1)

	for (const [clone, opacity] of [
		[startClone, '1'],
		[endClone, '0'],
	] as const) {
		Object.assign(clone.style, {
			position: 'relative',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			margin: '0',
			visibility: 'visible',
			opacity,
		})
	}

	const bgContainer = document.createElement('div')
	Object.assign(bgContainer.style, {
		position: 'fixed',
		zIndex: bgContainerZ,
		boxSizing: 'border-box',
		borderStyle: 'solid',
		pointerEvents: 'none',
	})

	const startColor = parseColor(getBackgroundColor(startElement))
	const endColor = parseColor(getBackgroundColor(endElement))
	const startRadius = parseSize(startStyle.borderRadius)
	const endRadius = parseSize(endStyle.borderRadius)
	const startBorderW = parseSize(startStyle.borderLeftWidth)
	const endBorderW = parseSize(endStyle.borderLeftWidth)
	const startBorderC = parseColor(startStyle.borderLeftColor)
	const endBorderC = parseColor(endStyle.borderLeftColor)
	const startShadow = parseBoxShadow(startStyle.boxShadow)
	const endShadow = parseBoxShadow(endStyle.boxShadow)

	const animationContainer = getAnimationContainer()
	animationContainer.append(bgContainer, startWrapper, endWrapper)

	const isEndLarger =
		endRect.width * endRect.height > startRect.width * startRect.height
	const startFadeDelay =
		(options.startElementFadeDelay ?? (isEndLarger ? 0 : 0.4)) / 2
	const endFadeDelay =
		(options.endElementFadeDelay ?? (isEndLarger ? 0.4 : 0.8)) / 2

	const updateFrame = (t: number) => {
		const w = lerp(startRect.width, endRect.width, t)
		const h = lerp(startRect.height, endRect.height, t)
		const x = lerp(startRect.left, endRect.left, t)
		const y = lerp(startRect.top, endRect.top, t)
		const r = lerp(startRadius, endRadius, t)
		const c = lerpColor(startColor, endColor, t)
		const bc = lerpColor(startBorderC, endBorderC, t)

		Object.assign(bgContainer.style, {
			top: `${y}px`,
			left: `${x}px`,
			width: `${w}px`,
			height: `${h}px`,
			borderRadius: `${r}px`,
			borderWidth: `${lerp(startBorderW, endBorderW, t)}px`,
			backgroundColor: `rgba(${c.map(Math.round).join(',')})`,
			borderColor: `rgba(${bc.map(Math.round).join(',')})`,
			boxShadow: interpolateBoxShadow(startShadow, endShadow, t),
		})

		for (const wrapper of [startWrapper, endWrapper]) {
			Object.assign(wrapper.style, {
				top: `${y}px`,
				left: `${x}px`,
				width: `${w}px`,
				height: `${h}px`,
				borderRadius: `${r}px`,
			})
		}

		startClone.style.transform = `scale(${w / startRect.width}, ${h / startRect.height})`
		startClone.style.transformOrigin = 'top left'
		startClone.style.width = `${startRect.width}px`
		startClone.style.height = `${startRect.height}px`

		endClone.style.transform = `scale(${w / endRect.width}, ${h / endRect.height})`
		endClone.style.transformOrigin = 'top left'
		endClone.style.width = `${endRect.width}px`
		endClone.style.height = `${endRect.height}px`

		startClone.style.opacity = Math.max(
			0,
			1 - Math.max(0, (t - startFadeDelay) * 2),
		).toString()
		endClone.style.opacity = Math.max(
			0,
			Math.min(1, (t - endFadeDelay) * 2),
		).toString()
	}

	const cleanup = () => {
		startWrapper.remove()
		endWrapper.remove()
		bgContainer.remove()
		endElement.style.visibility = ''
		options.onComplete?.()
	}

	const cancel = animate(updateFrame, { duration, easing, onComplete: cleanup })
	return () => {
		cancel()
		cleanup()
	}
}
