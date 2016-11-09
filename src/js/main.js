var social = require("./lib/social");
require("./lib/ads");
var closest = require("./lib/closest");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var animateScroll = require("./lib/animateScroll");
var qsa = require("./lib/qsa.js");

var recipeLookup = {
  turkey1: "Spatchcocked Turkey (full version)",
  turkey2: "Spatchcocked Turkey (simplified version)",
  gravy1: "Gravy (full version)",
  gravy2: "Gravy (simplified version)",
  beans1: "Heirloom Bean Cassoulet (full version)",
  beans2: "Heirloom Bean Cassoulet (simplified version)",
  potatoes1: "Soy-Glazed Potatoes (full version)",
  potatoes2: "Soy-Glazed Potatoes (simplified version)",
  cornbread1: "Cornbread Dressing (full version)",
  cornbread2: "Cornbread Dressing (simplified version)",
  gel1: "Cranberry Gel (full version)",
  gel2: "Cranberry Gel (simplified version)",
  pie1: "Cranberry Pie (full version)",
  pie2: "Rustic Cranberry Tart (simplified version)"
};

var socialLookup = {
  turkey: {
    title: "Spatchcocked Turkey",
    img: "turkey.jpg"
  },
  gravy: {
    title: "Gravy",
    img: "gravy.jpg"
  },
  beans: {
    title: "Heirloom Bean Cassoulet",
    img: "beans.jpg"
  },
  potatoes: {
    title: "Soy-Glazed Potatoes",
    img: "potatoes.jpg"
  },
  dressing: {
    title: "Cornbread Dressing",
    img: "dressing.jpg"
  },
  cranberries: {
    title: "Cranberry Gel"
  },
  pie: {
    title: "Cranberry Pie",
    img: "pie.jpg"
  }
};

var pluralize = ["cup", "recipe", "lb", "quart"];

qsa(".tabs div").forEach(function(t) {
  t.addEventListener("click", function() {
    var recipe = closest(t, "section").getAttribute("id");
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
    var recipeLabels = [];
    qsa("input:checked").forEach(function(i) {
      recipes.push(...i.getAttribute("data-recipe").split(" "));
      recipeLabels.push(recipeLookup[i.getAttribute("id")]);
    });
    var allIngredients = {};
    recipes.forEach(function(r) {
      var ingredients = ingredientData.filter(function(i) {
        return i.recipe == r;
      });
      ingredients.forEach(function(i) {
        var ingredientLabel = i.ingredient;
        var unitLabel = i.unit;
        if (i.amount > 1 && !i.unit && i.ingredient.indexOf("Sachet") < 0) {
          ingredientLabel = i.ingredient + "s";
        } else if (i.amount > 1 && pluralize.indexOf(i.unit) > -1) {
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
          } else if (allIngredients[i.ingredient].amount > 1 && pluralize.indexOf(i.unit) > -1) {
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

    var recipeList = document.querySelector(".recipe-list");
    recipeList.innerHTML = "";
    if (recipeLabels.length > 0) {
      recipeList.innerHTML = "Ingredients you will need to make: ";
      recipeLabels.forEach(function(r, i) {
        if (i == 0) {
          recipeList.innerHTML += r;
        } else {
          recipeList.innerHTML += ", " + r;
        }
      });
    }

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

qsa(".recipe-share").forEach(function(s) {
  var id = s.getAttribute('data-id');
  var href = window.location.href.replace(/#.*$/, "");
  var s = social.makeShare(`.recipe-share[data-id="${id}"]`, "bottom right", href + "#" + id);
  console.log(s)
  s.config.title = "The Imperfect Thanksgiving: " + socialLookup[id].title;
  s.config.image = `assets/${socialLookup[id].img || "header.jpg"}`;
});