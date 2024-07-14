"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/database");
const bcrypt = require("bcrypt");

module.exports = sequelize.define(
  "users",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
      allowNull: false,
      validate: {
        notNull: { msg: "userType cannot be null" },
        notEmpty: { msg: "userType cannot be empty" },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "name cannot be null" },
        notEmpty: { msg: "name cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "email cannot be null" },
        notEmpty: { msg: "email cannot be empty" },
        isEmail: {
          msg: "Invalid email id",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "phoneNumber cannot be null" },
        notEmpty: { msg: "phoneNumber cannot be empty" },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "address cannot be null" },
        notEmpty: { msg: "address cannot be empty" },
      },
    },
    rating: {
      type: DataTypes.FLOAT(1),
    },
    openingHours: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const hashPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("password", hashPassword);
      },
      allowNull: false,
      validate: {
        notNull: { msg: "password cannot be null" },
        notEmpty: { msg: "password cannot be empty" },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  { paranoid: true }
);
