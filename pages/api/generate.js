import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }


  //check if empty 
  const food = req.body.food || '';
  
  //if empty / just spaces don't even send a request 
  if (food.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid food",
      }
    });
    return;
  }

  //time for calling of actual openAI api
  try {
    const completion = await openai.createCompletion({
      //specify which gpt model to use for autocomplete
      model: "text-davinci-003",
      //calls function that provides extra context for request of making pet names
      prompt: generatePrompt(food),

      //specify the randomness / confidence at which the model will provide
      //response
      max_tokens: 500,
      temperature: 0.6,
    });

    //if everything goes well we send back http 200 + object with key of result and value of the text we spit out
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(food) {
  //horse -> Horse, CaT -> Cat
  //Ensures standardized capitalization of inputs
  const capitalizedFood =
  food[0].toUpperCase() + food.slice(1).toLowerCase();
  return `Suggest three incredibly tasty recipes in an html unordered list given a certain food.

Food: Macaroni and Cheese
Recipe: <ul><li>1 (8 ounce) box elbow macaroni</li><li>¼ cup butter</li><li>¼ cup all-purpose flour</li><li>½ teaspoon salt</li><li>ground black pepper to taste</li><li>2 cups milk</li><li>2 cups shredded Cheddar cheese</li></ul>
Food: Pan-Seared Tilapia
Recipe: <ul><li>4 (4 ounce) tilapia fillets</li><li>salt and ground black pepper to taste</li><li>½ cup all-purpose flour</li><li>1 tablespoon olive oil</li><li>2 tablespoons unsalted butter, melted</li><li>1 tablespoon lemon juice, or to taste (Optional)</li><li>1 teaspoon chopped fresh flat-leaf parsley, or to taste (Optional)</li><li>½ teaspoon chopped fresh thyme, or to taste (Optional)</li></ul>
Food: ${capitalizedFood}
Recipe:`;
}
