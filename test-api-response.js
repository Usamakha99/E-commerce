// Test script to check actual API response structure
// Run this in browser console or Node.js

const testAPIResponse = async () => {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('==========================================');
  console.log('🧪 TESTING AI AGENT API ENDPOINTS');
  console.log('==========================================\n');
  
  // Test 1: GET ALL AGENTS
  try {
    console.log('1️⃣ Testing GET /api/aiagents?page=1&limit=5');
    console.log('------------------------------------------');
    const getAllResponse = await fetch(`${baseURL}/aiagents?page=1&limit=5`);
    const getAllData = await getAllResponse.json();
    console.log('Status:', getAllResponse.status);
    console.log('Response Structure:', getAllData);
    console.log('Type:', typeof getAllData);
    console.log('Is Array:', Array.isArray(getAllData));
    console.log('Has success:', getAllData?.success);
    console.log('Has data:', !!getAllData?.data);
    console.log('Has pagination:', !!getAllData?.pagination);
    if (getAllData?.data) {
      console.log('Data Type:', typeof getAllData.data);
      console.log('Data Is Array:', Array.isArray(getAllData.data));
      console.log('Data Length:', getAllData.data?.length);
    }
    console.log('\n');
  } catch (error) {
    console.error('❌ Error in GET ALL:', error);
    console.log('\n');
  }
  
  // Test 2: GET SINGLE AGENT (try with ID 1)
  try {
    console.log('2️⃣ Testing GET /api/aiagents/1');
    console.log('------------------------------------------');
    const getOneResponse = await fetch(`${baseURL}/aiagents/1`);
    const getOneData = await getOneResponse.json();
    console.log('Status:', getOneResponse.status);
    console.log('Response Structure:', getOneData);
    console.log('Type:', typeof getOneData);
    console.log('Is Array:', Array.isArray(getOneData));
    console.log('Has success:', getOneData?.success);
    console.log('Has data:', !!getOneData?.data);
    if (getOneData?.data) {
      console.log('Data Keys:', Object.keys(getOneData.data));
      console.log('Has featuresContent:', !!getOneData.data.featuresContent);
      console.log('Has resourcesContent:', !!getOneData.data.resourcesContent);
      console.log('Has supportContent:', !!getOneData.data.supportContent);
      console.log('Has productComparisonContent:', !!getOneData.data.productComparisonContent);
      console.log('Has pricingContent:', !!getOneData.data.pricingContent);
    }
    console.log('\n');
  } catch (error) {
    console.error('❌ Error in GET ONE:', error);
    console.log('\n');
  }
  
  // Test 3: GET SINGLE AGENT (if first ID doesn't work, try to get ID from list)
  try {
    console.log('3️⃣ Getting first agent ID from list...');
    console.log('------------------------------------------');
    const listResponse = await fetch(`${baseURL}/aiagents?page=1&limit=1`);
    const listData = await listResponse.json();
    
    let agentId = null;
    if (listData?.success && listData?.data && listData.data.length > 0) {
      agentId = listData.data[0].id;
    } else if (Array.isArray(listData) && listData.length > 0) {
      agentId = listData[0].id;
    } else if (listData?.data && Array.isArray(listData.data) && listData.data.length > 0) {
      agentId = listData.data[0].id;
    }
    
    if (agentId) {
      console.log(`Found Agent ID: ${agentId}`);
      const detailResponse = await fetch(`${baseURL}/aiagents/${agentId}`);
      const detailData = await detailResponse.json();
      console.log('Detail Response:', detailData);
      console.log('Detail Has success:', detailData?.success);
      console.log('Detail Has data:', !!detailData?.data);
      if (detailData?.data) {
        console.log('Detail Data Keys:', Object.keys(detailData.data));
      }
    } else {
      console.log('❌ Could not find agent ID');
    }
    console.log('\n');
  } catch (error) {
    console.error('❌ Error in GET DETAIL:', error);
    console.log('\n');
  }
  
  console.log('==========================================');
  console.log('✅ TEST COMPLETE');
  console.log('==========================================');
};

// Run the test
if (typeof window !== 'undefined') {
  // Browser environment
  window.testAPIResponse = testAPIResponse;
  console.log('Run testAPIResponse() in console to test API');
} else {
  // Node.js environment
  testAPIResponse();
}

