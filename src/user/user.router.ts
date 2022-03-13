import * as express from "express";
import { UserMiddleware } from "./middlewares/user.middleware";
import { UserController } from "./controllers/user.controller";
import { AuthenticationMiddleware } from "../authentication/middlewares/authentication.middleware";
import { PermissionMiddleware } from "../common/middlewares/permission.middleware";
import { UserRole } from "./utilities/UserRole";

export class UserRouter {

    static configRoutes = (app: express.Application) => {

        app.get("/users", [
            AuthenticationMiddleware.checkJwtToken,
            PermissionMiddleware.checkAllowedPermissions([UserRole.ADMIN, UserRole.USER]),
            UserController.list
        ]);

        app.get("/users/:userId", [
            AuthenticationMiddleware.checkJwtToken,
            PermissionMiddleware.checkMeOrPermissionsAllowed([UserRole.ADMIN]),
            UserController.getById
        ]);

        app.post("/users", [
            AuthenticationMiddleware.checkJwtToken,
            PermissionMiddleware.checkAllowedPermissions([UserRole.ADMIN]),
            UserMiddleware.validateInsertInput,
            UserMiddleware.checkUserExistance('email', 'body.email', false),
            UserController.insert
        ]);

        app.patch("/users/:userId", [
            AuthenticationMiddleware.checkJwtToken,
            PermissionMiddleware.checkAllowedPermissions([UserRole.ADMIN]),
            UserMiddleware.validationPatchByIdInput,
            UserController.patchById
        ]);

        app.delete("/users/:userId", [
            AuthenticationMiddleware.checkJwtToken,
            PermissionMiddleware.checkAllowedPermissions([UserRole.ADMIN]),
            PermissionMiddleware.checkNotMe,
            UserMiddleware.checkUserExistance('id', 'params.userId', true),
            UserController.deleteById
        ]);

        app.get("/scrape", [
            AuthenticationMiddleware.checkJwtToken,
            UserController.startScrape
        ]);

        app.get("/products-latest", [
            AuthenticationMiddleware.checkJwtToken,
            UserController.getLatest
        ]);

        app.get("/products-csv/:id", [
            // AuthenticationMiddleware.checkJwtToken,
            UserController.getCsv
        ]);

        app.get("/jobs", [
            AuthenticationMiddleware.checkJwtToken,
            UserController.getJobs
        ]);

        app.get("/categories", [
            AuthenticationMiddleware.checkJwtToken,
            UserController.getCategories
        ]);

        app.delete("/jobs/:id", [
            AuthenticationMiddleware.checkJwtToken,
            UserController.deleteJob
        ]);

        app.get("/scrape-retry/:jobId", [
            AuthenticationMiddleware.checkJwtToken,
            UserController.startFailedScrape
        ]);
    }
}