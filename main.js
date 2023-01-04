const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInput = document.getElementById("file");
fileInput.addEventListener("change", handleFiles);
function handleFiles() {
	const file = this.files[0];

	const reader = new FileReader();
	reader.onload = parseImage;
	reader.readAsText(file);
}

function parseImage(e) {
	const data = e.target.result;
	const rawImage = (() => {
		const arr = data
			.trim()
			.split("\r\n\r\n")
			.map((a) => a.split("\r\n"));
		arr[0] = arr[0].map((a) => a.split(" "));
		return arr;
	})();

	const image = new Image(...rawImage);
	drawImage(image, 10);
}

function drawImage(image, scale) {
	canvas.width = image.dimensions.width * scale;
	canvas.height = image.dimensions.height * scale;
	for (let y = 0; y < image.dimensions.height; y++) {
		for (let x = 0; x < image.dimensions.width; x++) {
			const colour = image.colours[image.pixels[y][x]];
			ctx.fillStyle = colour == null ? "transparent" : `rgb(${colour})`;
			ctx.fillRect(x * scale, y * scale, scale, scale);
		}
	}
}

class Image {
	constructor(pixels, colours) {
		this.pixels = pixels;
		this.colours = colours;
	}

	get dimensions() {
		return {
			width: Math.max(...this.pixels.map((a) => a.length)),
			height: this.pixels.length,
		};
	}

	scaledDimensions(scale) {
		const dimensions = this.dimensions;
		return {
			width: dimensions.width * scale,
			height: dimensions.height * scale,
		};
	}
}
