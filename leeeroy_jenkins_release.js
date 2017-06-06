// ==UserScript==
// @name         Jenkins Augmented Release Page
// @namespace    http://dsverdlo.be/
// @version      0.1
// @description  Adds automation to release page
// @author       David Sverdlov
// @match        http://jenkins.url/here/*/m2release/
// @grant        none
// ==/UserScript==

var done = 0;

function findTriggerElement() {
    var els = document.getElementsByTagName('td');
    for(var i = 0; i < els.length ; i++ ) {
        var el = els[i];
        if(el.innerText !== undefined && el.innerText.includes("Username")) {
            return el;
        }
    }
}
function findInputElement(name) {
    var els = document.getElementsByTagName('input');
    for(var i = 0; i < els.length ; i++ ) {
        var el = els[i];
        if(el.name !== undefined && el.name.includes(name)) { 
            return el;
        }
    }
}
function findtr() {   
    var els = document.getElementsByClassName('rowvg-start');
    if(els === undefined || els.length === 0) { return; }
    return els[els.length-1];
}
function findFields() {
    var fields = [];
    var els = document.getElementsByTagName('input');
    for(var i = 0; i < els.length ; i++ ) {
        var el = els[i];
        if(el.name !== undefined && el.name.includes("scmUsername")) {
            fields.push(el);
        } else if(el.name !== undefined && el.name.includes("scmPassword")) {
            fields.push(el);
        }
    }
    return fields;
}

function setUsername(name) {
    if (typeof(Storage) === "undefined") { log("not using LS"); return; }
    localStorage.setItem("username", name);
}
function getUsername() {
    if (typeof(Storage) === "undefined") { log("not using LS"); return; }
    return localStorage.getItem("username");
}

function giveKeyListener() {
    var els = findInputElement("scmUsername");
    if(els === null || els === undefined) { return; }
    els.onkeyup = function(eve) {
        console.log("keyup type: " + typeof(eve) + " " + eve.which );
        try {
            setUsername(els.value);
            var pw = findInputElement("scmPassword");
            pw.value = els.value;
        } catch (ex) {
            log(ex);
        }
        console.log("done with keyup");
    };
}

var popUpShown = false;
function alertPopUp() {
    if(!popUpShown) {
        alert("Leeeroy Jenkins script is currently only accepting int.int format. If you wish to stray from this convention, please check that the related fields are filled out appropriately.");
        popUpShown = true;
    }
}

function doIt() {
    console.log("ohi");
    
    giveKeyListener();
    
    var el = findTriggerElement();
    if(el === undefined) { return; }

    el.onclick = function() { 
        findFields().forEach( function(e) { 
            if(e.value.includes('continuum')) {
                e.value = getUsername();
            } else {
                e.value = "continuum";
            }
        } );
    };
    el.click();
    //
    el = findInputElement("releaseVersion");
    el.onkeyup = function() {
        // Click on show specify custom tag
        if(done === 0) {
            findInputElement("specifyScmTag").click();
            done = done + 1;
        }
        // Copy release version in development version
        try {
            // Check versions
            try {
                if(el.getValue().split(".").length != 2) throw "Length...";
                first = parseInt(el.getValue().split(".")[0]);
                second = parseInt(el.getValue().split(".")[1]);
            } catch(e) {
                alertPopUp();
                return;
            }
            
            first = parseInt(el.getValue().split(".")[0]);
            second = parseInt(el.getValue().split(".")[1]);
            
            var development = findInputElement("developmentVersion");
            var snapshot = "-SNAPSHOT";
            var version = development.getValue().split(snapshot)[0]; // ok
            development.setValue(first + "." + (second + 1) + snapshot);
            
            // Then change scm tag
            var scmtag = findInputElement("scmTag");
            var pretag = scmtag.getValue().split("-");
            var version = pretag[pretag.length - 1]; // ok
            pretag[pretag.length - 1] = first + "." + second + "_" + (new Date().getHours()) + (new Date().getMinutes());
            scmtag.setValue(pretag.join("-"));
        } catch (e) { console.log("whatever " + e);
        }
        
    };
}


setTimeout( doIt , 500);
