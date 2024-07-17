const observer = new IntersectionObserver((entries) =>{
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting){
      entry.target.classList.add('show');
    }
  });
});

const homeElements = document.querySelectorAll('.home');
homeElements.forEach((el) => observer.observe(el));
const columnProjectsElements = document.querySelectorAll('.columnProjects');
columnProjectsElements.forEach((el) => observer.observe(el));
const mainColumnAboutMeElements = document.querySelectorAll('.mainColumnAboutMe');
mainColumnAboutMeElements.forEach((el) => observer.observe(el));
const aboutMeElements = document.querySelectorAll('.columnAboutMe');
aboutMeElements.forEach((el) => observer.observe(el));
const aboutMe2Elements = document.querySelectorAll('.columnAboutMe2');
aboutMe2Elements.forEach((el) => observer.observe(el));
const resumeContainer = document.querySelector('.resumeContainer');
observer.observe(resumeContainer);



const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
  "#a945c7",
  "#a945c7",
  "#AE4FCA",
  "#AE4FCA",
  "#B55CCF",
  "#B55CCF",
  "#BB67D3",
  "#C172D7",
  "#CE7FE4",
  "#D689EC",
  "#DF90F6",
  "#E19CF5",
  "#E2A9F2"
];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
  
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();


document.addEventListener('DOMContentLoaded', () => {
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  const carousel = document.querySelector('.carousel-cards');
  const cards = document.querySelectorAll('.card');
  let currentIndex = 0;

  const cardWidth = cards[0].clientWidth; 
  const maxIndex = cards.length - 1;

  prev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + maxIndex) % maxIndex; 
    carousel.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
  });

  next.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % maxIndex; 
    carousel.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
  });
});



document.addEventListener('DOMContentLoaded', function() {
  var skillSection = document.getElementById('skillId');
  var hasAnimated = false;

  window.addEventListener('scroll', function() {
    if (!hasAnimated && isElementInViewport(skillSection)) {
      animateCards();
      hasAnimated = true;
    }
  });
});

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

function animateCards() {
  var cards = document.querySelectorAll('.card');
  cards.forEach(function(card, index) {
    setTimeout(function() {
      card.classList.add('animate-slide');
    }, index * 200); // Adjust the delay here if needed
  });
}


// Lista de las URLs de las imágenes
var imageUrls = [
  "Images/projects/Osc1.png",
  "Images/projects/Osc2.png",
  "Images/projects/Osc3.png",
  "Images/projects/Osc4.png"
];

// Obtén el elemento de la imagen
var imgElement = document.getElementById("imgOsc");

// Variable para llevar el conteo de la imagen actual
var currentImageIndex = 0;

// Función para cambiar la imagen cada 3 segundos con animación de transición
function changeImageWithTransition() {
  // Desvanece la imagen actual cambiando su opacidad a 0
  imgElement.style.opacity = 0;

  // Después de un breve retraso, cambia la imagen y restaura la opacidad a 1
  setTimeout(function() {
    // Cambia la fuente de la imagen al siguiente URL
    imgElement.src = imageUrls[currentImageIndex];

    // Incrementa el índice para apuntar a la siguiente imagen
    currentImageIndex++;

    // Si llegamos al final de la lista de imágenes, volvemos al principio
    if (currentImageIndex === imageUrls.length) {
      currentImageIndex = 0;
    }

    // Hace que la imagen aparezca gradualmente restaurando su opacidad a 1
    imgElement.style.opacity = 1;
  }, 500); // Espera 500 milisegundos (0.5 segundos) antes de cambiar la imagen
}

changeImageWithTransition();

// Llama a la función changeImageWithTransition() cada 3 segundos
setInterval(changeImageWithTransition, 3000); // Intervalo de cambio de imagen cada 3 segundos


// Lista de las URLs de las imágenes
var imageUrlsPadi = [
  "Images/projects/CasaPadi/1.png",
  "Images/projects/CasaPadi/2.png",
  "Images/projects/CasaPadi/3.png",
  "Images/projects/CasaPadi/4.png"
];

// Obtén el elemento de la imagen
var imgElementPadi = document.getElementById("imgPadi");

// Variable para llevar el conteo de la imagen actual
var currentImageIndexPadi = 0;

// Función para cambiar la imagen cada 3 segundos con animación de transición
function changeImageWithTransitionPadi() {
  // Desvanece la imagen actual cambiando su opacidad a 0
  imgElementPadi.style.opacity = 0;

  // Después de un breve retraso, cambia la imagen y restaura la opacidad a 1
  setTimeout(function() {
      // Cambia la fuente de la imagen al siguiente URL
      imgElementPadi.src = imageUrlsPadi[currentImageIndexPadi];

      // Incrementa el índice para apuntar a la siguiente imagen
      currentImageIndexPadi++;

      // Si llegamos al final de la lista de imágenes, volvemos al principio
      if (currentImageIndexPadi === imageUrlsPadi.length) {
          currentImageIndexPadi = 0;
      }

      // Hace que la imagen aparezca gradualmente restaurando su opacidad a 1
      imgElementPadi.style.opacity = 1;
  }, 500); // Espera 500 milisegundos (0.5 segundos) antes de cambiar la imagen
}


changeImageWithTransitionPadi();

// Llama a la función changeImageWithTransitionPadi() cada 3 segundos
setInterval(changeImageWithTransitionPadi, 3000); // Intervalo de cambio de imagen cada 3 segundos

// Inicialmente llama a la función para que comience la transición

