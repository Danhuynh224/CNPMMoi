import express, { Application, Router } from "express";
import homeController from "../controllers/homeController";

const router: Router = express.Router();

const initWebRoutes = (app: Application): void => {
  //Default
  router.get("/", (req, res) => {
    return res.send("Huỳnh Việt Đan");
  });
  // Define routes
  router.get("/home", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getFindAllCrud);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  // Use the router in the app
  app.use("/", router);
};

export default initWebRoutes;
