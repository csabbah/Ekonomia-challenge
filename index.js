const ethers = require('ethers');
const axios = require('axios');
const fs = require('fs');

var data = { positionsWithPaidInterest: '', sumOfPaidInterest: '' };

// Extract the data from the subgraph using axios
const queryPositions = async () => {
  try {
    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/nmimran99/compound',
      {
        // The below query returns 1000 positions that HAVE interestPaid
        // It is also sorted by interestPaid in descending order
        query: `
    {
  positions(first: 1000, where: { interestPaid_gt: "0" }, orderBy: interestPaid, orderDirection: desc ) {
    account {
      id
    }
    interestPaid
  }
  }
        `,
      }
    );

    // Console log the results
    console.log(
      `Number of positions with interest paid ${result.data.data.positions.length}`
    );

    // Add the number of positions with paid interest to the object
    data.positionsWithPaidInterest = result.data.data.positions.length;

    // Push the number of positions into the data object
    generateJsonFile(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

// Generates the positions.json file based on the data extracted from queryPositions()
const generateJsonFile = (data) => {
  fs.writeFile('./positions.json', data, (err) => {
    if (err) throw new Error(err);
    console.log('Positions.json file created!');
  });
};

queryPositions();
