
app.use(
  session({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
      mongoUrl: "mongodb://localhost:27017/pizza",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //cookie valid for 24 hours
  })
);