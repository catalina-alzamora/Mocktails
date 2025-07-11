const allDrinksURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"; //list of names and images
const drinkDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="; //Lookup full drink details by id
const searchBtn = document.getElementById('searchBtn');
const drinkSelect = document.getElementById('mocktailSelect');
const card = document.getElementById('card');
const resultCard = document.getElementById('resultCard');

let ingAndMeasures = [];
let ingredientsList = [];

window.addEventListener("load", printDrinksList);

async function getDrinksList(){
  try {
    const response = await fetch(allDrinksURL);   
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // The drinks array is under the "drinks" key   
    const drinksArray = await data.drinks;
    return drinksArray;
  } catch (error) {
    console.error('Failed to fetch non-alcoholic drinks:', error);
  }
}
async function printDrinksList(){
  try {
    const drinksListArray = await getDrinksList();
    drinksListArray.forEach(drink => {
      drinkSelect.innerHTML += 
      `<option value='${drink.idDrink}'>${drink.strDrink}</option>`;
      })
  } catch (error) {
      console.error("Error:", error);
    }
} 
async function getDrinkDetails(drinkURL) {
  try {
    const response = await fetch(drinkURL);   
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();   
    let drinkDetailsRes = await data.drinks;
    let drinkDetails = drinkDetailsRes[0];
    let name = drinkDetails.strDrink; 
    let glass = drinkDetails.strGlass;
    let photoURL = drinkDetails.strDrinkThumb;
    let ingredients = getIngredientsList(drinkDetails);
    let instructions = drinkDetails.strInstructions;
    instructions = instructions.split("-");
    for (let i = 0; i < instructions.length; i++) {
       instructions[i] = instructions[i] + "<br>";
    }
    instructions = instructions.join("");
    printDetails(name, instructions, glass, photoURL, ingredients);
  } catch (error) {
    console.error('Failed to fetch drink URL:', error);
  }
}
function getIngredientsList(drinkDetails) {
  for (let i = 1; i <= 15; i++) {
    let ingredient = drinkDetails[`strIngredient${i}`];
    let measure = drinkDetails[`strMeasure${i}`]; 
    if (ingredient && ingredient.trim() !== "") {  //discarding ingredients with empty value.
      ingredientsList.push({
        ingredient,

        measure: measure ? measure.trim() : "N/A", //discarding empty measures with ternary operator
      });
    }      
  }
  ingredientsList.forEach(ing => {
    ingAndMeasures += [`- ${ing.ingredient} (${ing.measure})<br>`];
  });
  return ingAndMeasures;
}
function printDetails(name, instructions, glass, photoURL, ingredients) {
resultCard.innerHTML += `<div><h2>${name}</h2><br>
<p>Ingredients:</p>${ingredients}<br>
<p class='instructions'>Instructions:<br> ${instructions}</p><br>
<p class='glass'>Serve: ${glass}</p><br>
</div><img class='photo' src='${photoURL}'>`
}
searchBtn.addEventListener("click", function () {
  //adding selected id in drinkURL  
  let drinkURL = drinkDetailsURL + drinkSelect.value;
  getDrinkDetails(drinkURL);
  //display only results
  card.style.display = "none";
  resultCard.style.display = "flex";
  return drinkURL;
});