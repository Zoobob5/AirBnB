'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    // static async newImage({url, preview}) {
    //   const img = await SpotImage.create({
    //     url,
    //     preview
    //   });

    //   return await SpotImage.findByPk(img.id);
    //}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  SpotImage.init({
    spotId: DataTypes.INTEGER,

    preview: {
      type: DataTypes.BOOLEAN
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
