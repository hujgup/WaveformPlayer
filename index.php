<!DOCTYPE html>
<html>
<head>
<!-- TODO:
	Update documentation
-->
	<meta charset="utf-8" />
	<title>Wavefrom Player - Tech Demo</title>
	<link rel="stylesheet" href="/global.css" />
	<link rel="stylesheet" href="/navbar/navbar.css" />
	<link rel="stylesheet" href="style.css" />
	<script src="/libraries/global.js"></script>
	<script src="/libraries/previewList.js"></script>
	<script src="/navbar/navbar.js"></script>
	<script src="/libraries/polyfills/AudioContext.js"></script>
	<script src="waveformPlayer.js"></script>
	<script src="waveformPlayer.timeline.js"></script>
	<script src="waveformPlayer.bars.js"></script>
	<script src="waveformPlayer.interface.js"></script>
	<script src="extractQuery.js"></script>
	<script src="script.js"></script>
	<script>
		var songs = <?php echo json_encode(file_get_contents("songs.xml")); ?>;
	</script>
	<?php
		require_once($_SERVER["DOCUMENT_ROOT"]."libraries/include.php");
	?>
</head>
<body>
	<?php
		f_include($_SERVER["DOCUMENT_ROOT"]."navbar/navbar.htmlt");
	?>
	<div class="content">
		<div id="interface"></div>
	</div>
</body>
</html>
