


const menu = document.querySelector('#roupa-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');

// Display Roupa Menu
const roupaMenu = () => {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
};

menu.addEventListener('click', roupaMenu);

// Show active menu when scrolling
const highlightMenu = () => {
  const elem = document.querySelector('.highlight');
  const homeMenu = document.querySelector('#home-page');
  const aboutMenu = document.querySelector('#about-page');
  const signupMenu = document.querySelector('#signup');
  let scrollPos = window.scrollY;
  // console.log(scrollPos);

  // adds 'highlight' class to my menu items
  if (window.innerWidth > 960 && scrollPos < 1000) {
    homeMenu.classList.add('highlight');
    aboutMenu.classList.remove('highlight');
    signupMenu.classList.remove('highlight');
    return;
  } else if (window.innerWidth > 960 && scrollPos < 1400) {
    homeMenu.classList.remove('highlight');
    aboutMenu.classList.remove('highlight');
    signupMenu.classList.remove('highlight');
    return;
  } else if (window.innerWidth > 960 && scrollPos < 2345) {
    homeMenu.classList.remove('highlight');
    aboutMenu.classList.remove('highlight');
    signupMenu.classList.remove('highlight');
    return;
  }
  else if (window.innerWidth > 960 && scrollPos < 2345) {
    homeMenu.classList.remove('highlight');
    aboutMenu.classList.remove('highlight');
    signupMenu.classList.remove('highlight');
    return;
  }
  else if (window.innerWidth > 960 && scrollPos < 2345) {
    homeMenu.classList.add('highlight');
    aboutMenu.classList.add('highlight');
    signupMenu.classList.remove('highlight');
    return;
  }

  if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
    elem.classList.remove('highlight');
  }
};

window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);

//  Close roupa Menu when clicking on a menu item
const hideroupaMenu = () => {
  const menuBars = document.querySelector('.is-active');
  if (window.innerWidth <= 768 && menuBars) {
    menu.classList.toggle('is-active');
    menuLinks.classList.remove('active');
  }
};

menuLinks.addEventListener('click', hideroupaMenu);
navLogo.addEventListener('click', hideroupaMenu);



  