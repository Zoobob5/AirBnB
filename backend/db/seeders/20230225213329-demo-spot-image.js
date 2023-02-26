'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        preview: true,
        url: 'https://media.istockphoto.com/id/157318026/photo/carboard-box-w-clippping-path.jpg?s=612x612&w=0&k=20&c=XuE3LFtj47KV6_LbtJXfEdXyHLPHy4qexjRI1LXSlTc='
      },

      {
        spotId: 2,
        preview: true,
        url: 'https://media.istockphoto.com/id/1227533874/vector/gingerbread-house-with-christmas-candies-gingerbread-man-and-gingerbread-tree.jpg?s=612x612&w=0&k=20&c=rs8Gnuv9c0wv5UMHIKcBOQX70tZfSqUlOU0FmMp8jzU='
      },

      {
        spotId: 3,
        preview: true,
        url: 'https://images.immediate.co.uk/production/volatile/sites/4/2022/01/Astronaut-on-the-Moon-rendering-398e37a.jpg?quality=90&resize=700,394'
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
