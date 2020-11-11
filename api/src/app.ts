import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import browseController from './controllers/browse';
import fileController from './controllers/file';
import thumbController from './controllers/thumb';
import commandController from './controllers/command';
import saveController from './controllers/save';

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get(/^\/browse\/.*/, browseController);
app.get(/^\/file\/.*/, fileController);
app.get(/^\/thumb\/.*/, thumbController);
app.get(/^\/cmd\/.*/, commandController);
app.post(/^\/save\/.*/, saveController);

app.get('/', (req, res) => {
  res.render('index');
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
