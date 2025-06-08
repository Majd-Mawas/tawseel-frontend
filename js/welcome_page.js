document.addEventListener("DOMContentLoaded",
function () {
  
       setTimeout(function () 
       {
           document.getElementById("first_page")
           .style.display = "none";
           document.getElementById("second_page")
           .style.display = "block";
           addLiveAnimations();
       }, 4000);
});

