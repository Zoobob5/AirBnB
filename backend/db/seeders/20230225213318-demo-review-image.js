'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://www.shutterstock.com/shutterstock/photos/1531987439/display_1500/stock-photo-a-distressed-sheet-of-corrugated-cardboard-with-water-stains-and-creases-isolated-on-white-1531987439.jpg'
      },

      {
        reviewId: 2,
        url: 'https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FSeries%2F2021-08-how-to-graham-crackers%2FReshoot%2F2021-08-12_ATK-6287'
      },

      {
        reviewId: 3,
        url: 'https://media.npr.org/assets/img/2010/11/17/void_wide-aafb8b68b1f476c7ff6070e092dc3f7d20af75a7-s1100-c50.jpg'
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
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
