function init() {
	if (null == window.localStorage.getItem('items')) {
		window.localStorage.setItem('items', JSON.stringify([]));
	} else {
		document.getElementById('gallery').innerHTML = '';
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

function onClickDelImg(itemId) {
	var items = JSON.parse(window.localStorage.getItem('items'));
	var newItems = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i] != itemId) {
			newItems.push(items[i]);
		}
	}
	
	window.localStorage.setItem('items', JSON.stringify(newItems));
	window.localStorage.removeItem(itemId);
	document.getElementById(itemId).parentNode.removeChild(document.getElementById(itemId));
}

function onAddNewItem(itemId) {
	var item = JSON.parse(window.localStorage.getItem(itemId));
	var div = document.createElement('DIV');
	div.id = itemId;
	var img = document.createElement('IMG');
	img.className = 'preview-image';
	img.src = item['img'];
	var span = document.createElement('SPAN');
	span.className = 'img-del';
	span.innerHTML = 'Del';
	span.setAttribute('onclick', 'onClickDelImg(\'' + itemId + '\')');
	div.appendChild(img);
	div.appendChild(span);
	document.getElementById('gallery').appendChild(div);
}