"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "menus",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "name cannot be null" },
        notEmpty: { msg: "name cannot be empty" },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "description cannot be null" },
        notEmpty: { msg: "description cannot be empty" },
      },
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "price cannot be null" },
        notEmpty: { msg: "price cannot be empty" },
      },
    },
    image: {
      type: DataTypes.STRING,
    },
    vendor: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
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
  },
  { paranoid: true }
);
