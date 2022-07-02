import ethers from 'ethers';
import axios from 'axios';
import fs from 'fs';

var data = [];

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
      `Number of positions with interest paid - ${result.data.data.positions.length}`
    );

    // Return the sum of all paid interests
    returnSum(result.data.data.positions);

    // Add the number of positions with paid interest to the object
    data.positionsWithPaidInterest = result.data.data.positions.length;

    result.data.data.positions.forEach((item) => {
      data.push({
        accountId: item.account.id,
        interestPaid: item.interestPaid,
      });
    });
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

// Return the sum of all interest paid
const returnSum = (queryData) => {
  // Create a temporary array
  let tempArr = [];
  // Push all interestPaid values into array
  queryData.forEach((item) => {
    tempArr.push(Math.trunc(item.interestPaid));
    // tempArr.push(Number(item.interestPaid));
  });

  const initialValue = 0;

  // Reduce the array to one single sum number
  const totalSum = tempArr.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );

  // Calculate final sum using BigNumber
  const finalSum = ethers.BigNumber.from(totalSum.toString());
  // const finalSum = ethers.BigNumber.from(revised).mul(
  //   BigNumber.from(10).pow(18)
  // );

  // Log the result
  console.log(`Total sum of all interest paid - ${finalSum}`);

  // Push the final value to the object
  data.sumOfPaidInterest = finalSum;
};

queryPositions();
