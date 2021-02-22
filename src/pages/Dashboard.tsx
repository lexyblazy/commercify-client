import React, { Component } from "react";
import _ from "lodash";

import { Loader } from "../components";
import { OrdersList, ProductsList } from "../components/dashboard";

import * as utils from "../utils";
import * as apis from "../apis";

type MenuItem = "analytics" | "orders" | "products" | "settings";

interface DashboardState {
  selectedMenu: MenuItem;
  loading: boolean;
  merchant: Merchant | null;
}

export class Dashboard extends Component {
  state: DashboardState = {
    selectedMenu: "products",
    loading: true,
    merchant: null,
  };

  async componentDidMount() {
    let merchant = utils.auth.getMerchant();

    if (!merchant) {
      await utils.sleep(2000);
    }
    // await this.getProducts();
    merchant = utils.auth.getMerchant();
    this.setState({ loading: false, merchant });
  }

  getProducts = async () => {
    const response = await apis.merchants.products.list();
    if (response && response.ok && response.data) {
      console.log(response.data);
    } else {
      const message = _.get(response.data, "error") ?? response.problem;
      utils.api.handleErrors({ response, onClientError: () => alert(message) });
    }
  };

  renderDashboardContent = () => {
    const { selectedMenu, loading } = this.state;

    if (selectedMenu === "orders") {
      return <OrdersList />;
    }

    if (selectedMenu === "products") {
      return <ProductsList />;
    }

    return (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia, beatae
        assumenda. Magnam voluptatem aliquam sint eaque cupiditate mollitia
        praesentium. Magnam eveniet dolore assumenda quaerat qui perferendis
        fugit veritatis eligendi cum.
      </div>
    );
  };

  getActiveMenuClass = (menuItem: MenuItem) => {
    if (this.state.selectedMenu === menuItem) {
      return "dashboard-sidebar__menu-item--active";
    }
    return "";
  };

  render() {
    const { loading, merchant } = this.state;

    return (
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <h3 className="heading-tertiary margin-bottom-4 center-text">
            Commercify
          </h3>
          <ul className="dashboard-sidebar__menu-items">
            <li
              onClick={() => this.setState({ selectedMenu: "analytics" })}
              className={`dashboard-sidebar__menu-item ${this.getActiveMenuClass(
                "analytics"
              )}`}
            >
              <i className="fas fa-chart-line"></i> &nbsp;&nbsp;&nbsp; Analytics
            </li>
            <li
              onClick={() => this.setState({ selectedMenu: "products" })}
              className={`dashboard-sidebar__menu-item ${this.getActiveMenuClass(
                "products"
              )}`}
            >
              <i className="fas fa-cubes"></i> &nbsp;&nbsp;&nbsp; Products
            </li>

            <li
              onClick={() => this.setState({ selectedMenu: "orders" })}
              className={`dashboard-sidebar__menu-item ${this.getActiveMenuClass(
                "orders"
              )}`}
            >
              <i className="fas fa-shopping-cart"></i> &nbsp;&nbsp;&nbsp; Orders
            </li>
            <li
              onClick={() => this.setState({ selectedMenu: "settings" })}
              className={`dashboard-sidebar__menu-item ${this.getActiveMenuClass(
                "settings"
              )}`}
            >
              <i className="fas fa-cogs"></i> &nbsp;&nbsp;&nbsp;Settings
            </li>
          </ul>
        </div>
        <div className="dashboard-main">
          <div className="dashboard-main__navigation margin-bottom-4">
            <h3 className="dashboard-main__navigation--heading-text">
              Welcome, <strong>{merchant?.firstName}</strong>
            </h3>
            <div className="dashboard-main__navigation--right">
              <input
                placeholder="Search for products"
                className="dashboard-main__navigation--search"
              />
              <span className="dashboard-main__navigation--notification">
                <i className="far fa-bell"></i>
                <div className="dashboard-main__navigation--notification-badge"></div>
              </span>
              <span className="dashboard-main__navigation--notification">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>
          {loading ? (
            <Loader size="medium" withContainer center />
          ) : (
            this.renderDashboardContent()
          )}
        </div>
      </div>
    );
  }
}
