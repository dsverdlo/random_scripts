// ==UserScript==
// @name         Filter 9gag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter away annoying posts
// @author       dsverdlo
// @match        https://9gag.com/trending
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9gag.com
// @grant        none
// ==/UserScript==

let CATEGORY_DIM_THESE = [ ];
let CATEGORY_REMOVE_THESE = ['Latest News', 'Warhammer', 'Politics', 'Car', 'Promoted', 'Anime & Manga', 'Sport', 'Football', 'Elden Ring🆕', 'Formula 1🆕', 'Superhero'];
let TITLE_DIM = ['Ukrain', 'Poland', 'Putin', 'Russia', 'FIFA', 'UEFA', 'Politics', 'Warhammer 40K', 'Zelensky', 'Kyiv'];

function main() {

  let sections = document.getElementsByClassName("section");
  for(let section of sections) {
   if(CATEGORY_DIM_THESE.indexOf(section.text.trim()) > -1) { dimPost(section); continue; }
   if(CATEGORY_REMOVE_THESE.indexOf(section.text.trim()) > -1) { removePost(section); continue; }
   for(let titleWord of TITLE_DIM) {
    if(doesPostTitleContainThis(section, titleWord)) { console.log("> Detected: " + titleWord); dimPost(section); break; }
   }
  }
}

function doesPostTitleContainThis(section, titleWord) {
	let postTitle = section.parentElement.parentElement.parentElement.getElementsByTagName('H1')[0].textContent;
	return postTitle.toLowerCase().indexOf(titleWord.toLowerCase()) > -1;
}

let removedCounter = 0;
function removePost(section) {
   let post = section.parentElement.parentElement.parentElement.parentElement;
   //post.remove();
    post.style.display = 'none';
    removedCounter += 1;
   console.log("> Deleted a shitty " + section.text + " post (total: " + removedCounter + ")");
}

function dimPost(section) {
	let dimOpacity = 0.07;
   let post = section.parentElement.parentElement.parentElement.parentElement;
   post.style.opacity = dimOpacity;
   post.onmouseover = function() { post.style.opacity = 1; }
   post.onmouseleave = function() { post.style.opacity = dimOpacity; }
}




let lastKnownScrollPosition = 0;
let scrollLengthBeforeChecking = 500;
let lastPostsCheckedAtPos = 0;
let ticking = false;

function hasDecimals(num) { return num % 1 != 0; }
function doSomething(scrollPos) {
  let posFromLastChecking = (lastKnownScrollPosition - lastPostsCheckedAtPos);
  if(hasDecimals(scrollPos)) {
    return;
  }
  if(scrollLengthBeforeChecking-posFromLastChecking>0)
	console.log("ScrollPos is now: " + scrollPos + " (" + (scrollLengthBeforeChecking-posFromLastChecking) + " before check again)");
  if( posFromLastChecking > scrollLengthBeforeChecking ) {
    console.log("*************************************************");
    console.log("Checking to delete posts!");
    console.log("*************************************************");
	lastPostsCheckedAtPos = lastKnownScrollPosition;
	main();
  } else {
    //console.log("Not yet! ");
  }
}

document.addEventListener('scroll', function(e) {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
});

main();
