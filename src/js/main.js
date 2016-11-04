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

qsa(".basket-button input").forEach(function(b) {
  b.addEventListener("click", function() {
    var recipes = [];
    qsa("input:checked").forEach(function(i) {
      recipes.push(...i.getAttribute("data-recipe").split(" "));
    });
    var allIngredients = {};
    recipes.forEach(function(r) {
      var ingredients = ingredientData.filter(function(i) {
        return i.recipe == r;
      });
      ingredients.forEach(function(i) {
        if (!allIngredients[i.ingredient]) {
          console.log(eval(i.amount))
          allIngredients[i.ingredient] = {
            amount: eval(i.amount),
            unit: i.unit,
            ingredient: i.ingredient
          };
        } else {
          allIngredients[i.ingredient].amount += eval(i.amount);
        }
      });
    });
    if (Object.keys(allIngredients).length == 0) {
      document.querySelector(".empty").classList.remove("hidden");
    } else {
      document.querySelector(".empty").classList.add("hidden");
    }
    document.querySelector(".basket ul").innerHTML = "";

    for (var ing in allIngredients) {
      var item = document.createElement("li");
      var ingredient = allIngredients[ing].ingredient;
      if (allIngredients[ing].amount) ingredient = allIngredients[ing].ingredient.toLowerCase();

      var language = "";
      if (allIngredients[ing].amount) language += allIngredients[ing].amount + " ";
      if (allIngredients[ing].unit) language += allIngredients[ing].unit + " ";
      language += ingredient;
      item.innerHTML = language;
      document.querySelector(".basket ul").appendChild(item);
    }
  });
});

var scroll = function(a) {
  a.addEventListener("click", function(e) {
    var href = this.getAttribute("href");
    if (href.indexOf("#") != 0) return;
    var section = document.querySelector(href);
    if (!section) return;
    e.preventDefault();
    animateScroll(section);
  });
}

qsa(".menu a").forEach(function(a) {
  scroll(a);
});
qsa("a.top").forEach(function(a) {
  scroll(a);
});
qsa("a.basket-link").forEach(function(a) {
  scroll(a);
});
