import "reflect-metadata";
require('dotenv').config();
import express = require('express');
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { UserRouter } from "./user/user.router";
import { createConnection } from "typeorm";
import { AuthenticationRouter } from "./authentication/authentication.router";
import { DocRouter } from "./doc/doc.router";
import { AttachmentRouter } from "./attachment/attachment.router";

var app = express();

createConnection().then(async connection => {

	app.use(cors())
	app.use(bodyParser.json({ limit: '200mb' }));
	app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
	//app.use(expressFormidable());

	//

	app.use(function (req, res, next) {

		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', 1);

		// Pass to next layer of middleware
		next();
	});




	//

	// Doc routes
	DocRouter.configRoutes(app);

	// Authentication routes
	AuthenticationRouter.configRoutes(app);

	// User routes
	UserRouter.configRoutes(app);

	// Attachment routes
	AttachmentRouter.configRoutes(app);

	// get api version
	app.get(process.env.URL + '/version', (req, res) => {
		res.status(200).send({
			success: true,
			message: 'the api call is successfull',
			body: {
				version: process.env.VERSION
			}
		})
	});

	const port = process.env.PORT || 4500;

	app.listen(port, () => {
		return console.log(`server is listening on ${port}`);
	});

}).catch(error => console.log(error));


