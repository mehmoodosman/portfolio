/* =====================================================================
Project overlays
===================================================================== */
function handleOverlay(e) {
  if (window.matchMedia('screen and (min-width: 1110px)').matches) {
    const overlay = e.target.children[1];

    overlay.classList.contains('enabled')
      ? overlay.classList.remove('enabled')
      : overlay.classList.add('enabled');
  }
}

/* =====================================================================
Check elements in viewport
===================================================================== */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.right >= 0 &&
    rect.left >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

function checkCardPos() {
  const projectItems = [
    {
      element: document.querySelectorAll('.project-card'),
      name: 'card-show',
    },
    {
      element: document.querySelectorAll('.project-details h3'),
      name: 'card-title-show',
    },
    {
      element: document.querySelectorAll('.project-tags'),
      name: 'card-tags-show',
    },
    {
      element: document.querySelectorAll('.project-links'),
      name: 'card-links-show',
    },
  ];

  projectItems.forEach((item) => {
    const { element, name } = item;

    element.forEach((el) => {
      isInViewport(el) ? el.classList.add(name) : el.classList.remove(name);
    });
  });
}

function checkLogoPos() {
  const logos = document.querySelectorAll('.experience');

  logos.forEach((logo) => {
    if (
      window.matchMedia('(max-width: 767px)').matches &&
      isInViewport(logos[4])
    ) {
      logo.classList.add('logo-show');
    } else if (isInViewport(logos[logos.length - 1])) {
      logo.classList.add('logo-show');
    }
  });
}

function checkElPos() {
  checkCardPos();
  checkLogoPos();
}

/* =====================================================================
Typewriter effect
===================================================================== */
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = JSON.parse(words);
    this.wait = parseInt(wait, 10); // base 10 number
    this.isDeleting = false;
    this.wordIndex = 0;
    this.txt = 'Osman Mehmood';
    this.type();
  }

  type() {
    // get current word
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    // add/remove chars
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // insert text
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 300;
    if (this.isDeleting) typeSpeed /= 2;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait; // add pause at end
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed); // integrate the typespeed
  }
}

function initTypeWriter() {
  const txtElement = document.querySelector('.about-name');
  const words = txtElement.getAttribute('data-words');
  const wait = txtElement.getAttribute('data-wait');

  new TypeWriter(txtElement, words, wait);
}

/* =====================================================================
Event listeners
===================================================================== */
const projectImage = document.querySelectorAll('.image-container');
projectImage.forEach((image) => {
  image.addEventListener('mouseenter', handleOverlay);
  image.addEventListener('mouseleave', handleOverlay);
  window.addEventListener('touchcancel', handleOverlay);
});

window.addEventListener('load', checkElPos);
window.addEventListener('resize', checkElPos);
window.addEventListener('scroll', checkElPos);
document.addEventListener('DOMContentLoaded', initTypeWriter);

