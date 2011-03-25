function generateID()
{
    var d = new Date();
    return d.getTimestamp();
}

function selectTab(tabName)
{
    var ts = document.getElementsByTagName('div');
    ts.concat(document.getElementById('tabRow').getElementsByTagName('span'));
    for(var t = 0; t < ts.length; t++)
    {
        ts[t].className = ts[t].className.replace(" selected", "");
        alert(ts[t].className);
    }
    
    document.getElementById(tabName).className += " selected";
    document.getElementById(tabName.replace("tab", "")).className += " selected"
}
