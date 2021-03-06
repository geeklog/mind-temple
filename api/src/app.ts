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
import renameController from './controllers/rename';
import moveController from './controllers/move';
import createController from './controllers/create';
import trashController from './controllers/trash';
import bookController from './controllers/book';

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.use(cors());
// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get(/^\/browse\/.*/, browseController);
app.get(/^\/file\/.*/, fileController);
app.get(/^\/thumb\/.*/, thumbController);
app.get(/^\/cmd\/.*/, commandController);
app.get(/^\/book/, bookController);
app.post(/^\/save\/.*/, saveController);
app.post(/^\/rename\/.*/, renameController);
app.post(/^\/create\/.*/, createController);
app.post(/^\/trash/, trashController);
app.post(/^\/move/, moveController);

app.get('/', (req, res) => {
  res.render('index', {content: 'hello'});
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({
    ok: 0,
    error: err.stack
  });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
