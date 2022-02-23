import { Response, Request } from "express";
import { SuccessResponse } from "../../common/utilities/SuccessResponse";
import { ErrorResponse } from "../../common/utilities/ErrorResponse";
import { ERROR_MESSAGES } from "../../common/utilities/ErrorMessages";
import { UserService } from "../services/user.service";
import { QueryStringProcessor } from "../../common/utilities/QueryStringProcessor";
import { IUserFilter } from "../utilities/user-filter.interface";
import { Helper } from "../../common/utilities/Helper";
import { HttpStatusCode } from "../../common/utilities/HttpStatusCodes";
import { JobService } from "../services/job.service";
import { ProductService } from "../services/product.service";
const puppeteer = require('puppeteer');
const axios = require('axios');
const convert = require('xml-js');
const fastCsv = require("fast-csv");
const fs = require("fs");
var path = require('path');

export class UserController {

    static list = async (request: Request, response: Response) => {

        const queryStringProcessor = new QueryStringProcessor(request.query);
        const filter: IUserFilter = {};

        const results = await UserService.list(queryStringProcessor, filter);

        response.status(HttpStatusCode.OK).send(new SuccessResponse({ results }));
    }

    static insert = async (request: Request, response: Response) => {

        const user = await UserService.insert(request.body);

        response.status(HttpStatusCode.OK).send(new SuccessResponse({ user }));
    }

    static getById = async (request: Request, response: Response) => {

        const user = await UserService.getById(+request.params.userId);

        if (Helper.isDefined(user)) {
            response.status(HttpStatusCode.OK).send(new SuccessResponse(user.toResponseObject()));
        } else {
            response.status(HttpStatusCode.NOT_FOUND).send(new ErrorResponse(ERROR_MESSAGES.RECORD_NOT_FOUND));
        }
    }

    static patchById = async (request: Request, response: Response) => {

        const user = await UserService.getById(+request.params.userId);

        if (Helper.isDefined(user)) {

            const finalUser = await UserService.update(request.body, user);
            response.status(HttpStatusCode.OK).send(new SuccessResponse(finalUser.toResponseObject()));

        } else {
            return response.status(HttpStatusCode.NOT_FOUND).send(new ErrorResponse(ERROR_MESSAGES.RECORD_NOT_FOUND));
        }

        response.status(HttpStatusCode.OK).send();
    }

    static deleteById = async (request: Request, response: Response) => {

        await UserService.deleteById(+request.params.userId);

        response.status(HttpStatusCode.OK).send();
    }

    static startScrape(request: Request, response: Response) {
        response.status(HttpStatusCode.OK).send('Scraping started');
        UserController.scrape();
    }

    public static async scrape() {

        const apiKey = '1a97e0cea9953e86dac194f2532bc05f'

        const PROXY_USERNAME = 'scraperapi';
        const PROXY_PASSWORD = apiKey; // <-- enter your API_Key here
        const PROXY_SERVER = 'proxy-server.scraperapi.com';
        const PROXY_SERVER_PORT = '8001';


        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index]);
            }
        }



        let products = [];

        const rBlocket = ['image', 'imageset', 'font', 'stylesheet', 'media', 'other', 'script']; // to save data

        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            executablePath: '/opt/homebrew/bin/chromium',
            args: [
                `--proxy-server=http://${PROXY_SERVER}:${PROXY_SERVER_PORT}`,
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
            ]
        });

        const page = await browser.newPage();

        await page.authenticate({
            username: PROXY_USERNAME,
            password: PROXY_PASSWORD,
        });

        await page.setRequestInterception(true);

        page.setDefaultNavigationTimeout(600000);

        page.on('request', async (req) => {
            let rType = req.resourceType();
            if (rBlocket.includes(rType)) {
                req.abort();
            }
            else {
                req.continue();
            }
        });

        const job = await JobService.insert();

        try {

            const headers = { "X-Requested-With": "XMLHttpRequest" }
            const { data } = await axios.get("https://www.henryschein.it/product_details_sitemap1.xml", headers);
            const { urlset: { url } } = JSON.parse(convert.xml2json(data, { compact: true, spaces: 4 }));



            const tests = url.slice(0, 2); // only get 10 TO BE REMOVED

            await asyncForEach(tests, async (test) => {

                await page.goto(test['loc']['_text'] + '?FullPageMode=true');

                const textItem = await page.evaluate(() => {
                    let el = document.querySelector('[type="application/ld+json"]');
                    return el.innerHTML;
                }).catch((error) => {
                    console.log(error);
                    return JSON.stringify({ product: null });
                });

                let product = JSON.parse(textItem);

                products.push(product);
            });

            await ProductService.insert(products, job.id);

            await JobService.update(job.id, "SUCCESS");
        } catch (error) {
            console.log(error);
            await JobService.update(job.id, "FAILED");
        }

        await browser.close();
        return products;

    }

    static getLatest = async (request: Request, response: Response) => {

        try {
            const products = await ProductService.getLatest()
            response.status(HttpStatusCode.OK).send(new SuccessResponse({ products }));
        } catch (error) {
            console.log(error)
        }
    }

    static getCsv = async (request: Request, response: Response) => {

        try {
            const products = await ProductService.getLatest()
            const rows = products.map(product => {
                let offer = { priceCurrency: "", price: "" };
                let brand = { name: "" };

                if (product.offer) {
                    offer = JSON.parse(product.offer);
                }

                if (product.brand) {
                    brand = JSON.parse(product.brand);
                }

                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    sku: product.sku,
                    image: product.image,
                    url: product.url,
                    mpn: product.mpn,
                    priceCurrency: offer.priceCurrency,
                    price: offer.price,
                    brandName: brand.name,
                }
            })

            // const csvFields = Object.keys(rows[0]).map(key => key.charAt(0).toUpperCase());

            const csv = await fs.createWriteStream("./products.csv");
            await fastCsv.write(rows, { headers: true }).
                on("finish", async function () {
                    const stat = fs.statSync("./products.csv");

                    setTimeout(() => {
                        response.sendFile(path.resolve('products.csv'))
                    }, 0)

                }).pipe(csv)
        } catch (error) {
            console.log(error)
        }
    }
}