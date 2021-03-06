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
	
	var geoInput = document.getElementById('geolocation');
	if (!geoInput.value.trim()) {
		geoInput.focus();
		return;
	}
	
	var obj = {};
	obj['img'] = document.getElementById('img-previewer').src;
	obj['geo'] = geoInput.value;
	
	var items = JSON.parse(window.localStorage.getItem(currentProject));
	var itemId = 'item-' + new Date().getTime();
	items.push(itemId);
	
	try {
		window.localStorage.setItem(itemId, JSON.stringify(obj));
		window.localStorage.setItem(currentProject, JSON.stringify(items));
		onAddNewItem(itemId);
		alert('Your entry has been stored');
	} catch (e) {
		alert('Your entry could not be added: '  + e);
	}
}

function onClickDelImg(itemId) {
	var items = JSON.parse(window.localStorage.getItem(currentProject));
	var newItems = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i] != itemId) {
			newItems.push(items[i]);
		}
	}
	
	window.localStorage.setItem(currentProject, JSON.stringify(newItems));
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
	span.innerHTML = 'X';
	span.title = 'Remove';
	span.setAttribute('onclick', 'onClickDelImg(\'' + itemId + '\')');
	var geoDiv = document.createElement('DIV');
	geoDiv.textContent = 'geolocation: ' + item.geo;
	div.appendChild(img);
	div.appendChild(geoDiv);
	div.appendChild(span);
	document.getElementById('gallery').appendChild(div);
}


/********* functions for geolocation *******/
function onClickGeolocation(input) {
	function _showThrobber(show) {
		document.getElementById('throbber').style.display = show ? 'inline' : 'none';
	}
	input.value = '';
	_showThrobber(true);
	navigator.geolocation.getCurrentPosition(function(position) {
		_showThrobber(false);
		input.value = position.coords.latitude + ',' + position.coords.longitude;
	}, function(positionError) {
		_showThrobber(false);
		alert("geo error code: " + positionError.code);
	});
}
/************* end ************/


/************** functions for adding epiForm to local storage ******************/

function onClickSaveEpiForm() {
	var epiForm = document.getElementById('epiForm');
	if (!epiForm) {
		return;
	}
	
	var socialnetworks = [];
	for (var i = 0; i < epiForm.socialnetworks.length; i++) {
		if (epiForm.socialnetworks[i].checked) {
			socialnetworks.push(epiForm.socialnetworks[i].value);
		}
	}
	
	var epiData = {
		name: epiForm.name.value.trim(),
		age:  epiForm.age.value.trim(),
		sex:  epiForm.sex.value.trim(),
		searchengine:   epiForm.searchengine.value,
		socialnetworks: socialnetworks,
		geolocation:    document.getElementById('geolocation').value.trim(),
		img: document.getElementById('img-previewer').src
	};
	
	// TODO do some checking
	
	var itemsStr = window.localStorage.getItem(currentProject);
	var items = JSON.parse(!itemsStr ? '[]' : itemsStr);
	var itemId = 'item-' + new Date().getTime();
	items.push(itemId);
	
	try {
		window.localStorage.setItem(itemId, JSON.stringify(epiData));
		window.localStorage.setItem(currentProject, JSON.stringify(items));
		// onAddNewItem(itemId);
	} catch (e) {
		alert('Error occurs when adding data to local storage: '  + e);
	}
	
	displayLocalData();
}

function onClickClearEpiData() {
	var itemsStr = window.localStorage.getItem(currentProject);
	var items = JSON.parse(!itemsStr ? '[]' : itemsStr);	
	items.forEach(function(itemId) {
		if (!window.localStorage.getItem(itemId)) {
			return;
		}
		
		window.localStorage.removeItem(itemId);
	});
	
	window.localStorage.removeItem(currentProject);
	displayLocalData();
}
/************** end ************/