require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var animateScroll = require("./lib/animateScroll");
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

qsa(".basket-button").forEach(function(b) {
  b.addEventListener("click", function() {
    var recipes = [];
    qsa("input:checked").forEach(function(i) {
      recipes.push(...i.getAttribute("data-recipe").split(" "));
    })
    console.log(qsa("input:checked"))
    var allIngredients = [];
    recipes.forEach(function(r) {
      var ingredients = ingredientData.filter(function(i) {
        return i.recipe == r;
      })
      allIngredients = allIngredients.concat(ingredients);
    });
    if (allIngredients.length == 0) {
      document.querySelector(".empty").classList.remove("hidden");
    } else {
      document.querySelector(".empty").classList.add("hidden");
    }
    document.querySelector(".basket ul").innerHTML = "";
    allIngredients.forEach(function(i) {
      var item = document.createElement("li");
      if (i.amount) i.ingredient = i.ingredient.toLowerCase();

      var language = "";
      if (i.amount) language += i.amount + " ";
      if (i.unit) language += i.unit + " ";
      if (i.ingredient) language += i.ingredient;
      item.innerHTML = language;
      document.querySelector(".basket ul").appendChild(item);
    });
  });
});

qsa(".menu a").forEach(function(a) {
  a.addEventListener("click", function(e) {
    var href = this.getAttribute("href");
    if (href.indexOf("#") != 0) return;
    var section = document.querySelector(href);
    if (!section) return;
    e.preventDefault();
    animateScroll(section);
  });
});