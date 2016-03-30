function extractQuery() {
	var query = location.href.split("?");
	query = query[query.length - 1].split("&");
	var res = {};
	for (var i = 0; i < query.length; i++) {
		query[i] = query[i].split("=");
		res[query[i][0]] = query[i][1];
	}
	return res;
}