'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Perfect, the stains made it look unique and rustic giving it a natural vibe.',
        stars: 5,
      },

      {
        userId: 2,
        spotId: 2,
        review: 'Looks nice but the smell is conflicting with all the flavours around here and there is no bathroom or sink.',
        stars: 3,
      },

      {
        userId: 3,
        spotId: 3,
        review: 'Very nice get away and super afforable, the view is breathtaking but it is very quiet.',
        stars: 4,
      }
    ], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
