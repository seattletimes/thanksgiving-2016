require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var qsa = require("./lib/qsa.js");

qsa(".tabs div").forEach(function(t) {
  t.addEventListener("click", function() {
    var recipe = t.closest("section").getAttribute("id");
    if (!t.classList.contains("selected")) {
      document.querySelector(`#${recipe} .selected`).classList.remove("selected");
      t.classList.add("selected");
      var type = t.getAttribute("data-type");
      document.querySelector(`#${recipe} .shown`).classList.remove("shown");
      if (type == "goforit") {
        document.querySelector(`#${recipe} .goforit`).classList.add("shown");
      } else {
        document.querySelector(`#${recipe} .simplify`).classList.add("shown");
      }
    }
  });
});

qsa(".fa-shopping-basket").forEach(function(b) {
  b.addEventListener("click", function() {
    var allIngredients = [];
    var recipes = b.getAttribute("data-recipe").split(" ");
    recipes.forEach(function(r) {
      var ingredients = ingredientData.filter(function(i) {
        return i.recipe == r;
      })
      allIngredients += ingredients;
      console.log(allIngredients)
    });
    document.querySelector(".basket").innerHTML += allIngredients;
  });
});