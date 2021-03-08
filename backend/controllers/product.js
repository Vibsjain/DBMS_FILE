const category = require("../models/category");
const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate(category)
    .exec((err, product) => {
      if (err || !product) {
        return res.status(404).json({
          error: "Product Not Found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "There is problem with image",
      });
    }

    // desctructure the fields
    const { name, description, price, category, stock } = fields;

    // Restriction on fields
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = new Product(fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too large!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to the DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
}

// delete product
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if(err){
      return res.json({
        error: `Failed to delete ${deletedProduct.name}`
      });
    }
    res.json({
      message: `${deletedProduct.name} has been deleted successfully`
    });
  })
}

// update product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "There is problem with image",
      });
    }

    // desctructure the fields
    const { name, description, price, category, stock } = fields;

    // Restriction on fields
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = req.product;
    // update data using lodash
    product = _.extend(product, fields)

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too large!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to the DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to update product",
        });
      }
      res.json(product);
    });
  });
}

// Product listing 
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
  .select("-photo")
  .populate("category")
  .sort([[sortBy, "asc"]])
  .limit(limit)
  .exec((err, products) => {
    if(err){
      return res.status(400).json({
        error: "Product NOT FOUND"
      });
    }
    res.json(products);
  })
}

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: {_id: prod._id},
        update: {$inc: {stock: -prod.count, sold: +prod.count}}
      }
    }
  })

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if(err){
      return res.status(400).json({
        error: "Bulk operation not working...Sorry for the inconvenience"
      });
    }
    next();
  })
}

exports.getAllUniqueCategory = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if(err){
      return res.status(400).json({
        error: "No category found"
      });
    }
    res.json(category);
  })
}