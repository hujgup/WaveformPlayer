function WFPInterface(optionsInput) {
	var thisObj = this;

	if (typeof optionsInput.width !== "number" || typeof optionsInput.audio.file !== "string" || typeof optionsInput.container.tagName !== "string" || typeof optionsInput.waveform.height !== "number" || typeof optionsInput.waveform.color !== "string" || typeof optionsInput.timeline.height !== "number") {
		throw new TypeError("One or more required parameters are undefined or are not the correct type.");
	}

	var options = {
		audio: {
			file: optionsInput.audio.file,
			autoplay: false,
			loop: false
		},
		container: optionsInput.container,
		width: optionsInput.width,
		waveform: {
			height: optionsInput.waveform.height,
			color: optionsInput.waveform.color,
			refreshRate: 60,
			marginBottom: 2,
			decodeError: function() { }
		},
		bars: {
			exists: true,
			height: 16,
			granularity: 1024,
			color: "black",
			clippingExists: true,
			clippingColor: "red",
			clippingInertia: 8,
			textColor: "white",
			font: "inherit",
			marginTop: 2,
			marginInternal: 1,
			marginBottom: 2
		},
		loading: {
			loadingMsg: "Loading...",
			decodingMsg: "Decoding...",
			textColor: "inherit",
			font: "inherit"
		},
		timeline: {
			height: optionsInput.timeline.height,
			marginTop: 2,
			marginBottom: 2,
			playhead: {
				exists: true,
				arrowColor: "black",
				lineColor: "black"
			},
			bar: {
				exists: true,
				color: "black"
			},
			delimiters: {
				exists: true,
				meanType: MeanType.ARITHMETIC,
				color: "black",
				text: {
					exists: true,
					color: "black"
				}
			},
			waveform: {
				exists: true,
				pastColor: "black",
				futureColor: "black",
				meanPastColor: "black",
				meanFutureColor: "black",
				clippingExists: true,
				clippingColor: "red"
			}
		},
		buttons: {
			type: "button",
			containerOneClassName: "",
			containerTwoClassName: "",
			buttonClassName: "",
			marginTop: 2
		},
		metadata: {
			exists: false,
			title: "",
			artist: "",
			album: "",
			containerClassName: "",
			titleClassName: "",
			artistClassName: "",
			albumClassName: ""
		}
	};

	if (typeof optionsInput.audio.autoplay === typeof options.audio.autoplay) {
		options.audio.autoplay = optionsInput.audio.autoplay;
	}
	if (typeof optionsInput.audio.loop === typeof options.audio.loop) {
		options.audio.loop = optionsInput.audio.loop;
	}
	if (typeof optionsInput.waveform.refreshRate === typeof options.waveform.refreshRate) {
		if (optionsInput.waveform.refreshRate > 0) {
			options.waveform.refreshRate = optionsInput.waveform.refreshRate;
		}
	}
	if (typeof optionsInput.waveform.color === typeof options.waveform.color) {
		options.waveform.color = optionsInput.waveform.color;
	}
	if (typeof optionsInput.waveform.marginBottom === typeof options.waveform.marginBottom) {
		if (optionsInput.waveform.marginBottom >= 0) {
			options.waveform.marginBottom = optionsInput.waveform.marginBottom;
		}
	}
	if (typeof optionsInput.waveform.decodeError === typeof options.waveform.decodeError) {
		options.waveform.decodeError = optionsInput.waveform.decodeError;
	}
	if (typeof optionsInput.bars !== "undefined") {
		if (typeof optionsInput.bars.exists === typeof options.bars.exists) {
			options.bars.exists = optionsInput.bars.exists;
		}
		if (typeof optionsInput.bars.height === typeof options.bars.height) {
			if (optionsInput.bars.height > 0) {
				options.bars.height = optionsInput.bars.height;
			}
		}
		if (typeof optionsInput.bars.granularity === typeof options.bars.granularity) {
			if (optionsInput.bars.granularity > 0) {
				options.bars.granularity = Math.floor(optionsInput.bars.granularity);
			}
		}
		if (typeof optionsInput.bars.color === typeof options.bars.color) {
			options.bars.color = optionsInput.bars.color;
		}
		if (typeof optionsInput.bars.clippingExists === typeof options.bars.clippingExists) {
			options.bars.clippingExists = optionsInput.bars.clippingExists;
		}
		if (typeof optionsInput.bars.clippingColor === typeof options.bars.clippingColor) {
			options.bars.clippingColor = optionsInput.bars.clippingColor;
		}
		if (typeof optionsInput.bars.clippingInertia === typeof options.bars.clippingInertia) {
			options.bars.clippingInertia = optionsInput.bars.clippingInertia;
		}
		if (typeof optionsInput.bars.textColor === typeof options.bars.textColor) {
			options.bars.textColor = optionsInput.bars.textColor;
		}
		if (typeof optionsInput.bars.font === typeof options.bars.font) {
			options.bars.font = optionsInput.bars.font;
		}
		if (typeof optionsInput.bars.marginTop === typeof options.bars.marginTop) {
			if (optionsInput.bars.marginTop >= 0) {
				options.bars.marginTop = optionsInput.bars.marginTop;
			}
		}
		if (typeof optionsInput.bars.marginInternal === typeof options.bars.marginInternal) {
			if (optionsInput.bars.marginInternal >= 0) {
				options.bars.marginInternal = optionsInput.bars.marginInternal;
			}
		}
		if (typeof optionsInput.bars.marginBottom === typeof options.bars.marginBottom) {
			if (optionsInput.bars.marginButtom >= 0) {
				options.bars.marginBottom = optionsInput.bars.marginBottom;
			}
		}
	}
	if (typeof optionsInput.loading !== "undefined") {
		if (typeof optionsInput.loading.loadingMsg === typeof options.loading.loadingMsg) {
			options.loading.loadingMsg = optionsInput.loading.loadingMsg;
		}
		if (typeof optionsInput.loading.decodingMsg === typeof options.loading.decodingMsg) {
			options.loading.decodingMsg = optionsInput.loading.decodingMsg;
		}
		if (typeof optionsInput.loading.textColor === typeof options.loading.textColor) {
			options.loading.textColor = optionsInput.loading.textColor;
		}
		if (typeof optionsInput.loading.font === typeof options.loading.font) {
			options.loading.font = optionsInput.loading.font;
		}
	}
	if (typeof optionsInput.timeline.marginTop === typeof options.timeline.marginTop) {
		if (optionsInput.timeline.marginTop >= 0) {
			options.timeline.marginTop = optionsInput.timeline.marginTop;
		}
	}
	if (typeof optionsInput.timeline.marginBottom === typeof options.timeline.marginBottom) {
		if (optionsInput.timeline.marginBottom >= 0) {
			options.timeline.marginBottom = optionsInput.timeline.marginBottom;
		}
	}
	if (typeof optionsInput.timeline.playhead !== "undefined") {
		if (typeof optionsInput.timeline.playhead.exists === typeof options.timeline.playhead.exists) {
			options.timeline.playhead.exists = optionsInput.timeline.playhead.exists;
		}
		if (typeof optionsInput.timeline.playhead.arrowColor === typeof options.timeline.playhead.arrowColor) {
			options.timeline.playhead.arrowColor = optionsInput.timeline.playhead.arrowColor;
		}
		if (typeof optionsInput.timeline.playhead.lineColor === typeof options.timeline.playhead.lineColor) {
			options.timeline.playhead.lineColor = optionsInput.timeline.playhead.lineColor;
		}
	}
	if (typeof optionsInput.timeline.bar !== "undefined") {
		if (typeof optionsInput.timeline.bar.exists === typeof options.timeline.bar.exists) {
			options.timeline.bar.exists = optionsInput.timeline.bar.exists;
		}
		if (typeof optionsInput.timeline.bar.color === typeof options.timeline.bar.color) {
			options.timeline.bar.color = optionsInput.timeline.bar.color;
		}
	}
	if (typeof optionsInput.timeline.delimiters !== "undefined") {
		if (typeof optionsInput.timeline.delimiters.exists === typeof options.timeline.delimiters.exists) {
			options.timeline.delimiters.exists = optionsInput.timeline.delimiters.exists;
		}
		if (typeof optionsInput.timeline.delimiters.color === typeof options.timeline.delimiters.color) {
				options.timeline.delimiters.color = optionsInput.timeline.delimiters.color;
		}
		if (typeof optionsInput.timeline.delimiters.text !== "undefined") {
			if (typeof optionsInput.timeline.delimiters.text.exists === typeof options.timeline.delimiters.text.exists) {
				options.timeline.delimiters.text.exists = optionsInput.timeline.delimiters.text.exists;
			}
			if (typeof optionsInput.timeline.delimiters.text.color === typeof options.timeline.delimiters.text.color) {
				options.timeline.delimiters.text.color = optionsInput.timeline.delimiters.text.color;
			}
		}
	}
	if (typeof optionsInput.timeline.waveform !== "undefined") {
		if (typeof optionsInput.timeline.waveform.exists === typeof options.timeline.waveform.exists) {
			options.timeline.waveform.exists = optionsInput.timeline.waveform.exists;
		}
		if (typeof optionsInput.timeline.waveform.meanType === typeof options.timeline.waveform.meanType) {
			options.timeline.waveform.meanType = optionsInput.timeline.waveform.meanType;
		}
		if (typeof optionsInput.timeline.waveform.pastColor === typeof options.timeline.waveform.pastColor) {
			options.timeline.waveform.pastColor = optionsInput.timeline.waveform.pastColor;
		}
		if (typeof optionsInput.timeline.waveform.futureColor === typeof options.timeline.waveform.futureColor) {
			options.timeline.waveform.futureColor = optionsInput.timeline.waveform.futureColor;
		}
		if (typeof optionsInput.timeline.waveform.meanPastColor === typeof options.timeline.waveform.meanPastColor) {
			options.timeline.waveform.meanPastColor = optionsInput.timeline.waveform.meanPastColor;
		}
		if (typeof optionsInput.timeline.waveform.meanFutureColor === typeof options.timeline.waveform.meanFutureColor) {
			options.timeline.waveform.meanFutureColor = optionsInput.timeline.waveform.meanFutureColor;
		}
		if (typeof optionsInput.timeline.waveform.clippingExists === typeof options.timeline.waveform.clippingExists) {
			options.timeline.waveform.clippingExists = optionsInput.timeline.waveform.clippingExists;
		}
		if (typeof optionsInput.timeline.waveform.clippingColor === typeof options.timeline.waveform.clippingColor) {
			options.timeline.waveform.clippingColor = optionsInput.timeline.waveform.clippingColor;
		}
	}
	if (typeof optionsInput.buttons !== "undefined") {
		if (typeof optionsInput.buttons.type === typeof options.buttons.type) {
			optionsInput.buttons.type = optionsInput.buttons.type.toLowerCase();
			if (optionsInput.buttons.type === "button" || optionsInput.buttons.type === "a") {
				options.buttons.type = optionsInput.buttons.type;
			}
		}
		if (typeof optionsInput.buttons.containerOneClassName === typeof options.buttons.containerOneClassName) {
			options.buttons.containerOneClassName = optionsInput.buttons.containerOneClassName;
		}
		if (typeof optionsInput.buttons.containerTwoClassName === typeof options.buttons.containerTwoClassName) {
			options.buttons.containerTwoClassName = optionsInput.buttons.containerTwoClassName;
		}
		if (typeof optionsInput.buttons.buttonClassName === typeof options.buttons.buttonClassName) {
			options.buttons.buttonClassName = optionsInput.buttons.buttonClassName;
		}
		if (typeof optionsInput.buttons.marginTop === typeof options.buttons.marginTop) {
			if (typeof optionsInput.buttons.marginTop >= 0) {
				options.buttons.marginTop = optionsInput.buttons.marginTop;
			}
		}
	}
	if (typeof optionsInput.metadata !== "undefined") {
		if (typeof optionsInput.metadata.exists === typeof options.metadata.exists) {
			options.metadata.exists = optionsInput.metadata.exists;
		}
		if (typeof optionsInput.metadata.title === typeof options.metadata.title) {
			options.metadata.title = optionsInput.metadata.title;
		}
		if (typeof optionsInput.metadata.artist === typeof options.metadata.artist) {
			options.metadata.artist = optionsInput.metadata.artist;
		}
		if (typeof optionsInput.metadata.album === typeof options.metadata.album) {
			options.metadata.album = optionsInput.metadata.album;
		}
		if (typeof optionsInput.metadata.albumArt === typeof options.metadata.albumArt) {
			options.metadata.albumArt = optionsInput.metadata.albumArt;
		}
		if (typeof optionsInput.metadata.containerClassName === typeof options.metadata.containerClassName) {
			options.metadata.containerClassName = optionsInput.metadata.containerClassName;
		}
		if (typeof optionsInput.metadata.titleClassName === typeof options.metadata.titleClassName) {
			options.metadata.titleClassName = optionsInput.metadata.titleClassName;
		}
		if (typeof optionsInput.metadata.artistClassName === typeof options.metadata.artistClassName) {
			options.metadata.artistClassName = optionsInput.metadata.artistClassName;
		}
		if (typeof optionsInput.metadata.albumClassName === typeof options.metadata.albumClassName) {
			options.metadata.albumClassName = optionsInput.metadata.albumClassName;
		}
	}

	var container = options.container;
	container.style.position = "static";
	var width = options.width+"px";
	container.style.width = width;

	var loading = document.createElement("div");
	loading.style.color = options.loading.textColor;
	loading.style.font = options.loading.font;
	loading.innerHTML = options.loading.loadingMsg;
	container.appendChild(loading);

	var waveform = document.createElement("div");
	waveform.style.width = width;
	waveform.style.height = options.waveform.height+"px";
	waveform.style.marginBottom = options.waveform.marginBottom+"px";
	container.appendChild(waveform);

	var bars;
	var barEle = document.createElement("div");
	barEle.style.display = "none";
	barEle.style.width = width;
	container.appendChild(barEle);

	var timeline = document.createElement("div");
	timeline.style.display = "none";
	timeline.style.width = width;
	timeline.style.height = options.timeline.height+"px";
	timeline.style.marginTop = options.timeline.marginTop+"px";
	timeline.style.marginBottom = options.timeline.marginBottom+"px";
	container.appendChild(timeline);
	this.timeline = null;

	var lowerContainer = document.createElement("div");
	lowerContainer.style.display = "none";
	lowerContainer.style.width = "100%";
	lowerContainer.style.marginTop = options.buttons.marginTop+"px";
	var controlsOuter = document.createElement("div");
	controlsOuter.style.flexGrow = "1";
	controlsOuter.className = options.buttons.containerOneClassName;
	var controls = document.createElement("div");
	controls.style.flexGrow = "1";
	controls.className = options.buttons.containerTwoClassName;
	controlsOuter.appendChild(controls);
	lowerContainer.appendChild(controlsOuter);
	if (options.metadata.exists) {
		var metadata = document.createElement("div");
		metadata.style.flexGrow = "1";
		metadata.className = options.metadata.containerClassName;
		var data;
		if (options.metadata.title !== "") {
			data = document.createElement("h2");
			data.innerHTML = options.metadata.title;
			data.className = options.metadata.titleClassName;
			metadata.appendChild(data);
		}
		if (options.metadata.artist !== "") {
			data = document.createElement("div");
			data.innerHTML = options.metadata.artist;
			data.className = options.metadata.artistClassName;
			metadata.appendChild(data);
		}
		if (options.metadata.album !== "") {
			data = document.createElement("div");
			data.innerHTML = options.metadata.album;
			data.className = options.metadata.albumClassName;
			metadata.appendChild(data);
		}
		lowerContainer.appendChild(metadata);
	}
	container.appendChild(lowerContainer);
	var playPause;

	function formatTime(t) {
		var seconds = t%60;
		if (seconds < 10) {
			seconds = "0"+seconds;
		}
		return Math.floor(t/60)+":"+second
	}
	function createControl(text,onClick) {
		var control = document.createElement(options.buttons.type);
		if (options.buttons.type === "button") {
			control.type = "button";
		} else {
			control.href = "javascript:void(0);";
		}
		control.className = options.buttons.buttonClassName;
		control.innerHTML = text;
		control.addEventListener("click",onClick);
		controls.appendChild(control);
		return control;
	}

	this.player = new WaveformPlayer(options.audio.file,waveform,options.waveform.color,options.waveform.refreshRate,options.audio.autoplay);
	this.player.addEventListener("loaded",function() {
		loading.innerHTML = options.loading.decodingMsg;
	});
	this.player.addEventListener("decoded",function() {
		container.removeChild(loading);
		if (options.bars.exists) {
			barEle.style.display = "block";
			bars = new WFPInstanceBars({
				container: barEle,
				waveformPlayer: thisObj.player,
				height: options.bars.height,
				granularity: options.bars.granularity,
				color: options.bars.color,
				clipping: {
					exists: options.bars.clippingExists,
					color: options.bars.clippingColor,
					inertia: options.bars.clippingInertia
				},
				textColor: options.bars.textColor,
				font: options.bars.font,
				margin: {
					top: options.bars.marginTop,
					internal: options.bars.marginInternal,
					bottom: options.bars.marginBottom
				}
			});
		}
		var text = "Play";
		if (options.audio.autoplay) {
			text = "Pause";
		}
		playPause = createControl(text,function() {
			thisObj.player.togglePlay();
		});
		createControl("Stop",function() {
			thisObj.player.stop();
		});
		createControl("Reset",function() {
			thisObj.player.seek(0);
		});
		lowerContainer.style.display = "flex";
		timeline.style.display = "";
		thisObj.timeline = new WFPIntegratedTimeline({
			waveformPlayer: thisObj.player,
			container: timeline,
			visuals: {
				playhead: {
					exists: options.timeline.playhead.exists,
					arrowColor: options.timeline.playhead.arrowColor,
					lineColor: options.timeline.playhead.lineColor
				},
				bar: {
					exists: options.timeline.bar.exists,
					color: options.timeline.bar.color
				},
				delimiters: {
					exists: options.timeline.delimiters.exists,
					color: options.timeline.delimiters.color,
					text: {
						exists: options.timeline.delimiters.text.exists,
						color: options.timeline.delimiters.text.color
					}
				},
				waveform: {
					exists: options.timeline.waveform.exists,
					meanType: options.timeline.waveform.meanType,
					pastColor: options.timeline.waveform.pastColor,
					futureColor: options.timeline.waveform.futureColor,
					meanPastColor: options.timeline.waveform.meanPastColor,
					meanFutureColor: options.timeline.waveform.meanFutureColor,
					clipping: {
						exists: options.timeline.waveform.clippingExists,
						color: options.timeline.waveform.clippingColor
					}
				}
			}
		});
	});
	this.player.addEventListener("decodeerror",options.waveform.decodeError);
	this.player.addEventListener("playstatechange",function(playing) {
		if (playing) {
			playPause.innerHTML = "Pause";
		} else {
			playPause.innerHTML = "Play";
		}
	});
	this.player.addEventListener("aftertick",function() {
		thisObj.timeline.draw(thisObj.player.getPlayhead());
	});
	if (options.audio.loop) {
		this.player.addEventListener("audiodone",function() {
			thisObj.player.togglePlay();
		});
	}
}




