// ==UserScript==
// @name         Hide Suggested Posts
// @namespace    http://yourmom.net/
// @version      0.1
// @description  Hide suggested posts in my facebook feed, because fuck that
// @author       David 
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    //console.log(mutations, observer);
    // Your code here...
    myFunction();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
    subtree: true,
    attributes: true
    //...
});


function myFunction() {
    //console.log('looking for suggested posts');
    var d = document;
    var classes = d.getElementsByClassName('_5g-l');
    for(var i = 0; i < classes.length; i++) {
        //alert('Found one!');
        var el = classes[i];
        if(el.firstChild.textContent.startsWith('Suggested')) {
            var block = el.parentElement.parentElement.parentElement.parentElement.parentElement;
            for(var j = 0; j < block.children.length; j++) {
                block.removeChild(block.children[j]);
            };
            block.textContent = 'Deleted lol';
        }
    }
};

