var survey

function getXML(url, callback)
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            callback(xmlhttp.responseXML);
        }
    }    
}

function parseCtrl(nd)
{
    var ctrl = {options : []};
    var attrName;
    var opt;
    
    ctrl.name = nd.attributes.getNamedItem('ref').value;
    ctrl.type = nd.nodeName;
    ctrl.required = nd.attributes.getNamedItem('required') ? nd.attributes.getNamedItem('required').value : false;
    ctrl.title = nd.attributes.getNamedItem('title') ? nd.attributes.getNamedItem('title').value : false;
    ctrl.chart = nd.attributes.getNamedItem('chart') ? nd.attributes.getNamedItem('chart').value : false;
    
    for(var i = 0; i < nd.childNodes.length; i++)
    {
        
        if(nd.childNodes[i].nodeType != 1) continue;
        if(nd.childNodes[i].nodeName == 'label')
        {
            ctrl.label = nd.childNodes[i].firstChild.data;
            
        }
        else if(nd.childNodes[i].nodeName == 'item')
        {
            opt = {};
            for(var j = 0; j < nd.childNodes[i].childNodes.length; j++ )
            {
                var n = nd.childNodes[i].childNodes[j];
                if(n.nodeType == 1)
                {
                    if(n.nodeName == 'label'){ opt.label = n.firstChild.data; }
                    if(n.nodeName == 'value'){ opt.value = n.firstChild.data; }
                }
            }
            ctrl.options.push(opt);
        }   
    }
    return ctrl;
}

function addOptions(ele, ctrl)
{
   /* ctrl.options = [];
    var opts = ele.getElementsByTagName('item');
    for(var i = 0; i < opts.length; i++)
    {
        ctrl.options.push({
            label : ele.getElementByTagName('label')[0].firstChild.data,
            value : ele.getElementByTagName('value')[0].firstChild.data
        })
    }*/
    return ctrl;
}


function parseXML(xml)
{
    var form = {controls : []};
    var ctrl = {};
    xml = xml.firstChild;
    
    for(var i = 0; i < xml.childNodes.length; i++){    
        if(xml.childNodes[i].nodeType != 1) continue;
        switch(xml.childNodes[i].nodeName)
        {
            case "model":
                var model = xml.getElementsByTagName("submission")[0];
                form.id = model.getAttribute('id');
                form.name = model.getAttribute('projectName');
                form.version = model.getAttribute('versionNumber');
                
                break;
            case "input":
                ctrl = parseCtrl(xml.childNodes[i]);
                break;
            case "select1":
                ctrl = parseCtrl(xml.childNodes[i]);
                //ctrl = addOptions(xml.childNodes[i], ctrl);
                break;
            case "select":
                ctrl = parseCtrl(xml.childNodes[i]);
                //ctrl = addOptions(xml.childNodes[i], ctrl);
                break;  
        }
        if(ctrl.options) form.controls.push(ctrl);
    }
    return form;
}

function drawForm(form, target)
{
    if(typeof target == "string")
    {
        target = document.getElementById(target);
    }
    
    target.appendChild(createDOMElement('h2', 'header', '', form.name + ' v ' + form.version));
    
    var frm = createDOMElement('form', 'epiForm', '', '');
    for(var i = 0; i < form.controls.length; i++)
    {
        frm.appendChild(createHtml5FormControl(form.controls[i]));
    }
    
    target.appendChild(frm);
    
}

function createHtml5FormControl(ctrl)
{
    var tags = {
        select1 : 'select',
        input : 'input',
        select : 'div'
    }
    var d = createDOMElement('div', '', 'ctrlRow', '');
    d.appendChild(createDOMElement('span', '', 'controlLabel', ctrl.label));
    var c = createDOMElement(tags[ctrl.type], ctrl.name, 'ctrl', '', ctrl);
    switch(ctrl.type)
    {
        case 'select' :
            for(var o = 0; o < ctrl.options.length; o++)
            {
                c.appendChild(createDOMElement('span', '', 'optionLabel', ctrl.options[o].label));
                c.appendChild(createDOMElement('input', ctrl.options[o].value, '', '',{ type : 'checkbox', name : ctrl.name, value : ctrl.options[o].value}));
            }
            break;
        case 'input' :
            break;
        case 'select1' :
            for(var o = 0; o < ctrl.options.length; o++)
            {
                c.appendChild(createDOMElement('option', '', '', ctrl.options[o].label, {value : ctrl.options[o].value}));
                
            }
            break;
    }
    d.appendChild(c)
    return d;
}

function createDOMElement(tagName, id, className, content, attributes)
{
    var ele = document.createElement(tagName);
    ele.id = id;
    ele.className = className;
    ele.appendChild(document.createTextNode(content));
    if(attributes)
    {
        for(att in attributes){
            ele.setAttribute(att, attributes[att]);
        }
    }
    return ele;
}

function displayLocalData()
{
    var fields = [];
    if(document.getElementById('localData').tHead.rows.length > 0) document.getElementById('localData').tHead.deleteRow(0);
    while( document.getElementById('localData').tBodies[0].rows.length > 0) document.getElementById('localData').tBodies[0].deleteRow(0);
    
    for(var h = 0; h < form.controls.length; h++)
    {
        fields.push(form.controls[h].name);
    }
    fields.push('geolocation');
    fields.push('img');
    var hr = document.getElementById('localData').tHead.insertRow(0);
    
    for(var f = 0; f < fields.length; f++)
    {
        var he = createDOMElement('th', '', '', fields[f]);
        hr.appendChild(he);
    }
   // document.getElementById('localData').appendChild(hr);
    
    var ents = JSON.parse(window.localStorage.getItem('items'));
    var r;
    for(var i = 0; i < ents.length; i++)
    {
        item = JSON.parse(window.localStorage.getItem(ents[i]));
        r = document.getElementById('localData').tBodies[0].insertRow(0);
        for(var f = 0; f < fields.length; f++)
        {
            var he = createDOMElement('td', '', '', fields[f] == 'img' ? '' : item[fields[f]]);
            if(fields[f] == 'img') he.appendChild(createDOMElement('img', '','','',{src : item[fields[f]]}) );
            r.appendChild(he);
        }
    }
}