export const renderer = (onUrlChange) => {
	const $canvas = document.createElement('canvas')
	$canvas.style.display = 'none'
	document.body.appendChild($canvas)

	const width = 2880
	const height = 1620
	$canvas.width = width
	$canvas.height = height
	const fontFamily = 'Manrope'
	const context = $canvas.getContext('2d')
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
			isBold ? '800' : 'normal'
		} ${size}px ${fontFamily}, sans-serif`
	}

	const isImageLoaded = (image) => image.complete && image.naturalHeight !== 0

	const render = ({ title = '' }) => {
		parameters = {
			title,
		}

		context.fillStyle = '#f5f3f0'
		context.fillRect(0, 0, width, height)

		if (isImageLoaded(backgroundImage)) {
			context.drawImage(backgroundImage, 0, 0)
		}

		context.fillStyle = '#000000'

		setFont(120, true)
		context.textAlign = 'center'
		title.split('\n').forEach((line, i, lines) => {
			const lineHeight = 112
			context.fillText(line, width / 2, 1080 + i * lineHeight)
		})

		onUrlChange($canvas.toDataURL('image/jpeg'))
	}

	return {
		render,
	}
}
