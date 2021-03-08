import React from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper/index";
import { Link } from "react-router-dom";

const AdminDashBoard = () => {
  const {
    user: { name, email, role },
  } = isAuthenticated();

  const adminLeftSide = () => {
    return (
      <div className="card">
        <h4 className="card-header bg-dark text-white text-center">
          Admin Navigation
        </h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link
              to="/admin/create/category"
              className="nav-link text-primary text-center"
            >
              Create Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link
              to="/admin/categories"
              className="nav-link text-primary text-center"
            >
              Manage Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link
              to="/admin/create/product"
              className="nav-link text-primary text-center"
            >
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link
              to="/admin/products"
              className="nav-link text-primary text-center"
            >
              Manage Products
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/orders" className="nav-link text-primary text-center">
              Manage Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminRightSide = () => {
    return (
      <div className="card mb-4">
        <h4 className="card-header">Admin Info</h4>
        <ul className = "list-group">
            <li className = "list-group-item">
                <h5><span className = "badge bg-success mr-2">Name : </span> {name}</h5>
            </li>
            <li className = "list-group-item">
                <h5><span className = "badge bg-success mr-2">Email : </span> {email}</h5>
            </li>
            <li className = "list-group-item">
                <h5><span className = "badge bg-danger mr-2">Admin Area</span></h5>
            </li>
        </ul>
      </div>
    );
  };

  return (
    <Base
      title="Welcome to admin dashboard"
      description="Manage all your products here"
      className="container bg-success p-4"
    >
      <div className="row">
        <div className="col-3">{adminLeftSide()}</div>
        <div className="col-9">{adminRightSide()}</div>
      </div>
    </Base>
  );
};

export default AdminDashBoard;
