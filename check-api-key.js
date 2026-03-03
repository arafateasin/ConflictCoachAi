// Check if Gemini API key is working and list available models
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyDQmRGmcvgMHuadNWTrgNEk-Rn9SL_pkf4';

async function checkAPIKey() {
  console.log('🔍 Checking Gemini API Key...\n');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try different model names
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-flash-latest',
    'gemini-pro-latest'
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hello" in one word.');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`   Response: ${text}\n`);
      break; // Stop after first working model
      
    } catch (error) {
      if (error.message.includes('API key not valid')) {
        console.log(`❌ API KEY INVALID!\n`);
        console.log('Error:', error.message);
        return;
      } else if (error.message.includes('404')) {
        console.log(`❌ Model not found (404)\n`);
      } else if (error.message.includes('429') || error.message.includes('quota')) {
        console.log(`⚠️ Quota exceeded - but API key is valid!\n`);
        console.log('Your API key works, but you hit rate limits.');
        return;
      } else {
        console.log(`❌ Error: ${error.message}\n`);
      }
    }
  }
  
  console.log('\n📊 API Key Status: Valid but needs correct model name');
}

checkAPIKey().catch(console.error);
