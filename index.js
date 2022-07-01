const ethers = require('ethers');
const axios = require('axios');

const queryPositions = async () => {
  try {
    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/nmimran99/compound',
      {
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

    console.log(result.data.data.positions.length);
  } catch (error) {
    console.log(error);
  }
};

queryPositions();
