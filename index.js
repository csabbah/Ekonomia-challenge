import ethers from 'ethers';
import axios from 'axios';
import fs from 'fs';

var data = [];

// ----------------------------------------------------- Axios client (First Attempt)
// Extract the data from the subgraph using axios
// const queryPositions = async () => {
//   try {
//     const result = await axios.post(
//       'https://api.thegraph.com/subgraphs/name/nmimran99/compound',
//       {
//         // The below query returns 1000 positions that HAVE interestPaid
//         // It is also sorted by interestPaid in descending order
//         query: `
//     {
//   positions(first: 1000, where: { interestPaid_gt: "0" }, orderBy: interestPaid, orderDirection: desc ) {
//     account {
//       id
//     }
//     interestPaid
//   }
//   }
//         `,
//       }
//     );
//     console.log(result)
//   } catch (error) {
//     console.log(error);
//   }
// };

// ----------------------------------------------------- GraphQL client (Second Attempt)
// import { GraphQLClient, gql } from 'graphql-request';
// const query = gql`
//   {
//   positions(first: 1000, where: { interestPaid_gt: "0" }, orderBy: interestPaid, orderDirection: desc ) {
//     account {
//       id
//     }
//     interestPaid
//   }
//   }
// `;
// const client = new GraphQLClient(
//   'https://api.thegraph.com/subgraphs/name/nmimran99/compound'
// );
// const data2 = await client.request(query);

// ----------------------------------------------------- Apollo client (Third Attempt)
import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, gql } = pkg;

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/nmimran99/compound',
  cache: new InMemoryCache(),
});

client
  .query({
    // Only return the positions that have interestPaid
    query: gql`
      {
  positions(first: 1000, where: { interestPaid_gt: "0" }, orderBy: interestPaid, orderDirection: desc ) {
    account {
      id
    }
    interestPaid
  }
  }
    `,
  })
  .then((result) => {
    // Console log the results
    console.log(
      `Number of positions with interest paid - ${result.data.positions.length}`
    );

    // Return the sum of all paid interests
    returnSum(result.data.positions);

    // Iterate through all positions data and push it to the main data object declared above
    result.data.positions.forEach((item) => {
      data.push({
        accountId: item.account.id,
        interestPaid: item.interestPaid,
      });
    });
    // Stringify and generate the positions.json file with the extracted data
    generateJsonFile(JSON.stringify(data));
  });

// Generates the positions.json file based on the data extracted from queryPositions()
const generateJsonFile = (data) => {
  fs.writeFile('./positions.json', data, (err) => {
    if (err) throw new Error(err);
    console.log('Positions.json file created!');
  });
};

// Return the sum of all interest paid
const returnSum = (queryData) => {
  // Create a temporary array to hold just the interest paid values
  let tempArr = [];
  // Push all interestPaid values into above array
  queryData.forEach((item) => {
    tempArr.push(Number(item.interestPaid));
  });

  // Declare variable to be used in reduce() and contain the total sum
  const initialValue = 0;
  // Reduce the array to one single sum number
  const totalSum = tempArr.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );

  // Calculate final summation using BigNumber
  // const finalSum = ethers.BigNumber.from(totalSum.toString());
  // const finalSum = ethers.BigNumber.from(totalSum.toString()).mul(
  //   ethers.BigNumber.from(10).pow(18)
  // );

  // Log the result
  console.log(`Total sum of all interest paid - ${totalSum}`);
};
