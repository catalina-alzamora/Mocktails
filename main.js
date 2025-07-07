/*
Author: Catalina
this is the js for the mocktails website
*/

const mocktailsListURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
const mocktailsList = document.getElementById("mocktails");

//window.addEventListener("load", updateMocktailList);

async function getMocktailsList() {
  try {
    const response = await fetch(mocktailsListURL);   
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // The drinks array is under the "drinks" key
    return data.drinks;
  } catch (error) {
    console.error('Failed to fetch non-alcoholic drinks:', error);
    return [];
  }
}

getMocktailsList().then(drinks => {
  console.log(drinks); // Array of drink objects
});

//updateMocktailList is going to print options