/* =====================================================================
Canvas Dots (Script from bscottnz: http://tinyurl.com/2xu8cr78)
===================================================================== */
const canvasDots = function () {
  const canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    colorDot = [
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)', // here and above is blue
      'rgb(255, 77, 90)', // here is yellow
    ], // 80% of dots are blue. 20% yellow
    color = 'rgb(81, 162, 233)';

  // ctx.globalAlpha = 0.8;
  canvas.width = document.body.scrollWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  // ctx.fillStyle = colorDot;
  // ctx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
  ctx.lineWidth = 0.3;
  ctx.strokeStyle = color;

  let mousePosition = {
    x: (30 * canvas.width) / 100,
    y: (30 * canvas.height) / 100,
  };

  const windowSize = window.innerWidth;
  let dots;

  if (windowSize > 1600) {
    dots = {
      nb: 600, // number of particles
      distance: 70, // max distance between particles for them to link
      d_radius: 300, // radius from mouse location that particles will link
      array: [],
    };
  } else if (windowSize > 1300) {
    dots = {
      nb: 575,
      distance: 60,
      d_radius: 280,
      array: [],
    };
  } else if (windowSize > 1100) {
    dots = {
      nb: 500,
      distance: 55,
      d_radius: 250,
      array: [],
    };
  } else if (windowSize > 800) {
    dots = {
      nb: 300,
      distance: 50,
      d_radius: 230,
      array: [],
    };
  } else if (windowSize > 600) {
    dots = {
      nb: 200,
      distance: 0,
      d_radius: 0,
      array: [],
    };
  } else {
    dots = {
      nb: 100,
      distance: 0,
      d_radius: 0,
      array: [],
    };
  }

  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();

    this.radius = Math.random() * 1.5;

    this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
  }

  Dot.prototype = {
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      const dotDistance =
        ((this.x - mousePosition.x) ** 2 + (this.y - mousePosition.y) ** 2) **
        0.5;
      const distanceRatio = dotDistance / (windowSize / 1.7);

      // this chops the bracket off the rgb colour and ads an opacity
      ctx.fillStyle = this.colour.slice(0, -1) + `,${1 - distanceRatio})`;

      ctx.fill();
    },

    animate: function () {
      for (let i = 0; i < dots.nb; i++) {
        const dot = dots.array[i];

        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        } else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    },

    line: function () {
      for (let i = 0; i < dots.nb; i++) {
        for (let j = 0; j < dots.nb; j++) {
          const iDot = dots.array[i];
          const jDot = dots.array[j];

          if (
            iDot.x - jDot.x < dots.distance &&
            iDot.y - jDot.y < dots.distance &&
            iDot.x - jDot.x > -dots.distance &&
            iDot.y - jDot.y > -dots.distance
          ) {
            if (
              iDot.x - mousePosition.x < dots.d_radius &&
              iDot.y - mousePosition.y < dots.d_radius &&
              iDot.x - mousePosition.x > -dots.d_radius &&
              iDot.y - mousePosition.y > -dots.d_radius
            ) {
              ctx.beginPath();
              ctx.moveTo(iDot.x, iDot.y);
              ctx.lineTo(jDot.x, jDot.y);
              ctx.strokeStyle =
                'rgba(81, 162, 233,' +
                (1 -
                  ((iDot.x - mousePosition.x) ** 2 +
                    (iDot.y - mousePosition.y) ** 2) **
                    0.5 /
                    dots.d_radius) +
                ')';
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    },
  };

  function createDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot());
      dot = dots.array[i];

      dot.create();
    }

    dot.line();
    dot.animate();
  }

  window.onmousemove = function (parameter) {
    mousePosition.x = parameter.pageX;
    mousePosition.y = parameter.pageY;
  };

  mousePosition.x = window.innerWidth / 2;
  mousePosition.y = window.innerHeight / 2;

  setInterval(createDots, 1000 / 30);

  window.addEventListener('resize', () => {
    canvas.width = document.body.scrollWidth;
    canvas.height = window.innerHeight;
    dots.array = [];
  });
};

window.onload = function () {
  canvasDots();
};

/* =====================================================================
Light/Dark mode Toggle 
===================================================================== */
const toggle = document.getElementById('toggleDark');
const root = document.querySelector(':root'); // Use ':root' to select the root element

toggle.addEventListener('click', function() {
  this.classList.toggle('bi-moon-fill');
  
  if (this.classList.toggle('bi-brightness-high-fill')) { 
    root.style.setProperty('--color-primary-one', '#ffffff');
    root.style.setProperty('--color-primary-two', '#ebebeb');
    root.style.setProperty('--color-secondary-one', '#151515');
    root.style.setProperty('--color-secondary-two', '#242424');
    root.style.setProperty('--color-accent', '#99C9F2');
  } else {
    root.style.setProperty('--color-primary-one', '#151515');
    root.style.setProperty('--color-primary-two', '#272727');
    root.style.setProperty('--color-secondary-one', '#dcdcde');
    root.style.setProperty('--color-secondary-two', 'rgb(168, 168, 168)');
    root.style.setProperty('--color-accent', '#f0db4f');
  }
});