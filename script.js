// Navbar toggle
let openNav = document.querySelector('#open');
let closeNav = document.querySelector('#close');
let bottomLinks = document.querySelector('.bottom_links');

// Open navbar
openNav.addEventListener('click', function () {
    bottomLinks.classList.add('active');
    openNav.style.display = 'none';
    closeNav.style.display = 'block';
});

// Close navbar
closeNav.addEventListener('click', function () {
    bottomLinks.classList.remove('active');
    openNav.style.display = 'block';
    closeNav.style.display = 'none';
});