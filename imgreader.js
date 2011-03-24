function onchange_file(input) {
	var file = input.files[0];
	
	//alert(file.type);
	var imageType = /image.*/i;	
	if (!file.type.match(imageType)) {
		return;
	}
	
	var reader = new FileReader();
	reader.onload = (function(aImg) {
		return function(e) {
			aImg.src = e.target.result;
			document.getElementById('file-info').textContent  = aImg.src;
		};
	})(document.getElementById('img-previewer'));
	
	reader.onerror = function(event) {
		alert('Error: ' + event);
	};
	
	reader.readAsDataURL(file);
}