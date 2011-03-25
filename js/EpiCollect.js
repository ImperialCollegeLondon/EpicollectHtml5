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
        if(xml.childNode[i].nodeType != 1) continue;
        switch(xml.childNode[i].tagName)
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
    }
    
}