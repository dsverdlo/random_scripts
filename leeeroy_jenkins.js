// ==UserScript==
// @name         Leeeroy Jenkins
// @namespace    http://dsverdlo.be/
// @version      0.1
// @description  Adds some features to the standard Jenkins tool
// @author       David Sverdlov
// @match        http://gensvl4002.gen.volvocars.net:8082/*
// @grant        none
// ==/UserScript==

  //////////////////////////////////////////////////////////////
 // CUSTOMIZABLE FEATURES  -- change your preferences here   //
//////////////////////////////////////////////////////////////
var alpha = '0.1'; // how transparent the background color should be
function customizeEntities(element) {
    element.style.backgroundColor = 'rgba(255, 255, 255, '+alpha+')';
    element.style.fontStyle = "italic";
}
function customizeServices(element) {
    element.style.backgroundColor = 'rgba(230, 230, 0, '+alpha+')';
}
function customizeTclient(element) {
    element.style.backgroundColor = 'rgba(0, 0, 200, '+alpha+')';
}
function customizeBatch(element) {
    element.style.color = 'darkred';
}







  //////////////////////////////////////////////////////////////
 // CRAPPY CODE  -- explore at your own risk of insanity     //
//////////////////////////////////////////////////////////////


var DEBUG = false;
var LS_KEY = 'HIGHLIGHT';

function addToLS(module) {
    if (typeof(Storage) === "undefined") { log("not using LS"); return; }

    // Get the modules (make them if they were empty)
    var modules = localStorage.getItem(LS_KEY);
    if(modules === undefined || modules === null) {
        localStorage.setItem(LS_KEY, JSON.stringify([]));
    }
    modules = JSON.parse(JSON.parse(localStorage.getItem(LS_KEY)));


    // Add the module as the last one clicked
    modules.push(module);

    // Store it in the storage again
    localStorage.setItem(LS_KEY, JSON.stringify(modules));
}

// Remove all values from LS
function clearLS() {
    if (typeof(Storage) === "undefined") { log("not using LS"); return; }

    localStorage.setItem(LS_KEY, JSON.stringify([]));
}

// Get all values from the local storage in an array or something
function getFromLS() {
    if (typeof(Storage) === "undefined") { log("not using LS"); return; }

    // Get the modules (make them if they were empty)
    var modules = localStorage.getItem(LS_KEY);
    if(modules === undefined || modules === null) {
        localStorage.setItem(LS_KEY, JSON.stringify([]));
    }
    modules = JSON.parse(JSON.parse(localStorage.getItem(LS_KEY)));
    return modules;
}

function isModuleInLS(module) {
    if (typeof(Storage) === "undefined") { log("not using storage :'("); return false; }
    //log("gettin from storage.");

    // Get the modules (make them if they were empty)
    var modules = localStorage.getItem(LS_KEY);
    if(modules === undefined || modules === null) {
        localStorage.setItem(LS_KEY, JSON.stringify([]));
    }
    
    modules = JSON.parse(JSON.parse(localStorage.getItem(LS_KEY)));  // don't ask me why

    var i = modules.indexOf(module);
    
    return i >= 0;
}


function customizeModuleIfInLS(element) {
    log("customizeModuleIfInLS - " + element);
    
    if(element.innerText === null || element.innerText === undefined || element.innerText === "") {
        return;
    }
    
    // Make it bigger / smaller
    if(isModuleInLS(element.innerText)) {
        log("customizeModuleIfInLS - Customizing: " + element.innerText);
        element.style.fontSize = 'larger';
        element.style.fontWeight = 'bold';
    } else {
        log("customizeModuleIfInLS - Uncustomizing: " + element.innerText);
        if(element.style.fontWeight == 'bold') {
            element.style.fontSize = 'inherit';
            element.style.fontWeight = '';
        }
    }
    
    // Customize it 
    
    if(element.innerText.toLowerCase().includes('tclient')) {
       customizeTclient(element);
    } 
    
    if(element.innerText.toLowerCase().includes('entities')) {
           customizeEntities(element);
    } 
    
    if(element.innerText.toLowerCase().includes('services')) {
            customizeServices(element);
    } 
    
    if(element.innerText.toLowerCase().includes('mcr')) {
            customizeBatch(element);
    } 
    
    if(element.innerText.toLowerCase().includes('mcn')) {
            customizeBatch(element);
    }
    
    if(element.innerText.toLowerCase().includes('mck')) {
            customizeBatch(element);
    }
}


