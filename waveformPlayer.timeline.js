function WFPIntegratedTimeline(timelineInput) {
	var thisObj = this;

	if (typeof timelineInput.waveformPlayer.getAudioLength !== "function" || typeof timelineInput.container.tagName !== "string") {
		throw new TypeError("One or more required parameters are undefined or are not the correct type.");
	}

	var timeline = {
		waveformPlayer: timelineInput.waveformPlayer,
		waveformContainerPosition: timelineInput.waveformPlayer.getWaveformContainer(),
		container: timelineInput.container,
		canvases: {
			background: document.createElement("canvas"),
			pastWaveformPreRender: document.createElement("canvas"),
			playheadOverlay: document.createElement("canvas")
		},
		context: {},
		audioLength: timelineInput.waveformPlayer.getAudioLength(),
		width: timelineInput.container.offsetWidth,
		height: timelineInput.container.offsetHeight,
		intensity: {
			clipping: [],
			positive: [],
			negative: [],
			meanPositive: [],
			meanNegative: [],
			heightMax: {
				positive: [],
				negative: []
			},
			heightMean: {
				positive: [],
				negative: []
			}
		},
		visuals: {
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
				color: "black",
				text: {
					exists: true,
					color: "black"
				}
			},
			waveform: {
				exists: true,
				meanType: MeanType.ARITHMETIC,
				pastColor: "black",
				futureColor: "black",
				meanPastColor: "black",
				meanFutureColor: "black",
				clipping: {
					exists: true,
					color: "red"
				}
			}			
		}
	};

	if (typeof timelineInput.visuals !== "undefined") {
		if (typeof timelineInput.visuals.playhead !== "undefined") {
			if (typeof timelineInput.visuals.playhead.exists === typeof timeline.visuals.playhead.exists) {
				timeline.visuals.playhead.exists = timelineInput.visuals.playhead.exists;
			}
			if (typeof timelineInput.visuals.playhead.arrowColor === typeof timeline.visuals.playhead.arrowColor) {
				timeline.visuals.playhead.arrowColor = timelineInput.visuals.playhead.arrowColor;
			}
			if (typeof timelineInput.visuals.playhead.lineColor === typeof timeline.visuals.playhead.lineColor) {
				timeline.visuals.playhead.lineColor = timelineInput.visuals.playhead.lineColor;
			}
		}
		if (typeof timelineInput.visuals.bar !== "undefined") {
			if (typeof timelineInput.visuals.bar.exists === typeof timeline.visuals.bar.exists) {
				timeline.visuals.bar.exists = timelineInput.visuals.bar.exists;
			}
			if (typeof timelineInput.visuals.bar.color === typeof timeline.visuals.bar.color) {
				timeline.visuals.bar.color = timelineInput.visuals.bar.color;
			}
		}
		if (typeof timelineInput.visuals.delimiters !== "undefined") {
			if (typeof timelineInput.visuals.delimiters.exists === typeof timeline.visuals.delimiters.exists) {
				timeline.visuals.delimiters.exists = timelineInput.visuals.delimiters.exists;
			}
			if (typeof timelineInput.visuals.delimiters.color === typeof timeline.visuals.delimiters.color) {
				timeline.visuals.delimiters.color = timelineInput.visuals.delimiters.color;
			}
			if (typeof timelineInput.visuals.delimiters.text !== "undefined") {
				if (typeof timelineInput.visuals.delimiters.text.exists === typeof timeline.visuals.delimiters.text.exists) {
					timeline.visuals.delimiters.text.exists = timelineInput.visuals.delimiters.text.exists;
				}
				if (typeof timelineInput.visuals.delimiters.text.color === typeof timeline.visuals.delimiters.text.color) {
					timeline.visuals.delimiters.text.color = timelineInput.visuals.delimiters.text.color;
				}
			}
		}
		if (typeof timelineInput.visuals.waveform !== "undefined") {
			if (typeof timelineInput.visuals.waveform.exists === typeof timeline.visuals.waveform.exists) {
				timeline.visuals.waveform.exists = timelineInput.visuals.waveform.exists;
			}
			if (typeof timelineInput.visuals.waveform.meanType === typeof timeline.visuals.waveform.meanType) {
				timeline.visuals.waveform.meanType = timelineInput.visuals.waveform.meanType;
			}
			if (typeof timelineInput.visuals.waveform.pastColor === typeof timeline.visuals.waveform.pastColor) {
				timeline.visuals.waveform.pastColor = timelineInput.visuals.waveform.pastColor;
			}
			if (typeof timelineInput.visuals.waveform.futureColor === typeof timeline.visuals.waveform.futureColor) {
				timeline.visuals.waveform.futureColor = timelineInput.visuals.waveform.futureColor;
			}
			if (typeof timelineInput.visuals.waveform.meanPastColor === typeof timeline.visuals.waveform.meanPastColor) {
				timeline.visuals.waveform.meanPastColor = timelineInput.visuals.waveform.meanPastColor;
			}
			if (typeof timelineInput.visuals.waveform.meanFutureColor === typeof timeline.visuals.waveform.meanFutureColor) {
				timeline.visuals.waveform.meanFutureColor = timelineInput.visuals.waveform.meanFutureColor;
			}
			if (typeof timelineInput.visuals.waveform.clipping !== "undefined") {
				if (typeof timelineInput.visuals.waveform.clipping.exists === typeof timeline.visuals.waveform.clipping.exists) {
					timeline.visuals.waveform.clipping.exists = timelineInput.visuals.waveform.clipping.exists;
				}
				if (typeof timelineInput.visuals.waveform.clipping.color === typeof timeline.visuals.waveform.clipping.color) {
					timeline.visuals.waveform.clipping.color = timelineInput.visuals.waveform.clipping.color;
				}
			}
		}
	}

	function computedStyle(ele,style) {
		var computedStyle;
		if (typeof ele.currentStyle !== "undefined") {
			computedStyle = ele.currentStyle;
		} else {
			computedStyle = document.defaultView.getComputedStyle(ele,null);
		}
		return computedStyle[style];
	}

	timeline.pixelsPerSecond = timeline.width/timeline.audioLength;
	timeline.secondsPerPixel = 1/timeline.pixelsPerSecond;
	timeline.granularity = Math.floor(timeline.waveformPlayer.getByteLength()*timeline.secondsPerPixel/(2*timeline.waveformPlayer.getAudioLength()));
	timeline.canvases.background.width = timeline.width;
	timeline.canvases.background.height = timeline.height;
	timeline.canvases.pastWaveformPreRender.width = timeline.width;
	timeline.canvases.pastWaveformPreRender.height = timeline.height;
	timeline.canvases.playheadOverlay.width = timeline.width;
	timeline.canvases.playheadOverlay.height = timeline.height;
	timeline.container.innerHTML = "";
	timeline.container.appendChild(timeline.canvases.background);
	timeline.container.appendChild(timeline.canvases.pastWaveformPreRender);
	timeline.container.appendChild(timeline.canvases.playheadOverlay);
	var rect = timeline.canvases.background.getBoundingClientRect();
	var left = rect.left;
	var top = rect.top;
	var ele = timeline.container.parentElement;
	var position;
	while (ele.tagName.toLowerCase() !== "body") {
		position = computedStyle(ele,"position").toLowerCase();
		if (position === "relative") {
			position = ele.getBoundingClientRect();
			left -= position.left;
			top -= position.top;
		}
		ele = ele.parentElement;
	}
	timeline.canvases.playheadOverlay.style.position = "absolute";
	timeline.canvases.playheadOverlay.style.left = Math.round(left)+"px";
	timeline.canvases.playheadOverlay.style.top = Math.round(top)+"px";
	timeline.canvases.pastWaveformPreRender.style.position = "absolute";
	timeline.canvases.pastWaveformPreRender.style.left = "-100000px";
	timeline.context.background = timeline.canvases.background.getContext("2d");
	timeline.context.pastWaveformPreRender = timeline.canvases.pastWaveformPreRender.getContext("2d");
	timeline.context.playheadOverlay = timeline.canvases.playheadOverlay.getContext("2d");
	timeline.context.background.font = "bold 14px 'Courier New',monospace";

	var maxTextSize = 8*formatTime(Math.floor(timeline.audioLength)).length + 12;
	timeline.visuals.delimiters.separation = 0.0625;
	var tick;
	do {
		if (timeline.visuals.delimiters.separation < 1) {
			timeline.visuals.delimiters.separation *= 2;
		} else if (timeline.visuals.delimiters.separation === 1) {
			timeline.visuals.delimiters.separation = 5;
		} else if (timeline.visuals.delimiters.separation < 15) {
			timeline.visuals.delimiters.separation += 5;
		} else if (timeline.visuals.delimiters.separation === 15) {
			timeline.visuals.delimiters.separation = 30;
		} else if (timeline.visuals.delimiters.separation < 300) {
			timeline.visuals.delimiters.separation += 30;
		} else {
			timeline.visuals.delimiters.separation += 60;
		}
		tick = timeline.visuals.delimiters.separation*timeline.pixelsPerSecond;
	} while (tick < maxTextSize);

	var i = 0;
	var max = timeline.width - tick;
	while (i < max) {
		i += tick;
	}
	timeline.visuals.delimiters.text.renderLast = i + maxTextSize - 8 <= timeline.width;
	delete i;
	delete tick;
	delete max;

	timeline.waveformPlayer.addEventListener("decoded",function() {
		var offsetTop = 19;
		if (timeline.visuals.delimiters.text.exists) {
			offsetTop = 36;
		}
		timeline.visuals.waveform.baseline = Math.round((offsetTop + (timeline.height - 4))/2);
		timeline.visuals.waveform.baselineMinusOne = timeline.visuals.waveform.baseline - 1;
		timeline.visuals.waveform.workspace = timeline.visuals.waveform.baseline - offsetTop;
		var granularity = timeline.waveformPlayer.getWaveformGranularity();
		var data;
		var stereoData;
		var index;
		var j;
		var max = {
			positive: null,
			negative: null,
			stereo: null
		};
		var mean = {
			positive: null,
			negative: null,
			positiveDataPoints: null,
			negativeDataPoints: 0
		};
		var dataAbs;
		var arithmetic = timeline.visuals.waveform.meanType == MeanType.ARITHMETIC;
		var geometric = timeline.visuals.waveform.meanType == MeanType.GEOMETRIC;
		var harmonic = timeline.visuals.waveform.meanType == MeanType.HARMONIC;
		var arithmeticOrHarmonic = arithmetic || harmonic;
		var waveformMin = timeline.visuals.waveform.baseline - timeline.visuals.waveform.workspace;
		var waveformMax = 2*timeline.visuals.waveform.baseline + timeline.visuals.waveform.workspace;
		for (var i = 0; i < timeline.audioLength; i += timeline.secondsPerPixel) {
			data = timeline.waveformPlayer.getWaveformMonoData(timeline.granularity,i).mono;
			stereoData = timeline.waveformPlayer.getWaveformStereoData(timeline.granularity,i);
			index = timeline.intensity.positive.length;
			max.positive = 0;
			max.negative = 0;
			max.stereo = 0;
			if (arithmeticOrHarmonic) {
				mean.positive = 0;
				mean.negative = 0;
			} else if (geometric) {
				mean.positive = 1;
				mean.negative = 1;
			}
			mean.positiveDataPoints = 0;
			mean.negativeDataPoints = 0;
			for (j = 0; j < data.length; j++) {
				data[j] *= -1; // The data was rendering the wrong way around
				if (data[j] > 0) {
					if (data[j] > max.positive) {
						max.positive = data[j];
					}
					if (arithmetic) {
						mean.positive += data[j];
					} else if (geometric) {
						mean.positive *= data[j];
					} else if (harmonic) {
						mean.positive += 1/data[j];
					}
					mean.positiveDataPoints++;
				} else if (data[j] < 0) {
					if (data[j] < max.negative) {
						max.negative = data[j];
					}
					if (arithmetic) {
						mean.negative += data[j];
					} else if (geometric) {
						mean.negative *= -data[j];
					} else if (harmonic) {
						mean.negative += 1/dataAbs;
					}
					mean.negativeDataPoints++;
				}
				stereoData.left[j] = Math.abs(stereoData.left[j]);
				stereoData.right[j] = Math.abs(stereoData.right[j]);
				if (stereoData.left[j] > max.stereo) {
					max.stereo = stereoData.left[j];
				}
				if (stereoData.right[j] > max.stereo) {
					max.stereo = stereoData.right[j];
				}
			}
			timeline.intensity.clipping[index] = max.stereo === 1;
			if (max.positive !== -1) {
				timeline.intensity.positive[index] = timeline.visuals.waveform.baseline - timeline.visuals.waveform.workspace*max.positive;
				timeline.intensity.heightMax.positive[index] = timeline.visuals.waveform.baseline - timeline.intensity.positive[index];
				if (arithmetic) {
					mean.positive /= mean.positiveDataPoints;
				} else if (geometric) {
					mean.positive = Math.pow(mean.positive,1/mean.positiveDataPoints);
				} else if (harmonic) {
					mean.positive = mean.positiveDataPoints/mean.positive;
				}
				timeline.intensity.meanPositive[index] = timeline.visuals.waveform.baseline - timeline.visuals.waveform.workspace*mean.positive;
				timeline.intensity.heightMean.positive[index] = timeline.visuals.waveform.baseline - timeline.intensity.meanPositive[index];
			}
			if (max.negative !== 1) {
				timeline.intensity.negative[index] = timeline.visuals.waveform.baseline - timeline.visuals.waveform.workspace*max.negative;
				timeline.intensity.heightMax.negative[index] = timeline.visuals.waveform.baseline - timeline.intensity.negative[index];
				if (arithmetic) {
					mean.negative /= mean.negativeDataPoints;
				} else if (geometric) {
					mean.negative = -Math.pow(mean.negative,1/mean.negativeDataPoints);
				} else if (harmonic) {
					mean.negative = mean.negativeDataPoints/mean.negative;
				}
				timeline.intensity.meanNegative[index] = timeline.visuals.waveform.baseline - timeline.visuals.waveform.workspace*mean.negative;
				timeline.intensity.heightMean.negative[index] = timeline.visuals.waveform.baseline - timeline.intensity.meanNegative[index];
			}
		}
		timeline.waveformContainerPosition = timeline.waveformContainerPosition.getBoundingClientRect().left;
		timeline.canvases.playheadOverlay.addEventListener("click",function(event) {
			timeline.waveformPlayer.seek((window.scrollX + event.clientX - timeline.waveformContainerPosition)*timeline.secondsPerPixel);
		});
		if (timeline.visuals.bar.exists) {
			timeline.context.background.fillStyle = timeline.visuals.bar.color;
			timeline.context.background.fillRect(0,13,timeline.width,2);
		}
		if (timeline.visuals.delimiters.exists) {
			var tick = timeline.visuals.delimiters.separation*timeline.pixelsPerSecond;
			timeline.context.background.fillStyle = timeline.visuals.delimiters.color;
			for (i = 0; i < timeline.width; i += tick) {
				timeline.context.background.fillRect(Math.round(i),0,1,timeline.height);
			}
			if (timeline.visuals.delimiters.text.exists) {
				var pass;
				var realTicks;
				timeline.context.background.fillStyle = timeline.visuals.delimiters.text.color;
				for (i = 0, realTicks = 0; i < timeline.width; i += tick, realTicks += timeline.visuals.delimiters.separation) {
					pass = true;
					if (timeline.audioLength - realTicks < timeline.visuals.delimiters.separation) {
						pass = timeline.visuals.delimiters.text.renderLast;
					}
					if (pass) {
						timeline.context.background.fillText(formatTime(realTicks),Math.round(i) + 4,28);
					}
				}
			}
		}
		if (timeline.visuals.waveform.exists) {
			var noClipping = !timeline.visuals.waveform.clipping.exists;
			timeline.context.background.fillStyle = timeline.visuals.waveform.futureColor;
			timeline.context.pastWaveformPreRender.fillStyle = timeline.visuals.waveform.pastColor;
			for (i = 0; i < timeline.intensity.positive.length; i++) {
				if (noClipping || !timeline.intensity.clipping[i]) {
					timeline.context.background.fillRect(i,timeline.intensity.positive[i],1,timeline.intensity.heightMax.positive[i]);
					timeline.context.background.fillRect(i,timeline.intensity.negative[i],1,timeline.intensity.heightMax.negative[i]);
					timeline.context.pastWaveformPreRender.fillRect(i,timeline.intensity.positive[i],1,timeline.intensity.heightMax.positive[i]);
					timeline.context.pastWaveformPreRender.fillRect(i,timeline.intensity.negative[i],1,timeline.intensity.heightMax.negative[i]);
				}
			}
			if (timeline.visuals.waveform.clipping.exists) {
				timeline.context.background.fillStyle = timeline.visuals.waveform.clipping.color;
				timeline.context.pastWaveformPreRender.fillStyle = timeline.visuals.waveform.clipping.color;
				for (i = 0; i < timeline.intensity.positive.length; i++) {
					if (timeline.intensity.clipping[i]) {
						timeline.context.background.fillRect(i,waveformMin,1,waveformMax);
						timeline.context.pastWaveformPreRender.fillRect(i,waveformMin,1,waveformMax);
					}
				}
			}
			timeline.context.background.fillStyle = timeline.visuals.waveform.meanFutureColor;
			timeline.context.pastWaveformPreRender.fillStyle = timeline.visuals.waveform.meanPastColor;
			for (i = 0; i < timeline.intensity.positive.length; i++) {
				timeline.context.background.fillRect(i,timeline.intensity.meanPositive[i],1,timeline.intensity.heightMean.positive[i]);
				timeline.context.background.fillRect(i,timeline.intensity.meanNegative[i],1,timeline.intensity.heightMean.negative[i]);
				timeline.context.pastWaveformPreRender.fillRect(i,timeline.intensity.meanPositive[i],1,timeline.intensity.heightMean.positive[i]);
				timeline.context.pastWaveformPreRender.fillRect(i,timeline.intensity.meanNegative[i],1,timeline.intensity.heightMean.negative[i]);
			}
			timeline.context.background.fillRect(0,timeline.visuals.waveform.baselineMinusOne,timeline.width,2);
			timeline.context.pastWaveformPreRender.fillRect(0,timeline.visuals.waveform.baselineMinusOne,timeline.width,2);
		}
	});
	timeline.waveformPlayer.addEventListener("aftertick",function() {
		thisObj.draw(timeline.waveformPlayer.getPlayhead());
	});

	function formatTime(t) {
		var seconds = t%60;
		var minutes = Math.floor(t/60);
		var res = "";
		if (minutes !== 0) {
			if (seconds < 10) {
				seconds = "0"+seconds;
			}
			res += minutes+":";
		}
		return res+seconds;
	}
	this.draw = function(timestamp) {
		timestamp = timestamp*timeline.pixelsPerSecond;
		timeline.context.playheadOverlay.clearRect(0,0,timeline.width,timeline.height);
		if (timeline.visuals.waveform.exists) {
			var x = Math.ceil(timestamp);
			timeline.context.playheadOverlay.drawImage(timeline.canvases.pastWaveformPreRender,0,0,x,timeline.height,0,0,x,timeline.height);
		}
		if (timeline.visuals.playhead.exists) {
			var lowBoundX = timestamp - 8;
			timeline.context.playheadOverlay.fillStyle = timeline.visuals.playhead.lineColor;
			timeline.context.playheadOverlay.fillRect(timestamp - 1,0,2,timeline.height);
			timeline.context.playheadOverlay.fillStyle = timeline.visuals.playhead.arrowColor;
			timeline.context.playheadOverlay.beginPath();
			timeline.context.playheadOverlay.moveTo(lowBoundX,0);
			timeline.context.playheadOverlay.lineTo(timestamp + 8,0);
			timeline.context.playheadOverlay.lineTo(timestamp,16);
			timeline.context.playheadOverlay.lineTo(lowBoundX,0);
			timeline.context.playheadOverlay.closePath();
			timeline.context.playheadOverlay.fill();
		}
	};
}