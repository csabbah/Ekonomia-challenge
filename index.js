'use strict';
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
// import ethers from 'ethers';
// import axios from 'axios';
var fs = require('fs');
var data = [];
var allData = [];
// ----------------------------------------------------- Side Functions
// Generates the positions.json file based on the data extracted from queryPositions()
var generateJsonFile = function(data) {
  fs.writeFile('./positions.json', data, function(err) {
    if (err) return console.log(err);
    console.log('Positions.json file created!');
  });
};
// Return the sum of all interest paid
var returnSum = function(queryData) {
  // Create a temporary array to hold just the interest paid values
  var tempArr = [];
  // Push all interestPaid values into above array
  queryData.forEach(function(item) {
    tempArr.push(Number(item.interestPaid));
  });
  // Declare variable to be used in reduce() and contain the total sum
  var initialValue = 0;
  // Reduce the array to one single sum number
  var totalSum = tempArr.reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  }, initialValue);
  // Calculate final summation using BigNumber
  // const finalSum = ethers.BigNumber.from(totalSum.toString());
  // const finalSum = ethers.BigNumber.from(totalSum.toString()).mul(
  //   ethers.BigNumber.from(10).pow(18)
  // );
  // Log the result
  console.log('Total sum of all interest paid - '.concat(totalSum));
};
// ----------------------------------------------------- Main Fetch Functions
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
var graphql_request_1 = require('graphql-request');
// Fetch the data from the subgraph
var fetchQuery = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    var skip, limit, keepQuerying, query, client, result;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          skip = 0;
          limit = 1000;
          keepQuerying = true;
          _a.label = 1;
        case 1:
          if (!keepQuerying) return [3 /*break*/, 3];
          if (skip == 6000) {
            keepQuerying = false;
            console.log('done', allData);
            return [3 /*break*/, 3];
          }
          console.log('Current skip '.concat(skip));
          query = (0, graphql_request_1.gql)(
            templateObject_1 ||
              (templateObject_1 = __makeTemplateObject(
                [
                  '\n      {\n        positions(\n          first: ',
                  ',\n          skip: ',
                  ',\n          where: { interestPaid_gt: "0" }\n          orderBy: interestPaid\n          orderDirection: desc\n        ) {\n          account {\n            id\n          }\n          interestPaid\n        }\n      }\n    ',
                ],
                [
                  '\n      {\n        positions(\n          first: ',
                  ',\n          skip: ',
                  ',\n          where: { interestPaid_gt: "0" }\n          orderBy: interestPaid\n          orderDirection: desc\n        ) {\n          account {\n            id\n          }\n          interestPaid\n        }\n      }\n    ',
                ]
              )),
            limit,
            skip
          );
          client = new graphql_request_1.GraphQLClient(
            'https://api.thegraph.com/subgraphs/name/nmimran99/compound'
          );
          return [4 /*yield*/, client.request(query)];
        case 2:
          result = _a.sent();
          result.positions.forEach(function(item) {
            allData.push(item);
          });
          skip += limit;
          return [3 /*break*/, 1];
        case 3:
          console.log(
            'Number of positions with interest paid - '.concat(allData.length)
          );
          // Return the sum of all paid interests
          returnSum(allData);
          // Iterate through all positions data and push it to the main data object declared above
          allData.forEach(function(item) {
            data.push({
              accountId: item.account.id,
              interestPaid: item.interestPaid,
            });
          });
          console.log(
            "Number of Positions pushed to 'positions.json': ".concat(
              allData.length
            )
          );
          // Stringify and generate the positions.json file with the extracted data
          generateJsonFile(JSON.stringify(data));
          return [2 /*return*/];
      }
    });
  });
};
fetchQuery();
var templateObject_1;
// ----------------------------------------------------- Apollo client (Third Attempt)
// import pkg from '@apollo/client';
// const { ApolloClient, InMemoryCache, gql } = pkg;
// import fetch from 'node-fetch';
// const client = new ApolloClient({
//   fetch: fetch,
//   uri: 'https://api.thegraph.com/subgraphs/name/nmimran99/compound',
//   cache: new InMemoryCache(),
// });
// client
//   .query({
//     // Only return the positions that have interestPaid
//     query: gql`
//       {
//         positions(
//           first: 1000
//           where: { interestPaid_gt: "0" }
//           orderBy: interestPaid
//           orderDirection: desc
//         ) {
//           account {
//             id
//           }
//           interestPaid
//         }
//       }
//     `,
//   })
//   .then((result) => {
//     // Console log the results
//     console.log(
//       `Number of positions with interest paid - ${result.data.positions.length}`
//     );
//     // Return the sum of all paid interests
//     returnSum(result.data.positions);
//     // Iterate through all positions data and push it to the main data object declared above
//     result.data.positions.forEach((item) => {
//       data.push({
//         accountId: item.account.id,
//         interestPaid: item.interestPaid,
//       });
//     });
//     // Stringify and generate the positions.json file with the extracted data
//     generateJsonFile(JSON.stringify(data));
//   });
