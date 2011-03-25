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

function parseCtrl(ele)
{
    ctrl = {
        name : ele.getAttribute('ref'),
        type : ele.tagName,
        required : ele.getAttribute('required'),
        title: ele.getAttribute('title'),
        chart : ele.getAttribute('chart'),
        label : ele.getElementByTagName('label')[0].firstChild.data
    };
    return ctrl;
}

function addOptions(ele, ctrl)
{
    ctrl.options = [];
    var opts = ele.getElementsByTagName('item');
    for(var i = 0; i < opts.length; i++)
    {
        ctrl.options.push({
            label : ele.getElementByTagName('label')[0].firstChild.data,
            value : ele.getElementByTagName('value')[0].firstChild.data
        })
    }
    return ctrl;
}


function parseXML(xml)
{
    var form = {controls : []};
    var ctrl = {};
    
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
                ctrl = parseCtrl(xml.childNode[i]);
                break;
            case "select1":
                ctrl = parseCtrl(xml.childNode[i]);
                ctrl = addOptions(xml.childNode[i], ctrl);
                break;
            case "select":
                ctrl = parseCtrl(xml.childNode[i]);
                ctrl = addOptions(xml.childNode[i], ctrl);
                break;  
        }
        form.controls.push(ctrl);
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
    
    var frm = createDOMElement('form', 'epiForm', '');
    for(var i = 0; i < form.controls.length; i++)
    {
        frm.appendChild(createDOMElement('span', '', 'controlLabel', form.controls[i].label));
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
    var c = createDOMElement(tags[ctrl.type], ctrl.name, 'ctrl', '', ctrl);
    switch(ctrl.type)
    {
        case 'select' :
            for(var o = 0; o < ctrl.options.length; o++)
            {
                c.appendChild(createDOMElement('span', '', 'optionLabel', ctrl.options[o].label));
                c.appendChild(createDOMElement('input', ctrl.options[o].value, '', '',{ type : 'checkbox', name : ctrl.options[o].value}));
            }
            break;
        case 'input' :
            break;
        case ' select1' :
            for(var o = 0; o < ctrl.options.length; o++)
            {
                c.appendChild(createDOMElement('option', '', 'optionLabel', ctrl.options[o].label, {value : ctrls.options[o].value}));
                
            }
            break;
    }
    
}

function createDOMElement(tagName, id, className, content, attributes)
{
    var ele = document.createElement(tagName);
    ele.id = id;
    ele.className = className;
    ele.innerHtml = content;
    if(attributes)
    {
        for(att in attributes){
            ele.setAttribute(att, attributes[att]);
        }
    }
    return ele;
}