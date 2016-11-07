require("./lib/social");
require("./lib/ads");
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
        console.log(i.ingredient)
        var ingredientLabel = i.ingredient;
        var unitLabel = i.unit;
        if (i.amount > 1 && !i.unit && i.ingredient.indexOf("Sachet") < 0) {
          ingredientLabel = i.ingredient + "s";
        } else if (i.amount > 1 && (i.unit == "cup" || i.unit == "recipe" || i.unit == "lb")) {
          unitLabel = i.unit + "s";
        }
        if (!allIngredients[i.ingredient]) {
          allIngredients[i.ingredient] = {
            amount: i.amount,
            unit: unitLabel,
            ingredient: ingredientLabel
          };
        } else if (i.amount) {
          allIngredients[i.ingredient].amount += i.amount;
          if (allIngredients[i.ingredient].amount > 1 && !i.unit && i.ingredient.indexOf("Sachet") < 0) {
            allIngredients[i.ingredient].ingredient = i.ingredient + "s";
          } else if (allIngredients[i.ingredient].amount > 1 && (i.unit == "cup" || i.unit == "recipe" || i.unit == "lb")) {
            allIngredients[i.ingredient].unit = i.unit + "s";
          }
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
      if (allIngredients[ing].amount) {
        var fraction = allIngredients[ing].amount.toString();
        if (fraction.indexOf(".") > -1) {
          var split = fraction.split(".");
          var first = split[0];
          var second = split[1];

          if (second == "25") {
            second = "¼";
          } else if (second == "5") {
            second = "½";
          } else if (second == "75") {
            second = "¾";
          }

          if (first != "0") {
            fraction = first + second;
          } else {
            fraction = second;
          }
        }
        language +=  fraction + " ";
      }
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
qsa("a.top-button").forEach(function(a) {
  scroll(a);
});
qsa("a.basket-link").forEach(function(a) {
  scroll(a);
});
