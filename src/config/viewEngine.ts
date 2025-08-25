import express, { Application } from "express";

const configViewEngine = (app: Application): void => {
    app.use(express.static("./src/public")); // Thiết lập thư mục tĩnh (images, css,..)
    app.set("view engine", "ejs"); // Thiết lập viewEngine
    app.set("views", "./src/views"); // Thư mục chứa views
};

export default configViewEngine;
