export const renderer = ($canvas, onUrlChange = () => {}) => {
	const width = 1920
	const height = 1080
	$canvas.width = width
	$canvas.height = height
	const fontFamily = 'Open Sans'
	const context = $canvas.getContext('2d')
	const iconImage = new Image()
	iconImage.crossOrigin = 'anonymous'
	const backgroundImage = new Image(width, height)
	backgroundImage.src = 'background.jpg'
	let parameters = {}

	backgroundImage.addEventListener('load', () => {
		render(parameters)
	})

	document.fonts.ready.then(function () {
		if (document.fonts.check(`1em ${fontFamily}`)) {
			render(parameters)
		}
	})

	const setFont = (size, isBold) => {
		context.font = `${
			isBold ? 'bold' : 'normal'
		} ${size}px ${fontFamily}, sans-serif`
	}

	const isImageLoaded = (image) => image.complete && image.naturalHeight !== 0

	const render = ({
		title = '',
		meta1 = '',
		meta2 = '',
		meta3 = '',
		icon = '',
	}) => {
		parameters = {
			title,
			meta1,
			meta2,
			meta3,
			icon,
		}
		if (iconImage.src !== icon) {
			iconImage.addEventListener(
				'load',
				() => {
					render(parameters)
				},
				{ once: true },
			)
			iconImage.src = icon
		}

		context.fillStyle = '#222262'
		context.fillRect(0, 0, width, height)

		if (isImageLoaded(backgroundImage)) {
			context.drawImage(backgroundImage, 0, 0)
		}

		if (icon) {
			const frameWidth = 432
			const frameHeight = 432
			const top = 551
			const left = 1391

			if (isImageLoaded(iconImage)) {
				const scale = Math.min(
					frameWidth / iconImage.width,
					frameHeight / iconImage.height,
				)
				const imageWidth = scale * iconImage.width
				const imageHeight = scale * iconImage.height
				context.drawImage(
					iconImage,
					left + (frameWidth - imageWidth) / 2,
					top + (frameHeight - imageHeight) / 2,
					imageWidth,
					imageHeight,
				)
			} else {
				context.fillStyle = '#ff000044'
				context.fillRect(left, top, frameWidth, frameHeight)
			}
		}

		context.fillStyle = '#ffffff'

		setFont(94, true)
		title
			.toLocaleUpperCase('cs')
			.split('\n')
			.forEach((line, i, lines) => {
				const lineHeight = 112
				context.fillText(line, 99, 652 - (lines.length - i - 1) * lineHeight)
			})
		setFont(46, false)
		context.fillText(meta1, 99, 740)
		context.fillText(meta2, 99, 814)
		context.fillText(meta3, 99, 890)

		onUrlChange($canvas.toDataURL('image/jpeg'))
	}

	return {
		render,
	}
}
