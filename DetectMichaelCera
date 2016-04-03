// ==UserScript==
// @name         DetectMichaelCera
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Marks Imgur posts from ANewBadlyPhotoshoppedPhotoofMichaelCeraEveryday
// @author       David Sverdlov
// @match        http://imgur.com/gallery/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

function detect() {
    var d = document;
    var classes = d.getElementsByClassName('post-account');
    if (classes.length <= 0) { return; }

    var uname = classes[0];
    if (uname.text == "ANewBadlyPhotoshoppedPhotoofMichaelCeraEveryday") {
        uname.style.backgroundColor = "#FEFEFE";
        uname.parentElement.parentElement.parentElement.style.backgroundColor = 'red';
    } else {
        uname.style.backgroundColor = "";
        uname.parentElement.parentElement.parentElement.style.backgroundColor = "";
    }                   
};

// Detect on clicks
document.addEventListener("click", detect);

// Detect on keyboard navigation
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   if (key == 37 || key == 39) {
       detect();
   }
};

// Detect on pageload
detect();

