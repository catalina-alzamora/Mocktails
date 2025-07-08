/*
Author: Catalina
this is the js for the mocktails website
*/

const mocktailsListURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
window.addEventListener("load", updateMocktailList);

async function getMocktailsList() {
  try {
    const response = await fetch(mocktailsListURL);   
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
async function updateMocktailList(){
  try {
    const mocktailListArray = await getMocktailsList();
    printOptions(mocktailListArray);
  } catch (error) {
      console.error("Error:", error);
    }
} 
function printOptions(mocktailListArray){
  for (let i = 0; i < mocktailListArray.length; i++) {
    document.getElementById('mocktails').innerHTML += 
    `<option value='${mocktailListArray[i].strDrink}'>${mocktailListArray[i].strDrink}</option>`;
  }
}