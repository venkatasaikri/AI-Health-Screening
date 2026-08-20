require('dotenv').config();
const { startCallSession, generateReport } = require('./services/ai');

async function testAll() {
  console.log("1. Testing startCallSession()...");
  try {
    const { text, history } = await startCallSession();
    console.log("   AI Response:", text);
    
    // Simulate user responding with text instead of audio for the test script
    console.log("\n2. Simulating conversation...");
    history.push({ role: 'user', parts: [{ text: "My name is John. I have had a severe headache for 3 days." }] });
    history.push({ role: 'model', parts: [{ text: "I'm sorry to hear that, John. On a scale of 1-10, how severe is the headache?" }] });
    history.push({ role: 'user', parts: [{ text: "It's about an 8." }] });
    
    console.log("   History updated with fake turns.");

    console.log("\n3. Testing generateReport()...");
    const report = await generateReport(history);
    console.log("   Report Generated Successfully!");
    console.log(JSON.stringify(report, null, 2));
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testAll();
