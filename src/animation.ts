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
	if (trimmed.endsWith('ms')) {
		return parseFloat(trimmed)
	} else if (trimmed.endsWith('s')) {
		return parseFloat(trimmed) * 1000
	}

	console.warn(`Unable to parse duration: ${duration}`)
	return 0
}

export const parseColor = (color: string): [number, number, number, number] => {
	const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
	if (match) {
		const [r, g, b, opacity = 1.0] = match
			.slice(1, 5)
			.map(val => val && parseFloat(val))
		if (
			typeof r === 'number' &&
			typeof g === 'number' &&
			typeof b === 'number' &&
			typeof opacity === 'number'
		) {
			return [r, g, b, opacity]
		}
	}
	return [0, 0, 0, 0]
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
	if (node.parentElement)
		return getBackgroundColor(node.parentElement, defaultColor)
	return defaultColor
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

// TODO: Shared axis transitions

const _getSharedAxisStyles = (
	progress: number,
	options: SharedAxisOptions,
): string => {
	const t = (options.easing || easeEmphasized)(progress)
	const u = 1 - t
	const opacity = Math.max(0, (t - 0.35) * (1 / 0.35))

	if (options.direction === 'Z') {
		const factor = options.leaving ? u * 0.1 + 1 : t * 0.2 + 0.8
		let css = `transform: scale(${factor.toFixed(3)});`
		if (!options.leaving) css += ` opacity: ${opacity.toFixed(3)};`
		return css
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
	const duration = options.duration || 500
	const delay = options.delay || 0
	const easing = options.easing || easeEmphasized
	const onComplete = options.onComplete

	let startTime: number | null = null
	let rafId: number | null = null
	let cancelled = false

	const tick = (time: number) => {
		if (cancelled) return

		if (!startTime) startTime = time
		const elapsed = time - startTime - delay

		if (elapsed < 0) {
			rafId = requestAnimationFrame(tick)
			return
		}

		const progress = Math.min(1, elapsed / duration)
		const easedProgress = easing(progress)
		callback(easedProgress)

		if (progress < 1) {
			rafId = requestAnimationFrame(tick)
		} else {
			// Animation complete
			if (onComplete) {
				onComplete()
			}
		}
	}

	rafId = requestAnimationFrame(tick)

	return () => {
		cancelled = true
		if (rafId !== null) {
			cancelAnimationFrame(rafId)
		}
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
	const duration = options.duration || 500
	const easing = options.easing || easeEmphasized
	const bgContainerZ = options.bgContainerZ || 1000
	const fgContainerZ = options.fgContainerZ || 1001

	startElement.style.visibility = 'hidden'
	endElement.style.visibility = 'hidden'

	const startRect = startElement.getBoundingClientRect()
	const endRect = endElement.getBoundingClientRect()
	const startStyle = getComputedStyle(startElement)
	const endStyle = getComputedStyle(endElement)

	const startClone = startElement.cloneNode(true) as HTMLElement
	const endClone = endElement.cloneNode(true) as HTMLElement

	startClone.querySelectorAll('m3-ripple').forEach(el => el.remove())
	endClone.querySelectorAll('m3-ripple').forEach(el => el.remove())

	// For opacity control
	const startWrapper = document.createElement('div')
	const endWrapper = document.createElement('div')

	startWrapper.appendChild(startClone)
	endWrapper.appendChild(endClone)

	const positionWrapper = (wrapper: HTMLElement, zIndex: number) => {
		wrapper.style.position = 'fixed'
		wrapper.style.top = `${startRect.top}px`
		wrapper.style.left = `${startRect.left}px`
		wrapper.style.width = `${startRect.width}px`
		wrapper.style.height = `${startRect.height}px`
		wrapper.style.margin = '0'
		wrapper.style.pointerEvents = 'none'
		wrapper.style.overflow = 'hidden'
		wrapper.style.zIndex = zIndex.toString()
	}

	positionWrapper(startWrapper, fgContainerZ)
	positionWrapper(endWrapper, fgContainerZ + 1)

	// Reset clone positioning to be relative to wrapper
	startClone.style.position = 'relative'
	startClone.style.top = '0'
	startClone.style.left = '0'
	startClone.style.width = '100%'
	startClone.style.height = '100%'
	startClone.style.margin = '0'
	startClone.style.visibility = 'visible'
	startClone.style.opacity = '1'

	endClone.style.position = 'relative'
	endClone.style.top = '0'
	endClone.style.left = '0'
	endClone.style.width = '100%'
	endClone.style.height = '100%'
	endClone.style.margin = '0'
	endClone.style.visibility = 'visible'
	endClone.style.opacity = '0'

	// Background container for color and border interpolation
	// Without this, the two clones will be a little transparent during fade
	const bgContainer = document.createElement('div')
	bgContainer.style.position = 'fixed'
	bgContainer.style.zIndex = bgContainerZ.toString()
	bgContainer.style.boxSizing = 'border-box'
	bgContainer.style.borderStyle = 'solid'
	bgContainer.style.pointerEvents = 'none'

	const startColor = parseColor(getBackgroundColor(startElement))
	const endColor = parseColor(getBackgroundColor(endElement))
	const startRadius = parseSize(startStyle.borderRadius)
	const endRadius = parseSize(endStyle.borderRadius)
	const startBorderWidth = parseSize(startStyle.borderLeftWidth)
	const endBorderWidth = parseSize(endStyle.borderLeftWidth)
	const startBorderColor = parseColor(startStyle.borderLeftColor)
	const endBorderColor = parseColor(endStyle.borderLeftColor)

	const animationContainer = getAnimationContainer()
	animationContainer.appendChild(bgContainer)
	animationContainer.appendChild(startWrapper)
	animationContainer.appendChild(endWrapper)

	const isEndElementLarger =
		endRect.width * endRect.height > startRect.width * startRect.height

	// Usually smaller content would have a higher contrast (eg. FAB -> Card), so:

	// Try to fade out smaller content earlier to reduce visual pop
	const startCloneOpacityDelay = (options.startElementFadeDelay ?? (isEndElementLarger ? 0 : 0.4)) / 2
	// Try to fade in smaller content later to reduce visual pop
	const endCloneOpacityDelay = (options.endElementFadeDelay ?? (isEndElementLarger ? 0.4 : 0.8)) / 2

	const updateFrame = (progress: number) => {
		const t = progress
		const u = 1 - t

		const currentWidth = u * startRect.width + t * endRect.width
		const currentHeight = u * startRect.height + t * endRect.height
		const currentLeft = u * startRect.left + t * endRect.left
		const currentTop = u * startRect.top + t * endRect.top
		const currentRadius = u * startRadius + t * endRadius

		// Interpolate background container
		bgContainer.style.top = `${currentTop}px`
		bgContainer.style.left = `${currentLeft}px`
		bgContainer.style.width = `${currentWidth}px`
		bgContainer.style.height = `${currentHeight}px`
		bgContainer.style.borderRadius = `${currentRadius}px`
		bgContainer.style.borderWidth = `${u * startBorderWidth + t * endBorderWidth}px`

		const interpColor = [0, 1, 2, 3].map(i =>
			Math.round(u * (startColor[i] ?? 0) + t * (endColor[i] ?? 0)),
		)
		bgContainer.style.backgroundColor = `rgba(${interpColor.join(',')})`

		const interpBorder = [0, 1, 2, 3].map(i =>
			Math.round(u * (startBorderColor[i] ?? 0) + t * (endBorderColor[i] ?? 0)),
		)
		bgContainer.style.borderColor = `rgba(${interpBorder.join(',')})`

		// Position and size both wrappers
		startWrapper.style.top = `${currentTop}px`
		startWrapper.style.left = `${currentLeft}px`
		startWrapper.style.width = `${currentWidth}px`
		startWrapper.style.height = `${currentHeight}px`
		startWrapper.style.borderRadius = `${currentRadius}px`

		endWrapper.style.top = `${currentTop}px`
		endWrapper.style.left = `${currentLeft}px`
		endWrapper.style.width = `${currentWidth}px`
		endWrapper.style.height = `${currentHeight}px`
		endWrapper.style.borderRadius = `${currentRadius}px`

		// Scale content to maintain original layout and prevent text wrapping
		const startScaleX = currentWidth / startRect.width
		const startScaleY = currentHeight / startRect.height
		const endScaleX = currentWidth / endRect.width
		const endScaleY = currentHeight / endRect.height

		startClone.style.transform = `scale(${startScaleX}, ${startScaleY})`
		startClone.style.transformOrigin = 'top left'
		startClone.style.width = `${startRect.width}px`
		startClone.style.height = `${startRect.height}px`

		endClone.style.transform = `scale(${endScaleX}, ${endScaleY})`
		endClone.style.transformOrigin = 'top left'
		endClone.style.width = `${endRect.width}px`
		endClone.style.height = `${endRect.height}px`

		// Start content fades out, end content fades in
		startClone.style.opacity = Math.max(
			0,
			1 - Math.max(0, (t - startCloneOpacityDelay) * 2),
		).toString()
		endClone.style.opacity = Math.max(
			0,
			Math.min(1, (t - endCloneOpacityDelay) * 2),
		).toString()
	}

	// Run animation with completion callback
	const cleanup = () => {
		// Remove clones and wrappers
		if (startWrapper.parentNode) animationContainer.removeChild(startWrapper)
		if (endWrapper.parentNode) animationContainer.removeChild(endWrapper)
		if (bgContainer.parentNode) animationContainer.removeChild(bgContainer)

		// Only restore visibility on the end element (destination)
		// Start element should remain hidden
		endElement.style.visibility = ''

		if (options.onComplete) {
			options.onComplete()
		}
	}

	const animationCleanup = animate(updateFrame, {
		duration,
		easing,
		onComplete: cleanup,
	})

	return () => {
		animationCleanup()
		cleanup()
	}
}