function conv(char) {
    return char.charCodeAt() - 32;
}
function addHR(el) {
    var tr = el.parentElement.parentElement;
    if(tr.tagName.toLowerCase() == "tr") {
        tr.style.borderTop = "1px solid rgba(0, 0, 200, 0.15)";
    } else {
        log("Received element " + el + " which has parent parent: " + tr.tagName);
    }
}
function addRemoveModule(el, module) {
    var tr = el.parentElement.parentElement;
    if(tr.tagName.toLowerCase() == "tr") {
        tr.ondblclick = function(){
            var input = document.getElementById('leeeroy_jenkins_input');
            if(input === null) { return; }
            var modules = getFromLS();
            if(modules !== null && modules.includes(module)) {
                log("addRemoveModule - Module "+module+" was found... clearing all and adding other modules!");
                clearLS();
                for(var i = 0; i < modules.length; i++) {
                    if(modules[i] != module) {
                        log("addRemoveModule - Module adding: " + modules[i]);
                        addToLS(modules[i]);
                    }
                }
            } else {
                log("addRemoveModule - Module not found... adding: " + module);
                addToLS(module);
            }
            log("addRemoveModule - done, repopulate input field by simulating keyup");
            //input.dispatchEvent(new KeyboardEvent('keyup',{'key':'a'}));
            refreshData(input);
            colorIt();
        };
    } else {
        log("addRemoveModule - !! Received element " + el + " which has parent parent: " + tr.tagName);
    }
}

function injectelement() {
    log("Looking to inject");
    var exists = document.getElementById('leeeroy_jenkins_input');
    if(exists !== null) { log("Already exists"); return; }

    // Most global elementDir
    var elementDir = document.createElement('dir');
    elementDir.class = "container-fluid pane-frame";
    elementDir.id = 'leeeroy_jenkins_dir';
    
    // With header
    var elementDirHeader = document.createElement('div');
    elementDirHeader.class = "col-xs-24 pane-header";
    elementDirHeader.innerText = "LEEROY configurations";
    elementDir.appendChild(elementDirHeader);
    
    var elementDirField = document.createElement('dir');
    var elementDirFieldInput = document.createElement('textarea');
    elementDirFieldInput.id = 'leeeroy_jenkins_input';
    elementDirFieldInput.style.width = "250px";
    elementDirFieldInput.onkeyup = function(eve) {
        log("keyup inputfield type" + typeof(eve) + eve.which );
        try {
            var inputelement = document.getElementById('leeeroy_jenkins_input');
            
            if(eve.which == 13) {
                inputelement.rows += 1;
                return ;
            }
            
            var modules = inputelement.value.split("\n");
            
            inputelement.style.backgroundColor = '';
            
                clearLS();
                for(var i=0; i<modules.length; i++) {
                    log("input field -- adding " + modules[i]);
                    addToLS(modules[i]);

            }
            log("all good, recolor");
            refreshData();
            colorIt();
        } catch (ex) {
            log(ex);
            el.style.backgroundColor = 'red';
        }
        log("done with keyup of input field");
    };
    elementDirField.appendChild(elementDirFieldInput);
    // end element dir field

    var injecthere = document.getElementById('side-panel');
    if(injecthere === null) {
        log("Could not find side panel to inject in");
        return;
    }
    
    //refreshData(elementDirFieldInput);
    elementDir.appendChild(elementDirField);
    
    injecthere.appendChild(elementDir);
    log("injected input element");
    
    // If we are not in debug, don't show this panel
    if(!DEBUG) {
        elementDir.style.display = 'none';
    }

}

function refreshData(ele) {
    var elementDirFieldInput = ele;
    if(ele === null || ele === undefined) {
        elementDirFieldInput = document.getElementById('leeeroy_jenkins_input');
    }
    if(elementDirFieldInput === null || elementDirFieldInput === undefined) { return; }
    var modules = getFromLS();
    elementDirFieldInput.value = modules.toString().replace(new RegExp(",", 'g'),"\n");
    elementDirFieldInput.rows = modules.length;
    
}

function log(o) {
    if(DEBUG) {
        console.log(o);
    }
}

function colorIt() {
    injectelement(); // create and inject elements
    refreshData(); // add data to element

    var links = document.getElementsByClassName('model-link inside');
    var lastModule = "";
    log("Links found: " + links.length);
    for(var i=0; i < links.length; i++) {

        var link = links[i];
        //console.log(link);
        if(link.innerText === undefined ||
           link.innerText === "" ||
           link.innerText[0] == "#") { continue; }
        
        var module = link.innerText.split(" ")[0];
        //console.log("last("+lastModule+") =?= curr("+module+")");
        if(lastModule !== "" && module != lastModule) {
            addHR(link);
        }
        lastModule = module;
        
        // give double click function
        addRemoveModule(link, link.innerText);

        customizeModuleIfInLS(link);
        /*
        if(link.innerText.includes('tclient')) {
            customizeModuleIfInLS("tclient", link);
        } else if(link.innerText.includes('entities')) {
            customizeModuleIfInLS("entities", link);
        } else if(link.innerText.includes('services')) {
            customizeModuleIfInLS("services", link);
        } else if(link.innerText.toLowerCase().includes('mcr')) {
            customizeModuleIfInLS("batch", link);
        } else if(link.innerText.toLowerCase().includes('mcn')) {
            customizeModuleIfInLS("batch", link);
        } else if(link.innerText.toLowerCase().includes('mck')) {
            customizeModuleIfInLS("batch", link);
        }*/
    }
}

var done = 0;
setTimeout(function() { colorIt(); done++; }   , 0);
setTimeout(function() { if(done++ === 0) colorIt(); }   , 1000);
setTimeout(function() { if(done++ === 0) colorIt(); }   , 2000);
setTimeout(function() { if(done++ === 0) colorIt(); }   , 5000);
