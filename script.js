/* =========================
   CULTÚS | script.js
   ========================= */

document.addEventListener("DOMContentLoaded", () => {


    // Fade in animation

    const elements = document.querySelectorAll(
        "section, .product-card, .feature-card, .review-card"
    );


    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if(entry.isIntersecting){

                    entry.target.classList.add("show");

                }

            });

        },
        {
            threshold:0.15
        }
    );


    elements.forEach(element => {

        element.classList.add("fade-in");

        observer.observe(element);

    });



    // Smooth navigation scrolling

    document.querySelectorAll("a[href^='#']")
    .forEach(link => {

        link.addEventListener("click", function(e){

            const target = document.querySelector(
                this.getAttribute("href")
            );

            if(target){

                e.preventDefault();

                target.scrollIntoView({
                    behavior:"smooth"
                });

            }

        });

    });



    // Navbar background on scroll

    const nav = document.querySelector("nav");


    window.addEventListener("scroll",()=>{

        if(window.scrollY > 50){

            nav.style.background = "rgba(248,245,239,0.95)";
            nav.style.backdropFilter = "blur(10px)";

        } else {

            nav.style.background = "transparent";

        }

    });



    // Newsletter interaction

    const button = document.querySelector(".newsletter button");

    const input = document.querySelector(".newsletter input");


    if(button){

        button.addEventListener("click",()=>{

            if(input.value.trim() !== ""){

                button.innerHTML="Subscribed ✓";
                input.value="";

            }

        });

    }


});