
const hamburgerEl = document.querySelector(".navbar__hamburger");
const mobileBarEl = document.querySelector(".mobile__navbar");
const headerLinksEl = document.querySelector(".header__links");
const followLinksEl = document.querySelector(".follow__links");


hamburgerEl.addEventListener("click",function(){
 console.log("hey")
 mobileBarEl.classList.toggle("show");
 // mobileBarEl.classList.toggle("fade");


// Complete it okay
 fadeOut(mobileBarEl)
 
   
})


