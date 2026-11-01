const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Dish name in English is required'],
      trim: true
    },
    teluguName: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    type: {
      type: String,
      enum: ['veg', 'non-veg', 'egg'],
      default: 'veg',
      index: true
    },
    image: {
      type: String,
      default: 'images/kaju-biryani.jpg',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    page: {
      type: Number,
      enum: [1, 2],
      default: 1,
      index: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
