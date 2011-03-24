function init() {
	if (null == window.localStorage.getItem('items')) {
		window.localStorage.setItem('items', JSON.stringify([]));
	} else {
		document.getElementById('gallary').innerHTML = '';
		var items = JSON.parse(window.localStorage.getItem('items'));
		for (var i = 0; i < items.length; i++) {
			onAddNewItem(items[i]);
		}
	}
}

window.addEventListener('load', function(even) {
	init();
}, false);

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
		};
	})(document.getElementById('img-previewer'));
	
	reader.onerror = function(event) {
		alert('Error: ' + event);
	};
	
	reader.readAsDataURL(file);
}

function onClickSaveToLocal(input) {
	var dataUrl = document.getElementById('img-previewer').src;
	if (!dataUrl) {
		return;
	}
	
	var obj = {};
	obj['img'] = document.getElementById('img-previewer').src;
	
	var items = JSON.parse(window.localStorage.getItem('items'));
	var itemId = 'item-' + new Date().getTime();
	items.push(itemId);
	
	window.localStorage.setItem('items', JSON.stringify(items));
	window.localStorage.setItem(itemId, JSON.stringify(obj));
	
	onAddNewItem(itemId);
}

function onAddNewItem(itemId) {
	var item = JSON.parse(window.localStorage.getItem(itemId));
	var img = document.createElement('IMG');
	img.className = 'preview-image';
	img.src = item['img'];
	document.getElementById('gallary').appendChild(img);
}