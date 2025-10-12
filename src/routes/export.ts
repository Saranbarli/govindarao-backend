import { Router } from "express";
import ExcelJS from "exceljs";
import Order from "../models/Order";  // your Order model
import Product from "../models/Product";
import Customer from "../models/Customer";

const router = Router();

// Helper: get week number
function getWeek(date: Date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((days + oneJan.getDay() + 1) / 7);
}

router.get("/excel", async (req, res) => {
  try {
    const orders = await Order.find().populate("product customer");

    const workbook = new ExcelJS.Workbook();

    // ----------------- Weekly Sales -----------------
    const weeklySheet = workbook.addWorksheet("Weekly Sales");
    weeklySheet.addRow(["Week", "Product", "Quantity"]);

    const weeklyMap = new Map();
    orders.forEach((o) => {
      const week = getWeek(new Date(o.createdAt));
      const key = `${week}-${o.product.name}`;
      weeklyMap.set(key, (weeklyMap.get(key) || 0) + o.quantity);
    });

    weeklyMap.forEach((qty, key) => {
      const [week, product] = key.split("-");
      weeklySheet.addRow([week, product, qty]);
    });

    // ----------------- Monthly Sales -----------------
    const monthlySheet = workbook.addWorksheet("Monthly Sales");
    monthlySheet.addRow(["Month", "Product", "Quantity"]);

    const monthlyMap = new Map();
    orders.forEach((o) => {
      const month = new Date(o.createdAt).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const key = `${month}-${o.product.name}`;
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + o.quantity);
    });

    monthlyMap.forEach((qty, key) => {
      const [month, product] = key.split("-");
      monthlySheet.addRow([month, product, qty]);
    });

    // ----------------- Product Summary -----------------
    const productSheet = workbook.addWorksheet("Products Summary");
    productSheet.addRow(["Product", "Total Sold"]);

    const productMap = new Map();
    orders.forEach((o) => {
      productMap.set(o.product.name, (productMap.get(o.product.name) || 0) + o.quantity);
    });

    productMap.forEach((qty, product) => {
      productSheet.addRow([product, qty]);
    });

    // ----------------- Customer Summary -----------------
    const customerSheet = workbook.addWorksheet("Customers Summary");
    customerSheet.addRow(["Customer", "Orders", "Total Items"]);

    const customerMap = new Map();
    orders.forEach((o) => {
      if (!customerMap.has(o.customer.name)) {
        customerMap.set(o.customer.name, { count: 0, total: 0 });
      }
      const c = customerMap.get(o.customer.name);
      c.count += 1;
      c.total += o.quantity;
      customerMap.set(o.customer.name, c);
    });

    customerMap.forEach((data, customer) => {
      customerSheet.addRow([customer, data.count, data.total]);
    });

    // ----------------- Send file -----------------
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel");
  }
});

export default router;
