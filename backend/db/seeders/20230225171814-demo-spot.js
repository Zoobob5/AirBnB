'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: 'SomeWhere Rd',
        city: 'Not Kansas',
        state: 'Tx',
        country: 'USA',
        lat: 55.1234,
        lng: -101.5463,
        name: 'The Card Board House',
        description: 'It is affordable, Portable, and Stylish on any coner. Reccomended spot is under a bridge but it is in this fixed location instead.',
        price: 1.99
      },
      {
        ownerId: 2,
        address: 'hill cove blvd',
        city: 'sweetson',
        state: 'MN',
        country: 'USA',
        lat: 78.9874,
        lng: -101.1234,
        name: 'Candy House',
        description: 'From the story of Hansel and Gretel, this house was created in honor of the witch for her demised was caused by wondering intruders that started eating her house, litteraly.',
        price: 450.50
      },
      {
        ownerId: 3,
        address: "earth orbit",
        city: 'Moon',
        state: 'Earth',
        country: 'Space',
        lat: 0,
        lng: 0,
        name: 'Space Station Xtf-1384',
        description: 'If you got enough money you can expierence living in outer space with the wonderfull view of eiter the pitch black void or the occassional blinding star we call sun. ',
        price: 150000.99
      }

   ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Demo-The Card Board House', 'Candy House', 'Space Station Xtf-1384'] }
    }, {});
  }
};
