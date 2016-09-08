// ==UserScript==
// @name         YourSerie hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds functionality to yourserie.com. Some hotkeys for navigation, other for hiding series that I don't watch.
// @author       David Sverdlov
// @match        http://www.yourserie.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

// Todo: Documentation
var collapsed = false;

var collapse = localStorage.getItem('collapse');
if(!collapse) {
    localStorage.setItem('collapse', JSON.stringify(['MasterChef', 'Americas Got Talent']));
}
collapse = JSON.parse(localStorage.getItem('collapse'));
console.log("I know: " + collapse);
    

function coll(title) {
    for(var i = 0; i < collapse.length; i++) {
        if( title.toLowerCase().includes(collapse[i].toLowerCase()) ) {
            return true;
        }
    }
    return false;
}

function toggleDisplay(el) {
    if (el.style.display == 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

function conv(char) {
return char.charCodeAt() - 32;
}

function collapseArticles() {
    var items = document.getElementsByClassName('entry-title');
    var display = "none";
   if(collapsed) {
       display = "block";
   }
    collapsed = !collapsed;
       
   for(var i = 0; i < items.length; i++) {
       if( coll(items[i].firstChild.innerText) ) {
           //toggleDisplay(items[i].parentElement.parentElement);
           items[i].parentElement.parentElement.style.display = display;
       }
   }
}

//document.addEventListener("DOMContentLoaded", collapseArticles);

document.addEventListener("keyup", function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
    if (key == conv('x')) {
        var x = e.clientX, y = e.clientY,
            elementMouseIsOver = document.elementFromPoint(x, y);
        elementMouseIsOver = window.getSelection().anchorNode.parentNode; // chrome and ff only?
        //alert('Got an: ' + elementMouseIsOver);
        var article = upUntil(elementMouseIsOver, 'article');
        if(!article) {
            alert('No article found, please try again.');
            return;
        }
        var title = article.getElementsByTagName('header')[0].innerText;
        var matches = new RegExp(" S[0-9]{2}.*").exec(title);
        if (matches) {
            title = title.substr(0, title.indexOf(matches[0]));
        } else {
            title = title.split(' ')[0];
        }
        if (!collapse.includes(title)) {
            collapse.push(title);
            console.log('Added: '+title);
            localStorage.setItem('collapse', JSON.stringify(collapse));
            alert('Added ' + title);
        }
    } else if ( key == conv('h') ) {
        alert("Press J for next page. Press X to block a selected article. Press C to collapse them. Currently blocking articles: " + JSON.parse(localStorage.getItem('collapse')));
    }
});

function upUntil(el, elname) {
    console.log("Got: " + el.tagName + " but looking for: " + elname);
    if(el) {
        if(el.tagName.toLowerCase() == elname) {
            return el;
        } else {
            return upUntil(el.parentElement, elname);
        }
    } else {
        return null;
    }
}

function getHTMLbar() {
    var collapseString = "Blocking: ";
    collapse.forEach(function(element, index, array) {
        collapseString += element + ", ";
    });

    var bar = '<input type="text" value="' + collapseString + '" />';
    return ''; // abort for now
    return '<li id="menu-item-block" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-121392">' + bar + '</li>';
}

(function() {
    'use strict';

    // on loading:
    var menu = document.getElementById('menu-menu1');
    menu.innerHTML += getHTMLbar();
    
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   if (key == conv('c')) { // collapse unwanted posts
       collapseArticles();
   }else if (key == conv('j')) { // go to next page
       var nexts = document.getElementsByClassName('next page-numbers');
       if(nexts.length > 0) {
           nexts[0].click();
       } else {
           alert('Next button not found!');
       }
   }
}
    collapseArticles();
    
})();

