module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define('list', {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      user_email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      poster:{
        type: DataTypes.STRING
      },
      title:{
        type: DataTypes.STRING
      },
      heart :{
        type: DataTypes.BOOLEAN
      }
    });
  
    return user;
  };
  